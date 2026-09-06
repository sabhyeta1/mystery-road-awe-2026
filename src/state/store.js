
//state points to one object (the "folder"). We're allowed to change the contents inside that folder. 
//We are not allowed to make state point to a different folder.
//"imports are live, read-only views of exported bindings". in this case "state" connected to the obj is the binding

export const state = {
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
        workspace: false
    }, 

    notesStore: {},
    modalCloseListenerCount: 0
};

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function setLatestSearchRequestId(id) {
  state.latestSearchRequestId = id;
}