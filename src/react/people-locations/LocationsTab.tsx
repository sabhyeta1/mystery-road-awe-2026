import { LocationList } from "./LocationList";
import type { LoadState } from "../data/useCaseData";

interface LocationsTabProps {
  loadState: LoadState;
}

export function LocationsTab({ loadState }: LocationsTabProps) {
  if (loadState.status === "loading") {
    return <p>Loading case file…</p>;
  }

  if (loadState.status === "error") {
    return <p>Something went wrong: {loadState.message}</p>;
  }

  return <LocationList locations={loadState.data.locations} />;
}
