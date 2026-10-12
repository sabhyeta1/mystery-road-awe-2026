export type ViewName = "dashboard" | "evidence" | "people" | "timeline" | "workspace";

export const VIEWS: { name: ViewName; label: string }[] = [
  { name: "dashboard", label: "Dashboard" },
  { name: "evidence", label: "Evidence" },
  { name: "people", label: "People & Locations" },
  { name: "timeline", label: "Timeline" },
  { name: "workspace", label: "Workspace" },
];
