interface EmptyStateProps {
  message: string;
}

// Shown when the request worked, but there is nothing to show.
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="state-box state-empty">
      <p>{message}</p>
    </div>
  );
}
