/* =====================================================================
   feature-extractor.js — הפיכת קורס לוקטור מאפיינים + בניית דאטת אימון
   דאטת האימון היא הקורסים הקודמים של הסטודנט בלבד (אין דאטה מומצא).
   ===================================================================== */

const FEATURE_NAMES = ['ממוצע בגרות','ציון מתמטיקה','ציון מדמ"ח','יח"ל מתמטיקה','יח"ל מדמ"ח',
  'קורס מתמטי','קורס מדמ"ח','נק"ז','שעות למידה ראשונית','שעות הכנה למבחן',
  'שעות יומיות פתרון מבחנים','תרגול מיידי','משקל שיעורי בית','מדד העתקה',
  'אחוז לימוד לבד','אחוז עם חבר','אחוז מורה פרטי','ניגש למועד ב\''];

// המרת יושרת ההגשה למספר רציף (0=עצמאי, 0.5=חלקי, 1=העתקה מלאה)
function honestyToNumber(course){
  if (course.hwHonesty === 'cheated') return 1;
  if (course.hwHonesty === 'partial') return 0.5;
  return 0;
}

// אותו סדר משמש לאימון ולחיזוי — חובה לעקביות
function courseToFeatures(course, highSchool){
  return [
    +highSchool.gpa || 0, +highSchool.mathGrade || 0, +highSchool.csGrade || 0,
    +highSchool.mathUnits || 0, +highSchool.csUnits || 0,
    course.isMath ? 1 : 0, course.isCS ? 1 : 0, +course.credits || 0,
    +course.firstLearnHrs || 0, +course.examPrepHrs || 0, +course.dailyPastExamHrs || 0,
    course.practiceAfter ? 1 : 0, +course.hwWeight || 0, honestyToNumber(course),
    +course.methodSolo || 0, +course.methodFriend || 0, +course.methodTutor || 0,
    course.moedB ? 1 : 0
  ];
}

// הציון הסופי של קורס עבר: ממוצע הקורס, ואם חסר — ציון המבחן הסופי
function finalCourseGrade(course){
  return +course.courseAvg > 0 ? +course.courseAvg : +course.finalExam || 0;
}

// בונה: מטריצת מאפיינים, תוויות מעבר (0/1), וציונים (0-100)
function buildTrainingSet(pastCourses, highSchool){
  const featureRows = [], passLabels = [], grades = [];
  pastCourses.forEach(course => {
    const grade = finalCourseGrade(course);
    if (grade <= 0) return;                       // קורס בלי ציון אינו דוגמת אימון
    featureRows.push(courseToFeatures(course, highSchool));
    grades.push(Math.max(0, Math.min(100, grade)));
    passLabels.push(grade >= 60 ? 1 : 0);
  });
  return { featureRows, passLabels, grades };
}
