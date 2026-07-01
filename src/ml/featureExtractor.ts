/* featureExtractor — turn a course into a feature vector + build the training set.
   Training data is the student's own past courses only (no synthetic data). */

import type { HighSchool, PastCourse, TargetCourse } from '../types';

export const FEATURE_NAMES: readonly string[] = [
  'ממוצע בגרות', 'ציון מתמטיקה', 'ציון מדמ"ח', 'יח"ל מתמטיקה', 'יח"ל מדמ"ח',
  'קורס מתמטי', 'קורס מדמ"ח', 'נק"ז', 'שעות למידה ראשונית', 'שעות הכנה למבחן',
  'שעות יומיות פתרון מבחנים', 'תרגול מיידי', 'משקל שיעורי בית', 'מדד העתקה',
  'אחוז לימוד לבד', 'אחוז עם חבר', 'אחוז מורה פרטי', "ניגש למועד ב'",
];

/** Map homework honesty to a continuous number (0 = solo, 1 = full copy). */
export const honestyToNumber = (course: PastCourse | TargetCourse): number => {
  if (course.hwHonesty === 'cheated') return 1;
  if (course.hwHonesty === 'partial') return 0.5;
  return 0;
};

const num = (value: number): number => (Number.isFinite(value) ? value : 0);

/** Same feature order is used for training and prediction — required for consistency. */
export const courseToFeatures = (
  course: PastCourse | TargetCourse,
  highSchool: HighSchool,
): number[] => {
  const moedB = 'moedB' in course ? course.moedB : false;
  return [
    num(highSchool.gpa), num(highSchool.mathGrade), num(highSchool.csGrade),
    num(highSchool.mathUnits), num(highSchool.csUnits),
    course.isMath ? 1 : 0, course.isCS ? 1 : 0, num(course.credits),
    num(course.firstLearnHrs), num(course.examPrepHrs), num(course.dailyPastExamHrs),
    course.practiceAfter ? 1 : 0, num(course.hwWeight), honestyToNumber(course),
    num(course.methodSolo), num(course.methodFriend), num(course.methodTutor),
    moedB ? 1 : 0,
  ];
};

/** Final grade of a past course: course average, or final exam if the average is missing. */
export const finalCourseGrade = (course: PastCourse): number =>
  course.courseAvg > 0 ? course.courseAvg : num(course.finalExam);

export interface TrainingSet {
  featureRows: number[][];
  passLabels: number[];
  grades: number[];
}

/** Build the feature matrix, pass labels (0/1) and grades (0-100). */
export const buildTrainingSet = (
  pastCourses: PastCourse[],
  highSchool: HighSchool,
): TrainingSet => {
  const featureRows: number[][] = [];
  const passLabels: number[] = [];
  const grades: number[] = [];
  pastCourses.forEach((course) => {
    const grade = finalCourseGrade(course);
    if (grade <= 0) return; // a course with no grade is not a training example
    featureRows.push(courseToFeatures(course, highSchool));
    grades.push(Math.max(0, Math.min(100, grade)));
    passLabels.push(grade >= 60 ? 1 : 0);
  });
  return { featureRows, passLabels, grades };
};
