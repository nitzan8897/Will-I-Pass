import type { Algorithm, HwHonesty, PassedOn } from '../../types';

export const HONESTY_OPTIONS: ReadonlyArray<{ value: HwHonesty; label: string }> = [
  { value: 'independent', label: 'עצמאי' },
  { value: 'partial', label: 'חלקי' },
  { value: 'cheated', label: 'העתקה / שימוש ב-AI' },
];

export const PASSED_ON_OPTIONS: ReadonlyArray<{ value: PassedOn; label: string }> = [
  { value: 'first', label: "עברתי במועד א'" },
  { value: 'second', label: "עברתי במועד ב'" },
  { value: 'third', label: "עברתי במועד ג'" },
  { value: 'none', label: 'לא עברתי (נכשלתי)' },
];

export const ALGORITHM_OPTIONS: ReadonlyArray<{ value: Algorithm; label: string }> = [
  { value: 'perceptron', label: 'פרספטרון (Perceptron)' },
  { value: 'svm', label: 'SVM' },
  { value: 'tree', label: 'עץ החלטה (ID3)' },
  { value: 'knn', label: 'KNN' },
  { value: 'nn', label: 'רשת נוירונים (MLP)' },
];

export const ALGORITHM_SUMMARIES: Record<Algorithm, string> = {
  perceptron: 'פרספטרון: נוירון בודד שלומד קו מפריד לינארי בעזרת ירידת גרדיאנט. נכשל ב-XOR.',
  svm: 'SVM: מרווח מרבי בין המחלקות; Soft Margin עם פרמטר C ו-Kernel Trick לבעיות לא-לינאריות.',
  tree: 'עץ החלטה: פיצול חמדני לפי אנטרופיה ורווח אינפורמציה.',
  knn: 'KNN: אלגוריתם עצלן — מסווג לפי רוב הקורסים הדומים ביותר בהיסטוריה.',
  nn: 'רשת נוירונים (MLP): שכבה נסתרת + Backpropagation ללמידת קשרים לא-לינאריים.',
};
