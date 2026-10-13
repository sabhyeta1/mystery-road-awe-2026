import type { Person } from "../../types/domain";

interface PersonCardProps {
  person: Person;
  evidenceCount: number;
}

export function PersonCard({ person, evidenceCount }: PersonCardProps) {
  return (
    <div className="person-card">
      <div className="person-card-header">
        <img className="person-avatar" src={person.avatar} alt={"Portrait of " + person.name} />
        <div>
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
      <p>
        {evidenceCount} related evidence item{evidenceCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}
