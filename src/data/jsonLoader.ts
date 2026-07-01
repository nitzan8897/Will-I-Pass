/* jsonLoader — load past courses (and optionally high-school / target) from a JSON file.
   Accepts either a full exported bundle or a plain array of course records. */

import type { HighSchool, PastCourse, TargetCourse } from '../types';
import { makePastCourse } from './defaults';
import { isCsCourse, isMathCourse } from './courseKeywords';

export interface LoadedGrades {
  pastCourses: PastCourse[];
  highSchool?: Partial<HighSchool>;
  targetCourse?: Partial<TargetCourse>;
}

const asRecord = (v: unknown): Record<string, unknown> =>
  (v && typeof v === 'object' ? (v as Record<string, unknown>) : {});

/** Normalise one raw record into a PastCourse, inferring isMath/isCS from the name. */
export const normaliseCourse = (raw: unknown): PastCourse => {
  const r = asRecord(raw);
  const name = typeof r.name === 'string' ? r.name : '';
  const isMath = typeof r.isMath === 'boolean' ? r.isMath : isMathCourse(name);
  const isCS = typeof r.isCS === 'boolean' ? r.isCS : isCsCourse(name);
  return makePastCourse({ ...r, name, isMath, isCS });
};

export const parseGradesJson = (text: string): LoadedGrades => {
  const data: unknown = JSON.parse(text);
  const rows = Array.isArray(data) ? data : asRecord(data).pastCourses;
  if (!Array.isArray(rows)) {
    throw new Error('לא נמצאו קורסים בקובץ ה-JSON.');
  }
  const bundle = asRecord(data);
  return {
    pastCourses: rows.map(normaliseCourse),
    highSchool: bundle.highSchool as Partial<HighSchool> | undefined,
    targetCourse: bundle.targetCourse as Partial<TargetCourse> | undefined,
  };
};

export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
