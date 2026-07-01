import type { ReactElement } from 'react';
import { AnimatedViz } from './AnimatedViz';
import type { MathStep } from './engine';

interface Pt { x0: number; y0: number; r: number; cls: 'r' | 'b'; }
interface KernelState { t: number; }

const CX = 180, CY = 110, MAX_R = 82, BASE = 190, TOP = 30;

const ring = (count: number, radius: number, cls: 'r' | 'b'): Pt[] =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * 2 * Math.PI;
    return { x0: CX + radius * Math.cos(a), y0: CY + radius * Math.sin(a), r: radius, cls };
  });

const INNER: Pt[] = [...ring(6, 26, 'r'), { x0: CX, y0: CY, r: 0, cls: 'r' }];
const OUTER: Pt[] = ring(12, MAX_R, 'b');

const lift = (pt: Pt, slot: number, count: number): { x: number; y: number } => {
  const zNorm = (pt.r / MAX_R) ** 2;                       // z = (x²+y²) normalised
  return { x: 40 + (count > 1 ? (slot / (count - 1)) * 280 : 140), y: BASE - zNorm * (BASE - TOP) };
};

const at = (pt: Pt, target: { x: number; y: number }, t: number): [number, number] =>
  [pt.x0 + (target.x - pt.x0) * t, pt.y0 + (target.y - pt.y0) * t];

const setT = (t: number) => (s: KernelState): KernelState => ({ ...s, t });

const STEPS: MathStep<KernelState>[] = [
  { line: 'data not linearly separable in 2D', apply: setT(0.04) },
  { line: 'φ(x,y) = (x, y, x² + y²)', apply: setT(0.22) },
  { line: 'z = x² + y²   (squared distance from centre)', apply: setT(0.42) },
  { line: 'inner class: small z → stays low', apply: setT(0.62) },
  { line: 'outer class: large z → lifts high', apply: setT(0.82) },
  { line: 'plane  z = c  separates the classes  ✓', apply: setT(1) },
];

const render = ({ t }: KernelState): ReactElement => {
  const dots = [
    ...INNER.map((p, i) => ({ p, xy: at(p, lift(p, i, INNER.length), t) })),
    ...OUTER.map((p, i) => ({ p, xy: at(p, lift(p, i, OUTER.length), t) })),
  ];
  return (
    <>
      {t > 0.55 && <line x1={20} y1={CY} x2={340} y2={CY} className="v-margin" />}
      {dots.map(({ p, xy }, i) => (
        <circle key={i} cx={xy[0]} cy={xy[1]} r={7} className={p.cls === 'r' ? 'vr' : 'vb'} />
      ))}
      <text x={180} y={210} className="v-label" textAnchor="middle">
        {t > 0.55 ? 'מישור מפריד במימד הגבוה (z)' : 'לא ניתן להפריד בקו במישור'}
      </text>
    </>
  );
};

export const KernelTrick = (): ReactElement => (
  <AnimatedViz
    title="🌀 טריק הקרנל"
    sub="אדומים במרכז, כחולים בטבעת — אי אפשר להפריד בקו. המיפוי מרים למימד 3 לפי z=x²+y² עד שמישור מפריד."
    initial={{ t: 0 }}
    steps={STEPS}
    render={render}
    info={({ t }) => `z-lift: ${Math.round(t * 100)}%`}
  />
);
