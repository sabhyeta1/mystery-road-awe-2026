import type { Dispatch } from "react";
import type { CaseLocation, Person } from "../../types/domain";
import {
  isSortOrder,
  type EvidenceFilters,
  type FilterAction,
  type FilterField,
} from "./evidenceFilters";

interface EvidenceToolbarProps {
  filters: EvidenceFilters;
  dispatch: Dispatch<FilterAction>;
  evidenceTypes: string[];
  people: Person[];
  locations: CaseLocation[];
}

export function EvidenceToolbar({
  filters,
  dispatch,
  evidenceTypes,
  people,
  locations,
}: EvidenceToolbarProps) {
  function setFilter(field: FilterField, value: string): void {
    dispatch({ type: "SET_FILTER", field, value });
  }

  return (
    <div className="toolbar" id="evidenceToolbar">
      <div className="toolbar-row">
        <label htmlFor="evidenceSearch" className="visually-hidden">
          Search evidence
        </label>
        <input
          type="text"
          id="evidenceSearch"
          placeholder="Search evidence by title, summary, or tag…"
          autoComplete="off"
          value={filters.search}
          onChange={(event) => setFilter("search", event.target.value)}
        />

        <label htmlFor="filterType" className="visually-hidden">
          Filter by type
        </label>
        <select
          id="filterType"
          value={filters.type}
          onChange={(event) => setFilter("type", event.target.value)}
        >
          <option value="">All types</option>
          {evidenceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="filterPerson" className="visually-hidden">
          Filter by person
        </label>
        <select
          id="filterPerson"
          value={filters.person}
          onChange={(event) => setFilter("person", event.target.value)}
        >
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <label htmlFor="filterLocation" className="visually-hidden">
          Filter by location
        </label>
        <select
          id="filterLocation"
          value={filters.location}
          onChange={(event) => setFilter("location", event.target.value)}
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.id} - {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-row">
        <label htmlFor="filterStatus" className="visually-hidden">
          Filter by status
        </label>
        <select
          id="filterStatus"
          value={filters.status}
          onChange={(event) => setFilter("status", event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>

        <label htmlFor="filterRelevance" className="visually-hidden">
          Filter by relevance
        </label>
        <select
          id="filterRelevance"
          value={filters.relevance}
          onChange={(event) => setFilter("relevance", event.target.value)}
        >
          <option value="">All relevance</option>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>

        <label htmlFor="sortEvidence" className="visually-hidden">
          Sort evidence
        </label>
        <select
          id="sortEvidence"
          value={filters.sort}
          onChange={(event) => {
            if (isSortOrder(event.target.value)) {
              dispatch({ type: "SET_SORT", sort: event.target.value });
            }
          }}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
        </select>

        <button
          type="button"
          id="clearFiltersBtn"
          className="btn btn-secondary"
          onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
