import type { ReactElement } from 'react';
import { Svg } from './svg';

const LEFT = 40, RIGHT = 330, BASE = 190, TOP = 25;
const hoursToX = (h: number): number => LEFT + (h / 40) * (RIGHT - LEFT);
const gradeToY = (g: number): number => BASE - (g / 100) * (BASE - TOP);
const DATA: Array<[number, number]> = [[5, 40], [10, 48], [15, 55], [20, 62], [25, 70], [30, 78], [35, 88]];

export const ClassVsReg = (): ReactElement => (
  <div className="card viz">
    <h3>⚖️ סיווג מול רגרסיה</h3>
    <p className="sub">רגרסיה מנבאת ציון רציף (קו), סיווג חותך בסף 60 לעובר/נכשל.</p>
    <Svg>
      <line x1={LEFT} y1={BASE} x2={RIGHT} y2={BASE} className="v-axis" />
      <line x1={LEFT} y1={BASE} x2={LEFT} y2={TOP} className="v-axis" />
      <text x={RIGHT - 12} y={BASE + 16} className="v-label">שעות</text>
      <text x={LEFT - 18} y={TOP + 4} className="v-label">ציון</text>
      <line x1={LEFT} y1={gradeToY(60)} x2={RIGHT} y2={gradeToY(60)} className="v-margin" />
      <text x={RIGHT - 30} y={gradeToY(60) - 5} className="v-label">סף 60</text>
      <line x1={hoursToX(3)} y1={gradeToY(36)} x2={hoursToX(37)} y2={gradeToY(92)} className="v-separator" />
      {DATA.map(([h, g], i) => (
        <circle key={i} cx={hoursToX(h)} cy={gradeToY(g)} r={6} className={g >= 60 ? 'vg' : 'vr'} />
      ))}
    </Svg>
  </div>
);
