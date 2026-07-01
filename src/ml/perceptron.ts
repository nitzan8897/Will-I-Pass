/* perceptron — single perceptron (ml.js has no built-in perceptron).
   Learns a linear separating hyperplane: on every mistake it updates the weights
   (gradient descent) and classifies by the sign of w·x + b.
   Implemented as a functional factory to avoid classes. */

export interface PerceptronModel {
  readonly weights: number[];
  readonly bias: number;
  predict(features: number[]): number;
}

const netInput = (features: number[], weights: number[], bias: number): number =>
  features.reduce((sum, value, j) => sum + value * weights[j], 0) + bias;

export const trainPerceptron = (
  featureRows: number[][],
  labels: number[],
  learningRate = 0.05,
  epochs = 80,
): PerceptronModel => {
  const featureCount = featureRows[0].length;
  const weights: number[] = Array(featureCount).fill(0);
  let bias = 0;
  for (let epoch = 0; epoch < epochs; epoch++) {
    featureRows.forEach((features, i) => {
      const target = labels[i] ? 1 : -1;
      const predicted = netInput(features, weights, bias) >= 0 ? 1 : -1;
      if (predicted !== target) {
        for (let j = 0; j < featureCount; j++) weights[j] += learningRate * target * features[j];
        bias += learningRate * target;
      }
    });
  }
  return {
    weights,
    bias,
    predict: (features: number[]): number => (netInput(features, weights, bias) >= 0 ? 1 : 0),
  };
};
