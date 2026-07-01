/* Card wrapper for a math visualization: SVG + play/reset controls +
   a debug panel that steps through the math line-by-line in sync with the animation. */

import type { ReactNode, ReactElement } from 'react';
import { Svg } from './svg';
import { useAnimatedSteps, type MathStep } from './engine';

interface Props<S> {
  title: string;
  sub: string;
  initial: S;
  steps: MathStep<S>[];
  render: (state: S) => ReactNode;
  info?: (state: S, index: number) => string;
  legend?: ReactNode;
  stepDelay?: number;
}

export const AnimatedViz = <S,>({
  title, sub, initial, steps, render, info, legend, stepDelay,
}: Props<S>): ReactElement => {
  const { state, index, playing, play, reset } = useAnimatedSteps(steps, initial, stepDelay);
  return (
    <div className="card viz">
      <h3>{title}</h3>
      <p className="sub">{sub}</p>
      <Svg>{render(state)}</Svg>
      <div className="ctl">
        <button className="btn sm sec" onClick={play} disabled={playing}>▶ הפעל</button>
        <button className="btn sm ghost" onClick={reset}>↺ אפס</button>
        {info && <span className="mini">{info(state, index)}</span>}
      </div>
      {legend}
      <div className="math-debug">
        <div className="ttl">math · debug</div>
        <ol>
          {steps.map((step, i) => (
            <li key={i} className={i === index ? 'active' : i < index ? 'done' : ''}>
              {step.line}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
