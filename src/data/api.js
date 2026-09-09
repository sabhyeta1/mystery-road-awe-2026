import { state } from "../state/store.js";
import { renderDashboard } from "../views/dashboard.js";
import { populateAllDropdowns } from "../views/dropdowns.js";
import { renderEvidenceList, applyStoredBookmarkFlags } from "../views/evidence.js";
import { renderTimeline } from "../views/timeline.js";

export function showLoadingOverlay(msg) {
  var overlay = document.getElementById("loadingOverlay");
  var text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

export function hideLoadingStep() {
  state.loadingStepsRemaining--;
  if (state.loadingStepsRemaining <= 0) {
    var overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

async function loadCorePeopleAndLocations() {
  const caseRes = await fetch("data/case.json");
  state.caseData = await caseRes.json();

  const peopleRes = await fetch("data/people.json");
  state.allPeople = await peopleRes.json();

  const locationsRes = await fetch("data/locations.json");
  state.allLocations = await locationsRes.json();

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData() {
  try {
    const res = await fetch("data/evidence.json");
    const data = await res.json();
    state.allEvidence = data;
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

function loadTimelineData() {
  return fetch("data/timeline.json")
    .then(function (res) {
      return res.json();
    })
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

export function loadAllData() {
  showLoadingOverlay("Loading case file…");
  state.loadingStepsRemaining = 2;
  return loadCorePeopleAndLocations().then(function () {
    loadEvidenceData();
    loadTimelineData();
  });
}