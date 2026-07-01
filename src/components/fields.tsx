/* Small typed, controlled form fields reused across the app. */

import type { ChangeEvent, ReactElement } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumberField = ({ label, value, onChange, min, max }: NumberFieldProps): ReactElement => (
  <div className="fld">
    <label>{label}</label>
    <input
      type="number"
      value={Number.isFinite(value) ? value : ''}
      min={min}
      max={max}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
    />
  </div>
);

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextField = ({ label, value, onChange }: TextFieldProps): ReactElement => (
  <div className="fld">
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  </div>
);

interface CheckFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckField = ({ label, checked, onChange }: CheckFieldProps): ReactElement => (
  <div className="fld chk">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
    />
    <label>{label}</label>
  </div>
);

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

export const SelectField = <T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<T>): ReactElement => (
  <div className="fld">
    <label>{label}</label>
    <select value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as T)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);
