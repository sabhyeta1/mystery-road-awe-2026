import { createContext, useContext, useState, type ReactNode } from "react";
import type { EvidenceId } from "../../types/domain";
import { loadBookmarkIds, saveBookmarkIds } from "./persistence";

interface BookmarksValue {
  bookmarkedIds: EvidenceId[];
  isBookmarked: (id: EvidenceId) => boolean;
  toggleBookmark: (id: EvidenceId) => void;
}

const BookmarksContext = createContext<BookmarksValue | null>(null);

// The single source of truth for bookmarks. It lives in this provider, which App mounts above
// every view, so the Evidence cards, the Dashboard and the Workspace all read the same list.
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<EvidenceId[]>(loadBookmarkIds);

  function toggleBookmark(id: EvidenceId): void {
    // Immutable update: build a NEW array, never push into or splice the current one.
    const next = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((existingId) => existingId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(next);
    saveBookmarkIds(next);
  }

  const value: BookmarksValue = {
    bookmarkedIds,
    isBookmarked: (id) => bookmarkedIds.includes(id),
    toggleBookmark,
  };

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks(): BookmarksValue {
  const value = useContext(BookmarksContext);
  if (value === null) {
    throw new Error("useBookmarks must be used inside a <BookmarksProvider>");
  }
  return value;
}
