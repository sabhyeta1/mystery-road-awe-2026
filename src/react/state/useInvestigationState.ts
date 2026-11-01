import { useMemo, useState } from "react";
import type { EvidenceId, EvidenceRelevance, EvidenceStatus } from "../../types/domain";
import type { LoadState } from "../data/useCaseData";
import { loadNotes, saveNotes } from "./persistence";

interface ReviewOverride {
  status?: EvidenceStatus;
  relevance?: EvidenceRelevance;
}

type ReviewOverrides = Record<EvidenceId, ReviewOverride>;

// Returns a NEW load state in which the user's review changes are applied on top of the loaded
// evidence. The loaded data itself is never modified.
function applyOverrides(loadState: LoadState, overrides: ReviewOverrides): LoadState {
  if (loadState.status !== "ready") return loadState;
  return {
    status: "ready",
    data: {
      ...loadState.data,
      evidence: loadState.data.evidence.map((item) => {
        const override = overrides[item.id];
        return override === undefined ? item : { ...item, ...override };
      }),
    },
  };
}

// State that several views need to share. It is owned by App (the common ancestor of all views)
// and handed down as props plus callbacks.
export function useInvestigationState(loadState: LoadState) {
  const [notes, setNotes] = useState<Record<EvidenceId, string>>(loadNotes);
  const [overrides, setOverrides] = useState<ReviewOverrides>({});

  const effectiveLoadState = useMemo(
    () => applyOverrides(loadState, overrides),
    [loadState, overrides],
  );

  function saveNote(id: EvidenceId, text: string): void {
    const next = { ...notes, [id]: text };
    setNotes(next);
    saveNotes(next);
  }

  function changeStatus(id: EvidenceId, status: EvidenceStatus): void {
    setOverrides((previous) => ({ ...previous, [id]: { ...previous[id], status } }));
  }

  function changeRelevance(id: EvidenceId, relevance: EvidenceRelevance): void {
    setOverrides((previous) => ({ ...previous, [id]: { ...previous[id], relevance } }));
  }

  return { effectiveLoadState, notes, saveNote, changeStatus, changeRelevance };
}
