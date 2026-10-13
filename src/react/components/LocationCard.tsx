import type { CaseLocation } from "../../types/domain";

interface LocationCardProps {
  location: CaseLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="location-card">
      <h3>
        {location.id} &mdash; {location.name}
      </h3>
      <p>{location.description}</p>
      {location.contains.length > 0 && (
        <>
          <p>
            <strong>Contains:</strong>
          </p>
          <ul>
            {location.contains.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
