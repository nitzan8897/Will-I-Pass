/* Default form values and factory helpers for new records. */

import type { HighSchool, PastCourse, TargetCourse } from '../types';

export const defaultHighSchool: HighSchool = {
  mathUnits: 5, mathGrade: 90, csUnits: 5, csGrade: 85, gpa: 92,
  school: '', city: '', country: 'ישראל',
};

export const makePastCourse = (overrides: Partial<PastCourse> = {}): PastCourse => ({
  name: '', lecturer: '', credits: 4, isMath: true, isCS: false,
  firstLearnHrs: 30, examPrepHrs: 25, dailyPastExamHrs: 2, practiceAfter: true,
  hwWeight: 15, hwHonesty: 'independent', methodSolo: 60, methodFriend: 30, methodTutor: 10,
  finalExam: 75, courseAvg: 78, moedB: false,
  ...overrides,
});

export const defaultTargetCourse: TargetCourse = {
  name: '', credits: 4, isMath: true, isCS: false,
  firstLearnHrs: 30, examPrepHrs: 25, dailyPastExamHrs: 2, practiceAfter: true,
  hwWeight: 15, hwHonesty: 'independent', methodSolo: 60, methodFriend: 30, methodTutor: 10,
  moedB: false,
};
