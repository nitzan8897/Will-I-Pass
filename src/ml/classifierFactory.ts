/* classifierFactory — pick a classifier for the chosen algorithm.
   KNN / decision tree / SVM / neural net come from ml.js (CDN).
   Perceptron is our own local implementation. */

import type { Algorithm } from '../types';
import { trainPerceptron, type PerceptronModel } from './perceptron';
import { trainLinearSvm, type SvmModel } from './svm';

export type Classifier = PerceptronModel | SvmModel | MlModelLike;

/** Build and train a classifier. Labels are 0/1. */
export const trainClassifier = (
  algorithm: Algorithm,
  scaledRows: number[][],
  labels: number[],
): Classifier => {
  if (algorithm === 'perceptron') {
    return trainPerceptron(scaledRows, labels);
  }
  if (algorithm === 'knn') {
    return new ML.KNN(scaledRows, labels, { k: Math.min(5, scaledRows.length) });
  }
  if (algorithm === 'tree') {
    const tree = new ML.DecisionTreeClassifier({ gainFunction: 'gini', maxDepth: 5, minNumSamples: 1 });
    tree.train?.(scaledRows, labels);
    return tree;
  }
  if (algorithm === 'svm') {
    return trainLinearSvm(scaledRows, labels);
  }
  // neural net (MLP) — one hidden layer
  const network = new ML.FNN({ hiddenLayers: [6], iterations: 300, learningRate: 0.1, activation: 'sigmoid' });
  network.train?.(scaledRows, labels);
  return network;
};

/** Return 0/1 for a single feature vector (handles each library's output format). */
export const classifyOne = (
  algorithm: Algorithm,
  model: Classifier,
  features: number[],
): number => {
  if (algorithm === 'perceptron') return (model as PerceptronModel).predict(features);
  if (algorithm === 'svm') return (model as SvmModel).predict(features);
  return (model as MlModelLike).predict([features])[0]; // KNN / tree / net return label/index
};
