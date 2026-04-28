"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Receipt,
  Wallet,
  CreditCard,
  Package,
  CircleDollarSign,
  TrendingUp,
  Megaphone,
  Palette,
  Globe,
  Monitor,
} from "lucide-react";
import Home2 from "@/Icons/Home2";
import Group from "@/Icons/Group";
import GraduationCap from "@/Icons/GraduationCap";
import CBTIcon from "@/Icons/CBTIcon";
import CalendarCheck from "@/Icons/CalendarCheck";
import ListCheck3 from "@/Icons/ListCheck3";
import Logout from "@/Icons/Logout";
import { AxisLogo } from "./AxisLogo";
import { useSidebarStore } from "@/store/sidebar-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type NavItem = {
  label: string;
  href?: string;
  matchPrefix?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
};

const mainNav: NavItem[] = [
  { label: "Dashboard", Icon: Home2, disabled: true },
  { label: "Student & Parent Record", Icon: Group, disabled: true },
  { label: "Classes & Subjects", Icon: GraduationCap, disabled: true },
  {
    label: "CBT",
    Icon: CBTIcon,
    href: "/subjects",
    matchPrefix: "/subjects|/classes",
  },
  { label: "Attendance", Icon: CalendarCheck, disabled: true },
  { label: "Admission Management", Icon: ListCheck3, disabled: true },
];

const financeNav: NavItem[] = [
  { label: "Invoices", Icon: Receipt, disabled: true },
  { label: "Fees", Icon: Wallet, disabled: true },
  { label: "Expenses", Icon: CreditCard, disabled: true },
  { label: "Stock", Icon: Package, disabled: true },
  { label: "Fee Collection", Icon: CircleDollarSign, disabled: true },
  { label: "Finance Report", Icon: TrendingUp, disabled: true },
];

const commsNav: NavItem[] = [
  { label: "Communications", Icon: Megaphone, disabled: true },
  { label: "Website Customization", Icon: Palette, disabled: true },
  { label: "Domain", Icon: Globe, disabled: true },
  { label: "Website Overview", Icon: Monitor, disabled: true },
];

const SidebarItem = ({
  item,
  active,
  onDisabledClick,
}: {
  item: NavItem;
  active: boolean;
  onDisabledClick?: () => void;
}) => {
  const className = cn(
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
    active
      ? "bg-[var(--color-bg-state-soft)] font-medium text-[var(--color-text-default)]"
      : "text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)] hover:text-[var(--color-text-default)]",
    item.disabled && "cursor-not-allowed opacity-60",
  );

  const content = (
    <>
      <item.Icon className="h-[18px] w-[18px] shrink-0" fill="currentColor" />
      <span className="truncate">{item.label}</span>
    </>
  );

  if (item.disabled || !item.href) {
    return (
      <button
        type="button"
        className={cn(className, "w-full text-left")}
        onClick={onDisabledClick}
        aria-disabled={item.disabled}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
};

const NavSection = ({
  title,
  items,
  currentPath,
  onDisabledClick,
}: {
  title?: string;
  items: NavItem[];
  currentPath: string;
  onDisabledClick: () => void;
}) => (
  <div className="flex flex-col gap-0.5">
    {title && (
      <div className="px-3 pb-1 pt-3 text-xs font-medium text-[var(--color-text-muted)]">
        {title}
      </div>
    )}
    {items.map((item) => {
      const matchRegex = item.matchPrefix
        ? new RegExp(`^(${item.matchPrefix})`)
        : null;
      const active = !!(
        item.href &&
        (matchRegex
          ? matchRegex.test(currentPath)
          : currentPath.startsWith(item.href))
      );
      return (
        <SidebarItem
          key={item.label}
          item={item}
          active={active}
          onDisabledClick={onDisabledClick}
        />
      );
    })}
  </div>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();

  const handleDisabledClick = () => {
    toast.info("Coming soon", {
      description: "This module isn't part of the CBT preview.",
    });
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-[var(--color-border-default)] bg-[var(--color-bg-sidebar)]",
        "w-[240px]",
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] px-4">
        <AxisLogo />
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="hide-scrollbar flex-1 overflow-y-auto px-3 py-3">
        <NavSection
          items={mainNav}
          currentPath={pathname}
          onDisabledClick={handleDisabledClick}
        />
        <NavSection
          title="Finance"
          items={financeNav}
          currentPath={pathname}
          onDisabledClick={handleDisabledClick}
        />
        <NavSection
          title="Communication & Portal"
          items={commsNav}
          currentPath={pathname}
          onDisabledClick={handleDisabledClick}
        />
      </nav>

      <div className="shrink-0 border-t border-[var(--color-border-default)] px-3 py-3">
        <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--color-text-default)]">
              Setup Guide
            </span>
            <span className="text-[var(--color-text-muted)]">50%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
            <div
              className="h-full rounded-full bg-[var(--green-500)]"
              style={{ width: "50%" }}
            />
          </div>
        </div>
        <button
          type="button"
          className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
          onClick={() =>
            toast.info("Sign out", {
              description: "Auth flow isn't part of the CBT preview.",
            })
          }
        >
          <Logout className="h-[18px] w-[18px]" fill="currentColor" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
