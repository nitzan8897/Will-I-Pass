import { useState, type Dispatch, type ReactElement, type SetStateAction } from 'react';
import type { Algorithm, Factor, HighSchool, PastCourse, Prediction, TargetCourse, TrainedModel } from '../../types';
import { HighSchoolForm } from '../forms/HighSchoolForm';
import { CourseList } from '../forms/CourseList';
import { TargetCourseForm } from '../forms/TargetCourseForm';
import { GradeLoaders } from '../forms/GradeLoaders';
import { ResultView } from './ResultView';
import { SelectField } from '../fields';
import { ALGORITHM_OPTIONS, ALGORITHM_SUMMARIES } from '../forms/options';
import { buildPredictor } from '../../ml/modelTrainer';
import { buildFactorList } from '../../data/factors';
import { courseToFeatures } from '../../ml/featureExtractor';

interface Props {
  highSchool: HighSchool;
  setHighSchool: Dispatch<SetStateAction<HighSchool>>;
  pastCourses: PastCourse[];
  setPastCourses: Dispatch<SetStateAction<PastCourse[]>>;
  target: TargetCourse;
  setTarget: Dispatch<SetStateAction<TargetCourse>>;
  algorithm: Algorithm;
  setAlgorithm: Dispatch<SetStateAction<Algorithm>>;
  trainedModel: TrainedModel | null;
  setTrainedModel: Dispatch<SetStateAction<TrainedModel | null>>;
}

export const PredictTab = ({
  highSchool, setHighSchool, pastCourses, setPastCourses, target, setTarget,
  algorithm, setAlgorithm, trainedModel, setTrainedModel,
}: Props): ReactElement => {
  const [busy, setBusy] = useState<'' | 'train' | 'predict'>('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [factors, setFactors] = useState<Factor[]>([]);

  const stale = trainedModel !== null && trainedModel.algorithm !== algorithm;

  const train = (): void => {
    setBusy('train');
    setPrediction(null);
    window.setTimeout(() => {
      const { model, error } = buildPredictor(pastCourses, highSchool, algorithm);
      setBusy('');
      if (error || !model) { setTrainedModel(null); alert(`⚠️ ${error}`); return; }
      setTrainedModel(model);
    }, 400);
  };

  const predict = (): void => {
    if (!trainedModel) return;
    setBusy('predict');
    window.setTimeout(() => {
      const result = trainedModel.predict(courseToFeatures(target, highSchool));
      setFactors(buildFactorList(target, highSchool, trainedModel));
      setPrediction(result);
      setBusy('');
    }, 300);
  };

  return (
    <section className="tab">
      <h2 className="title">לוח חיזוי ציונים</h2>
      <p className="sub">
        המודל לומד מהקורסים <b>הקודמים שלך</b> (כל אחד עם הציון שקיבלת) ואז חוזה את הקורס החדש.
        ראשית <b>אמן לפי הנתונים שלך</b>, ואז <b>חזה את ציון הקורס</b>.
      </p>

      <GradeLoaders
        onCoursesLoaded={(courses) => { setPastCourses(courses); setTrainedModel(null); }}
        onHighSchoolLoaded={setHighSchool}
      />
      <HighSchoolForm value={highSchool} onChange={setHighSchool} />
      <CourseList courses={pastCourses} onChange={(c) => { setPastCourses(c); }} />
      <TargetCourseForm value={target} onChange={setTarget} />

      <div className="card">
        <h3>⚙️ מנוע החיזוי</h3>
        <div className="grid">
          <SelectField
            label="בחר אלגוריתם למידת מכונה"
            value={algorithm}
            options={ALGORITHM_OPTIONS}
            onChange={(v) => setAlgorithm(v)}
          />
        </div>
        <div className="algo-summary">{ALGORITHM_SUMMARIES[algorithm]}</div>

        <div className="btn-row" style={{ marginTop: 16 }}>
          <button className="btn sec" onClick={train} disabled={busy !== ''}>🏋️ אמן לפי הנתונים שלי</button>
          <button className="btn" onClick={predict} disabled={busy !== '' || !trainedModel || stale}>🔮 חזה את ציון הקורס</button>
          {trainedModel && !stale && (
            <span className="badge ok">
              מאומן · {trainedModel.sampleCount} קורסים · דיוק {trainedModel.trainingAccuracy}%
            </span>
          )}
          {stale && <span className="badge wait">שינית אלגוריתם — אמן מחדש</span>}
          {!trainedModel && <span className="badge wait">יש לאמן לפני חיזוי</span>}
        </div>

        {busy && (
          <div className="loader">
            <div className="spinner" />
            <p>{busy === 'train' ? 'מאמן את המודל על ההיסטוריה שלך...' : 'מחשב חיזוי...'}</p>
          </div>
        )}

        {prediction && !busy && <ResultView prediction={prediction} factors={factors} />}
      </div>
    </section>
  );
};
