import { certaintyBadgeClass, formatDate } from "../../utils/format";
import type { TimelineEvent } from "../../types/domain";

interface TimelineEventCardProps {
  event: TimelineEvent;
  locationLabels: string[];
}

export function TimelineEventCard({ event, locationLabels }: TimelineEventCardProps) {
  return (
    <div className={"timeline-event certainty-" + event.certainty}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        <span className={"badge badge-" + certaintyBadgeClass(event.certainty)}>
          {event.certainty}
        </span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {locationLabels.length > 0 && (
        <p className="evidence-meta">Location: {locationLabels.join(", ")}</p>
      )}
    </div>
  );
}
