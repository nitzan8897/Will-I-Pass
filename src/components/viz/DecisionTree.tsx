import type { ReactElement } from 'react';
import { Svg } from './svg';

interface NodeProps { x: number; y: number; w: number; label: string; fill?: string; }

const Node = ({ x, y, w, label, fill }: NodeProps): ReactElement => (
  <>
    <rect x={x - w / 2} y={y} width={w} height={30} rx={7} className="v-node" fill={fill ?? '#fff'} />
    <text x={x} y={y + 19} className="v-label" textAnchor="middle">{label}</text>
  </>
);

export const DecisionTree = (): ReactElement => (
  <div className="card viz">
    <h3>🌳 עץ החלטה (ID3)</h3>
    <p className="sub">בכל צומת נבחרת התכונה עם רווח האינפורמציה המרבי. עלים = עובר/נכשל.</p>
    <Svg>
      <line x1={180} y1={40} x2={90} y2={95} className="v-edge" />
      <line x1={180} y1={40} x2={270} y2={95} className="v-edge" />
      <line x1={90} y1={125} x2={45} y2={175} className="v-edge" />
      <line x1={90} y1={125} x2={135} y2={175} className="v-edge" />
      <Node x={180} y={10} w={150} label="פתרון מבחנים > 2/יום?" />
      <text x={120} y={78} className="v-label">לא</text>
      <text x={232} y={78} className="v-label">כן</text>
      <Node x={90} y={95} w={120} label="הכנה > 20 שעות?" />
      <Node x={270} y={95} w={90} label="עובר" fill="#d8f5e6" />
      <Node x={45} y={175} w={80} label="נכשל" fill="#fbdde0" />
      <Node x={135} y={175} w={80} label="עובר" fill="#d8f5e6" />
    </Svg>
  </div>
);
