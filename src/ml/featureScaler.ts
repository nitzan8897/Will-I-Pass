/* featureScaler — z-score normalisation.
   Essential for KNN/SVM/neural net so every feature contributes equally. */

import type { Scaler } from '../types';

/** Compute per-column mean and standard deviation from the training rows. */
export const fitScaler = (featureRows: number[][]): Scaler => {
  const featureCount = featureRows[0].length;
  const mean: number[] = Array(featureCount).fill(0);
  const std: number[] = Array(featureCount).fill(0);
  featureRows.forEach((row) => row.forEach((value, col) => { mean[col] += value; }));
  mean.forEach((_, col) => { mean[col] /= featureRows.length; });
  featureRows.forEach((row) =>
    row.forEach((value, col) => { std[col] += (value - mean[col]) ** 2; }));
  std.forEach((_, col) => { std[col] = Math.sqrt(std[col] / featureRows.length) || 1; });
  return { mean, std };
};

/** Normalise a single vector using the learned mean/std. */
export const scaleFeatures = (features: number[], scaler: Scaler): number[] =>
  features.map((value, col) => (value - scaler.mean[col]) / scaler.std[col]);
