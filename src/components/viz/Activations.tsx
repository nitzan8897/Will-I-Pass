import type { ReactElement } from 'react';
import { AnimatedViz } from './AnimatedViz';
import { polyPoints } from './svg';
import type { MathStep } from './engine';

interface AState { reveal: number; }

const LEFT = 30, RIGHT = 335, BASE = 180, TOP = 30;

const curve = (fn: (x: number) => number): Array<[number, number]> => {
  const pts: Array<[number, number]> = [];
  for (let x = -6; x <= 6; x += 0.25) {
    const px = LEFT + ((x + 6) / 12) * (RIGHT - LEFT);
    const py = BASE - Math.max(0, Math.min(1, fn(x))) * (BASE - TOP);
    pts.push([px, py]);
  }
  return pts;
};

const FNS: Array<{ fn: (x: number) => number; color: string }> = [
  { fn: (x) => (x >= 0 ? 1 : 0), color: '#e23d4d' },
  { fn: (x) => 1 / (1 + Math.exp(-x)), color: '#1e4d8c' },
  { fn: (x) => Math.max(0, x) / 6, color: '#16a3a3' },
];

const setReveal = (n: number) => (s: AState): AState => ({ ...s, reveal: n });
const STEPS: MathStep<AState>[] = [
  { line: 'axes:  x ∈ [−6, 6],  y ∈ [0, 1]', apply: setReveal(0) },
  { line: 'step(x) = 1 if x ≥ 0 else 0', apply: setReveal(1) },
  { line: 'σ(x) = 1 / (1 + e^−x)', apply: setReveal(2) },
  { line: 'relu(x) = max(0, x)   (scaled to view)', apply: setReveal(3) },
];

const render = ({ reveal }: AState): ReactElement => (
  <>
    <line x1={LEFT} y1={BASE} x2={RIGHT} y2={BASE} className="v-axis" />
    <line x1={(LEFT + RIGHT) / 2} y1={BASE} x2={(LEFT + RIGHT) / 2} y2={TOP} className="v-axis" />
    {FNS.slice(0, reveal).map((f, i) => (
      <polyline key={i} points={polyPoints(curve(f.fn))} fill="none" stroke={f.color} strokeWidth={2.5} />
    ))}
  </>
);

export const Activations = (): ReactElement => (
  <AnimatedViz
    title="⚡ פונקציות הפעלה"
    sub="Step (פרספטרון), Sigmoid ו-ReLU (רשתות) — כל אחת נחשפת עם הנוסחה שלה."
    initial={{ reveal: 0 }}
    steps={STEPS}
    render={render}
    legend={
      <div className="legend">
        <span><i style={{ background: '#e23d4d' }} /> Step</span>
        <span><i style={{ background: '#1e4d8c' }} /> Sigmoid</span>
        <span><i style={{ background: '#16a3a3' }} /> ReLU</span>
      </div>
    }
  />
);
