/* =====================================================================
   model-trainer.js — מאמן את המודל על ההיסטוריה ומחזיר אובייקט חוזה
   המסווג קובע עובר/נכשל; רגרסיה לינארית (ml.js) מעריכה את הציון המספרי.
   ===================================================================== */

const MINIMUM_TRAINING_COURSES = 2;

function buildPredictor(pastCourses, highSchool, algorithm){
  const { featureRows, passLabels, grades } = buildTrainingSet(pastCourses, highSchool);
  if (featureRows.length < MINIMUM_TRAINING_COURSES){
    return { error: `נדרשים לפחות ${MINIMUM_TRAINING_COURSES} קורסים קודמים עם ציון כדי לאמן את המודל.` };
  }

  const scaler = fitScaler(featureRows);
  const scaledRows = featureRows.map(row => scaleFeatures(row, scaler));

  const classifier = trainClassifier(algorithm, scaledRows, passLabels);
  const gradeRegressor = new ML.MultivariateLinearRegression(scaledRows, grades.map(g => [g]));

  let correct = 0;
  scaledRows.forEach((row, i) => { if (classifyOne(algorithm, classifier, row) === passLabels[i]) correct++; });

  return {
    scaler, classifier, gradeRegressor, algorithm,
    sampleCount: featureRows.length,
    passCount: passLabels.reduce((sum, label) => sum + label, 0),
    trainingAccuracy: Math.round(100 * correct / scaledRows.length),

    // חיזוי קורס חדש מתוך וקטור המאפיינים הגולמי שלו
    predict(rawFeatures){
      const scaled = scaleFeatures(rawFeatures, this.scaler);
      const willPass = classifyOne(this.algorithm, this.classifier, scaled) === 1;
      const estimatedGrade = clamp(this.gradeRegressor.predict(scaled)[0], 0, 100);
      // הסתברות מעבר נגזרת מהציון המשוער (סיגמואיד סביב סף 60)
      const passProbability = clamp(100 / (1 + Math.exp(-(estimatedGrade - 60) / 8)), 2, 98);
      return { willPass, estimatedGrade, passProbability };
    }
  };
}

function clamp(value, low, high){ return Math.max(low, Math.min(high, value)); }
