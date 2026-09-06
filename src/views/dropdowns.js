import { populateEvidenceDropdowns } from "./evidence.js";
import { populateTimelineDropdowns } from "./timeline.js";
import { populateHypothesisDropdowns } from "./workspace.js";

export function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}