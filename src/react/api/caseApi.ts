import type {
  CaseInfo,
  CaseLocation,
  Evidence,
  EvidenceRelevance,
  EvidenceStatus,
  Person,
  TimelineEvent,
} from "../../types/domain";

// API-access layer: the ONLY place in the React app that calls fetch(). It knows the backend's
// URLs and the shape of its answers, and nothing else: no React, no state, no loading flags.
// Every function takes an optional AbortSignal so that the caller can cancel the request.

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  // cache: "no-store" = always ask the server. A reload must really reload, and the browser
  // must not make a second identical request wait for the first one.
  const response = await fetch(url, { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load " + url + " (status " + response.status + ")");
  }
  return (await response.json()) as T;
}

// The JSON is not fully consistent (one item has the status "Reviewed" with a capital R).
// Normalising it here means everything outside this file can rely on the exact lowercase values.
function normaliseEvidence(item: Evidence): Evidence {
  return {
    ...item,
    status: item.status.toLowerCase() as EvidenceStatus,
    relevance: item.relevance.toLowerCase() as EvidenceRelevance,
  };
}

export function fetchCaseInfo(signal?: AbortSignal): Promise<CaseInfo> {
  return fetchJson<CaseInfo>("/api/case", signal);
}

export function fetchPeople(signal?: AbortSignal): Promise<Person[]> {
  return fetchJson<Person[]>("/api/people", signal);
}

export function fetchLocations(signal?: AbortSignal): Promise<CaseLocation[]> {
  return fetchJson<CaseLocation[]>("/api/locations", signal);
}

export async function fetchEvidence(signal?: AbortSignal): Promise<Evidence[]> {
  const evidence = await fetchJson<Evidence[]>("/api/evidence", signal);
  return evidence.map(normaliseEvidence);
}

export function fetchTimeline(signal?: AbortSignal): Promise<TimelineEvent[]> {
  return fetchJson<TimelineEvent[]>("/api/timeline", signal);
}
