import type { ReactElement } from 'react';
import type { HighSchool } from '../../types';
import { NumberField, TextField } from '../fields';

interface Props {
  value: HighSchool;
  onChange: (value: HighSchool) => void;
}

export const HighSchoolForm = ({ value, onChange }: Props): ReactElement => {
  const set = <K extends keyof HighSchool>(key: K, v: HighSchool[K]): void =>
    onChange({ ...value, [key]: v });
  return (
    <div className="card">
      <h3>🏫 נתוני תיכון</h3>
      <div className="grid">
        <NumberField label="יחידות לימוד מתמטיקה" value={value.mathUnits} min={3} max={5} onChange={(v) => set('mathUnits', v)} />
        <NumberField label="ציון מתמטיקה" value={value.mathGrade} min={0} max={100} onChange={(v) => set('mathGrade', v)} />
        <NumberField label="יחידות מדעי המחשב" value={value.csUnits} min={0} max={10} onChange={(v) => set('csUnits', v)} />
        <NumberField label="ציון מדעי המחשב" value={value.csGrade} min={0} max={100} onChange={(v) => set('csGrade', v)} />
        <NumberField label="ממוצע ציונים (בגרות)" value={value.gpa} min={0} max={100} onChange={(v) => set('gpa', v)} />
        <TextField label="שם בית הספר" value={value.school} onChange={(v) => set('school', v)} />
        <TextField label="עיר" value={value.city} onChange={(v) => set('city', v)} />
        <TextField label="מדינה" value={value.country} onChange={(v) => set('country', v)} />
      </div>
    </div>
  );
};
