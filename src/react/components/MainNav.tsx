import { VIEWS } from "../views";
import type { ViewName } from "../views";

interface MainNavProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

export function MainNav({ currentView, onNavigate }: MainNavProps) {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {VIEWS.map((view) => (
        <button
          key={view.name}
          type="button"
          className={view.name === currentView ? "nav-btn active" : "nav-btn"}
          onClick={() => onNavigate(view.name)}
        >
          {view.label}
        </button>
      ))}
    </nav>
  );
}
