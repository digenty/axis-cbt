"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-2 px-6 py-12 text-center",
      className,
    )}
  >
    {icon && (
      <div className="mb-1 text-[var(--color-icon-default-muted)]">{icon}</div>
    )}
    <h3 className="text-sm font-semibold text-[var(--color-text-default)]">
      {title}
    </h3>
    {description && (
      <p className="max-w-sm text-xs text-[var(--color-text-muted)]">
        {description}
      </p>
    )}
    {action && <div className="mt-3">{action}</div>}
  </div>
);
