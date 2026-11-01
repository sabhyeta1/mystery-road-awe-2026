import { Link } from "react-router";
import { useBookmarks } from "../state/BookmarksContext";
import type { Evidence } from "../../types/domain";

interface BookmarkedEvidenceListProps {
  evidence: Evidence[];
}

export function BookmarkedEvidenceList({ evidence }: BookmarkedEvidenceListProps) {
  const { isBookmarked } = useBookmarks();

  // Derived from the full list and the shared bookmark ids, never stored separately.
  const bookmarkedItems = evidence.filter((item) => isBookmarked(item.id));

  return (
    <div className="bookmarks-list">
      {bookmarkedItems.length === 0 && (
        <p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>
      )}
      {bookmarkedItems.map((item) => (
        <div className="mini-list-item" key={item.id}>
          <strong>{item.id}</strong> — {item.title}{" "}
          <Link className="btn btn-small btn-secondary" to={"/evidence?open=" + item.id}>
            Open
          </Link>
        </div>
      ))}
    </div>
  );
}
