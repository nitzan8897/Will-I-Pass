/* modelTrainer — train the model on the student's history and return a predictor.
   The classifier decides pass/fail; a distance-weighted average of past grades
   estimates the numeric grade. (ml.js linear regression is singular and returns
   NaN when samples < features, which is the normal case here — 2 courses, 20 features.) */

import type { Algorithm, HighSchool, PastCourse, Prediction, TrainedModel } from '../types';
import { buildTrainingSet, applyWeights, FEATURE_INDEX } from './featureExtractor';
import { fitScaler, scaleFeatures } from './featureScaler';
import { trainClassifier, classifyOne } from './classifierFactory';

export const MINIMUM_TRAINING_COURSES = 2;

/** Below these, the student is under-prepared. If ALL hold, pass chances drop. */
const LOW_EFFORT = { firstLearnHrs: 15, examPrepHrs: 15, dailyPastExamHrs: 1.5 } as const;
const LOW_EFFORT_PENALTY = 22; // grade points removed when under-prepared on all three

const clamp = (value: number, low: number, high: number): number =>
  Math.max(low, Math.min(high, value));

const isUnderPrepared = (raw: number[]): boolean =>
  raw[FEATURE_INDEX.firstLearnHrs] < LOW_EFFORT.firstLearnHrs &&
  raw[FEATURE_INDEX.examPrepHrs] < LOW_EFFORT.examPrepHrs &&
  raw[FEATURE_INDEX.dailyPastExamHrs] < LOW_EFFORT.dailyPastExamHrs;

const gradeToPassProbability = (grade: number): number =>
  clamp(100 / (1 + Math.exp(-(grade - 60) / 8)), 2, 98);

/** Inverse-distance weighted average of training grades (Shepard). Always finite. */
const estimateGrade = (query: number[], scaledRows: number[][], grades: number[]): number => {
  let weightSum = 0;
  let weighted = 0;
  scaledRows.forEach((row, i) => {
    const distSq = row.reduce((sum, v, j) => sum + (v - query[j]) ** 2, 0);
    const weight = 1 / (distSq + 1e-6); // guard exact matches
    weightSum += weight;
    weighted += weight * grades[i];
  });
  return weightSum > 0 ? weighted / weightSum : grades.reduce((a, b) => a + b, 0) / grades.length;
};

export interface TrainResult {
  model?: TrainedModel;
  error?: string;
}

export const buildPredictor = (
  pastCourses: PastCourse[],
  highSchool: HighSchool,
  algorithm: Algorithm,
): TrainResult => {
  const { featureRows, passLabels, grades } = buildTrainingSet(pastCourses, highSchool);
  if (featureRows.length < MINIMUM_TRAINING_COURSES) {
    return {
      error: `נדרשים לפחות ${MINIMUM_TRAINING_COURSES} קורסים קודמים עם ציון כדי לאמן את המודל.`,
    };
  }

  const scaler = fitScaler(featureRows);
  const scaledRows = featureRows.map((row) => applyWeights(scaleFeatures(row, scaler)));

  const classifier = trainClassifier(algorithm, scaledRows, passLabels);

  let correct = 0;
  scaledRows.forEach((row, i) => {
    if (classifyOne(algorithm, classifier, row) === passLabels[i]) correct++;
  });

  const model: TrainedModel = {
    algorithm,
    scaler,
    sampleCount: featureRows.length,
    passCount: passLabels.reduce((sum, label) => sum + label, 0),
    trainingAccuracy: Math.round((100 * correct) / scaledRows.length),

    predict(rawFeatures: number[]): Prediction {
      const scaled = applyWeights(scaleFeatures(rawFeatures, this.scaler));
      let willPass = classifyOne(algorithm, classifier, scaled) === 1;
      let estimatedGrade = clamp(estimateGrade(scaled, scaledRows, grades), 0, 100);

      // domain rule: under-prepared on all three effort dimensions → chances drop
      if (isUnderPrepared(rawFeatures)) {
        estimatedGrade = clamp(estimatedGrade - LOW_EFFORT_PENALTY, 0, 100);
        willPass = willPass && estimatedGrade >= 60;
      }
      // pass probability derived from the (adjusted) estimated grade — sigmoid around 60
      return { willPass, estimatedGrade, passProbability: gradeToPassProbability(estimatedGrade) };
    },
  };
  return { model };
};
