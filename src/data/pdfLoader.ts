/* pdfLoader — best-effort extraction of graded courses from a university
   transcript PDF (Hebrew, RTL). Uses pdf.js (loaded from CDN).

   Each course row looks roughly like:  hours  credits  grade  ... year  courseNumber
   We keep only rows that carry a numeric grade, and infer isMath / isCS from any
   Hebrew course description on the line via keyword matching. */

import type { PastCourse } from '../types';
import { makePastCourse } from './defaults';
import { isCsCourse, isMathCourse } from './courseKeywords';
import type { LoadedGrades } from './jsonLoader';

const WORKER_SRC =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const HEBREW = /[֐-׿]/;

/** Group a page's text items into lines by their y coordinate. */
const itemsToLines = (items: PdfTextItem[]): string[] => {
  const buckets = new Map<number, PdfTextItem[]>();
  items.forEach((item) => {
    if (!item.str.trim()) return;
    const y = Math.round(item.transform[5]);
    const bucket = buckets.get(y) ?? [];
    bucket.push(item);
    buckets.set(y, bucket);
  });
  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0]) // top of page first
    .map(([, bucket]) =>
      bucket
        .sort((a, b) => a.transform[4] - b.transform[4])
        .map((i) => i.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim());
};

/** Parse a single transcript line into a course, or null if it has no grade. */
export const parseTranscriptLine = (line: string): PastCourse | null => {
  const tokens = line.split(/\s+/);
  const courseNumber = tokens.find((t) => /^\d{6,7}$/.test(t));
  if (!courseNumber) return null;

  const grade = tokens
    .map(Number)
    .find((n) => Number.isInteger(n) && n >= 40 && n <= 100 && String(n).length <= 3);
  if (grade === undefined) return null; // no grade → not a training example

  const description = tokens.filter((t) => HEBREW.test(t)).join(' ');
  return makePastCourse({
    name: description || `קורס ${courseNumber}`,
    courseAvg: grade,
    finalExam: grade,
    isMath: isMathCourse(description),
    isCS: isCsCourse(description),
  });
};

export const parseGradesPdf = async (buffer: ArrayBuffer): Promise<LoadedGrades> => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pastCourses: PastCourse[] = [];
  for (let page = 1; page <= pdf.numPages; page++) {
    const content = await (await pdf.getPage(page)).getTextContent();
    itemsToLines(content.items).forEach((line) => {
      const course = parseTranscriptLine(line);
      if (course) pastCourses.push(course);
    });
  }
  if (!pastCourses.length) {
    throw new Error('לא זוהו קורסים עם ציון ב-PDF. נסה קובץ JSON במקום.');
  }
  return { pastCourses };
};

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
