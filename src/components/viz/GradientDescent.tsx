import type { ReactElement } from 'react';
import { AnimatedViz } from './AnimatedViz';
import { polyPoints } from './svg';
import type { MathStep } from './engine';

interface GState { position: number; step: number; }

const LEFT = 40, RIGHT = 330, BASE = 195, TOP = 25, MIN = 0.7, LR = 0.12;

const lossAt = (p: number): number => (p - MIN) ** 2;
const toPlot = (p: number): [number, number] => [
  LEFT + p * (RIGHT - LEFT),
  BASE - (lossAt(p) / lossAt(0)) * (BASE - TOP),
];

const gdStep = (s: GState): GState => ({
  position: s.position - LR * 2 * (s.position - MIN), // x ← x − η·∇L
  step: s.step + 1,
});

const STEPS: MathStep<GState>[] = [
  { line: 'L(x) = (x − x*)²', apply: (s) => s },
  { line: '∇L(x) = 2·(x − x*)', apply: (s) => s },
  ...Array.from({ length: 6 }, () => ({
    line: 'x ← x − η·∇L(x)   (η=0.12)',
    apply: gdStep,
  })),
];

const render = ({ position }: GState): ReactElement => {
  const curve: Array<[number, number]> = [];
  for (let p = 0; p <= 1.0001; p += 0.02) curve.push(toPlot(p));
  const ball = toPlot(position);
  return (
    <>
      <polyline points={polyPoints(curve)} fill="none" stroke="#9fb0c8" strokeWidth={2} />
      <circle cx={ball[0]} cy={ball[1]} r={9} className="vg" />
      <text x={toPlot(MIN)[0]} y={BASE + 15} className="v-label" textAnchor="middle">מינימום</text>
    </>
  );
};

export const GradientDescent = (): ReactElement => (
  <AnimatedViz
    title="⛷️ ירידת גרדיאנט"
    sub="הכדור מתגלגל במורד עקומת השגיאה: כל צעד מזיז את x בכיוון הנגזרת עד המינימום."
    initial={{ position: 0.04, step: 0 }}
    steps={STEPS}
    render={render}
    info={({ position, step }) => `צעד ${step} · שגיאה ${lossAt(position).toFixed(3)}`}
  />
);
