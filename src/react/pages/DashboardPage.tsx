import { IntroCard } from "../components/IntroCard";
import { CaseSummaryCard } from "../components/CaseSummaryCard";
import { StatCard } from "../components/StatCard";
import { ReviewProgress } from "../components/ReviewProgress";
import { RecentEvidenceList } from "../components/RecentEvidenceList";
import { RecentTimelineList } from "../components/RecentTimelineList";
import { readBookmarkCount } from "../bookmarks";
import type { ViewName } from "../views";
import type { LoadState } from "../useCaseData";

interface DashboardPageProps {
  loadState: LoadState;
  onNavigate: (view: ViewName) => void;
}

export function DashboardPage({ loadState, onNavigate }: DashboardPageProps) {
  if (loadState.status === "loading") {
    return (
      <section className="view active">
        <h2>Case Dashboard</h2>
        <p>Loading case file…</p>
      </section>
    );
  }

  if (loadState.status === "error") {
    return (
      <section className="view active">
        <h2>Case Dashboard</h2>
        <p>Something went wrong: {loadState.message}</p>
      </section>
    );
  }

  const { caseInfo, people, locations, evidence, timeline } = loadState.data;

  const reviewedCount = evidence.filter((item) => item.status.toLowerCase() === "reviewed").length;
  const progressPercent =
    evidence.length === 0 ? 0 : Math.round((reviewedCount / evidence.length) * 100);
  const recentEvidence = evidence.slice(-5).reverse();
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <section className="view active">
      <h2>Case Dashboard</h2>

      <IntroCard onNavigate={onNavigate} />

      <CaseSummaryCard caseInfo={caseInfo} />

      <div className="stat-grid">
        <StatCard value={evidence.length} label="Evidence items" />
        <StatCard value={people.length} label="People" />
        <StatCard value={locations.length} label="Locations" />
        <StatCard value={readBookmarkCount()} label="Bookmarked" />
        <StatCard value={reviewedCount} label="Reviewed" />
      </div>

      <ReviewProgress percent={progressPercent} />

      <div className="dashboard-columns">
        <RecentEvidenceList evidence={recentEvidence} />
        <RecentTimelineList events={recentTimeline} />
      </div>
    </section>
  );
}
