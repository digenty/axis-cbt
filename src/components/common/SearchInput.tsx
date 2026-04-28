"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search",
  hint = "/",
  className,
  autoFocus,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hint) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hint]);

  return (
    <div
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-input-soft)] px-3",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-[var(--color-icon-default-muted)]" />
      <input
        ref={inputRef}
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
      />
      {hint && (
        <kbd className="hidden h-5 items-center rounded border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-1.5 text-[10px] text-[var(--color-text-muted)] sm:inline-flex">
          {hint}
        </kbd>
      )}
    </div>
  );
};
