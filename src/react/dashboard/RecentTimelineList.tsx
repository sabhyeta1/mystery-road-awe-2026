import { formatDate } from "../../utils/format";
import type { TimelineEvent } from "../../types/domain";

interface RecentTimelineListProps {
  events: TimelineEvent[];
}

export function RecentTimelineList({ events }: RecentTimelineListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {events.length === 0 && <p>No timeline events loaded yet.</p>}
      {events.map((event) => (
        <div className="mini-list-item" key={event.id}>
          <strong>{formatDate(event.time)}</strong>
          <br />
          {event.title}
        </div>
      ))}
    </div>
  );
}
