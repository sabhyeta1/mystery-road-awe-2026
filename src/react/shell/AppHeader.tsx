import { MainNav } from "./MainNav";

interface AppHeaderProps {
  onReload: () => void;
  appliedRequestId: number | null;
}

export function AppHeader({ onReload, appliedRequestId }: AppHeaderProps) {
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
            <p className="subtitle">
              <button type="button" className="btn btn-primary btn-small" onClick={onReload}>
                Reload data
              </button>{" "}
              {appliedRequestId === null
                ? "No data loaded"
                : "Showing data from request #" + appliedRequestId}
            </p>
          </div>
        </div>
        <MainNav />
      </div>
    </header>
  );
}
