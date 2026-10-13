import { ViewSection } from "../components/ViewSection";
import { PersonCard } from "../components/PersonCard";
import { LocationCard } from "../components/LocationCard";
import type { LoadState } from "../useCaseData";

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

  return (
    <ViewSection title="People & Locations">
      <h3>People</h3>
      <div className="people-grid">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            evidenceCount={evidence.filter((item) => item.personIds.includes(person.id)).length}
          />
        ))}
      </div>

      <h3>Locations</h3>
      <div className="locations-grid">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </ViewSection>
  );
}
