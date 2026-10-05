import type {
  CaseInfo,
  CaseLocation,
  Evidence,
  EvidenceId,
  Person,
  TimelineEvent,
} from "../types/domain.js";

export type ViewName = "dashboard" | "evidence" | "people" | "timeline" | "workspace";

interface AppState {
  allEvidence: Evidence[];
  filteredEvidence: Evidence[];
  selectedEvidence: Evidence | null;
  bookmarks: EvidenceId[];
  currentPage: ViewName;

  allPeople: Person[];
  allLocations: CaseLocation[];
  allTimeline: TimelineEvent[];
  caseData: Partial<CaseInfo>;

  currentPeopleTab: "people" | "locations";
  loadingStepsRemaining: number;

  evidenceViewLoading: boolean;
  viewRendered: Record<ViewName, boolean>;

  notesStore: Record<EvidenceId, string>;
  modalCloseListenerCount: number;
  latestSearchRequestId: number;
}

//state points to one object (the "folder"). We're allowed to change the contents inside that folder.
//We are not allowed to make state point to a different folder.
//"imports are live, read-only views of exported bindings". in this case "state" connected to the obj is the binding

export const state: AppState = {
  allEvidence: [],
  filteredEvidence: [],
  selectedEvidence: null,
  bookmarks: [],
  currentPage: "dashboard",

  allPeople: [],
  allLocations: [],
  allTimeline: [],
  caseData: {},

  currentPeopleTab: "people",
  loadingStepsRemaining: 2,

  evidenceViewLoading: true,
  viewRendered: {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false,
  },

  notesStore: {},
  modalCloseListenerCount: 0,
  latestSearchRequestId: 0,
};

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function setLatestSearchRequestId(id: number): void {
  state.latestSearchRequestId = id;
}
