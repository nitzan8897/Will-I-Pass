import { useState, type ReactElement } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar, type TabId } from './components/Sidebar';
import { PredictTab } from './components/tabs/PredictTab';
import { ModelsTab } from './components/tabs/ModelsTab';
import { BasicsTab } from './components/tabs/BasicsTab';
import { VizTab } from './components/tabs/VizTab';
import { ExportTab } from './components/tabs/ExportTab';
import { defaultHighSchool, defaultTargetCourse, makePastCourse } from './data/defaults';
import type { Algorithm, HighSchool, PastCourse, TargetCourse, TrainedModel } from './types';

export const App = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<TabId>('predict');
  const [highSchool, setHighSchool] = useState<HighSchool>(defaultHighSchool);
  const [pastCourses, setPastCourses] = useState<PastCourse[]>([makePastCourse(), makePastCourse()]);
  const [target, setTarget] = useState<TargetCourse>(defaultTargetCourse);
  const [algorithm, setAlgorithm] = useState<Algorithm>('perceptron');
  const [trainedModel, setTrainedModel] = useState<TrainedModel | null>(null);

  return (
    <>
      <TopBar />
      <div className="app">
        <Sidebar active={activeTab} onSelect={setActiveTab} />
        <main className="main">
          {activeTab === 'predict' && (
            <PredictTab
              highSchool={highSchool}
              setHighSchool={setHighSchool}
              pastCourses={pastCourses}
              setPastCourses={setPastCourses}
              target={target}
              setTarget={setTarget}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              trainedModel={trainedModel}
              setTrainedModel={setTrainedModel}
            />
          )}
          {activeTab === 'models' && <ModelsTab />}
          {activeTab === 'basics' && <BasicsTab />}
          {activeTab === 'viz' && <VizTab />}
          {activeTab === 'export' && (
            <ExportTab highSchool={highSchool} pastCourses={pastCourses} target={target} algorithm={algorithm} />
          )}
          <div className="foot">
            כלי לימוד אינטראקטיבי · למידת מכונה וכריית נתונים · מודלים מספריית ml.js, מאומנים על נתוני הסטודנט
          </div>
        </main>
      </div>
    </>
  );
};
