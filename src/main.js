import { loadBookmarksFromStorage, loadNotesFromStorage, loadNoteAsync } from "./storage/storage.js";
import { loadAllData } from "./data/api.js";
import { setupEventListeners } from "./events/listeners.js";
import { handleHashChange, registerViewRenderers } from "./navigation/router.js";

import { renderDashboard } from "./views/dashboard.js";
import { renderEvidenceList } from "./views/evidence.js";
import { renderPeople, renderLocations } from "./views/people.js";
import { renderTimeline } from "./views/timeline.js";
import { renderWorkspace } from "./views/workspace.js";

registerViewRenderers({
  renderDashboard: renderDashboard,
  renderEvidenceList: renderEvidenceList,
  renderPeople: renderPeople,
  renderLocations: renderLocations,
  renderTimeline: renderTimeline,
  renderWorkspace: renderWorkspace
});

function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(function () {
    handleHashChange();
    var firstNote = loadNoteAsync("E01");
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);