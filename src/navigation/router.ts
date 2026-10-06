import { state } from "../state/store.js";
import type { ViewName } from "../state/store.js";
import { getEl } from "../utils/dom.js";

// router.js doesn't import the view-render functions directly (that would
// create a circular dependency, since those views need to call navigateTo()
// too). Instead, main.js registers them here once, at startup.
interface ViewRenderers {
  renderDashboard: () => void;
  renderEvidenceList: () => void;
  renderPeople: () => void;
  renderLocations: () => void;
  renderTimeline: () => void;
  renderWorkspace: () => void;
}

const VIEW_NAMES: ViewName[] = ["dashboard", "evidence", "people", "timeline", "workspace"];

function isViewName(value: string): value is ViewName {
  return VIEW_NAMES.some(function (name) {
    return name === value;
  });
}

let viewRenderers: ViewRenderers | null = null;

export function registerViewRenderers(renderers: ViewRenderers): void {
  viewRenderers = renderers;
}

export function navigateTo(viewName: ViewName): void {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange(): void {
  if (viewRenderers === null) {
    throw new Error("registerViewRenderers() must run before handleHashChange()");
  }
  const renderers = viewRenderers;

  const requested = window.location.hash.replace("#", "");
  const hash: ViewName = isViewName(requested) ? requested : "dashboard";
  state.currentPage = hash;

  const sections = document.querySelectorAll(".view");
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }
  getEl("view-" + hash).classList.add("active");

  const navButtons = document.querySelectorAll(".nav-btn");
  for (let n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove("active");
    if (navButtons[n].getAttribute("data-view") === hash) {
      navButtons[n].classList.add("active");
    }
  }


  // state.viewRendered remembers which views have already been drawn.
  // On a view's FIRST visit it is false, so we build the HTML and flip the flag to true.
  // On every later visit the flag is true, so we skip rendering and show the old HTML.
  
  if (hash === "dashboard" && !state.viewRendered.dashboard) {
    renderers.renderDashboard();
    state.viewRendered.dashboard = true; // from now on the dashboard is never redrawn
  } else if (hash === "evidence" && !state.viewRendered.evidence) {
    renderers.renderEvidenceList();
    state.viewRendered.evidence = true;
  } else if (hash === "people" && !state.viewRendered.people) {
    renderers.renderPeople();
    renderers.renderLocations();
    state.viewRendered.people = true;
  } else if (hash === "timeline" && !state.viewRendered.timeline) {
    renderers.renderTimeline();
    state.viewRendered.timeline = true;
  } else if (hash === "workspace") {
    // No flag here: the workspace is redrawn on EVERY visit, so it always
    // shows the current bookmarks and notes. This is the contrast to the dashboard.
    renderers.renderWorkspace();
  }
}

window.navigateTo = navigateTo;
