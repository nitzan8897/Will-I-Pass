import type { ReactElement } from 'react';
import { KernelTrick } from '../viz/KernelTrick';
import { SvmMargin } from '../viz/SvmMargin';
import { KnnVoting } from '../viz/KnnVoting';
import { PerceptronLearning } from '../viz/PerceptronLearning';
import { DecisionTree } from '../viz/DecisionTree';
import { EntropyCurve } from '../viz/EntropyCurve';
import { GradientDescent } from '../viz/GradientDescent';
import { Activations } from '../viz/Activations';
import { Overfit } from '../viz/Overfit';
import { ClassVsReg } from '../viz/ClassVsReg';
import { NeuralNetwork } from '../viz/NeuralNetwork';
import { DistanceMetrics } from '../viz/DistanceMetrics';

export const VizTab = (): ReactElement => (
  <section className="tab">
    <h2 className="title">ויזואליזציה וטריקים</h2>
    <p className="sub">
      המחשות אינטראקטיביות. אנימציות עם מתמטיקה כוללות כפתור <b>הפעל</b> ופאנל
      <b> debug</b> שמדגיש כל שורת נוסחה בזמן שהאנימציה מתקדמת — אפשר להריץ שוב וללמוד בקצב.
    </p>
    <div className="viz-grid">
      <KernelTrick />
      <SvmMargin />
      <KnnVoting />
      <PerceptronLearning />
      <DecisionTree />
      <EntropyCurve />
      <GradientDescent />
      <Activations />
      <Overfit />
      <ClassVsReg />
      <NeuralNetwork />
      <DistanceMetrics />
    </div>
  </section>
);
