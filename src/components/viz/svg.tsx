/* Small typed SVG helpers shared by the visualizations.
   Fixed viewBox keeps positions deterministic at any container width. */

import type { ReactNode, ReactElement } from 'react';

export const VIZ_W = 360;
export const VIZ_H = 220;

interface SvgProps {
  children: ReactNode;
  onPointerDown?: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void;
  svgRef?: React.Ref<SVGSVGElement>;
}

export const Svg = ({ children, onPointerDown, onPointerMove, svgRef }: SvgProps): ReactElement => (
  <svg
    ref={svgRef}
    viewBox={`0 0 ${VIZ_W} ${VIZ_H}`}
    className="viz-svg"
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
  >
    {children}
  </svg>
);

export const polyPoints = (pts: ReadonlyArray<readonly [number, number]>): string =>
  pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
