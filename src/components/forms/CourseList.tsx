import type { ReactElement } from 'react';
import type { PastCourse } from '../../types';
import { makePastCourse } from '../../data/defaults';
import { NumberField, TextField, CheckField, SelectField } from '../fields';
import { HONESTY_OPTIONS, PASSED_ON_OPTIONS } from './options';

interface CardProps {
  index: number;
  course: PastCourse;
  onChange: (course: PastCourse) => void;
  onRemove: () => void;
}

const CourseCard = ({ index, course, onChange, onRemove }: CardProps): ReactElement => {
  const set = <K extends keyof PastCourse>(key: K, v: PastCourse[K]): void =>
    onChange({ ...course, [key]: v });
  return (
    <div className="course">
      <div className="head">
        <b>קורס #{index + 1}</b>
        <button className="del" onClick={onRemove}>🗑 הסר</button>
      </div>
      <div className="grid">
        <TextField label="שם הקורס" value={course.name} onChange={(v) => set('name', v)} />
        <TextField label="שם המרצה" value={course.lecturer} onChange={(v) => set('lecturer', v)} />
        <NumberField label="נקודות זכות" value={course.credits} onChange={(v) => set('credits', v)} />
        <CheckField label="דורש חשיבה מתמטית" checked={course.isMath} onChange={(v) => set('isMath', v)} />
        <CheckField label="דורש חשיבת מדעי המחשב" checked={course.isCS} onChange={(v) => set('isCS', v)} />
        <NumberField label="שעות לימוד החומר בפעם הראשונה" value={course.firstLearnHrs} onChange={(v) => set('firstLearnHrs', v)} />
        <NumberField label="שעות הכנה למבחן (תרגול+מבחנים)" value={course.examPrepHrs} onChange={(v) => set('examPrepHrs', v)} />
        <NumberField label="שעות יומיות של פתרון מבחנים" value={course.dailyPastExamHrs} onChange={(v) => set('dailyPastExamHrs', v)} />
        <CheckField label="תרגל מיד אחרי הרצאות / תרגול" checked={course.practiceAfter} onChange={(v) => set('practiceAfter', v)} />
        <NumberField label="משקל שיעורי הבית (%)" value={course.hwWeight} onChange={(v) => set('hwWeight', v)} />
        <SelectField label="הגשת שיעורי הבית" value={course.hwHonesty} options={HONESTY_OPTIONS} onChange={(v) => set('hwHonesty', v)} />
      </div>
      <div className="cond">
        <b style={{ color: 'var(--teal-d)', fontSize: 13 }}>שיטת לימוד למבחן (% מהזמן)</b>
        <div className="pct-row" style={{ marginTop: 8 }}>
          <NumberField label="לבד" value={course.methodSolo} onChange={(v) => set('methodSolo', v)} />
          <NumberField label="עם חבר" value={course.methodFriend} onChange={(v) => set('methodFriend', v)} />
          <NumberField label="מורה פרטי" value={course.methodTutor} onChange={(v) => set('methodTutor', v)} />
        </div>
      </div>
      <div className="grid" style={{ marginTop: 10 }}>
        <NumberField label="ציון מבחן סופי" value={course.finalExam} onChange={(v) => set('finalExam', v)} />
        <NumberField label="ממוצע הקורס (תווית האימון)" value={course.courseAvg} onChange={(v) => set('courseAvg', v)} />
        <CheckField label="ניגשתי ל-2 מבחנים (מועד ב')" checked={course.moedB} onChange={(v) => set('moedB', v)} />
      </div>
      {course.moedB && (
        <div className="cond">
          <b style={{ color: 'var(--teal-d)', fontSize: 13 }}>מבחנים חוזרים — התפלגות ציונים</b>
          <div className="grid" style={{ marginTop: 8 }}>
            <NumberField label="ציון מועד א'" value={course.moedAGrade} min={0} max={100} onChange={(v) => set('moedAGrade', v)} />
            <NumberField label="ציון מועד ב'" value={course.moedBGrade} min={0} max={100} onChange={(v) => set('moedBGrade', v)} />
            <NumberField label="ציון מועד ג' (אם ניגשת)" value={course.moedCGrade} min={0} max={100} onChange={(v) => set('moedCGrade', v)} />
            <SelectField label="באיזה מועד עברת?" value={course.passedOn} options={PASSED_ON_OPTIONS} onChange={(v) => set('passedOn', v)} />
            <CheckField label="קורס חוזר (נכשלת בכל המועדים)" checked={course.isRetake} onChange={(v) => set('isRetake', v)} />
          </div>
        </div>
      )}
    </div>
  );
};

interface Props {
  courses: PastCourse[];
  onChange: (courses: PastCourse[]) => void;
}

export const CourseList = ({ courses, onChange }: Props): ReactElement => {
  const updateAt = (i: number, course: PastCourse): void =>
    onChange(courses.map((c, idx) => (idx === i ? course : c)));
  const removeAt = (i: number): void => onChange(courses.filter((_, idx) => idx !== i));
  const add = (): void => onChange([...courses, makePastCourse()]);
  return (
    <div className="card">
      <h3>📚 קורסים קודמים (דאטת האימון)</h3>
      {courses.map((course, i) => (
        <CourseCard key={i} index={i} course={course} onChange={(c) => updateAt(i, c)} onRemove={() => removeAt(i)} />
      ))}
      <button className="btn ghost sm" onClick={add}>➕ הוסף קורס</button>
    </div>
  );
};
