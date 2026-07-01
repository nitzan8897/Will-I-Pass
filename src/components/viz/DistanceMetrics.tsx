import type { ReactElement } from 'react';
import { AnimatedViz } from './AnimatedViz';
import type { MathStep } from './engine';

interface DState { reveal: number; } // 0 pts, 1 +L2, 2 +Δx, 3 +Δy

const A = { x: 80, y: 54 };
const B = { x: 280, y: 156 };

const setReveal = (n: number) => (s: DState): DState => ({ ...s, reveal: n });
const STEPS: MathStep<DState>[] = [
  { line: 'A=(80,54)  B=(280,156)', apply: setReveal(0) },
  { line: 'L2 = √(Δx² + Δy²)   (straight line)', apply: setReveal(1) },
  { line: 'L1 = |Δx| + |Δy|   → walk Δx first', apply: setReveal(2) },
  { line: 'L1 → then walk Δy   (axis steps)', apply: setReveal(3) },
];

const render = ({ reveal }: DState): ReactElement => (
  <>
    {Array.from({ length: 8 }, (_, i) => 40 + i * 40).map((gx) => (
      <line key={`vx${gx}`} x1={gx} y1={20} x2={gx} y2={190} className="v-grid" />
    ))}
    {Array.from({ length: 6 }, (_, i) => 20 + i * 34).map((gy) => (
      <line key={`hy${gy}`} x1={40} y1={gy} x2={320} y2={gy} className="v-grid" />
    ))}
    {reveal >= 2 && <line x1={A.x} y1={A.y} x2={B.x} y2={A.y} stroke="#e0a012" strokeWidth={3} />}
    {reveal >= 3 && <line x1={B.x} y1={A.y} x2={B.x} y2={B.y} stroke="#e0a012" strokeWidth={3} />}
    {reveal >= 1 && <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--teal)" strokeWidth={2.5} />}
    <circle cx={A.x} cy={A.y} r={7} className="vb" />
    <circle cx={B.x} cy={B.y} r={7} className="vr" />
    <text x={A.x - 6} y={A.y - 12} className="v-label">A</text>
    <text x={B.x + 8} y={B.y + 4} className="v-label">B</text>
  </>
);

export const DistanceMetrics = (): ReactElement => (
  <AnimatedViz
    title="📐 מרחק אוקלידי (L2) מול מנהטן (L1)"
    sub="L2 = קו אווירי ישר. L1 = סכום צעדים לאורך הצירים — נבנה צעד אחר צעד."
    initial={{ reveal: 0 }}
    steps={STEPS}
    render={render}
    legend={
      <div className="legend">
        <span><i style={{ background: '#16a3a3' }} /> L2 ישר</span>
        <span><i style={{ background: '#e0a012' }} /> L1 מדרגות</span>
      </div>
    }
  />
);
