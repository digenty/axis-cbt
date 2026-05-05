"use client";
import { QuickReferenceAll } from "@digenty/icons";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const ErrorComponent = ({
  title,
  description,
  buttonText,
  url,
  buttonStyle,
  onClick,
}: {
  title: string;
  description: string;
  buttonText?: string;
  url?: string;
  buttonStyle?: string;
  onClick?: () => void;
}) => {
  const router = useRouter();
  return (
    <div className="flex max-w-80 flex-col items-center gap-4">
      <QuickReferenceAll stroke="var(--color-icon-default-muted)" />
      <p className="text-text-default text-center text-lg font-medium">
        {title}
      </p>
      <p className="text-text-muted text-center text-xs font-normal">
        {description}
      </p>
      {(buttonText || onClick) && (
        <Button
          onClick={() => (onClick ? onClick() : router.push(url ?? "/staff/"))}
          className={cn(
            "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-sm px-4 py-2",
            buttonStyle,
          )}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};
