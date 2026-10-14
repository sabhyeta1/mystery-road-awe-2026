import type { ReactNode } from "react";

export type BadgeVariant = "reviewed" | "flagged" | "unreviewed" | "critical" | "relevant";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return <span className={"badge badge-" + variant}>{children}</span>;
}
