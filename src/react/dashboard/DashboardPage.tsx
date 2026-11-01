import { IntroCard } from "./IntroCard";
import { CaseSummaryCard } from "./CaseSummaryCard";
import { StatCard } from "./StatCard";
import { ReviewProgress } from "./ReviewProgress";
import { RecentEvidenceList } from "./RecentEvidenceList";
import { RecentTimelineList } from "./RecentTimelineList";
import { useBookmarks } from "../state/BookmarksContext";
import type { LoadState } from "../data/useCaseData";

interface DashboardPageProps {
  loadState: LoadState;
}

export function DashboardPage({ loadState }: DashboardPageProps) {
  const { isBookmarked } = useBookmarks();

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
  const bookmarkedCount = evidence.filter((item) => isBookmarked(item.id)).length;
  const recentEvidence = evidence.slice(-5).reverse();
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <section className="view active">
      <h2>Case Dashboard</h2>

      <IntroCard />

      <CaseSummaryCard caseInfo={caseInfo} />

      <div className="stat-grid">
        <StatCard value={evidence.length} label="Evidence items" />
        <StatCard value={people.length} label="People" />
        <StatCard value={locations.length} label="Locations" />
        <StatCard value={bookmarkedCount} label="Bookmarked" />
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
