/* exporter — export student data as JSON or CSV. */

import type { ExportBundle } from '../types';

const escapeCsvCell = (value: unknown): string => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const studentToCsv = (bundle: ExportBundle): string => {
  const highSchoolKeys = Object.keys(bundle.highSchool);
  const courseKeys = bundle.pastCourses.length ? Object.keys(bundle.pastCourses[0]) : [];
  const header = [...highSchoolKeys.map((k) => `hs_${k}`), 'algorithm', ...courseKeys].join(',');
  const source = bundle.pastCourses.length ? bundle.pastCourses : [{}];
  const hs = bundle.highSchool as unknown as Record<string, unknown>;
  const rows = source.map((course) => {
    const courseRecord = course as Record<string, unknown>;
    const hsValues = highSchoolKeys.map((k) => escapeCsvCell(hs[k]));
    const courseValues = courseKeys.map((k) => escapeCsvCell(courseRecord[k]));
    return [...hsValues, escapeCsvCell(bundle.algorithm), ...courseValues].join(',');
  });
  return `﻿${[header, ...rows].join('\n')}`; // BOM so Hebrew opens correctly in Excel
};

const downloadFile = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const downloadData = (bundle: ExportBundle, format: 'json' | 'csv'): void => {
  if (format === 'json') {
    downloadFile(JSON.stringify(bundle, null, 2), 'student_data.json', 'application/json');
  } else {
    downloadFile(studentToCsv(bundle), 'student_data.csv', 'text/csv;charset=utf-8');
  }
};
