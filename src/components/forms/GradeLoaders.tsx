import { useRef, useState, type ReactElement } from 'react';
import type { HighSchool, PastCourse } from '../../types';
import { parseGradesJson, readFileAsText, type LoadedGrades } from '../../data/jsonLoader';
import { parseGradesPdf, readFileAsArrayBuffer } from '../../data/pdfLoader';
import { defaultHighSchool } from '../../data/defaults';

interface Props {
  onCoursesLoaded: (courses: PastCourse[]) => void;
  onHighSchoolLoaded: (highSchool: HighSchool) => void;
}

export const GradeLoaders = ({ onCoursesLoaded, onHighSchoolLoaded }: Props): ReactElement => {
  const jsonInput = useRef<HTMLInputElement>(null);
  const pdfInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');

  const apply = (loaded: LoadedGrades, source: string): void => {
    onCoursesLoaded(loaded.pastCourses);
    if (loaded.highSchool) onHighSchoolLoaded({ ...defaultHighSchool, ...loaded.highSchool });
    setStatus(`✓ נטענו ${loaded.pastCourses.length} קורסים מ-${source}`);
  };

  const loadJson = async (file: File): Promise<void> => {
    try {
      apply(parseGradesJson(await readFileAsText(file)), 'JSON');
    } catch (err) {
      setStatus(`⚠️ ${(err as Error).message}`);
    }
  };

  const loadPdf = async (file: File): Promise<void> => {
    setStatus('⏳ מנתח את ה-PDF...');
    try {
      apply(await parseGradesPdf(await readFileAsArrayBuffer(file)), 'PDF');
    } catch (err) {
      setStatus(`⚠️ ${(err as Error).message}`);
    }
  };

  return (
    <div className="card">
      <h3>📥 טעינת ציונים</h3>
      <p className="sub">טען את הקורסים הקודמים שלך מקובץ במקום להזין ידנית. קורס עם מילות מפתח מתמטיות/מדמ"ח יסומן אוטומטית.</p>
      <div className="btn-row">
        <button className="btn sec sm" onClick={() => jsonInput.current?.click()}>⬆️ טען ציונים מ-JSON</button>
        <button className="btn sec sm" onClick={() => pdfInput.current?.click()}>📄 טען ציונים מ-PDF</button>
        {status && <span className="mini">{status}</span>}
      </div>
      <input
        ref={jsonInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void loadJson(f); e.target.value = ''; }}
      />
      <input
        ref={pdfInput}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void loadPdf(f); e.target.value = ''; }}
      />
    </div>
  );
};
