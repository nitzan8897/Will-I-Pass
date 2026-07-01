/* Human-readable factors that explain a prediction. */

import type { Factor, HighSchool, TargetCourse, TrainedModel } from '../types';
import { honestyToNumber } from '../ml/featureExtractor';

export const buildFactorList = (
  target: TargetCourse,
  highSchool: HighSchool,
  model: TrainedModel,
): Factor[] => {
  const factors: Factor[] = [
    {
      text: `אומן על ${model.sampleCount} קורסים (${model.passCount} עברו) · דיוק אימון ${model.trainingAccuracy}%`,
      direction: model.trainingAccuracy >= 70 ? 'up' : 'down',
    },
    {
      text: `רקע תיכון: ממוצע ${highSchool.gpa}, מתמטיקה ${highSchool.mathGrade}`,
      direction: highSchool.gpa >= 80 ? 'up' : 'down',
    },
    {
      text: `פתרון מבחנים מתוכנן: ${target.dailyPastExamHrs} שעות/יום`,
      direction: target.dailyPastExamHrs >= 2 ? 'up' : 'down',
    },
    {
      text: `שעות הכנה למבחן: ${target.examPrepHrs}`,
      direction: target.examPrepHrs >= 20 ? 'up' : 'down',
    },
    {
      text: `תרגול מיידי אחרי הרצאות: ${target.practiceAfter ? 'כן' : 'לא'}`,
      direction: target.practiceAfter ? 'up' : 'down',
    },
  ];
  if (honestyToNumber(target) > 0) {
    factors.push({ text: 'כוונת העתקה בשיעורי בית — פוגעת בידע למבחן', direction: 'down' });
  }
  return factors;
};
