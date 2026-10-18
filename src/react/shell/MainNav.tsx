import { NavLink } from "react-router";
import { VIEWS } from "./views";

export function MainNav() {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {VIEWS.map((view) => (
        <NavLink
          key={view.name}
          to={view.path}
          className={({ isActive }) => (isActive ? "nav-btn active" : "nav-btn")}
        >
          {view.label}
        </NavLink>
      ))}
    </nav>
  );
}
