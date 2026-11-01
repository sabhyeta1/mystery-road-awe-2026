import {
  STORAGE_KEY_BOOKMARKS,
  STORAGE_KEY_HYPOTHESIS,
  STORAGE_KEY_NOTES,
} from "../../state/store";
import type { EvidenceId, HypothesisDraft } from "../../types/domain";

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadBookmarkIds(): EvidenceId[] {
  const parsed = readJson(STORAGE_KEY_BOOKMARKS);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is string => typeof item === "string");
}

export function saveBookmarkIds(ids: EvidenceId[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(ids));
  } catch (err) {
    console.error("Could not save bookmarks", err);
  }
}

export function loadNotes(): Record<EvidenceId, string> {
  const parsed = readJson(STORAGE_KEY_NOTES);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
  const notes: Record<EvidenceId, string> = {};
  for (const [id, text] of Object.entries(parsed)) {
    if (typeof text === "string") notes[id] = text;
  }
  return notes;
}

export function saveNotes(notes: Record<EvidenceId, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error("Could not save notes", err);
  }
}

export function loadHypothesisDraft(): HypothesisDraft | null {
  const parsed = readJson(STORAGE_KEY_HYPOTHESIS);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
  const draft = parsed as Partial<HypothesisDraft>;
  return {
    suspectId: typeof draft.suspectId === "string" ? draft.suspectId : "",
    nature: typeof draft.nature === "string" ? draft.nature : "",
    evidenceIds: Array.isArray(draft.evidenceIds) ? draft.evidenceIds.map(String) : [],
    confidence: draft.confidence === undefined ? "50" : String(draft.confidence),
    explanation: typeof draft.explanation === "string" ? draft.explanation : "",
    alternative: typeof draft.alternative === "string" ? draft.alternative : "",
    savedAt: typeof draft.savedAt === "string" ? draft.savedAt : "",
  };
}

/** Throws if localStorage is unavailable or full, so the caller can show an error. */
export function saveHypothesisDraft(draft: HypothesisDraft): void {
  localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
}
