import { Badge } from "../components/Badge";
import type { BadgeVariant } from "../components/Badge";
import { formatDate } from "../../utils/format";
import type { TimelineCertainty, TimelineEvent } from "../../types/domain";

const CERTAINTY_VARIANT: Record<TimelineCertainty, BadgeVariant> = {
  confirmed: "reviewed",
  reported: "flagged",
  contradictory: "critical",
};

interface TimelineEventCardProps {
  event: TimelineEvent;
  locationLabels: string[];
}

export function TimelineEventCard({ event, locationLabels }: TimelineEventCardProps) {
  return (
    <div className={"timeline-event certainty-" + event.certainty}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        <Badge variant={CERTAINTY_VARIANT[event.certainty]}>{event.certainty}</Badge>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {locationLabels.length > 0 && (
        <p className="evidence-meta">Location: {locationLabels.join(", ")}</p>
      )}
    </div>
  );
}
