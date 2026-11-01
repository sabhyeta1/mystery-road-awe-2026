import { ViewSection } from "../components/ViewSection";
import { BookmarkedEvidenceList } from "./BookmarkedEvidenceList";
import { NotesList } from "./NotesList";
import { HypothesisForm } from "./HypothesisForm";
import type { LoadState } from "../data/useCaseData";
import type { EvidenceId } from "../../types/domain";

interface WorkspacePageProps {
  loadState: LoadState;
  notes: Record<EvidenceId, string>;
}

export function WorkspacePage({ loadState, notes }: WorkspacePageProps) {
  if (loadState.status === "loading") {
    return (
      <ViewSection title="Investigator Workspace">
        <p>Loading case file…</p>
      </ViewSection>
    );
  }

  if (loadState.status === "error") {
    return (
      <ViewSection title="Investigator Workspace">
        <p>Something went wrong: {loadState.message}</p>
      </ViewSection>
    );
  }

  const { evidence, people } = loadState.data;

  return (
    <ViewSection title="Investigator Workspace">
      <div className="workspace-grid">
        <div className="workspace-col">
          <h3>Bookmarked Evidence</h3>
          <BookmarkedEvidenceList evidence={evidence} />
        </div>

        <div className="workspace-col">
          <h3>Personal Notes</h3>
          <p className="hint-text">
            Notes are attached to whichever evidence item is currently open in the Evidence view.
          </p>
          <NotesList evidence={evidence} notes={notes} />
        </div>
      </div>

      <HypothesisForm people={people} evidence={evidence} />
    </ViewSection>
  );
}
