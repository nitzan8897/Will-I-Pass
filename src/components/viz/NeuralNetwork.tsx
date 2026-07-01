import type { ReactElement } from 'react';
import { Svg } from './svg';

const INPUTS = [60, 110, 160];
const HIDDEN = [40, 90, 140, 190];
const IN_X = 65, HID_X = 185, OUT_X = 305, OUT_Y = 115;

const Neuron = ({ x, y }: { x: number; y: number }): ReactElement => (
  <circle cx={x} cy={y} r={13} fill="#fff" stroke="var(--blue)" strokeWidth={2} />
);

export const NeuralNetwork = (): ReactElement => (
  <div className="card viz">
    <h3>🧠 ארכיטקטורת רשת נוירונים</h3>
    <p className="sub">קלט → שכבה נסתרת → פלט. כל קשת היא משקל; Backprop מעדכן את כולם.</p>
    <Svg>
      {INPUTS.flatMap((iy) => HIDDEN.map((hy) => (
        <line key={`e${iy}-${hy}`} x1={IN_X} y1={iy} x2={HID_X} y2={hy} className="v-edge" />
      )))}
      {HIDDEN.map((hy) => <line key={`o${hy}`} x1={HID_X} y1={hy} x2={OUT_X} y2={OUT_Y} className="v-edge" />)}
      {INPUTS.map((iy) => <Neuron key={`i${iy}`} x={IN_X} y={iy} />)}
      {HIDDEN.map((hy) => <Neuron key={`h${hy}`} x={HID_X} y={hy} />)}
      <Neuron x={OUT_X} y={OUT_Y} />
      <text x={IN_X} y={210} className="v-label" textAnchor="middle">קלט</text>
      <text x={HID_X} y={210} className="v-label" textAnchor="middle">שכבה נסתרת</text>
      <text x={OUT_X} y={210} className="v-label" textAnchor="middle">פלט</text>
    </Svg>
  </div>
);
