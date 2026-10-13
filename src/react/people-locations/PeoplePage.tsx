import { ViewSection } from "../components/ViewSection";
import { PeopleList } from "./PeopleList";
import { LocationList } from "./LocationList";
import type { PersonId } from "../../types/domain";
import type { LoadState } from "../data/useCaseData";

interface PeoplePageProps {
  loadState: LoadState;
}

export function PeoplePage({ loadState }: PeoplePageProps) {
  if (loadState.status === "loading") {
    return (
      <ViewSection title="People & Locations">
        <p>Loading case file…</p>
      </ViewSection>
    );
  }

  if (loadState.status === "error") {
    return (
      <ViewSection title="People & Locations">
        <p>Something went wrong: {loadState.message}</p>
      </ViewSection>
    );
  }

  const { people, locations, evidence } = loadState.data;

  const evidenceCounts: Record<PersonId, number> = {};
  for (const person of people) {
    evidenceCounts[person.id] = evidence.filter((item) =>
      item.personIds.includes(person.id),
    ).length;
  }

  return (
    <ViewSection title="People & Locations">
      <h3>People</h3>
      <PeopleList people={people} evidenceCounts={evidenceCounts} />

      <h3>Locations</h3>
      <LocationList locations={locations} />
    </ViewSection>
  );
}
