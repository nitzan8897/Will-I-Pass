import type { ReactElement } from 'react';
import { Svg } from './svg';

const PASSING: Array<[number, number]> = [[70, 55], [105, 42], [62, 95], [125, 72], [92, 115]];
const FAILING: Array<[number, number]> = [[300, 175], [330, 158], [268, 150], [312, 205], [258, 198]];

export const SvmMargin = (): ReactElement => (
  <div className="card viz">
    <h3>🛣️ המרווח של SVM</h3>
    <p className="sub">קו מפריד עם "רחוב" רחב. הנקודות עם מסגרת הן <b>וקטורי התמיכה</b>.</p>
    <Svg>
      <line x1={255} y1={25} x2={95} y2={210} className="v-separator" />
      <line x1={300} y1={35} x2={140} y2={220} className="v-margin" />
      <line x1={210} y1={15} x2={50} y2={200} className="v-margin" />
      {PASSING.map(([x, y], i) => <circle key={`p${i}`} cx={x} cy={y} r={7} className="vb" />)}
      {FAILING.map(([x, y], i) => <circle key={`f${i}`} cx={x} cy={y} r={7} className="vr" />)}
      <circle cx={125} cy={72} r={11} className="v-support" />
      <circle cx={268} cy={150} r={11} className="v-support" />
      <text x={180} y={30} className="v-label" textAnchor="middle">margin</text>
    </Svg>
    <div className="legend"><span><i className="r" /> נכשלים</span><span><i className="b" /> עוברים</span></div>
  </div>
);
