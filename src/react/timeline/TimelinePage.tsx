import { useSearchParams } from "react-router";
import { ViewSection } from "../components/ViewSection";
import { TimelineEventCard } from "./TimelineEventCard";
import { TimelineFilters } from "./TimelineFilters";
import type { LoadState } from "../data/useCaseData";

interface TimelinePageProps {
  loadState: LoadState;
}

export function TimelinePage({ loadState }: TimelinePageProps) {
  const [searchParams] = useSearchParams();
  const personParam = searchParams.get("person") ?? "";

  if (loadState.status === "loading") {
    return (
      <ViewSection title="Timeline">
        <p>Loading case file…</p>
      </ViewSection>
    );
  }

  if (loadState.status === "error") {
    return (
      <ViewSection title="Timeline">
        <p>Something went wrong: {loadState.message}</p>
      </ViewSection>
    );
  }

  const { timeline, people, locations } = loadState.data;

  const selectedPersonId = people.some((person) => person.id === personParam) ? personParam : "";
  const eventTypes = [...new Set(timeline.map((event) => event.type))];
  const visibleEvents =
    selectedPersonId === ""
      ? timeline
      : timeline.filter((event) => event.personIds.includes(selectedPersonId));

  return (
    <ViewSection title="Timeline">
      <TimelineFilters
        people={people}
        locations={locations}
        eventTypes={eventTypes}
        selectedPersonId={selectedPersonId}
      />
      {visibleEvents.length === 0 ? (
        <p>No timeline events match the current filters.</p>
      ) : (
        <div className="timeline-container">
          {visibleEvents.map((event) => {
            const locationLabels = event.locationIds.map((locationId) => {
              const location = locations.find((item) => item.id === locationId);
              return location ? location.id + " - " + location.name : locationId;
            });
            return (
              <TimelineEventCard key={event.id} event={event} locationLabels={locationLabels} />
            );
          })}
        </div>
      )}
    </ViewSection>
  );
}
