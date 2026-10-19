import { Link, useParams } from "react-router";
import { PersonCard } from "./PersonCard";
import type { LoadState } from "../data/useCaseData";

interface PersonDetailTabProps {
  loadState: LoadState;
}

export function PersonDetailTab({ loadState }: PersonDetailTabProps) {
  const { personId } = useParams();

  if (loadState.status === "loading") {
    return <p>Loading case file…</p>;
  }

  if (loadState.status === "error") {
    return <p>Something went wrong: {loadState.message}</p>;
  }

  const { people, evidence } = loadState.data;
  const person = people.find((item) => item.id === personId);

  if (person === undefined) {
    return (
      <>
        <p>There is no person with the id “{personId}” in this case.</p>
        <p>
          <Link to="/team/people">Back to all people</Link>
        </p>
      </>
    );
  }

  const evidenceCount = evidence.filter((item) => item.personIds.includes(person.id)).length;

  return (
    <>
      <p>
        <Link to="/team/people">← Back to all people</Link>
      </p>
      <PersonCard person={person} evidenceCount={evidenceCount} />
      <p>
        <Link to={"/timeline?person=" + person.id}>Show this person&rsquo;s timeline events</Link>
      </p>
      <h3>Background</h3>
      <p>{person.background}</p>
    </>
  );
}
