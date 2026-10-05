import { state } from "../state/store.js";
import { findLocationById, findEvidenceById } from "../utils/lookups.js";
import { formatDate, certaintyBadgeClass } from "../utils/format.js";
import { navigateTo } from "../navigation/router.js";
import { getEl } from "../utils/dom.js";
import type { EvidenceId, TimelineEvent } from "../types/domain.js";
import { openEvidenceDetail } from "./evidence.js";

export function populateTimelineDropdowns() {
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < state.allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' + state.allPeople[p].id + '">' + state.allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < state.allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' + state.allLocations[l].id + '">' + state.allLocations[l].id + "</option>";
  }

  const types: string[] = [];
  for (let i = 0; i < state.allTimeline.length; i++) {
    if (types.indexOf(state.allTimeline[i].type) === -1) types.push(state.allTimeline[i].type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (let t = 0; t < types.length; t++) {
    typeSelect.innerHTML += '<option value="' + types[t] + '">' + types[t] + "</option>";
  }
}

export function renderTimeline(): void {
  const container = document.getElementById("timelineContainer");
  if (!container) return;

  const order = getEl<HTMLSelectElement>("timelineOrder").value;
  const personFilter = getEl<HTMLSelectElement>("timelinePersonFilter").value;
  const locationFilter = getEl<HTMLSelectElement>("timelineLocationFilter").value;
  const typeFilter = getEl<HTMLSelectElement>("timelineTypeFilter").value;

  let events: TimelineEvent[] = [];
  for (let i = 0; i < state.allTimeline.length; i++) {
    const evt = state.allTimeline[i];
    if (personFilter && evt.personIds.indexOf(personFilter) === -1) continue;
    if (locationFilter && evt.locationIds.indexOf(locationFilter) === -1) continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events = events.slice().sort(function (a, b) {
    const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
    return order === "desc" ? -diff : diff;
  });

  let html = "";
  for (let e = 0; e < events.length; e++) {
    const item = events[e];
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames: string[] = [];
    for (let el = 0; el < item.locationIds.length; el++) {
      const evtLoc = findLocationById(item.locationIds[el]);
      eventLocationNames.push(evtLoc ? evtLoc.id + " - " + evtLoc.name : item.locationIds[el]);
    }
    if (eventLocationNames.length > 0) {
      html += '<p class="evidence-meta">Location: ' + eventLocationNames.join(", ") + "</p>";
    }

    for (let ev2 = 0; ev2 < item.evidenceIds.length; ev2++) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        item.evidenceIds[ev2] +
        '">View ' +
        item.evidenceIds[ev2] +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  const linkButtons = container.querySelectorAll(".evidence-link-btn");
  for (let b = 0; b < linkButtons.length; b++) {
    linkButtons[b].addEventListener("click", function () {
      const evidenceId = linkButtons[b].getAttribute("data-evidence-id");
      if (evidenceId === null) return;
      openEvidenceModal(evidenceId);
    });
  }
}

export function openEvidenceModal(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    const created = document.createElement("div");
    created.id = "quickViewModal";
    document.body.appendChild(created);

    created.addEventListener("click", function (e) {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (
        target.classList.contains("modal-close-btn") ||
        target.classList.contains("modal-backdrop")
      ) {
        created.innerHTML = "";
      }
      const openFull = target.getAttribute("data-open-full");
      if (openFull) {
        created.innerHTML = "";
        navigateTo("evidence");
        setTimeout(function () {
          openEvidenceDetail(openFull);
        }, 0);
      }
    });
    modal = created;
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";

  state.modalCloseListenerCount++;
  console.log("modal opened, active close listeners:", state.modalCloseListenerCount);
}
