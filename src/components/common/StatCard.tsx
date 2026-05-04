"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}

export const StatCard = ({
  icon,
  label,
  value,
  hint,
  className,
}: StatCardProps) => (
  // <div
  //   className={cn(
  //     "flex flex-col gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4",
  //     className,
  //   )}
  // >
  //   <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
  //     {icon && (
  //       <span className="flex h-5 w-5 items-center justify-center text-[var(--color-icon-default-subtle)]">
  //         {icon}
  //       </span>
  //     )}
  //     {label}
  //   </div>
  //   <div className="text-2xl font-semibold text-[var(--color-text-default)]">
  //     {value}
  //     {hint && (
  //       <span className="ml-0.5 text-base font-normal text-[var(--color-text-muted)]">
  //         {hint}
  //       </span>
  //     )}
  //   </div>
  // </div>

  <div
    className={cn(
      "border-border-default box flex w-full flex-col gap-4 rounded-md border px-3 py-4 md:gap-5 md:p-6",
      className,
    )}
  >
    <div className="flex items-center gap-2">
      {icon}
      <div className="text-text-muted text-xs font-medium capitalize">
        {label}
      </div>
    </div>

    <div className="text-2xl font-semibold text-[var(--color-text-default)]">
      {value}
      {hint && (
        <span className="ml-0.5 text-base font-normal text-[var(--color-text-muted)]">
          {hint}
        </span>
      )}
    </div>
  </div>
);
