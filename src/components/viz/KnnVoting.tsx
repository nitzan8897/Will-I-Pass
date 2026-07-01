import { useEffect, useRef, useState, type ReactElement, type PointerEvent } from 'react';
import { Svg } from './svg';

interface KPoint { x: number; y: number; cls: 'r' | 'b'; }

const POINTS: KPoint[] = [
  { x: 90, y: 70, cls: 'r' }, { x: 130, y: 50, cls: 'r' }, { x: 110, y: 110, cls: 'r' },
  { x: 70, y: 120, cls: 'r' }, { x: 160, y: 90, cls: 'r' },
  { x: 250, y: 80, cls: 'b' }, { x: 290, y: 130, cls: 'b' }, { x: 270, y: 60, cls: 'b' },
  { x: 310, y: 100, cls: 'b' }, { x: 240, y: 150, cls: 'b' },
];

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

export const KnnVoting = (): ReactElement => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<boolean>(false);
  const [query, setQuery] = useState<{ x: number; y: number }>({ x: 200, y: 110 });
  const [k, setK] = useState<number>(5);

  useEffect(() => {
    const stop = (): void => { dragging.current = false; };
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, []);

  const toSvg = (e: PointerEvent<SVGSVGElement>): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const p = point.matrixTransform(ctm.inverse());
    return { x: clamp(p.x, 12, 348), y: clamp(p.y, 12, 208) };
  };

  const move = (e: PointerEvent<SVGSVGElement>): void => {
    const p = toSvg(e);
    if (p) setQuery(p);
  };

  const neighbors = [...POINTS]
    .map((p) => ({ p, d: Math.hypot(p.x - query.x, p.y - query.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
  const redVotes = neighbors.filter((n) => n.p.cls === 'r').length;
  const winner: 'r' | 'b' = redVotes > k / 2 ? 'r' : 'b';

  return (
    <div className="card viz">
      <h3>🗳️ הצבעת KNN (גרור!)</h3>
      <p className="sub">גרור את הנקודה ושנה את K. הסיווג מתעדכן לפי רוב K השכנים הקרובים.</p>
      <Svg
        svgRef={svgRef}
        onPointerDown={(e) => { dragging.current = true; move(e); }}
        onPointerMove={(e) => { if (dragging.current) move(e); }}
      >
        {neighbors.map((n, i) => (
          <line key={`n${i}`} x1={query.x} y1={query.y} x2={n.p.x} y2={n.p.y} className="v-neighbor" />
        ))}
        {POINTS.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={7} className={p.cls === 'r' ? 'vr' : 'vb'} />)}
        <circle
          cx={query.x}
          cy={query.y}
          r={10}
          className={`grabbable ${winner === 'r' ? 'vr' : 'vb'}`}
          stroke="#0d2b52"
          strokeWidth={2.5}
        />
      </Svg>
      <div className="ctl">
        <label>K = <b>{k}</b></label>
        <input type="range" min={1} max={9} step={2} value={k} onChange={(e) => setK(Number(e.target.value))} />
      </div>
      <div className="legend">
        <span>אדום: {redVotes}</span>
        <span>כחול: {k - redVotes}</span>
        <span>→ סיווג: <b>{winner === 'r' ? 'אדום' : 'כחול'}</b></span>
      </div>
    </div>
  );
};
