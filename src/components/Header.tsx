"use client";

import Image from "next/image";
import Menu2 from "../Icons/Menu2";
import QuestionFill from "@/Icons/QuestionFill";
import { Button } from "./ui";
import Notification2 from "@/Icons/Notification2";
import { Avatar } from "./Avatar";
import { useSidebarStore } from "@/store/sidebar-store";
import { BackButton } from "./PageHeader";
import { usePathname } from "next/navigation";

export const Header = ({
  href,
  title,
  subtitle,
  controls,
}: {
  href?: string;
  title?: string;
  subtitle?: string;
  controls?: React.ReactNode;
}) => {
  const { setIsSidebarOpen } = useSidebarStore();
  const pathname = usePathname();

  return (
    <header className="border-border-default sticky flex h-16 w-full items-center justify-between border-b px-4 py-4 text-zinc-950 md:px-8">
      {/* Left: back+title (header-mode) OR brand (default) */}
      <div className="hidden items-center gap-3 md:flex">
        {title ? (
          <>
            {pathname !== "/subjects" && <BackButton href={href} />}
            <div>
              <h1 className="text-base font-semibold text-zinc-900">{title}</h1>
              {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
            </div>
          </>
        ) : (
          <span className="text-sm font-semibold text-zinc-900">CBT</span>
        )}
      </div>

      {/* Mobile section */}
      <div className="flex items-center gap-5 md:hidden">
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => {
            setIsSidebarOpen(true);
          }}
        >
          <Menu2 fill="var(--color-icon-default-subtle)" className="size-5" />
        </Button>

        <div className="flex items-center gap-2">
          <Image
            src="/icons/Logomark.svg"
            width={24}
            height={24}
            alt="Digenty logo"
          />
          <p className="text-text-default text-sm font-medium">Digenty</p>
        </div>
      </div>

      {/* Right: optional page controls + help + notification + avatar */}
      <div className="flex items-center gap-3">
        {controls && (
          <div className="hidden items-center gap-2 md:flex">{controls}</div>
        )}
        <Button
          variant="ghost"
          className="border-border-darker hidden h-7 rounded-full border border-dashed px-2! py-0.5! md:flex"
        >
          <QuestionFill fill="var(--color-icon-default-subtle)" />
          <p className="text-text-default text-sm font-medium">Help</p>
        </Button>

        <Button variant="ghost" className="p-0!">
          <Notification2 fill="var(--color-icon-default-subtle)" />
        </Button>

        <div className="border-border-darker rounded-full">
          <Avatar className="size-8" />
        </div>
      </div>
    </header>
  );
};
