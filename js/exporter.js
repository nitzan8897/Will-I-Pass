/* =====================================================================
   exporter.js — ייצוא נתוני הסטודנט (כרגע JSON/CSV, בעתיד DB)
   JSON: שמירה מלאה (תיכון + קורסים קודמים + הקורס לחיזוי).
   CSV : שורה לכל קורס קודם; שדות התיכון משוכפלים לכל שורה.
   ===================================================================== */

function gatherExportObject(){
  const student = collectStudentData();
  student.targetCourse = collectTargetCourse();
  return student;
}

function escapeCsvCell(value){
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function studentToCsv(student){
  const highSchoolKeys = Object.keys(student.highSchool);
  const courseKeys = student.pastCourses.length ? Object.keys(student.pastCourses[0]) : [];
  const header = [...highSchoolKeys.map(k => 'hs_' + k), 'algorithm', ...courseKeys].join(',');
  const rows = (student.pastCourses.length ? student.pastCourses : [{}]).map(course => {
    const highSchoolValues = highSchoolKeys.map(k => escapeCsvCell(student.highSchool[k]));
    const courseValues = courseKeys.map(k => escapeCsvCell(course[k]));
    return [...highSchoolValues, escapeCsvCell(student.algorithm), ...courseValues].join(',');
  });
  return '﻿' + [header, ...rows].join('\n');   // BOM כדי שעברית תיפתח נכון באקסל
}

function downloadFile(content, fileName, mimeType){
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadData(format){
  const student = gatherExportObject();
  if (format === 'json'){
    downloadFile(JSON.stringify(student, null, 2), 'student_data.json', 'application/json');
  } else {
    downloadFile(studentToCsv(student), 'student_data.csv', 'text/csv;charset=utf-8');
  }
}

function refreshPreview(){
  document.getElementById('exportPreview').textContent = JSON.stringify(gatherExportObject(), null, 2);
}
