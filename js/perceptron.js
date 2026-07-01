/* =====================================================================
   perceptron.js — פרספטרון בודד (ל-ml.js אין מימוש מובנה לפרספטרון)
   לומד על-מישור מפריד לינארי: בכל טעות מעדכן את המשקלים (ירידת גרדיאנט),
   ומסווג לפי פונקציית הסימן של w·x + b.
   ===================================================================== */
class Perceptron{
  train(featureRows, labels, learningRate = 0.05, epochs = 80){
    const featureCount = featureRows[0].length;
    this.weights = Array(featureCount).fill(0);
    this.bias = 0;
    for (let epoch = 0; epoch < epochs; epoch++){
      featureRows.forEach((features, i) => {
        const target = labels[i] ? 1 : -1;
        const predicted = this.netInput(features) >= 0 ? 1 : -1;
        if (predicted !== target){
          for (let j = 0; j < featureCount; j++) this.weights[j] += learningRate * target * features[j];
          this.bias += learningRate * target;
        }
      });
    }
    return this;
  }
  netInput(features){
    return features.reduce((sum, value, j) => sum + value * this.weights[j], 0) + this.bias;
  }
  predict(features){ return this.netInput(features) >= 0 ? 1 : 0; }
}
