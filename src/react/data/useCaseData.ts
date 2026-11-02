import { useMemo } from "react";
import type {
  CaseInfo,
  CaseLocation,
  Evidence,
  EvidenceRelevance,
  EvidenceStatus,
  Person,
  TimelineEvent,
} from "../../types/domain";
import { useFetch, type FetchState } from "./useFetch";

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
  // The load numbers of the data currently on screen. One number is normal. Two or more
  // numbers mean the screen mixes data from different loads (this is what a request race does).
  appliedLoads: number[];
  // Fetches everything again.
  reload: () => void;
}

// The JSON is not fully consistent (one item has the status "Reviewed" with a capital R).
// Normalising once here means every component can rely on the exact lowercase values.
function normaliseEvidence(item: Evidence): Evidence {
  return {
    ...item,
    status: item.status.toLowerCase() as EvidenceStatus,
    relevance: item.relevance.toLowerCase() as EvidenceRelevance,
  };
}

// Combines the five separate fetch states into the one LoadState the views understand:
// any error wins, otherwise everything must be ready, otherwise we are still loading.
function combineStates(
  caseInfo: FetchState<CaseInfo>,
  people: FetchState<Person[]>,
  locations: FetchState<CaseLocation[]>,
  evidence: FetchState<Evidence[]>,
  timeline: FetchState<TimelineEvent[]>,
): LoadState {
  for (const state of [caseInfo, people, locations, evidence, timeline]) {
    if (state.status === "error") return { status: "error", message: state.message };
  }
  if (
    caseInfo.status === "ready" &&
    people.status === "ready" &&
    locations.status === "ready" &&
    evidence.status === "ready" &&
    timeline.status === "ready"
  ) {
    return {
      status: "ready",
      data: {
        caseInfo: caseInfo.data,
        people: people.data,
        locations: locations.data,
        evidence: evidence.data.map(normaliseEvidence),
        timeline: timeline.data,
      },
    };
  }
  return { status: "loading" };
}

export function useCaseData(): CaseDataResult {
  // Hooks must be called in the same order on every render, so these are five plain lines
  // (no loop, no condition). Each call keeps its own state, effect and cancellation.
  const caseInfo = useFetch<CaseInfo>("/api/case");
  const people = useFetch<Person[]>("/api/people");
  const locations = useFetch<CaseLocation[]>("/api/locations");
  const evidence = useFetch<Evidence[]>("/api/evidence");
  const timeline = useFetch<TimelineEvent[]>("/api/timeline");

  const loadState = useMemo(
    () =>
      combineStates(caseInfo.state, people.state, locations.state, evidence.state, timeline.state),
    [caseInfo.state, people.state, locations.state, evidence.state, timeline.state],
  );

  const loadNumbers = [caseInfo, people, locations, evidence, timeline].map(
    (result) => result.loadNumber,
  );
  const appliedLoads =
    loadState.status === "ready"
      ? [...new Set(loadNumbers)]
          .filter((number): number is number => number !== null)
          .sort((a, b) => b - a)
      : [];

  function reload(): void {
    caseInfo.reload();
    people.reload();
    locations.reload();
    evidence.reload();
    timeline.reload();
  }

  return { loadState, appliedLoads, reload };
}
