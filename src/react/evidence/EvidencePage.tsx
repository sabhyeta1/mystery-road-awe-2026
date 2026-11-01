import { ViewSection } from "../components/ViewSection";
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
  if (loadState.status === "loading") {
    return (
      <ViewSection title="Evidence Catalogue">
        <p>Loading evidence…</p>
      </ViewSection>
    );
  }

  if (loadState.status === "error") {
    return (
      <ViewSection title="Evidence Catalogue">
        <p>Something went wrong: {loadState.message}</p>
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
