import { Navigate, Route, Routes } from "react-router";
import { AppHeader } from "./shell/AppHeader";
import { AppFooter } from "./shell/AppFooter";
import { DashboardPage } from "./dashboard/DashboardPage";
import { EvidencePage } from "./evidence/EvidencePage";
import { TeamLayout } from "./people-locations/TeamLayout";
import { PeopleTab } from "./people-locations/PeopleTab";
import { PersonDetailTab } from "./people-locations/PersonDetailTab";
import { LocationsTab } from "./people-locations/LocationsTab";
import { TimelinePage } from "./timeline/TimelinePage";
import { WorkspacePage } from "./workspace/WorkspacePage";
import { NotFoundPage } from "./shell/NotFoundPage";
import { useDocumentTitle } from "./shell/useDocumentTitle";
import { useCaseData } from "./data/useCaseData";
import { BookmarksProvider } from "./state/BookmarksContext";
import { useInvestigationState } from "./state/useInvestigationState";

export function App() {
  useDocumentTitle();
  const rawLoadState = useCaseData();
  // App is the common ancestor of every view, so notes and review changes are owned here.
  // effectiveLoadState is the loaded data with the user's review changes applied.
  const {
    effectiveLoadState: loadState,
    notes,
    saveNote,
    changeStatus,
    changeRelevance,
  } = useInvestigationState(rawLoadState);

  return (
    <BookmarksProvider>
      <AppHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage loadState={loadState} />} />
          <Route
            path="/evidence"
            element={
              <EvidencePage
                loadState={loadState}
                notes={notes}
                onSaveNote={saveNote}
                onChangeStatus={changeStatus}
                onChangeRelevance={changeRelevance}
              />
            }
          />
          <Route path="/team" element={<TeamLayout />}>
            <Route index element={<Navigate to="/team/people" replace />} />
            <Route path="people" element={<PeopleTab loadState={loadState} />} />
            <Route path="people/:personId" element={<PersonDetailTab loadState={loadState} />} />
            <Route path="locations" element={<LocationsTab loadState={loadState} />} />
          </Route>
          <Route path="/timeline" element={<TimelinePage loadState={loadState} />} />
          <Route
            path="/workspace"
            element={<WorkspacePage loadState={loadState} notes={notes} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <AppFooter />
    </BookmarksProvider>
  );
}
