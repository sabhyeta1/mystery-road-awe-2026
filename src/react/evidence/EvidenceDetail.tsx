import { useState } from "react";
import { formatDate } from "../../utils/format";
import {
  isEvidenceRelevance,
  isEvidenceStatus,
  type CaseLocation,
  type Evidence,
  type EvidenceId,
  type EvidenceRelevance,
  type EvidenceStatus,
  type Person,
} from "../../types/domain";

interface EvidenceDetailProps {
  evidence: Evidence;
  people: Person[];
  locations: CaseLocation[];
  savedNote: string;
  onClose: () => void;
  onSaveNote: (id: EvidenceId, text: string) => void;
  onChangeStatus: (id: EvidenceId, status: EvidenceStatus) => void;
  onChangeRelevance: (id: EvidenceId, relevance: EvidenceRelevance) => void;
}

export function EvidenceDetail({
  evidence,
  people,
  locations,
  savedNote,
  onClose,
  onSaveNote,
  onChangeStatus,
  onChangeRelevance,
}: EvidenceDetailProps) {
  // The text being typed. It only becomes the saved note when "Save note" is clicked.
  const [noteDraft, setNoteDraft] = useState(savedNote);

  const personNames = evidence.personIds.map(
    (personId) => people.find((person) => person.id === personId)?.name ?? personId,
  );
  const locationNames = evidence.locationIds.map((locationId) => {
    const location = locations.find((item) => item.id === locationId);
    return location ? location.id + " - " + location.name : locationId;
  });

  return (
    <div className="evidence-detail">
      <div className="evidence-detail-header">
        <div>
          <h2>{evidence.title}</h2>
          <div className="evidence-meta">
            {evidence.id} · {evidence.type} · {formatDate(evidence.timestamp)}
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-small" onClick={onClose}>
          Close
        </button>
      </div>

      {evidence.tags.includes("critical") && (
        <div className="warning-banner">This item is tagged as critical evidence.</div>
      )}

      <div className="detail-field">
        <strong>Summary</strong>
        {evidence.summary}
      </div>
      <div className="evidence-detail-content">{evidence.content}</div>
      <div className="detail-field">
        <strong>Related people</strong>
        {personNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Related locations</strong>
        {locationNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Tags</strong>
        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="detail-field">
        <strong>Review status</strong>
        <select
          aria-label="Review status"
          value={evidence.status}
          onChange={(event) => {
            if (isEvidenceStatus(event.target.value)) {
              onChangeStatus(evidence.id, event.target.value);
            }
          }}
        >
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <div className="detail-field">
        <strong>Relevance</strong>
        <select
          aria-label="Relevance"
          value={evidence.relevance}
          onChange={(event) => {
            if (isEvidenceRelevance(event.target.value)) {
              onChangeRelevance(evidence.id, event.target.value);
            }
          }}
        >
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>
      </div>

      <div className="detail-field">
        <strong>Investigator note</strong>
        <textarea
          className="note-textarea"
          rows={3}
          placeholder="Add a private note about this evidence..."
          aria-label="Investigator note"
          value={noteDraft}
          onChange={(event) => setNoteDraft(event.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary btn-small"
          style={{ marginTop: "6px" }}
          onClick={() => onSaveNote(evidence.id, noteDraft)}
        >
          Save note
        </button>
      </div>

      <div className="detail-field">
        <strong>Note preview</strong>
        <div>{savedNote}</div>
      </div>
    </div>
  );
}
