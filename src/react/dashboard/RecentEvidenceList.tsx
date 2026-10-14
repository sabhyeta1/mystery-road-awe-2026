import { Badge } from "../components/Badge";
import type { Evidence } from "../../types/domain";

interface RecentEvidenceListProps {
  evidence: Evidence[];
}

export function RecentEvidenceList({ evidence }: RecentEvidenceListProps) {
  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {evidence.length === 0 && <p>No evidence loaded yet.</p>}
      {evidence.map((item) => (
        <div className="mini-list-item" key={item.id}>
          <strong>{item.id}</strong> — {item.title}
          <Badge variant={item.status}>{item.status}</Badge>
        </div>
      ))}
    </div>
  );
}
