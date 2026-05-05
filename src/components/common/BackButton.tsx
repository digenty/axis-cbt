"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export const BackButton = ({ href, label = "Back" }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => (href ? router.push(href) : router.back())}
      className="h-8 gap-1.5 px-2.5 text-xs font-medium text-[var(--color-text-subtle)]"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
};
