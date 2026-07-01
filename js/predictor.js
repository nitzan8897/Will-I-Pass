/* =====================================================================
   predictor.js — מאמן על ההיסטוריה, חוזה את הקורס החדש, ומציג תוצאה
   ===================================================================== */

const ALGORITHM_SUMMARIES = {
  perceptron: '<b>פרספטרון:</b> נוירון בודד שלומד קו מפריד לינארי בעזרת ירידת גרדיאנט. נכשל ב-XOR.',
  svm: '<b>SVM:</b> מרווח מרבי בין המחלקות; Soft Margin עם פרמטר C ו-Kernel Trick לבעיות לא-לינאריות.',
  tree: '<b>עץ החלטה:</b> פיצול חמדני לפי אנטרופיה ורווח אינפורמציה.',
  knn: '<b>KNN:</b> אלגוריתם עצלן — מסווג לפי רוב הקורסים הדומים ביותר בהיסטוריה.',
  nn: '<b>רשת נוירונים (MLP):</b> שכבה נסתרת + Backpropagation ללמידת קשרים לא-לינאריים.'
};

function showAlgoSummary(){
  const box = document.getElementById('algoSummary');
  box.innerHTML = ALGORITHM_SUMMARIES[document.getElementById('algo').value];
  box.classList.add('show');
}

function buildFactorList(target, highSchool, predictor){
  const factors = [
    { text: `אומן על ${predictor.sampleCount} קורסים (${predictor.passCount} עברו) · דיוק אימון ${predictor.trainingAccuracy}%`, direction: predictor.trainingAccuracy >= 70 ? 'up' : 'down' },
    { text: `רקע תיכון: ממוצע ${highSchool.gpa}, מתמטיקה ${highSchool.mathGrade}`, direction: highSchool.gpa >= 80 ? 'up' : 'down' },
    { text: `פתרון מבחנים מתוכנן: ${target.dailyPastExamHrs} שעות/יום`, direction: target.dailyPastExamHrs >= 2 ? 'up' : 'down' },
    { text: `שעות הכנה למבחן: ${target.examPrepHrs}`, direction: target.examPrepHrs >= 20 ? 'up' : 'down' },
    { text: `תרגול מיידי אחרי הרצאות: ${target.practiceAfter ? 'כן' : 'לא'}`, direction: target.practiceAfter ? 'up' : 'down' }
  ];
  if (honestyToNumber(target) > 0) factors.push({ text: 'כוונת העתקה בשיעורי בית — פוגעת בידע למבחן', direction: 'down' });
  return factors;
}

function renderResult(prediction, factors){
  const passText = prediction.willPass ? '✓ עובר' : '✗ נכשל';
  const card = document.getElementById('classCard');
  card.className = 'rcard ' + (prediction.willPass ? 'pass' : 'fail');
  document.getElementById('classText').textContent = passText;
  document.getElementById('classProb').textContent = `הסתברות מעבר ~${Math.round(prediction.passProbability)}%`;
  document.getElementById('scoreText').textContent = Math.round(prediction.estimatedGrade);
  document.getElementById('scoreBar').style.width = Math.round(prediction.estimatedGrade) + '%';
  document.getElementById('factors').innerHTML = factors
    .map(f => `<li class="${f.direction}">${f.direction === 'up' ? '▲' : '▼'} ${f.text}</li>`).join('');
  document.getElementById('result').classList.add('show');
}

function predict(){
  const student = collectStudentData();
  const target = collectTargetCourse();
  document.getElementById('result').classList.remove('show');
  document.getElementById('loader').classList.add('show');
  setTimeout(() => {
    document.getElementById('loader').classList.remove('show');
    const predictor = buildPredictor(student.pastCourses, student.highSchool, student.algorithm);
    if (predictor.error){ alert('⚠️ ' + predictor.error); return; }
    const prediction = predictor.predict(courseToFeatures(target, student.highSchool));
    renderResult(prediction, buildFactorList(target, student.highSchool, predictor));
  }, 700);
}
