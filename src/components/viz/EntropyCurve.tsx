import type { ReactElement } from 'react';
import { AnimatedViz } from './AnimatedViz';
import { polyPoints } from './svg';
import type { MathStep } from './engine';

interface EState { p: number; }

const LEFT = 40, RIGHT = 330, BASE = 185, TOP = 30;

const entropy = (p: number): number =>
  p === 0 || p === 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);

const plot = (p: number): [number, number] => [
  LEFT + p * (RIGHT - LEFT),
  BASE - entropy(p) * (BASE - TOP),
];

const setP = (p: number) => (s: EState): EState => ({ ...s, p });
const STEPS: MathStep<EState>[] = [
  { line: 'H(p) = −p·log₂p − (1−p)·log₂(1−p)', apply: setP(0.02) },
  { line: 'p = 0.10 → H ≈ 0.47', apply: setP(0.10) },
  { line: 'p = 0.30 → H ≈ 0.88', apply: setP(0.30) },
  { line: 'p = 0.50 → H = 1.00   (max uncertainty)', apply: setP(0.50) },
  { line: 'p = 0.70 → H ≈ 0.88', apply: setP(0.70) },
  { line: 'p = 1.00 → H = 0   (pure set)', apply: setP(1) },
];

const render = ({ p }: EState): ReactElement => {
  const drawn: Array<[number, number]> = [];
  for (let q = 0; q <= p + 1e-9; q += 0.02) drawn.push(plot(q));
  const head = plot(p);
  return (
    <>
      <line x1={LEFT} y1={BASE} x2={RIGHT} y2={BASE} className="v-axis" />
      <line x1={LEFT} y1={BASE} x2={LEFT} y2={TOP} className="v-axis" />
      <text x={RIGHT - 10} y={BASE + 16} className="v-label">p</text>
      <text x={LEFT - 26} y={TOP + 6} className="v-label">H</text>
      {drawn.length > 1 && (
        <polyline points={polyPoints(drawn)} fill="none" stroke="var(--teal)" strokeWidth={2.5} />
      )}
      <circle cx={head[0]} cy={head[1]} r={5} className="vr" />
    </>
  );
};

export const EntropyCurve = (): ReactElement => (
  <AnimatedViz
    title="📊 עקומת אנטרופיה"
    sub="הסמן סורק את p ומחשב את H(p): מקסימום כשחצי-חצי (p=0.5), אפס כשהקבוצה טהורה."
    initial={{ p: 0 }}
    steps={STEPS}
    render={render}
    info={({ p }) => `p=${p.toFixed(2)} · H=${entropy(p).toFixed(2)}`}
  />
);
