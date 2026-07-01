/* =====================================================================
   viz-kernel-svm.js — טריק הקרנל + מרווח SVM
   ===================================================================== */
let kernelLifted = false;

function buildKernelTrick(){
  const svg = renderInto('vizKernel');
  const centerX = 180, centerY = 110;
  const ring = (count, radius) => Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  });
  const innerPoints = [...ring(6, 28), { x: centerX, y: centerY }];   // מחלקה אדומה במרכז
  const outerPoints = ring(13, 80);                                   // מחלקה כחולה בטבעת

  if (kernelLifted){                                                  // "הרמה" למימד 3: הפרדה לינארית
    svg.appendChild(svgLine(20, 115, 340, 115, 'v-margin'));
    innerPoints.forEach((p, i) => svg.appendChild(svgCircle(40 + i * 40, 70, 7, 'vr')));
    outerPoints.forEach((p, i) => svg.appendChild(svgCircle(25 + i * 25, 165, 7, 'vb')));
    svg.appendChild(svgText(180, 200, 'מישור מפריד במימד הגבוה', 'v-label', { 'text-anchor': 'middle' }));
  } else {
    outerPoints.forEach(p => svg.appendChild(svgCircle(p.x, p.y, 7, 'vb')));
    innerPoints.forEach(p => svg.appendChild(svgCircle(p.x, p.y, 7, 'vr')));
    svg.appendChild(svgText(180, 205, 'לא ניתן להפריד בקו במישור', 'v-label', { 'text-anchor': 'middle' }));
  }
}

function toggleKernel(){ kernelLifted = !kernelLifted; buildKernelTrick(); }

function buildSvmMargin(){
  const svg = renderInto('vizSVM');
  const passing = [[70, 55], [105, 42], [62, 95], [125, 72], [92, 115]];
  const failing = [[300, 175], [330, 158], [268, 150], [312, 205], [258, 198]];
  svg.appendChild(svgLine(255, 25, 95, 210, 'v-separator'));           // קו מפריד
  svg.appendChild(svgLine(300, 35, 140, 220, 'v-margin'));             // שולי המרווח
  svg.appendChild(svgLine(210, 15, 50, 200, 'v-margin'));
  passing.forEach(([x, y]) => svg.appendChild(svgCircle(x, y, 7, 'vb')));
  failing.forEach(([x, y]) => svg.appendChild(svgCircle(x, y, 7, 'vr')));
  svg.appendChild(svgCircle(125, 72, 11, 'v-support'));                // וקטורי תמיכה (הקרובים לקו)
  svg.appendChild(svgCircle(268, 150, 11, 'v-support'));
  svg.appendChild(svgText(180, 30, 'margin', 'v-label', { 'text-anchor': 'middle' }));
}
