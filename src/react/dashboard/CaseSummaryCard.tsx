import type { CaseInfo } from "../../types/domain";

interface CaseSummaryCardProps {
  caseInfo: CaseInfo;
}

export function CaseSummaryCard({ caseInfo }: CaseSummaryCardProps) {
  return (
    <div className="case-summary-card">
      <h3>{caseInfo.title}</h3>
      <p>
        <span className="badge badge-flagged">{caseInfo.status.toUpperCase()}</span>
      </p>
      <p>{caseInfo.summary}</p>
    </div>
  );
}
