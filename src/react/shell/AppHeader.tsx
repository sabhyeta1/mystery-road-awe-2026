import { MainNav } from "./MainNav";

export function AppHeader() {
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
        <MainNav />
      </div>
    </header>
  );
}
