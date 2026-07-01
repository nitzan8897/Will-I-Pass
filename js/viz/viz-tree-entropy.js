/* =====================================================================
   viz-tree-entropy.js — דיאגרמת עץ החלטה + עקומת אנטרופיה
   ===================================================================== */
function decisionNode(svg, x, y, width, label, fill){
  svg.appendChild(svgElement('rect', { x: x - width / 2, y, width, height: 30, rx: 7, class: 'v-node', fill: fill || '#fff' }));
  svg.appendChild(svgText(x, y + 19, label, 'v-label', { 'text-anchor': 'middle' }));
}

function buildDecisionTree(){
  const svg = renderInto('vizTree');
  svg.appendChild(svgLine(180, 40, 90, 95, 'v-edge'));
  svg.appendChild(svgLine(180, 40, 270, 95, 'v-edge'));
  svg.appendChild(svgLine(90, 125, 45, 175, 'v-edge'));
  svg.appendChild(svgLine(90, 125, 135, 175, 'v-edge'));
  decisionNode(svg, 180, 10, 150, 'פתרון מבחנים > 2/יום?');
  svg.appendChild(svgText(120, 78, 'לא', 'v-label')); svg.appendChild(svgText(232, 78, 'כן', 'v-label'));
  decisionNode(svg, 90, 95, 120, 'הכנה > 20 שעות?');
  decisionNode(svg, 270, 95, 90, 'עובר', '#d8f5e6');
  decisionNode(svg, 45, 175, 80, 'נכשל', '#fbdde0');
  decisionNode(svg, 135, 175, 80, 'עובר', '#d8f5e6');
}

function buildEntropyCurve(){
  const svg = renderInto('vizEntropy');
  const left = 40, right = 330, base = 185, top = 30;
  svg.appendChild(svgLine(left, base, right, base, 'v-axis'));   // ציר p
  svg.appendChild(svgLine(left, base, left, top, 'v-axis'));     // ציר אנטרופיה
  svg.appendChild(svgText(right - 10, base + 16, 'p', 'v-label'));
  svg.appendChild(svgText(left - 26, top + 6, 'H', 'v-label'));
  let points = '';
  for (let p = 0; p <= 1.0001; p += 0.02){
    const entropy = (p === 0 || p === 1) ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
    const x = left + p * (right - left);
    const y = base - entropy * (base - top);
    points += `${x.toFixed(1)},${y.toFixed(1)} `;
  }
  svg.appendChild(svgElement('polyline', { points, fill: 'none', stroke: 'var(--teal)', 'stroke-width': 2.5 }));
  svg.appendChild(svgCircle(left + 0.5 * (right - left), top, 4, 'vr'));
  svg.appendChild(svgText(185, 24, 'מקסימום ב-p=0.5', 'v-label', { 'text-anchor': 'middle' }));
}
