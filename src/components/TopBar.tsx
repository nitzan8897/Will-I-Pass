import type { ReactElement } from 'react';

export const TopBar = (): ReactElement => (
  <header className="topbar">
    <img src="./favicon.svg" alt="Will I Pass?" />
    <div className="titles">
      <h1>Will I Pass?</h1>
      <p>פרויקט לקורס כריית נתונים ולמידה חישובית</p>
    </div>
  </header>
);
