import { MainNav } from "./MainNav";

interface AppHeaderProps {
  onReload: () => void;
  appliedLoads: number[];
}

function describeLoads(loads: number[]): string {
  if (loads.length === 0) return "No data loaded";
  if (loads.length === 1) return "Showing data from load #" + loads[0];
  return "MIXED data from loads " + loads.map((load) => "#" + load).join(" and ");
}

export function AppHeader({ onReload, appliedLoads }: AppHeaderProps) {
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
              {describeLoads(appliedLoads)}
            </p>
          </div>
        </div>
        <MainNav />
      </div>
    </header>
  );
}
