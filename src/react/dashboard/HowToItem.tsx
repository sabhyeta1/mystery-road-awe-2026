interface HowToItemProps {
  title: string;
  text: string;
  buttonLabel: string;
  onGo: () => void;
}

export function HowToItem({ title, text, buttonLabel, onGo }: HowToItemProps) {
  return (
    <div className="howto-item">
      <h4>{title}</h4>
      <p>{text}</p>
      <button type="button" className="btn btn-secondary btn-small" onClick={onGo}>
        {buttonLabel}
      </button>
    </div>
  );
}
