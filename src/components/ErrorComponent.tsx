"use client";
import { useRouter } from "next/navigation";
import { QuickReferenceAll } from "@/Icons/QuickReferenceAll";
import { Button } from "./ui";

export const ErrorComponent = ({
  title,
  description,
  buttonText,
  url,
}: {
  title: string;
  description: string;
  buttonText?: string;
  url?: string;
}) => {
  const router = useRouter();
  return (
    <div className="flex max-w-80 flex-col items-center gap-4">
      <QuickReferenceAll />
      <p className="text-text-default text-lg font-medium">{title}</p>
      <p className="text-text-muted text-center text-xs font-normal">
        {description}
      </p>
      {buttonText && (
        <Button
          onClick={() => router.push(url ?? "/")}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-sm px-4 py-2"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};
