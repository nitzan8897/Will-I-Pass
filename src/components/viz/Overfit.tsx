import { useState, type ReactElement } from 'react';
import { Svg, polyPoints } from './svg';

const POINTS: Array<[number, number]> = [
  [50, 160], [85, 140], [120, 150], [150, 120], [185, 130], [215, 100], [250, 110], [285, 80], [315, 95],
];
const LABELS = ['תת-התאמה (מודל פשוט מדי)', 'הכללה טובה (מודל מאוזן)', 'התאמת יתר (משנן רעש)'];

const pathFor = (mode: number): string => {
  if (mode === 0) return `${POINTS[0][0]},150 ${POINTS[8][0]},110`;
  if (mode === 1) return '50,165 150,135 250,100 315,85';
  return polyPoints(POINTS);
};

export const Overfit = (): ReactElement => {
  const [mode, setMode] = useState<number>(0);
  return (
    <div className="card viz">
      <h3>🎯 התאמת יתר מול הכללה</h3>
      <p className="sub">לחץ כדי לעבור בין מודל פשוט (הכללה) למורכב ש"משנן רעש" (Overfit).</p>
      <Svg>
        <polyline points={pathFor(mode)} fill="none" stroke="var(--teal)" strokeWidth={2.5} />
        {POINTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} className="vb" />)}
      </Svg>
      <div className="ctl">
        <button className="btn sm sec" onClick={() => setMode((m) => (m + 1) % 3)}>🔁 החלף מורכבות</button>
        <span className="mini">{LABELS[mode]}</span>
      </div>
    </div>
  );
};
