import { getEl } from "../utils/dom.js";
import { handleHashChange } from "../navigation/router.js";
import { handleSearchInput, renderEvidenceList, clearFilters } from "../views/evidence.js";
import { renderTimeline } from "../views/timeline.js";

export function setupEventListeners(): void {
  window.addEventListener("hashchange", handleHashChange);

  const navButtons = document.querySelectorAll(".nav-btn");
  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
      const targetView = navButtons[i].getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  getEl("evidenceSearch").addEventListener("input", handleSearchInput);

  getEl("filterType").addEventListener("change", renderEvidenceList);
  getEl("filterPerson").addEventListener("change", renderEvidenceList);
  getEl("filterLocation").addEventListener("change", renderEvidenceList);

  getEl("filterStatus").addEventListener("change", renderEvidenceList);

  getEl("filterRelevance").addEventListener("change", renderEvidenceList);

  getEl("clearFiltersBtn").addEventListener("click", clearFilters);

  getEl("timelineOrder").addEventListener("change", renderTimeline);
  getEl("timelinePersonFilter").addEventListener("change", renderTimeline);
  getEl("timelineLocationFilter").addEventListener("change", renderTimeline);
  getEl("timelineTypeFilter").addEventListener("change", renderTimeline);

  const confidenceInput = getEl<HTMLInputElement>("hypConfidence");
  confidenceInput.addEventListener("input", () => {
    getEl("hypConfidenceValue").textContent = confidenceInput.value;
  });
}
