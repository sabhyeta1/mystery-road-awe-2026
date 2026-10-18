import { Outlet } from "react-router";
import { ViewSection } from "../components/ViewSection";
import { TeamTabs } from "./TeamTabs";

export function TeamLayout() {
  return (
    <ViewSection title="People & Locations">
      <TeamTabs />
      <Outlet />
    </ViewSection>
  );
}
