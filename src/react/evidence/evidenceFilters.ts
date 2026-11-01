import type { Evidence } from "../../types/domain";

export type SortOrder = "date-desc" | "date-asc" | "title-asc" | "title-desc";

export interface EvidenceFilters {
  search: string;
  type: string;
  person: string;
  location: string;
  status: string;
  relevance: string;
  sort: SortOrder;
}

export type FilterField = "search" | "type" | "person" | "location" | "status" | "relevance";

export type FilterAction =
  | { type: "SET_FILTER"; field: FilterField; value: string }
  | { type: "SET_SORT"; sort: SortOrder }
  | { type: "CLEAR_FILTERS" };

export const initialFilters: EvidenceFilters = {
  search: "",
  type: "",
  person: "",
  location: "",
  status: "",
  relevance: "",
  sort: "date-desc",
};

export function isSortOrder(value: string): value is SortOrder {
  return (
    value === "date-desc" || value === "date-asc" || value === "title-asc" || value === "title-desc"
  );
}

export function filtersReducer(state: EvidenceFilters, action: FilterAction): EvidenceFilters {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.field]: action.value };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "CLEAR_FILTERS":
      // Reset every filter in one step; the chosen sort order is kept, as in the vanilla app.
      return { ...initialFilters, sort: state.sort };
  }
}

function matchesFilters(item: Evidence, filters: EvidenceFilters): boolean {
  const searchTerm = filters.search.toLowerCase().trim();
  if (searchTerm !== "") {
    const haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
    if (!haystack.includes(searchTerm)) return false;
  }
  if (filters.type !== "" && item.type.toLowerCase() !== filters.type) return false;
  if (filters.person !== "" && !item.personIds.includes(filters.person)) return false;
  if (filters.location !== "" && !item.locationIds.includes(filters.location)) return false;
  if (filters.status !== "" && item.status !== filters.status) return false;
  if (filters.relevance !== "" && item.relevance !== filters.relevance) return false;
  return true;
}

function compareEvidence(a: Evidence, b: Evidence, sort: SortOrder): number {
  switch (sort) {
    case "title-asc":
      return a.title.localeCompare(b.title);
    case "title-desc":
      return b.title.localeCompare(a.title);
    case "date-asc":
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    case "date-desc":
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  }
}

// Derived data: computed from the full list plus the filters on every render, never stored.
// filter() already returns a new array, so sorting it can never reorder the original list.
export function filterAndSortEvidence(evidence: Evidence[], filters: EvidenceFilters): Evidence[] {
  return evidence
    .filter((item) => matchesFilters(item, filters))
    .sort((a, b) => compareEvidence(a, b, filters.sort));
}
