import type { Evidence, EvidenceId } from "../../types/domain";

interface NotesListProps {
  evidence: Evidence[];
  notes: Record<EvidenceId, string>;
}

export function NotesList({ evidence, notes }: NotesListProps) {
  // Derived: every evidence item that currently has a non-empty note.
  const itemsWithNotes = evidence.filter((item) => (notes[item.id] ?? "").trim() !== "");

  return (
    <div className="notes-list">
      {itemsWithNotes.length === 0 && (
        <p>No notes yet. Add one from an evidence item&apos;s detail view.</p>
      )}
      {itemsWithNotes.map((item) => (
        <div className="mini-list-item" key={item.id}>
          <strong>{item.id}</strong> — {item.title}
          <div>{notes[item.id]}</div>
        </div>
      ))}
    </div>
  );
}
