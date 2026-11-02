interface LoadingStateProps {
  message: string;
}

// Shown while a request is still pending. role="status" lets screen readers announce it politely.
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="evidence-loading" role="status">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
