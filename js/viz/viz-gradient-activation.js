/* =====================================================================
   viz-gradient-activation.js — ירידת גרדיאנט (כדור על עקומת שגיאה)
                                ופונקציות הפעלה (Step/Sigmoid/ReLU)
   ===================================================================== */
let gradientState;
const GD_LEFT = 40, GD_RIGHT = 330, GD_BASE = 195, GD_TOP = 25, GD_MINIMUM = 0.7;

const lossAt = position => (position - GD_MINIMUM) ** 2;
const toPlot = position => ({
  x: GD_LEFT + position * (GD_RIGHT - GD_LEFT),
  y: GD_BASE - lossAt(position) / lossAt(0) * (GD_BASE - GD_TOP)
});

function buildGradientDescent(){ gradientReset(); }
function gradientReset(){ gradientState = { position: 0.04, step: 0 }; renderGradient(); }

function gradientStep(){
  const learningRate = 0.12;
  gradientState.position -= learningRate * 2 * (gradientState.position - GD_MINIMUM);  // x -= lr·dL/dx
  gradientState.step++;
  renderGradient();
}

function renderGradient(){
  const svg = renderInto('vizGD');
  let curve = '';
  for (let p = 0; p <= 1.0001; p += 0.02){ const pt = toPlot(p); curve += `${pt.x.toFixed(1)},${pt.y.toFixed(1)} `; }
  svg.appendChild(svgElement('polyline', { points: curve, fill: 'none', stroke: '#9fb0c8', 'stroke-width': 2 }));
  const ball = toPlot(gradientState.position);
  svg.appendChild(svgCircle(ball.x, ball.y, 9, 'vg'));
  svg.appendChild(svgText(toPlot(GD_MINIMUM).x, GD_BASE + 15, 'מינימום', 'v-label', { 'text-anchor': 'middle' }));
  document.getElementById('gdInfo').textContent =
    `צעד ${gradientState.step} · שגיאה: ${lossAt(gradientState.position).toFixed(3)}`;
}

function buildActivations(){
  const svg = renderInto('vizAct');
  const left = 30, right = 335, base = 180, top = 30, midY = (base + top) / 2;
  svg.appendChild(svgLine(left, base, right, base, 'v-axis'));
  svg.appendChild(svgLine((left + right) / 2, base, (left + right) / 2, top, 'v-axis'));
  const plot = (fn, color) => {
    let pts = '';
    for (let x = -6; x <= 6; x += 0.25){
      const px = left + (x + 6) / 12 * (right - left);
      const py = base - Math.max(0, Math.min(1, fn(x))) * (base - top);
      pts += `${px.toFixed(1)},${py.toFixed(1)} `;
    }
    svg.appendChild(svgElement('polyline', { points: pts, fill: 'none', stroke: color, 'stroke-width': 2.5 }));
  };
  plot(x => x >= 0 ? 1 : 0, '#e23d4d');           // Step
  plot(x => 1 / (1 + Math.exp(-x)), '#1e4d8c');   // Sigmoid
  plot(x => Math.max(0, x) / 6, '#16a3a3');       // ReLU (מנורמל לתצוגה)
}
