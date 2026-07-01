/* =====================================================================
   viz-network-distance.js — ארכיטקטורת רשת נוירונים + מרחק L2 מול L1
   ===================================================================== */
function neuron(svg, x, y){
  svg.appendChild(svgElement('circle', { cx: x, cy: y, r: 13, fill: '#fff', stroke: 'var(--blue)', 'stroke-width': 2 }));
}

function buildNeuralNetwork(){
  const svg = renderInto('vizNet');
  const inputs = [60, 110, 160], hidden = [40, 90, 140, 190], outputY = 115;
  const inputX = 65, hiddenX = 185, outputX = 305;
  inputs.forEach(iy => hidden.forEach(hy => svg.appendChild(svgLine(inputX, iy, hiddenX, hy, 'v-edge'))));
  hidden.forEach(hy => svg.appendChild(svgLine(hiddenX, hy, outputX, outputY, 'v-edge')));
  inputs.forEach(iy => neuron(svg, inputX, iy));
  hidden.forEach(hy => neuron(svg, hiddenX, hy));
  neuron(svg, outputX, outputY);
  svg.appendChild(svgText(inputX, 210, 'קלט', 'v-label', { 'text-anchor': 'middle' }));
  svg.appendChild(svgText(hiddenX, 210, 'שכבה נסתרת', 'v-label', { 'text-anchor': 'middle' }));
  svg.appendChild(svgText(outputX, 210, 'פלט', 'v-label', { 'text-anchor': 'middle' }));
}

function buildDistanceMetrics(){
  const svg = renderInto('vizDist');
  for (let gx = 40; gx <= 320; gx += 40) svg.appendChild(svgLine(gx, 20, gx, 190, 'v-grid'));
  for (let gy = 20; gy <= 190; gy += 34) svg.appendChild(svgLine(40, gy, 320, gy, 'v-grid'));
  const a = { x: 80, y: 54 }, b = { x: 280, y: 156 };
  svg.appendChild(svgElement('polyline', { points: `${a.x},${a.y} ${b.x},${a.y} ${b.x},${b.y}`,
    fill: 'none', stroke: '#e0a012', 'stroke-width': 3 }));                 // L1 מדרגות
  svg.appendChild(svgLine(a.x, a.y, b.x, b.y, 'v-separator'));             // L2 ישר
  svg.lastChild.setAttribute('stroke', 'var(--teal)');
  svg.appendChild(svgCircle(a.x, a.y, 7, 'vb'));
  svg.appendChild(svgCircle(b.x, b.y, 7, 'vr'));
  svg.appendChild(svgText(a.x - 6, a.y - 12, 'A', 'v-label'));
  svg.appendChild(svgText(b.x + 8, b.y + 4, 'B', 'v-label'));
}
