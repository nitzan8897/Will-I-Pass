import type { ReactElement } from 'react';
import type { TargetCourse } from '../../types';
import { NumberField, TextField, CheckField, SelectField } from '../fields';
import { HONESTY_OPTIONS } from './options';

interface Props {
  value: TargetCourse;
  onChange: (value: TargetCourse) => void;
}

export const TargetCourseForm = ({ value, onChange }: Props): ReactElement => {
  const set = <K extends keyof TargetCourse>(key: K, v: TargetCourse[K]): void =>
    onChange({ ...value, [key]: v });
  return (
    <div className="card">
      <h3>🎯 הקורס לחיזוי</h3>
      <p className="sub">מלא את פרטי הקורס שאתה עומד ללמוד — ללא ציון. המודל ינבא אם תעבור ומה הציון הצפוי.</p>
      <div className="target-course">
        <div className="grid">
          <TextField label="שם הקורס" value={value.name} onChange={(v) => set('name', v)} />
          <NumberField label="נקודות זכות" value={value.credits} onChange={(v) => set('credits', v)} />
          <CheckField label="דורש חשיבה מתמטית" checked={value.isMath} onChange={(v) => set('isMath', v)} />
          <CheckField label="דורש חשיבת מדעי המחשב" checked={value.isCS} onChange={(v) => set('isCS', v)} />
          <NumberField label="שעות לימוד מתוכננות (פעם ראשונה)" value={value.firstLearnHrs} onChange={(v) => set('firstLearnHrs', v)} />
          <NumberField label="שעות הכנה מתוכננות למבחן" value={value.examPrepHrs} onChange={(v) => set('examPrepHrs', v)} />
          <NumberField label="שעות יומיות מתוכננות לפתרון מבחנים" value={value.dailyPastExamHrs} onChange={(v) => set('dailyPastExamHrs', v)} />
          <CheckField label="בכוונתך לתרגל מיד אחרי הרצאות" checked={value.practiceAfter} onChange={(v) => set('practiceAfter', v)} />
          <NumberField label="משקל שיעורי בית צפוי (%)" value={value.hwWeight} onChange={(v) => set('hwWeight', v)} />
          <SelectField label="כוונת הגשת שיעורי בית" value={value.hwHonesty} options={HONESTY_OPTIONS} onChange={(v) => set('hwHonesty', v)} />
        </div>
        <div className="cond blue">
          <b style={{ color: 'var(--blue)', fontSize: 13 }}>שיטת לימוד מתוכננת למבחן (% מהזמן)</b>
          <div className="pct-row" style={{ marginTop: 8 }}>
            <NumberField label="לבד" value={value.methodSolo} onChange={(v) => set('methodSolo', v)} />
            <NumberField label="עם חבר" value={value.methodFriend} onChange={(v) => set('methodFriend', v)} />
            <NumberField label="מורה פרטי" value={value.methodTutor} onChange={(v) => set('methodTutor', v)} />
          </div>
        </div>
      </div>
    </div>
  );
};
