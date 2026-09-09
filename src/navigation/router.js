import { state } from "../state/store.js";

// router.js doesn't import the view-render functions directly (that would
// create a circular dependency, since those views need to call navigateTo()
// too). Instead, main.js registers them here once, at startup.
var viewRenderers = null;

export function registerViewRenderers(renderers) {
  viewRenderers = renderers;
}

export function navigateTo(viewName) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange() {
  var hash = window.location.hash.replace("#", "");
  var validViews = ["dashboard", "evidence", "people", "timeline", "workspace"];
  if (validViews.indexOf(hash) === -1) {
    hash = "dashboard";
  }
  state.currentPage = hash;

  var sections = document.querySelectorAll(".view");
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }
  document.getElementById("view-" + hash).classList.add("active");

  var navButtons = document.querySelectorAll(".nav-btn");
  for (var n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove("active");
    if (navButtons[n].getAttribute("data-view") === hash) {
      navButtons[n].classList.add("active");
    }
  }

  if (hash === "dashboard" && !state.viewRendered.dashboard) {
    viewRenderers.renderDashboard();
    state.viewRendered.dashboard = true;
  } else if (hash === "evidence" && !state.viewRendered.evidence) {
    viewRenderers.renderEvidenceList();
    state.viewRendered.evidence = true;
  } else if (hash === "people" && !state.viewRendered.people) {
    viewRenderers.renderPeople();
    viewRenderers.renderLocations();
    state.viewRendered.people = true;
  } else if (hash === "timeline" && !state.viewRendered.timeline) {
    viewRenderers.renderTimeline();
    state.viewRendered.timeline = true;
  } else if (hash === "workspace") {
    viewRenderers.renderWorkspace();
  }
}

window.navigateTo = navigateTo;