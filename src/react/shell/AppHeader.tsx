import { MainNav } from "./MainNav";
import type { ViewName } from "./views";

interface AppHeaderProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

export function AppHeader({ currentView, onNavigate }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <img src="assets/logo/logo.svg" alt="Project ReMotion logo" className="brand-logo" />
          <div>
            <h1>Project ReMotion</h1>
            <p className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </p>
          </div>
        </div>
        <MainNav currentView={currentView} onNavigate={onNavigate} />
      </div>
    </header>
  );
}
