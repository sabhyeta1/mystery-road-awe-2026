import { Navigate, Route, Routes } from "react-router";
import { AppHeader } from "./shell/AppHeader";
import { AppFooter } from "./shell/AppFooter";
import { DashboardPage } from "./dashboard/DashboardPage";
import { EvidencePage } from "./evidence/EvidencePage";
import { TeamLayout } from "./people-locations/TeamLayout";
import { PeopleTab } from "./people-locations/PeopleTab";
import { LocationsTab } from "./people-locations/LocationsTab";
import { TimelinePage } from "./timeline/TimelinePage";
import { WorkspacePage } from "./workspace/WorkspacePage";
import { useCaseData } from "./data/useCaseData";
import { NotFoundPage } from "./shell/NotFoundPage";

export function App() {
  const loadState = useCaseData();

  return (
    <>
      <AppHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage loadState={loadState} />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="/team" element={<TeamLayout />}>
            <Route index element={<Navigate to="/team/people" replace />} />
            <Route path="people" element={<PeopleTab loadState={loadState} />} />
            <Route path="locations" element={<LocationsTab loadState={loadState} />} />
          </Route>
          <Route path="/timeline" element={<TimelinePage loadState={loadState} />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <AppFooter />
    </>
  );
}
