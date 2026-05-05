import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

export const Tooltip = ({
  Trigger,
  description,
  side = "right",
}: {
  Trigger: ReactNode | string;
  description: string;
  side?: "top" | "bottom" | "left" | "right";
}) => {
  return (
    <TooltipComponent>
      <TooltipTrigger asChild>{Trigger}</TooltipTrigger>
      <TooltipContent side={side}>
        <p className="text-xs font-medium">{description}</p>
      </TooltipContent>
    </TooltipComponent>
  );
};
