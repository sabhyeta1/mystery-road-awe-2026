import { state } from "../state/store.js";
import type { CaseInfo, CaseLocation, Evidence, Person, TimelineEvent } from "../types/domain.js";
import { renderDashboard } from "../views/dashboard.js";
import { populateAllDropdowns } from "../views/dropdowns.js";
import { renderEvidenceList, applyStoredBookmarkFlags } from "../views/evidence.js";
import { renderTimeline } from "../views/timeline.js";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  return (await res.json()) as T;
}

export function showLoadingOverlay(msg: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

export function hideLoadingStep(): void {
  state.loadingStepsRemaining--;
  if (state.loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

async function loadCorePeopleAndLocations(): Promise<void> {
  state.caseData = await fetchJson<CaseInfo>("data/case.json");
  state.allPeople = await fetchJson<Person[]>("data/people.json");
  state.allLocations = await fetchJson<CaseLocation[]>("data/locations.json");

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData(): Promise<void> {
  try {
    state.allEvidence = await fetchJson<Evidence[]>("data/evidence.json");
    state.evidenceViewLoading = false;
    applyStoredBookmarkFlags();
    state.filteredEvidence = state.allEvidence.slice();
    renderDashboard();
    populateAllDropdowns();
    if (state.currentPage === "evidence") renderEvidenceList();
  } catch (err) {
    console.error("Failed to load evidence.json", err);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  }
}

function loadTimelineData(): Promise<void> {
  return fetchJson<TimelineEvent[]>("data/timeline.json")
    .then(function (data) {
      state.allTimeline = data;
      renderDashboard();
      if (state.currentPage === "timeline") renderTimeline();
      populateAllDropdowns();
    })
    .catch(function (err) {
      console.log("timeline load error", err);
    })
    .finally(function () {
      hideLoadingStep();
    });
}

export function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");
  state.loadingStepsRemaining = 2;
  return loadCorePeopleAndLocations().then(function () {
    loadEvidenceData();
    loadTimelineData();
  });
}
