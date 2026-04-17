"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-border-darker data-[state=checked]:border-bg-checkbox-active data-[state=checked]:bg-bg-checkbox-active data-[state=checked]:text-icon-white-default focus-visible:ring-border-highlight aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:bg-bg-checkbox-disabled disabled:text-icon-default-disabled size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:border focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-current transition-none">
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
