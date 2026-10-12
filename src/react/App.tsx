import { AppHeader } from "./components/AppHeader";
import { AppFooter } from "./components/AppFooter";
import { DashboardPage } from "./pages/DashboardPage";
import { EvidencePage } from "./pages/EvidencePage";
import { PeoplePage } from "./pages/PeoplePage";
import { TimelinePage } from "./pages/TimelinePage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { useHashView } from "./useHashView";
import type { ViewName } from "./views";

function renderPage(view: ViewName) {
  switch (view) {
    case "dashboard":
      return <DashboardPage />;
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

  return (
    <>
      <AppHeader currentView={currentView} onNavigate={navigateTo} />
      <main className="app-main">{renderPage(currentView)}</main>
      <AppFooter />
    </>
  );
}
