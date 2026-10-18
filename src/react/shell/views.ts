export type ViewName = "dashboard" | "evidence" | "people" | "timeline" | "workspace";

export const VIEWS: { name: ViewName; label: string; path: string }[] = [
  { name: "dashboard", label: "Dashboard", path: "/dashboard" },
  { name: "evidence", label: "Evidence", path: "/evidence" },
  { name: "people", label: "People & Locations", path: "/team" },
  { name: "timeline", label: "Timeline", path: "/timeline" },
  { name: "workspace", label: "Workspace", path: "/workspace" },
];

export function getViewPath(name: ViewName): string {
  const view = VIEWS.find((item) => item.name === name);
  return view ? view.path : "/dashboard";
}
