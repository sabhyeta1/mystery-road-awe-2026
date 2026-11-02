import { useEffect, useState } from "react";
import type {
  CaseInfo,
  CaseLocation,
  Evidence,
  EvidenceRelevance,
  EvidenceStatus,
  Person,
  TimelineEvent,
} from "../../types/domain";

export interface CaseData {
  caseInfo: CaseInfo;
  people: Person[];
  locations: CaseLocation[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
}

export type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: CaseData };

export interface CaseDataResult {
  loadState: LoadState;
  // Which request produced the data that is currently on screen (shown in the header).
  appliedRequestId: number | null;
  // Fetches everything again.
  reload: () => void;
}

// DEMO SWITCH (Exercise 6, Demo 7): true = obsolete requests are cancelled and their results
// are ignored. Set it to false ONLY to demonstrate the request race, then set it back to true.
const CANCEL_OBSOLETE_REQUESTS = true;

// Numbers the requests (1, 2, 3, ...). Changing it inside an effect is fine, because effects
// are the place for side effects (see the rule from Demo 1).
let requestCounter = 0;

// The JSON is not fully consistent (one item has the status "Reviewed" with a capital R).
// Normalising once here means every component can rely on the exact lowercase values.
function normaliseEvidence(item: Evidence): Evidence {
  return {
    ...item,
    status: item.status.toLowerCase() as EvidenceStatus,
    relevance: item.relevance.toLowerCase() as EvidenceRelevance,
  };
}

async function fetchJson<T>(path: string, signal: AbortSignal | undefined): Promise<T> {
  // cache: "no-store" = always ask the server. A reload must really reload, and the browser
  // must not make a second identical request wait for the first one.
  const response = await fetch(path, { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load " + path + " (status " + response.status + ")");
  }
  return (await response.json()) as T;
}

export function useCaseData(): CaseDataResult {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [appliedRequestId, setAppliedRequestId] = useState<number | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  // Runs on mount and again every time reloadCount changes (that is, on every reload).
  useEffect(() => {
    requestCounter += 1;
    const requestId = requestCounter;

    // This request's "cancel button". Its signal is handed to every fetch below.
    const controller = new AbortController();
    const signal = CANCEL_OBSOLETE_REQUESTS ? controller.signal : undefined;
    const isObsolete = () => CANCEL_OBSOLETE_REQUESTS && controller.signal.aborted;

    Promise.all([
      fetchJson<CaseInfo>("/api/case", signal),
      fetchJson<Person[]>("/api/people", signal),
      fetchJson<CaseLocation[]>("/api/locations", signal),
      fetchJson<Evidence[]>("/api/evidence", signal),
      fetchJson<TimelineEvent[]>("/api/timeline", signal),
    ])
      .then(([caseInfo, people, locations, evidence, timeline]) => {
        if (isObsolete()) return;
        setLoadState({
          status: "ready",
          data: {
            caseInfo,
            people,
            locations,
            evidence: evidence.map(normaliseEvidence),
            timeline,
          },
        });
        setAppliedRequestId(requestId);
      })
      .catch((err: unknown) => {
        // An aborted request is not an error, it is simply no longer wanted.
        if (isObsolete()) return;
        const message = err instanceof Error ? err.message : String(err);
        setLoadState({ status: "error", message });
        setAppliedRequestId(null);
      });

    // React calls this when the effect is replaced (reload) or the component unmounts.
    return () => {
      controller.abort();
    };
  }, [reloadCount]);

  function reload(): void {
    setReloadCount((previous) => previous + 1);
  }

  return { loadState, appliedRequestId, reload };
}
