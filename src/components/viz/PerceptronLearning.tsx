import type { ReactElement } from 'react';
import { AnimatedViz } from './AnimatedViz';
import { VIZ_W, VIZ_H } from './svg';
import type { MathStep } from './engine';

interface PPoint { x: number; y: number; label: 0 | 1; }
interface PState { w: [number, number]; b: number; step: number; mistakes: number; }

const POINTS: PPoint[] = [
  { x: 70, y: 50, label: 1 }, { x: 110, y: 70, label: 1 }, { x: 90, y: 40, label: 1 },
  { x: 60, y: 95, label: 1 }, { x: 135, y: 60, label: 1 },
  { x: 300, y: 170, label: 0 }, { x: 270, y: 150, label: 0 }, { x: 320, y: 185, label: 0 },
  { x: 285, y: 200, label: 0 }, { x: 250, y: 160, label: 0 },
];
const LR = 0.5;

const runEpoch = (s: PState): PState => {
  let [w0, w1] = s.w;
  let b = s.b;
  let mistakes = 0;
  POINTS.forEach((p) => {
    const nx = p.x / VIZ_W;
    const ny = p.y / VIZ_H;
    const target = p.label ? 1 : -1;
    const output = w0 * nx + w1 * ny + b;
    if ((output >= 0 ? 1 : -1) !== target) {
      w0 += LR * target * nx;
      w1 += LR * target * ny;
      b += LR * target;
      mistakes += 1;
    }
  });
  return { w: [w0, w1], b, step: s.step + 1, mistakes };
};

const STEPS: MathStep<PState>[] = Array.from({ length: 8 }, (_, k) => ({
  line: k === 7
    ? 'converged → separating line stable'
    : `epoch ${k + 1}:  ŷ=sign(w·x+b);  on error w += η·y·x, b += η·y  (η=0.5)`,
  apply: runEpoch,
}));

const render = ({ w, b }: PState): ReactElement => {
  const [w0, w1] = w;
  const yAt = (nx: number): number => (-(w0 * nx + b) / w1) * VIZ_H;
  return (
    <>
      {Math.abs(w1) > 1e-3 && <line x1={0} y1={yAt(0)} x2={VIZ_W} y2={yAt(1)} className="v-separator" />}
      {POINTS.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={7} className={p.label ? 'vb' : 'vr'} />
      ))}
    </>
  );
};

export const PerceptronLearning = (): ReactElement => (
  <AnimatedViz
    title="📈 למידת פרספטרון"
    sub="בכל אפוק (epoch) הפרספטרון מעדכן את הקו המפריד לפי כלל העדכון עד התכנסות."
    initial={{ w: [0.9, -0.6], b: 0, step: 0, mistakes: -1 }}
    steps={STEPS}
    render={render}
    info={({ step, mistakes }) => (step === 0 ? '' : `אפוק ${step} · טעויות: ${mistakes}`)}
  />
);
