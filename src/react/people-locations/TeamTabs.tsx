import { NavLink } from "react-router";

const TABS: { label: string; path: string }[] = [
  { label: "People", path: "/team/people" },
  { label: "Locations", path: "/team/locations" },
];

export function TeamTabs() {
  return (
    <div className="tab-bar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => (isActive ? "tab-btn active" : "tab-btn")}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
