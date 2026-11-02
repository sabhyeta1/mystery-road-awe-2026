interface ErrorStateProps {
  title: string;
  detail: string;
}

// Shown when the request failed. role="alert" makes screen readers announce it immediately.
export function ErrorState({ title, detail }: ErrorStateProps) {
  return (
    <div className="state-box state-error" role="alert">
      <h3>{title}</h3>
      <p>Please check that the backend is running and reload the page.</p>
      <p className="state-detail">Technical detail: {detail}</p>
    </div>
  );
}
