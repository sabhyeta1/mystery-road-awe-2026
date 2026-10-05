import type { ViewName } from "../state/store.js";

declare global {
  interface Window {
    navigateTo: (viewName: ViewName) => void;
    switchPeopleTab: (tab: "people" | "locations") => void;
    handleSortChange: () => void;
    closeEvidenceDetail: () => void;
    saveCurrentNote: () => void;
    saveHypothesis: () => void;
  }
}
