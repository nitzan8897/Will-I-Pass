import { useMemo, type ReactElement } from 'react';
import type { Algorithm, HighSchool, PastCourse, TargetCourse, ExportBundle } from '../../types';
import { downloadData } from '../../data/exporter';

interface Props {
  highSchool: HighSchool;
  pastCourses: PastCourse[];
  target: TargetCourse;
  algorithm: Algorithm;
}

export const ExportTab = ({ highSchool, pastCourses, target, algorithm }: Props): ReactElement => {
  const bundle: ExportBundle = useMemo(
    () => ({ highSchool, pastCourses, algorithm, targetCourse: target }),
    [highSchool, pastCourses, target, algorithm],
  );

  return (
    <section className="tab">
      <h2 className="title">ייצוא נתוני סטודנט</h2>
      <p className="sub">הנתונים נאספים מהטופס בלשונית "חיזוי ציונים". בחר פורמט והורד.</p>
      <div className="card">
        <h3>💾 הורדת קובץ</h3>
        <p>הקובץ ישמור את <b>כל</b> שדות הקלט (תיכון + קורסים קודמים + הקורס לחיזוי) במבנה זהה למבנה האפליקציה.</p>
        <div className="btn-row" style={{ marginTop: 14 }}>
          <button className="btn" onClick={() => downloadData(bundle, 'json')}>⬇️ הורד JSON</button>
          <button className="btn sec" onClick={() => downloadData(bundle, 'csv')}>⬇️ הורד CSV</button>
        </div>
        <div className="preview">{JSON.stringify(bundle, null, 2)}</div>
      </div>
    </section>
  );
};
