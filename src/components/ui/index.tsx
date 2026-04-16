"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ─── Button ─────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none";

    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
      secondary:
        "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400 disabled:opacity-50",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 disabled:opacity-50",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50",
      outline:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400 disabled:opacity-50",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 h-7",
      md: "text-sm px-4 py-2 h-9",
      lg: "text-sm px-5 py-2.5 h-11",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
Button.displayName = "Button";

// ─── Badge ───────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}
export const Badge = ({ children, className }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
      className,
    )}
  >
    {children}
  </span>
);

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const s = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" }[size];
  return <Loader2 className={cn(s, "animate-spin text-blue-600")} />;
};

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="w-full flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="mb-4 text-gray-300">{icon}</div>}
    <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
    {description && (
      <p className="mb-4 max-w-xs text-xs text-gray-400">{description}</p>
    )}
    {action}
  </div>
);

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: React.ReactNode;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftAddon, ...props }, ref) => (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-600">{label}</label>
      )}
      <div className="relative flex items-center">
        {leftAddon && (
          <div className="absolute left-3 text-gray-400">{leftAddon}</div>
        )}
        <input
          ref={ref}
          className={cn(
            "h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
            leftAddon && "pl-9",
            error && "border-red-400 focus:ring-red-400",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  ),
);
Input.displayName = "Input";

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}
export const Modal = ({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) => {
  if (!open) return null;
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "animate-in fade-in zoom-in-95 relative mx-4 w-full overflow-hidden rounded-xl bg-white shadow-2xl duration-150",
          sizes[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <button
              title="close-button"
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// ─── Tooltip ─────────────────────────────────────────────────────────────────
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}
export const Tooltip = ({ content, children }: TooltipProps) => (
  <div className="group relative inline-flex">
    {children}
    <div className="absolute bottom-full left-1/2 z-50 mb-1.5 hidden -translate-x-1/2 group-hover:block">
      <div className="rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg">
        {content}
      </div>
    </div>
  </div>
);

// ─── Skeleton ────────────────────────────────────────────────────────────────
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-gray-100", className)} />
);

// ─── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-600">{label}</label>
      )}
      <select
        ref={ref}
        className={cn(
          "h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
);
Select.displayName = "Select";
