import { Link } from "react-router";
import { ViewSection } from "../components/ViewSection";

export function NotFoundPage() {
  return (
    <ViewSection title="Page not found">
      <p>There is no page at this address.</p>
      <p>
        <Link to="/dashboard">Back to the Dashboard</Link>
      </p>
    </ViewSection>
  );
}
