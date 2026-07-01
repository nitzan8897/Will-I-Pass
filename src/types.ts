/* Domain types shared across the app. */

export type Algorithm = 'perceptron' | 'svm' | 'tree' | 'knn' | 'nn';

export type HwHonesty = 'independent' | 'partial' | 'cheated';

export interface HighSchool {
  mathUnits: number;
  mathGrade: number;
  csUnits: number;
  csGrade: number;
  gpa: number;
  school: string;
  city: string;
  country: string;
}

/** A previously-taken course — this is one row of training data. */
export interface PastCourse {
  name: string;
  lecturer: string;
  credits: number;
  isMath: boolean;
  isCS: boolean;
  firstLearnHrs: number;
  examPrepHrs: number;
  dailyPastExamHrs: number;
  practiceAfter: boolean;
  hwWeight: number;
  hwHonesty: HwHonesty;
  methodSolo: number;
  methodFriend: number;
  methodTutor: number;
  finalExam: number;
  courseAvg: number;
  moedB: boolean;
}

/** The future course we want a prediction for (no grade). */
export interface TargetCourse {
  name: string;
  credits: number;
  isMath: boolean;
  isCS: boolean;
  firstLearnHrs: number;
  examPrepHrs: number;
  dailyPastExamHrs: number;
  practiceAfter: boolean;
  hwWeight: number;
  hwHonesty: HwHonesty;
  methodSolo: number;
  methodFriend: number;
  methodTutor: number;
  moedB: boolean;
}

export interface StudentData {
  highSchool: HighSchool;
  pastCourses: PastCourse[];
  algorithm: Algorithm;
}

export interface ExportBundle extends StudentData {
  targetCourse: TargetCourse;
}

export interface Scaler {
  mean: number[];
  std: number[];
}

export interface Prediction {
  willPass: boolean;
  estimatedGrade: number;
  passProbability: number;
}

export interface Factor {
  text: string;
  direction: 'up' | 'down';
}

/** A trained model plus training-set metadata. */
export interface TrainedModel {
  algorithm: Algorithm;
  scaler: Scaler;
  sampleCount: number;
  passCount: number;
  trainingAccuracy: number;
  predict(rawFeatures: number[]): Prediction;
}
