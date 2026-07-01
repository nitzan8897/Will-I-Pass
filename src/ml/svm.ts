/* svm — linear soft-margin SVM (ml.js 6.0.0 ships no SVM).
   Trained by sub-gradient descent on the hinge loss + L2 regularisation
   (Pegasos-style). Functional factory to match the rest of the ML core. */

export interface SvmModel {
  readonly weights: number[];
  readonly bias: number;
  decision(features: number[]): number;
  predict(features: number[]): number; // 0/1
}

const dot = (a: number[], b: number[]): number =>
  a.reduce((sum, v, j) => sum + v * b[j], 0);

export const trainLinearSvm = (
  featureRows: number[][],
  labels: number[], // 0/1
  lambda = 0.01,
  epochs = 200,
): SvmModel => {
  const featureCount = featureRows[0].length;
  const weights: number[] = Array(featureCount).fill(0);
  let bias = 0;
  const signed = labels.map((y) => (y ? 1 : -1)); // hinge loss needs ±1

  for (let epoch = 0; epoch < epochs; epoch++) {
    const learningRate = 1 / (lambda * (epoch + 1)); // decaying step size
    featureRows.forEach((x, i) => {
      const y = signed[i];
      const margin = y * (dot(weights, x) + bias);
      for (let j = 0; j < featureCount; j++) {
        const grad = lambda * weights[j] - (margin < 1 ? y * x[j] : 0);
        weights[j] -= learningRate * grad;
      }
      if (margin < 1) bias += learningRate * y;
    });
  }

  const decision = (features: number[]): number => dot(weights, features) + bias;
  return {
    weights,
    bias,
    decision,
    predict: (features: number[]): number => (decision(features) >= 0 ? 1 : 0),
  };
};
