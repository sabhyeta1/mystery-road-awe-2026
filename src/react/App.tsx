import { AppHeader } from "./shell/AppHeader";
import { AppFooter } from "./shell/AppFooter";
import { DashboardPage } from "./dashboard/DashboardPage";
import { EvidencePage } from "./evidence/EvidencePage";
import { PeoplePage } from "./people-locations/PeoplePage";
import { TimelinePage } from "./timeline/TimelinePage";
import { WorkspacePage } from "./workspace/WorkspacePage";
import { useHashView } from "./shell/useHashView";
import { useCaseData } from "./data/useCaseData";
import type { LoadState } from "./data/useCaseData";
import type { ViewName } from "./shell/views";

function renderPage(view: ViewName, loadState: LoadState, navigateTo: (view: ViewName) => void) {
  switch (view) {
    case "dashboard":
      return <DashboardPage loadState={loadState} onNavigate={navigateTo} />;
    case "evidence":
      return <EvidencePage />;
    case "people":
      return <PeoplePage loadState={loadState} />;
    case "timeline":
      return <TimelinePage loadState={loadState} />;
    case "workspace":
      return <WorkspacePage />;
  }
}

export function App() {
  const [currentView, navigateTo] = useHashView();
  const loadState = useCaseData();

  return (
    <>
      <AppHeader currentView={currentView} onNavigate={navigateTo} />
      <main className="app-main">{renderPage(currentView, loadState, navigateTo)}</main>
      <AppFooter />
    </>
  );
}
