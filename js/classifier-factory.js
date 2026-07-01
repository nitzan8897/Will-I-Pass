/* =====================================================================
   classifier-factory.js — בחירת מסווג לפי האלגוריתם הנבחר
   KNN / עץ החלטה / SVM / רשת נוירונים — מספריית ml.js (CDN).
   פרספטרון — מימוש מקומי (אין ב-ml.js).
   ===================================================================== */

// בונה ומאמן מסווג. labels הם 0/1.
function trainClassifier(algorithm, scaledRows, labels){
  if (algorithm === 'perceptron'){
    return new Perceptron().train(scaledRows, labels);
  }
  if (algorithm === 'knn'){
    return new ML.KNN(scaledRows, labels, { k: Math.min(5, scaledRows.length) });
  }
  if (algorithm === 'tree'){
    const tree = new ML.DecisionTreeClassifier({ gainFunction: 'gini', maxDepth: 5, minNumSamples: 1 });
    tree.train(scaledRows, labels);
    return tree;
  }
  if (algorithm === 'svm'){
    const svm = new ML.SVM({ kernel: 'linear', C: 1 });
    svm.train(scaledRows, labels.map(label => label ? 1 : -1));   // SVM דורש תוויות ±1
    return svm;
  }
  // רשת נוירונים (MLP) — שכבה נסתרת אחת
  const network = new ML.FNN({ hiddenLayers: [6], iterations: 300, learningRate: 0.1, activation: 'sigmoid' });
  network.train(scaledRows, labels);
  return network;
}

// מחזיר 0/1 עבור וקטור מאפיינים בודד (מטפל בפורמט הפלט של כל ספרייה)
function classifyOne(algorithm, model, features){
  if (algorithm === 'perceptron') return model.predict(features);
  if (algorithm === 'svm') return model.predict([features])[0] > 0 ? 1 : 0;
  return model.predict([features])[0];   // KNN / עץ / רשת מחזירים תווית/אינדקס
}
