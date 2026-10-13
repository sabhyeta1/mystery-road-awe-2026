import { getStatusBadgeClass } from "../../utils/format";
import type { EvidenceStatus } from "../../types/domain";

interface StatusBadgeProps {
  status: EvidenceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={"badge " + getStatusBadgeClass(status)}>{status}</span>;
}
