import { useReducer, useState } from "react";
import { useSearchParams } from "react-router";
import { ViewSection } from "../components/ViewSection";
import { EvidenceToolbar } from "./EvidenceToolbar";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceDetail } from "./EvidenceDetail";
import { filterAndSortEvidence, filtersReducer, initialFilters } from "./evidenceFilters";
import type { CaseData } from "../data/useCaseData";
import type { EvidenceId, EvidenceRelevance, EvidenceStatus } from "../../types/domain";

interface EvidenceCatalogueProps {
  data: CaseData;
  notes: Record<EvidenceId, string>;
  onSaveNote: (id: EvidenceId, text: string) => void;
  onChangeStatus: (id: EvidenceId, status: EvidenceStatus) => void;
  onChangeRelevance: (id: EvidenceId, relevance: EvidenceRelevance) => void;
}

export function EvidenceCatalogue({
  data,
  notes,
  onSaveNote,
  onChangeStatus,
  onChangeRelevance,
}: EvidenceCatalogueProps) {
  const { evidence, people, locations } = data;

  const [searchParams] = useSearchParams();
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
  // Only the id is stored. The selected evidence object is looked up below, so it can never
  // be an outdated copy.
  const [selectedId, setSelectedId] = useState<EvidenceId | null>(() => searchParams.get("open"));

  // Derived values: recomputed on every render from the single sources of truth.
  const evidenceTypes = [...new Set(evidence.map((item) => item.type.toLowerCase()))];
  const visibleEvidence = filterAndSortEvidence(evidence, filters);
  const selectedEvidence = evidence.find((item) => item.id === selectedId) ?? null;

  return (
    <ViewSection title="Evidence Catalogue">
      <EvidenceToolbar
        filters={filters}
        dispatch={dispatch}
        evidenceTypes={evidenceTypes}
        people={people}
        locations={locations}
      />

      {selectedEvidence !== null && (
        <EvidenceDetail
          key={selectedEvidence.id}
          evidence={selectedEvidence}
          people={people}
          locations={locations}
          savedNote={notes[selectedEvidence.id] ?? ""}
          onClose={() => setSelectedId(null)}
          onSaveNote={onSaveNote}
          onChangeStatus={onChangeStatus}
          onChangeRelevance={onChangeRelevance}
        />
      )}

      <div className="evidence-grid">
        {visibleEvidence.length === 0 && <p>No evidence matches the current filters.</p>}
        {visibleEvidence.map((item) => (
          <EvidenceCard key={item.id} evidence={item} onOpen={setSelectedId} />
        ))}
      </div>
    </ViewSection>
  );
}
