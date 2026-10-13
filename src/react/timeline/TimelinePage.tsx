import { ViewSection } from "../components/ViewSection";
import { TimelineEventCard } from "./TimelineEventCard";
import type { LoadState } from "../data/useCaseData";

interface TimelinePageProps {
  loadState: LoadState;
}

export function TimelinePage({ loadState }: TimelinePageProps) {
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

  const { timeline, locations } = loadState.data;

  return (
    <ViewSection title="Timeline">
      {timeline.length === 0 ? (
        <p>No timeline events match the current filters.</p>
      ) : (
        <div className="timeline-container">
          {timeline.map((event) => {
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
