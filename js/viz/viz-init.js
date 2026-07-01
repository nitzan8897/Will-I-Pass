/* =====================================================================
   viz-init.js — בניית כל הוויזואליזציות פעם אחת
   הקואורדינטות מבוססות viewBox ולכן נשארות במקום בכל גודל מסך.
   ===================================================================== */
function buildAllVisualizations(){
  buildKernelTrick();
  buildSvmMargin();
  buildKnnVoting();
  buildPerceptronLearning();
  buildDecisionTree();
  buildEntropyCurve();
  buildGradientDescent();
  buildActivations();
  buildOverfitting();
  buildClassVsReg();
  buildNeuralNetwork();
  buildDistanceMetrics();
}
