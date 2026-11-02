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

// The JSON is not fully consistent (one item has the status "Reviewed" with a capital R).
// Normalising once here means every component can rely on the exact lowercase values.
function normaliseEvidence(item: Evidence): Evidence {
  return {
    ...item,
    status: item.status.toLowerCase() as EvidenceStatus,
    relevance: item.relevance.toLowerCase() as EvidenceRelevance,
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error("Could not load " + path + " (status " + response.status + ")");
  }
  return (await response.json()) as T;
}

export function useCaseData(): LoadState {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    // The data now comes from the Node backend (proxied by Vite in development).
    Promise.all([
      fetchJson<CaseInfo>("/api/case"),
      fetchJson<Person[]>("/api/people"),
      fetchJson<CaseLocation[]>("/api/locations"),
      fetchJson<Evidence[]>("/api/evidence"),
      fetchJson<TimelineEvent[]>("/api/timeline"),
    ])
      .then(([caseInfo, people, locations, evidence, timeline]) => {
        if (cancelled) return;
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
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        setLoadState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return loadState;
}
