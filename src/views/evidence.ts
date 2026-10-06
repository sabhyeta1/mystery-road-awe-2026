import { state } from "../state/store.js";
import {
  findPersonById,
  findEvidenceById,
  findLocationById,
  evidenceMentionsPerson,
} from "../utils/lookups.js";
import {
  getStatusBadgeClass,
  getRelevanceBadgeClass,
  formatDate,
  statusOptionHTML,
} from "../utils/format.js";
import { getEl } from "../utils/dom.js";
import {
  isEvidenceRelevance,
  isEvidenceStatus,
  type Evidence,
  type EvidenceId,
} from "../types/domain.js";
import {
  saveBookmarksToStorage,
  saveNoteForEvidence,
  loadNoteForEvidence,
} from "../storage/storage.js";

export function populateEvidenceDropdowns() {
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types: string[] = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const t = state.allEvidence[i].type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (let ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML += '<option value="' + types[ti] + '">' + types[ti] + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < state.allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' + state.allPeople[p].id + '">' + state.allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < state.allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' +
      state.allLocations[l].id +
      '">' +
      state.allLocations[l].id +
      " - " +
      state.allLocations[l].name +
      "</option>";
  }
}

export function getFilteredEvidence(): Evidence[] {
  const searchBox = document.querySelector<HTMLInputElement>("#evidenceSearch");
  const searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  const typeVal = getEl<HTMLSelectElement>("filterType").value;
  const personVal = getEl<HTMLSelectElement>("filterPerson").value;
  const locationVal = getEl<HTMLSelectElement>("filterLocation").value;
  const statusVal = getEl<HTMLSelectElement>("filterStatus").value;
  const relevanceVal = getEl<HTMLSelectElement>("filterRelevance").value;

  const results: Evidence[] = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const item = state.allEvidence[i];
    let matches = true;

    if (searchTerm) {
      const haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal) matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds.indexOf(locationVal) === -1) matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal) matches = false;
    if (matches && relevanceVal && (item.relevance || "").toLowerCase() !== relevanceVal)
      matches = false;

    if (matches) results.push(item);
  }

  state.filteredEvidence = results;
  return results;
}

export function renderEvidenceList() {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (state.evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  const results = getFilteredEvidence();

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (let i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }
  container.innerHTML = html;

  container.addEventListener("click", handleEvidenceListClick);
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = state.bookmarks.indexOf(ev.id) !== -1;
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html += '<span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span>";
  html +=
    '<span class="badge ' + getRelevanceBadgeClass(ev.relevance) + '">' + ev.relevance + "</span>";
  html += "<div>";
  for (let t = 0; t < ev.tags.length; t++) {
    html += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

function handleEvidenceListClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const bookmarkId = target.dataset.id;
  if (target.dataset.action === "bookmark" && bookmarkId !== undefined) {
    event.stopPropagation();
    handleBookmarkClick(bookmarkId);
    return;
  }

  const cardId = target.closest(".evidence-card")?.getAttribute("data-id");
  if (cardId) {
    openEvidenceDetail(cardId);
  }
}

function handleBookmarkClick(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (state.bookmarks.indexOf(evidenceId) === -1) {
    state.bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    state.bookmarks = state.bookmarks.filter(function (id) {
      return id !== evidenceId;
    });
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (state.currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags() {
  for (let i = 0; i < state.allEvidence.length; i++) {
    state.allEvidence[i].bookmarked = state.bookmarks.indexOf(state.allEvidence[i].id) !== -1;
  }
}

export function handleSortChange() {
  const sortValue = getEl<HTMLSelectElement>("sortEvidence").value;

  if (sortValue === "title-asc") {
    state.filteredEvidence.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === "title-desc") {
    state.filteredEvidence.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === "date-asc") {
    state.filteredEvidence.sort(function (a, b) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } else {
    state.filteredEvidence.sort(function (a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }
  renderEvidenceList();
}

export function clearFilters() {
  getEl<HTMLInputElement>("evidenceSearch").value = "";
  getEl<HTMLSelectElement>("filterType").value = "";
  getEl<HTMLSelectElement>("filterPerson").value = "";
  getEl<HTMLSelectElement>("filterLocation").value = "";
  getEl<HTMLSelectElement>("filterStatus").value = "";
  getEl<HTMLSelectElement>("filterRelevance").value = "";
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise<string>(function (resolve) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

export function handleSearchInput(event: Event): void {
  if (!(event.target instanceof HTMLInputElement)) return;
  const term = event.target.value;
  // Every keystroke starts a new search, and async responses can arrive out of order.
  // Step 1: give this search a number by incrementing the shared counter.
  state.latestSearchRequestId = (state.latestSearchRequestId || 0) + 1;
  // Step 2: remember MY number in a local constant. It never changes for this call.
  const requestId = state.latestSearchRequestId;

  simulateAsyncSearch(term).then(function () {
    // Step 3: the response arrived. If the counter has moved on, a newer search
    // started in the meantime, so this result is outdated and must be ignored.
    if (requestId !== state.latestSearchRequestId) return;
    // Only the newest search result is used to update the UI.
    renderEvidenceList();
  });
}

export function openEvidenceDetail(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;
  state.selectedEvidence = ev;

  const section = getEl("evidenceDetailSection");
  section.classList.remove("hidden");

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function closeEvidenceDetail(): void {
  const section = getEl("evidenceDetailSection");
  section.classList.add("hidden");
  section.innerHTML = "";
  state.selectedEvidence = null;
}

export function renderEvidenceDetail(ev: Evidence): void {
  const section = getEl("evidenceDetailSection");

  const personNames: string[] = [];
  for (let p = 0; p < ev.personIds.length; p++) {
    const person = findPersonById(ev.personIds[p]);
    personNames.push(person ? person.name : ev.personIds[p]);
  }

  const locationNames: string[] = [];
  for (let l = 0; l < ev.locationIds.length; l++) {
    const loc = findLocationById(ev.locationIds[l]);
    locationNames.push(loc ? loc.id + " - " + loc.name : ev.locationIds[l]);
  }

  let tagsHtml = "";
  for (let t = 0; t < ev.tags.length; t++) {
    tagsHtml += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";
  html +=
    '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';
  html += "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html += '<div class="detail-field"><strong>Summary</strong>' + ev.summary + "</div>";
  html += '<div class="evidence-detail-content">' + ev.content + "</div>";
  html +=
    '<div class="detail-field"><strong>Related people</strong>' + personNames.join(", ") + "</div>";
  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";
  html += '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");
  html += statusOptionHTML(ev.status, "flagged", "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");
  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");
  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    storedNote +
    "</textarea>";
  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';
  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    storedNote +
    "</div></div>";

  section.innerHTML = html;

  const statusSelect = getEl<HTMLSelectElement>("detailStatusSelect");
  statusSelect.addEventListener("change", function () {
    if (isEvidenceStatus(statusSelect.value)) {
      ev.status = statusSelect.value;
    }
    renderEvidenceDetail(ev);
    if (state.viewRendered.evidence) renderEvidenceList();
  });
  const relevanceSelect = getEl<HTMLSelectElement>("detailRelevanceSelect");
  relevanceSelect.addEventListener("change", function () {
    if (isEvidenceRelevance(relevanceSelect.value)) {
      ev.relevance = relevanceSelect.value;
    }
    renderEvidenceDetail(ev);
    if (state.viewRendered.evidence) renderEvidenceList();
  });
}

export function saveCurrentNote(): void {
  const textarea = document.querySelector<HTMLTextAreaElement>("#evidenceNoteInput");
  if (!textarea) return;
  const evidenceId = textarea.getAttribute("data-evidence-id");
  if (evidenceId === null) return;
  const text = textarea.value;
  saveNoteForEvidence(evidenceId, text);
  const preview = document.getElementById("notePreview");
  if (preview) preview.innerHTML = text;
}

window.handleSortChange = handleSortChange;
window.closeEvidenceDetail = closeEvidenceDetail;
window.saveCurrentNote = saveCurrentNote;
