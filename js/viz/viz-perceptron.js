/* =====================================================================
   viz-perceptron.js — למידת קו מפריד צעד-אחר-צעד (ירידת גרדיאנט)
   הקואורדינטות מנורמלות ל-[0,1] כדי שעדכון המשקלים יהיה יציב.
   ===================================================================== */
let perceptronState;

const PERCEPTRON_POINTS = [
  { x: 70, y: 50, label: 1 }, { x: 110, y: 70, label: 1 }, { x: 90, y: 40, label: 1 },
  { x: 60, y: 95, label: 1 }, { x: 135, y: 60, label: 1 },
  { x: 300, y: 170, label: 0 }, { x: 270, y: 150, label: 0 }, { x: 320, y: 185, label: 0 },
  { x: 285, y: 200, label: 0 }, { x: 250, y: 160, label: 0 }
];

function buildPerceptronLearning(){ perceptronReset(); }

function perceptronReset(){
  perceptronState = { weights: [Math.random() - 0.5, Math.random() - 0.5], bias: 0, step: 0, errors: '-' };
  renderPerceptron();
}

function perceptronStep(){
  const learningRate = 0.5;
  let mistakes = 0;
  PERCEPTRON_POINTS.forEach(point => {
    const nx = point.x / VIZ_WIDTH, ny = point.y / VIZ_HEIGHT;
    const target = point.label ? 1 : -1;
    const output = perceptronState.weights[0] * nx + perceptronState.weights[1] * ny + perceptronState.bias;
    if ((output >= 0 ? 1 : -1) !== target){
      perceptronState.weights[0] += learningRate * target * nx;
      perceptronState.weights[1] += learningRate * target * ny;
      perceptronState.bias += learningRate * target;
      mistakes++;
    }
  });
  perceptronState.step++; perceptronState.errors = mistakes;
  renderPerceptron();
}

function renderPerceptron(){
  const svg = renderInto('vizPerc');
  const [w0, w1] = perceptronState.weights, b = perceptronState.bias;
  if (Math.abs(w1) > 1e-3){                              // קו: w0·nx + w1·ny + b = 0
    const yAt = nx => -(w0 * nx + b) / w1 * VIZ_HEIGHT;
    svg.appendChild(svgLine(0, yAt(0), VIZ_WIDTH, yAt(1), 'v-separator'));
  }
  PERCEPTRON_POINTS.forEach(p => svg.appendChild(svgCircle(p.x, p.y, 7, p.label ? 'vb' : 'vr')));
  document.getElementById('percInfo').textContent =
    `צעד ${perceptronState.step} · טעויות בצעד: ${perceptronState.errors}`;
}
