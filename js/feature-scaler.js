/* =====================================================================
   feature-scaler.js — נרמול z-score
   חיוני ל-KNN/SVM/רשת נוירונים כדי שכל מאפיין יתרום במידה שווה.
   ===================================================================== */

// מחשב ממוצע וסטיית תקן לכל עמודה מתוך דאטת האימון
function fitScaler(featureRows){
  const featureCount = featureRows[0].length;
  const mean = Array(featureCount).fill(0);
  const std = Array(featureCount).fill(0);
  featureRows.forEach(row => row.forEach((value, col) => mean[col] += value));
  mean.forEach((_, col) => mean[col] /= featureRows.length);
  featureRows.forEach(row => row.forEach((value, col) => std[col] += (value - mean[col]) ** 2));
  std.forEach((_, col) => std[col] = Math.sqrt(std[col] / featureRows.length) || 1);
  return { mean, std };
}

// מנרמל וקטור בודד לפי הממוצע/סטיית התקן שנלמדו
function scaleFeatures(features, scaler){
  return features.map((value, col) => (value - scaler.mean[col]) / scaler.std[col]);
}
