import { Badge } from "../components/Badge";
import type { CaseInfo } from "../../types/domain";

interface CaseSummaryCardProps {
  caseInfo: CaseInfo;
}

export function CaseSummaryCard({ caseInfo }: CaseSummaryCardProps) {
  return (
    <div className="case-summary-card">
      <h3>{caseInfo.title}</h3>
      <p>
        <Badge variant="flagged">{caseInfo.status.toUpperCase()}</Badge>
      </p>
      <p>{caseInfo.summary}</p>
    </div>
  );
}
