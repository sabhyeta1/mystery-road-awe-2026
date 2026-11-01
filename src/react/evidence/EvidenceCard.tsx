import { Badge } from "../components/Badge";
import { useBookmarks } from "../state/BookmarksContext";
import { formatDate } from "../../utils/format";
import type { Evidence, EvidenceId } from "../../types/domain";

interface EvidenceCardProps {
  evidence: Evidence;
  onOpen: (id: EvidenceId) => void;
}

export function EvidenceCard({ evidence, onOpen }: EvidenceCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(evidence.id);

  return (
    <div
      className="evidence-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(evidence.id)}
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen(evidence.id);
        }
      }}
    >
      <button
        type="button"
        className={bookmarked ? "bookmark-btn active" : "bookmark-btn"}
        aria-label={"Toggle bookmark for " + evidence.title}
        aria-pressed={bookmarked}
        onClick={(event) => {
          // The card itself is clickable, so stop this click from also opening the detail view.
          event.stopPropagation();
          toggleBookmark(evidence.id);
        }}
      >
        <span className="bookmark-icon">{bookmarked ? "★" : "☆"}</span>
      </button>
      <h3>{evidence.title}</h3>
      <div className="evidence-meta">
        {evidence.id} · {evidence.type} · {formatDate(evidence.timestamp)}
      </div>
      <div className="evidence-summary">{evidence.summary}</div>
      {evidence.tags.includes("critical") && <Badge variant="critical">Critical</Badge>}
      <Badge variant={evidence.status}>{evidence.status}</Badge>
      <Badge variant={evidence.relevance === "relevant" ? "relevant" : "unreviewed"}>
        {evidence.relevance}
      </Badge>
      <div>
        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
