import { Link } from "react-router";

interface HowToItemProps {
  title: string;
  text: string;
  buttonLabel: string;
  to: string;
}

export function HowToItem({ title, text, buttonLabel, to }: HowToItemProps) {
  return (
    <div className="howto-item">
      <h4>{title}</h4>
      <p>{text}</p>
      <Link to={to} className="btn btn-secondary btn-small">
        {buttonLabel}
      </Link>
    </div>
  );
}
