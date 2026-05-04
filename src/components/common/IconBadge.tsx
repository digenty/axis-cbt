import { cn } from "@/lib/utils";

export const IconBadge = ({
  color,
  children,
  className,
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "flex size-4.5 items-center justify-center  border border-white/20",
        className,
      )}
      style={{ background: `var(${color})` }}
    >
      {children}
    </span>
  );
};
