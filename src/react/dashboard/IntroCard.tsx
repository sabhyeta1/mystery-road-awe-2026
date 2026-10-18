import { HowToItem } from "./HowToItem";
import { getViewPath } from "../shell/views";
import type { ViewName } from "../shell/views";

const STEPS: { title: string; text: string; buttonLabel: string; target: ViewName }[] = [
  {
    title: "1. Evidence Catalogue",
    text: "Search, filter, and sort every evidence item. Open one for full details, related people and locations, and to add a private note.",
    buttonLabel: "Go to Evidence",
    target: "evidence",
  },
  {
    title: "2. People & Locations",
    text: "Read profiles and statements from the six team members involved, and look up the six key locations in the investigation.",
    buttonLabel: "Go to People & Locations",
    target: "people",
  },
  {
    title: "3. Timeline",
    text: "Walk through events in chronological order, filter by person, location, or type, and jump straight to the evidence behind any event.",
    buttonLabel: "Go to Timeline",
    target: "timeline",
  },
  {
    title: "4. Investigator Workspace",
    text: "Your bookmarked evidence and notes collect here. Draft a hypothesis — who you suspect, why, and how confident you are — it's saved automatically in your browser.",
    buttonLabel: "Go to Workspace",
    target: "workspace",
  },
];

export function IntroCard() {
  return (
    <div className="intro-card">
      <h3>How to use this portal</h3>
      <p>
        Everything gathered on the case so far is organised into four working views. Use the
        navigation bar at the top to move between them at any time.
      </p>
      <div className="howto-grid">
        {STEPS.map((step) => (
          <HowToItem
            key={step.target}
            title={step.title}
            text={step.text}
            buttonLabel={step.buttonLabel}
            to={getViewPath(step.target)}
          />
        ))}
      </div>
    </div>
  );
}
