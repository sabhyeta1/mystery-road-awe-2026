import { PersonCard } from "./PersonCard";
import type { Person, PersonId } from "../../types/domain";

interface PeopleListProps {
  people: Person[];
  evidenceCounts: Record<PersonId, number>;
}

export function PeopleList({ people, evidenceCounts }: PeopleListProps) {
  if (people.length === 0) {
    return <p>No people on file for this case.</p>;
  }

  return (
    <div className="people-grid">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} evidenceCount={evidenceCounts[person.id]} />
      ))}
    </div>
  );
}
