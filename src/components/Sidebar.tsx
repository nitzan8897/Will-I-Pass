import type { ReactElement } from 'react';

export type TabId = 'predict' | 'models' | 'basics' | 'viz' | 'export';

export const TABS: ReadonlyArray<{ id: TabId; icon: string; label: string }> = [
  { id: 'predict', icon: '📊', label: 'חיזוי ציונים' },
  { id: 'models', icon: '🧠', label: 'הסבר על מודלים' },
  { id: 'basics', icon: '💡', label: 'מושגי יסוד בבינה מלאכותית' },
  { id: 'viz', icon: '🎨', label: 'ויזואליזציה וטריקים' },
  { id: 'export', icon: '💾', label: 'ייצוא נתוני סטודנט' },
];

interface SidebarProps {
  active: TabId;
  onSelect: (tab: TabId) => void;
}

export const Sidebar = ({ active, onSelect }: SidebarProps): ReactElement => (
  <aside className="sidebar">
    <div className="brand">
      <h1>🎓 חיזוי ציונים</h1>
      <p>למידת מכונה וכריית נתונים</p>
    </div>
    <nav className="nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={tab.id === active ? 'active' : ''}
          onClick={() => onSelect(tab.id)}
        >
          <span className="ico">{tab.icon}</span> {tab.label}
        </button>
      ))}
    </nav>
  </aside>
);
