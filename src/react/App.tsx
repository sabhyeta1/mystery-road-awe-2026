import { AppHeader } from "./components/AppHeader";
import { AppFooter } from "./components/AppFooter";
import { DashboardPage } from "./pages/DashboardPage";
import { EvidencePage } from "./pages/EvidencePage";
import { PeoplePage } from "./pages/PeoplePage";
import { TimelinePage } from "./pages/TimelinePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { useHashView } from "./useHashView";
import { useCaseData } from "./useCaseData";
import type { LoadState } from "./useCaseData";
import type { ViewName } from "./views";

function renderPage(view: ViewName, loadState: LoadState, navigateTo: (view: ViewName) => void) {
  switch (view) {
    case "dashboard":
      return <DashboardPage loadState={loadState} onNavigate={navigateTo} />;
    case "evidence":
      return <EvidencePage />;
    case "people":
      return <PeoplePage />;
    case "timeline":
      return <TimelinePage />;
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
