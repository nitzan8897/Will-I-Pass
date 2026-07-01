/* =====================================================================
   viz-knn.js — הצבעת KNN אינטראקטיבית: גרירת נקודת השאילתה + בחירת K
   ===================================================================== */
let knnState, knnDragging = false;

function buildKnnVoting(){
  const svg = renderInto('vizKNN');
  const points = [
    { x: 90, y: 70, cls: 'r' }, { x: 130, y: 50, cls: 'r' }, { x: 110, y: 110, cls: 'r' },
    { x: 70, y: 120, cls: 'r' }, { x: 160, y: 90, cls: 'r' },
    { x: 250, y: 80, cls: 'b' }, { x: 290, y: 130, cls: 'b' }, { x: 270, y: 60, cls: 'b' },
    { x: 310, y: 100, cls: 'b' }, { x: 240, y: 150, cls: 'b' }
  ];
  knnState = { svg, points, query: { x: 200, y: 110 }, k: 5 };
  svg.addEventListener('pointerdown', e => { knnDragging = true; moveKnnQuery(e); });
  svg.addEventListener('pointermove', e => { if (knnDragging) moveKnnQuery(e); });
  window.addEventListener('pointerup', () => { knnDragging = false; });
  renderKnn();
}

function moveKnnQuery(event){
  const p = pointerToSvg(knnState.svg, event);
  knnState.query.x = Math.max(12, Math.min(348, p.x));
  knnState.query.y = Math.max(12, Math.min(208, p.y));
  renderKnn();
}

function updateKNNk(value){
  knnState.k = +value;
  document.getElementById('knnK').textContent = value;
  renderKnn();
}

function renderKnn(){
  const { svg, points, query, k } = knnState;
  svg.innerHTML = '';
  const neighbors = points
    .map(p => ({ p, distance: Math.hypot(p.x - query.x, p.y - query.y) }))
    .sort((a, b) => a.distance - b.distance).slice(0, k);
  neighbors.forEach(n => svg.appendChild(svgLine(query.x, query.y, n.p.x, n.p.y, 'v-neighbor')));
  points.forEach(p => svg.appendChild(svgCircle(p.x, p.y, 7, p.cls === 'r' ? 'vr' : 'vb')));
  const redVotes = neighbors.filter(n => n.p.cls === 'r').length;
  const winner = redVotes > k / 2 ? 'r' : 'b';
  const queryDot = svgCircle(query.x, query.y, 10, winner === 'r' ? 'vr' : 'vb');
  queryDot.classList.add('grabbable');
  queryDot.setAttribute('stroke', '#0d2b52'); queryDot.setAttribute('stroke-width', '2.5');
  svg.appendChild(queryDot);
  document.getElementById('knnVote').innerHTML =
    `<span>אדום: ${redVotes}</span><span>כחול: ${k - redVotes}</span>` +
    `<span>→ סיווג: <b>${winner === 'r' ? 'אדום' : 'כחול'}</b></span>`;
}
