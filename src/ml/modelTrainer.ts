/* modelTrainer — train the model on the student's history and return a predictor.
   The classifier decides pass/fail; a distance-weighted average of past grades
   estimates the numeric grade. (ml.js linear regression is singular and returns
   NaN when samples < features, which is the normal case here — 2 courses, 20 features.) */

import type { Algorithm, HighSchool, PastCourse, Prediction, TrainedModel } from '../types';
import { buildTrainingSet } from './featureExtractor';
import { fitScaler, scaleFeatures } from './featureScaler';
import { trainClassifier, classifyOne } from './classifierFactory';

export const MINIMUM_TRAINING_COURSES = 2;

const clamp = (value: number, low: number, high: number): number =>
  Math.max(low, Math.min(high, value));

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
  const scaledRows = featureRows.map((row) => scaleFeatures(row, scaler));

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
      const scaled = scaleFeatures(rawFeatures, this.scaler);
      const willPass = classifyOne(algorithm, classifier, scaled) === 1;
      const estimatedGrade = clamp(estimateGrade(scaled, scaledRows, grades), 0, 100);
      // pass probability derived from the estimated grade (sigmoid around the 60 threshold)
      const passProbability = clamp(100 / (1 + Math.exp(-(estimatedGrade - 60) / 8)), 2, 98);
      return { willPass, estimatedGrade, passProbability };
    },
  };
  return { model };
};
