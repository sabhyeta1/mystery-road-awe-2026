import { ViewSection } from "../components/ViewSection";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { EvidenceCatalogue } from "./EvidenceCatalogue";
import type { LoadState } from "../data/useCaseData";
import type { EvidenceId, EvidenceRelevance, EvidenceStatus } from "../../types/domain";

interface EvidencePageProps {
  loadState: LoadState;
  notes: Record<EvidenceId, string>;
  onSaveNote: (id: EvidenceId, text: string) => void;
  onChangeStatus: (id: EvidenceId, status: EvidenceStatus) => void;
  onChangeRelevance: (id: EvidenceId, relevance: EvidenceRelevance) => void;
}

export function EvidencePage({
  loadState,
  notes,
  onSaveNote,
  onChangeStatus,
  onChangeRelevance,
}: EvidencePageProps) {
  // Three different facts, three different early returns:
  // 1. the request is still pending
  if (loadState.status === "loading") {
    return (
      <ViewSection title="Evidence Catalogue">
        <LoadingState message="Loading evidence…" />
      </ViewSection>
    );
  }

  // 2. the request failed
  if (loadState.status === "error") {
    return (
      <ViewSection title="Evidence Catalogue">
        <ErrorState title="The evidence could not be loaded" detail={loadState.message} />
      </ViewSection>
    );
  }

  // 3. the request worked, but the list is empty
  if (loadState.data.evidence.length === 0) {
    return (
      <ViewSection title="Evidence Catalogue">
        <EmptyState message="No evidence has been recorded for this case yet." />
      </ViewSection>
    );
  }

  return (
    <EvidenceCatalogue
      data={loadState.data}
      notes={notes}
      onSaveNote={onSaveNote}
      onChangeStatus={onChangeStatus}
      onChangeRelevance={onChangeRelevance}
    />
  );
}
