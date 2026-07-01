/* Shared step-through animation engine for the math visualizations.
   Each "step" is one line of math plus the state transition it performs.
   Playing walks the steps at a readable pace, highlighting the active line
   so the user can follow (and re-run) the math behind the animation. */

import { useEffect, useRef, useState } from 'react';

export interface MathStep<S> {
  /** The line of math shown in the debug panel for this step. */
  line: string;
  /** Produce the next state from the previous one. */
  apply: (prev: S) => S;
}

export interface AnimationController<S> {
  state: S;
  index: number; // active line index, -1 before playback
  playing: boolean;
  play: () => void;
  reset: () => void;
}

export const useAnimatedSteps = <S>(
  steps: MathStep<S>[],
  initial: S,
  stepDelay = 850,
): AnimationController<S> => {
  const [state, setState] = useState<S>(initial);
  const [index, setIndex] = useState<number>(-1);
  const [playing, setPlaying] = useState<boolean>(false);
  const timer = useRef<number | undefined>(undefined);

  const stop = (): void => {
    if (timer.current !== undefined) window.clearInterval(timer.current);
    timer.current = undefined;
  };

  useEffect(() => stop, []);

  const reset = (): void => {
    stop();
    setState(initial);
    setIndex(-1);
    setPlaying(false);
  };

  const play = (): void => {
    stop();
    setState(initial);
    setIndex(-1);
    setPlaying(true);
    let i = 0;
    timer.current = window.setInterval(() => {
      const step = steps[i]; // capture by value — updater must not read mutable i
      if (!step) {
        stop();
        setPlaying(false);
        return;
      }
      setState((prev) => step.apply(prev));
      setIndex(i);
      i += 1;
      if (i >= steps.length) {
        stop();
        setPlaying(false);
      }
    }, stepDelay);
  };

  return { state, index, playing, play, reset };
};
