import type { ReactNode } from "react";

interface ViewSectionProps {
  title: string;
  children: ReactNode;
}

export function ViewSection({ title, children }: ViewSectionProps) {
  return (
    <section className="view active">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
