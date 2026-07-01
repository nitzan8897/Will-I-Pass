/* Classify a course as math-related / CS-related from its description text.
   PDF text may come out reversed (RTL), so we scan the string and its reverse. */

export const MATH_KEYWORDS: readonly string[] = [
  'מתמטיקה', 'אלגברה', 'חשבון', 'חדו"א', 'חדוא', 'אינפי', 'הסתברות',
  'סטטיסטיקה', 'גאומטריה', 'דיפרנציאלי', 'אינטגרל', 'קומבינטוריקה', 'לינארית',
];

export const CS_KEYWORDS: readonly string[] = [
  'מדעי המחשב', 'מחשב', 'תכנות', 'תיכנות', 'אלגוריתמ', 'מבני נתונים',
  'מסדי נתונים', 'תוכנה', 'קומפילציה', 'מערכות הפעלה', 'רשתות', 'סייבר',
];

const reverse = (text: string): string => text.split('').reverse().join('');

const matchesAny = (text: string, keywords: readonly string[]): boolean => {
  const forward = text;
  const backward = reverse(text);
  return keywords.some((kw) => forward.includes(kw) || backward.includes(kw));
};

export const isMathCourse = (description: string): boolean =>
  matchesAny(description, MATH_KEYWORDS);

export const isCsCourse = (description: string): boolean =>
  matchesAny(description, CS_KEYWORDS);
