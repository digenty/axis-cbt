"use client";

import { BackButton } from "./BackButton";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  backHref?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  showBack,
  right,
  className,
}: PageHeaderProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-3",
      className,
    )}
  >
    <div className="flex flex-wrap items-center gap-3">
      {showBack && <BackButton />}
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-semibold capitalize text-[var(--color-text-default)]">
          {title}
        </h1>
        {subtitle && (
          <span className="text-sm capitalize text-[var(--color-text-muted)]">
            {subtitle}
          </span>
        )}
      </div>
    </div>
    {right && <div className="flex items-center gap-2">{right}</div>}
  </div>
);
