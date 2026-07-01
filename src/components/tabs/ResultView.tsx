import type { ReactElement } from 'react';
import type { Factor, Prediction } from '../../types';

interface Props {
  prediction: Prediction;
  factors: Factor[];
}

export const ResultView = ({ prediction, factors }: Props): ReactElement => {
  const grade = Math.round(prediction.estimatedGrade);
  return (
    <>
      <div className="rcards">
        <div className={`rcard ${prediction.willPass ? 'pass' : 'fail'}`}>
          <small>סיווג (Classification)</small>
          <div className="big">{prediction.willPass ? '✓ עובר' : '✗ נכשל'}</div>
          <small>הסתברות מעבר ~{Math.round(prediction.passProbability)}%</small>
        </div>
        <div className="rcard score-c">
          <small>ציון משוער (Regression)</small>
          <div className="big">{grade}</div>
          <div className="bar"><div style={{ width: `${grade}%` }} /></div>
        </div>
      </div>
      <div className="card" style={{ margin: 0 }}>
        <h3>🔎 גורמים שהשפיעו על התחזית</h3>
        <ul className="factors">
          {factors.map((f, i) => (
            <li key={i} className={f.direction}>
              {f.direction === 'up' ? '▲' : '▼'} {f.text}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
