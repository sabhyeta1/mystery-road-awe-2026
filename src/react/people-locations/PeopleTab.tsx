import { PeopleList } from "./PeopleList";
import type { PersonId } from "../../types/domain";
import type { LoadState } from "../data/useCaseData";

interface PeopleTabProps {
  loadState: LoadState;
}

export function PeopleTab({ loadState }: PeopleTabProps) {
  if (loadState.status === "loading") {
    return <p>Loading case file…</p>;
  }

  if (loadState.status === "error") {
    return <p>Something went wrong: {loadState.message}</p>;
  }

  const { people, evidence } = loadState.data;

  const evidenceCounts: Record<PersonId, number> = {};
  for (const person of people) {
    evidenceCounts[person.id] = evidence.filter((item) =>
      item.personIds.includes(person.id),
    ).length;
  }

  return <PeopleList people={people} evidenceCounts={evidenceCounts} />;
}
