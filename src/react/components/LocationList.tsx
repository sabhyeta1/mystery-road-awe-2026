import { LocationCard } from "./LocationCard";
import type { CaseLocation } from "../../types/domain";

interface LocationListProps {
  locations: CaseLocation[];
}

export function LocationList({ locations }: LocationListProps) {
  if (locations.length === 0) {
    return <p>No locations on file for this case.</p>;
  }

  return (
    <div className="locations-grid">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}
