/* =====================================================================
   viz-overfit-classreg.js — התאמת יתר מול הכללה + סיווג מול רגרסיה
   ===================================================================== */
let overfitMode = 0;
const OVERFIT_POINTS = [[50, 160], [85, 140], [120, 150], [150, 120], [185, 130],
  [215, 100], [250, 110], [285, 80], [315, 95]];
const OVERFIT_LABELS = ['תת-התאמה (מודל פשוט מדי)', 'הכללה טובה (מודל מאוזן)', 'התאמת יתר (משנן רעש)'];

function buildOverfitting(){ overfitMode = 0; renderOverfitting(); }
function cycleOverfit(){ overfitMode = (overfitMode + 1) % 3; renderOverfitting(); }

function renderOverfitting(){
  const svg = renderInto('vizOver');
  let path;
  if (overfitMode === 0){
    path = `${OVERFIT_POINTS[0][0]},150 ${OVERFIT_POINTS[8][0]},110`;          // קו ישר
  } else if (overfitMode === 1){
    path = '50,165 150,135 250,100 315,85';                                   // עקומה חלקה
  } else {
    path = OVERFIT_POINTS.map(p => `${p[0]},${p[1]}`).join(' ');              // עובר בכל נקודה
  }
  svg.appendChild(svgElement('polyline', { points: path, fill: 'none', stroke: 'var(--teal)', 'stroke-width': 2.5 }));
  OVERFIT_POINTS.forEach(([x, y]) => svg.appendChild(svgCircle(x, y, 6, 'vb')));
  document.getElementById('overInfo').textContent = OVERFIT_LABELS[overfitMode];
}

function buildClassVsReg(){
  const svg = renderInto('vizCR');
  const left = 40, right = 330, base = 190, top = 25;
  const hoursToX = h => left + h / 40 * (right - left);
  const gradeToY = g => base - g / 100 * (base - top);
  svg.appendChild(svgLine(left, base, right, base, 'v-axis'));
  svg.appendChild(svgLine(left, base, left, top, 'v-axis'));
  svg.appendChild(svgText(right - 12, base + 16, 'שעות', 'v-label'));
  svg.appendChild(svgText(left - 18, top + 4, 'ציון', 'v-label'));
  svg.appendChild(svgLine(left, gradeToY(60), right, gradeToY(60), 'v-margin'));   // סף מעבר 60
  svg.appendChild(svgText(right - 30, gradeToY(60) - 5, 'סף 60', 'v-label'));
  const data = [[5, 40], [10, 48], [15, 55], [20, 62], [25, 70], [30, 78], [35, 88]];
  svg.appendChild(svgLine(hoursToX(3), gradeToY(36), hoursToX(37), gradeToY(92), 'v-separator'));  // קו רגרסיה
  data.forEach(([h, g]) => svg.appendChild(svgCircle(hoursToX(h), gradeToY(g), 6, g >= 60 ? 'vg' : 'vr')));
}
