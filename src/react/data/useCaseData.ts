import { useEffect, useState } from "react";
import type { CaseInfo, CaseLocation, Evidence, Person, TimelineEvent } from "../../types/domain";

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

    Promise.all([
      fetchJson<CaseInfo>("data/case.json"),
      fetchJson<Person[]>("data/people.json"),
      fetchJson<CaseLocation[]>("data/locations.json"),
      fetchJson<Evidence[]>("data/evidence.json"),
      fetchJson<TimelineEvent[]>("data/timeline.json"),
    ])
      .then(([caseInfo, people, locations, evidence, timeline]) => {
        if (cancelled) return;
        setLoadState({
          status: "ready",
          data: { caseInfo, people, locations, evidence, timeline },
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
