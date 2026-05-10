"use client";

import {
  Bank,
  Bill,
  Box3,
  CalendarCheck,
  Cash,
  ColorFilter,
  Global,
  GraduationCap,
  Group,
  Home2,
  LeadIcon,
  Line,
  LineChart,
  ListCheck3,
  Logout,
  Macbook,
  Megaphone,
  School,
  Wallet,
} from "@digenty/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Tooltip } from "../Tooltip";
import { Button } from "../ui/button";
import { deleteSession } from "@/lib/cookies";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  title: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  href?: string;
  externalPath?: string;
  matchPrefixes?: string[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

// ─── Nav definitions ──────────────────────────────────────────────────────────

const ADMIN_SECTIONS: NavSection[] = [
  {
    title: "",
    items: [
      { title: "Dashboard", icon: Home2, externalPath: "" },
      {
        title: "Student & Parent Record",
        icon: Group,
        externalPath: "student-and-parent-record",
      },
      {
        title: "Classes & Subjects",
        icon: GraduationCap,
        externalPath: "classes-and-subjects",
      },
      {
        title: "CBT",
        icon: ListCheck3,
        href: "/classes",
        matchPrefixes: ["/classes", "/subjects"],
      },
      { title: "Attendance", icon: CalendarCheck, externalPath: "attendance" },
      {
        title: "Admission Management",
        icon: School,
        externalPath: "admission-management",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      { title: "Invoices", icon: Bill, externalPath: "invoices" },
      { title: "Fees", icon: Wallet, externalPath: "fees" },
      { title: "Expenses", icon: Cash, externalPath: "expenses" },
      { title: "Stock", icon: Box3, externalPath: "stock" },
      { title: "Fee Collection", icon: Bank, externalPath: "fee-collection" },
      {
        title: "Finance Report",
        icon: LineChart,
        externalPath: "finance-report",
      },
    ],
  },
  {
    title: "Communication & Portal",
    items: [
      {
        title: "Communications",
        icon: Megaphone,
        externalPath: "communications",
      },
      {
        title: "Website Customization",
        icon: ColorFilter,
        externalPath: "website-customization",
      },
      { title: "Domain", icon: Global, externalPath: "domain" },
      {
        title: "Website Overview",
        icon: Macbook,
        externalPath: "website-overview",
      },
    ],
  },
];

const TEACHER_SECTIONS: NavSection[] = [
  {
    title: "",
    items: [
      {
        title: "CBT",
        icon: ListCheck3,
        href: "/subjects",
        matchPrefixes: ["/subjects", "/classes"],
      },
    ],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [showLogo, setShowLogo] = useState(true);
  const { setIsSidebarOpen, isSidebarOpen } = useSidebarStore();
  const queryClient = useQueryClient();

  const mainAppUrl =
    process.env.NEXT_PUBLIC_MAIN_APP_URL?.replace(/\/$/, "") ?? "";
  const sections = isAdmin ? ADMIN_SECTIONS : TEACHER_SECTIONS;

  const handleNavClick = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    }
    // else if (item.externalPath !== undefined) {
    //   const base = `${mainAppUrl}/staff`;
    //   window.location.href = item.externalPath
    //     ? `${base}/${item.externalPath}`
    //     : base;
    // }
  };

  const isItemActive = (item: NavItem) => {
    const prefixes = item.matchPrefixes ?? (item.href ? [item.href] : []);
    return prefixes.some((p) => pathname.startsWith(p));
  };

  const handleLogout = () => {
    queryClient.clear();
    deleteSession();
  };

  const renderNavItems = (items: NavItem[], collapsed: boolean) =>
    items.map((item) => (
      <Tooltip
        key={item.title}
        description={item.title}
        Trigger={
          <nav
            className={cn(
              "flex cursor-pointer items-center gap-[11px] px-2 py-2",
              collapsed && "justify-center px-0",
              isItemActive(item) && "bg-bg-state-soft rounded-md",
            )}
            onClick={() => handleNavClick(item)}
          >
            <item.icon fill="var(--color-icon-default-subtle)" />
            {!collapsed && (
              <p className="text-text-subtle text-sm leading-5 font-medium">
                {item.title}
              </p>
            )}
          </nav>
        }
      />
    ));

  const renderSections = (collapsed: boolean) =>
    sections.map((section, i) => (
      <div key={section.title || String(i)}>
        {section.title &&
          (collapsed ? (
            <Line fill="var(--color-icon-default-subtle)" />
          ) : (
            <p className="text-text-subtle mt-3 mb-1 text-xs leading-4 font-medium">
              {section.title}
            </p>
          ))}
        {renderNavItems(section.items, collapsed)}
      </div>
    ));

  return (
    <aside className="h-screen">
      {/* Desktop */}
      <div
        className={cn(
          "border-border-default bg-bg-sidebar-subtle hide-scrollbar relative hidden h-screen w-69 space-y-4 overflow-y-auto border-r p-4 pb-16 md:block md:space-y-8",
          !isSidebarOpen && "w-16",
        )}
      >
        {/* Logo + toggle */}
        <div
          className={cn(
            "flex",
            isSidebarOpen ? "justify-between" : "justify-center",
          )}
        >
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Image
                src="/icons/Logomark.svg"
                width={65}
                height={27}
                alt="Axis logo"
              />
            </div>
          )}
          {isSidebarOpen ? (
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(false)}
              className="p-0"
            >
              <LeadIcon
                fill="var(--color-icon-default-subtle)"
                className="size-5"
              />
            </Button>
          ) : (
            <Tooltip
              description="Expand"
              Trigger={
                <Button
                  variant="ghost"
                  onClick={() => setIsSidebarOpen(true)}
                  onMouseEnter={() => setShowLogo(false)}
                  onMouseLeave={() => setShowLogo(true)}
                  className="p-0"
                >
                  {showLogo ? (
                    <Image
                      src="/icons/Logomark.svg"
                      width={49}
                      height={20}
                      alt="Axis logo"
                    />
                  ) : (
                    <LeadIcon
                      fill="var(--color-icon-default-subtle)"
                      className="size-5 rotate-180"
                    />
                  )}
                </Button>
              }
            />
          )}
        </div>

        {/* Nav */}
        <div className="space-y-1">{renderSections(!isSidebarOpen)}</div>

        {/* Footer */}
        <div className="absolute right-4 bottom-4 left-4">
          <nav
            onClick={handleLogout}
            className={cn(
              "flex cursor-pointer items-center gap-[11px] py-2",
              !isSidebarOpen && "justify-center",
            )}
          >
            <Logout fill="var(--color-icon-default-subtle)" />
            {isSidebarOpen && (
              <p className="text-text-subtle text-sm leading-5 font-medium">
                Sign out
              </p>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile */}
      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetOverlay className="block md:hidden" />
          <SheetContent
            side="left"
            className="2xs:w-81 hide-scrollbar border-border-default bg-bg-sidebar-subtle text-text-subtle flex h-screen w-69 overflow-y-auto p-4 pb-16 text-left md:hidden"
          >
            <VisuallyHidden>
              <SheetHeader className="space-y-3 px-4">
                <SheetTitle>Sidebar</SheetTitle>
              </SheetHeader>
            </VisuallyHidden>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/Logomark.svg"
                  width={65}
                  height={27}
                  alt="Axis logo"
                />
              </div>
            </div>

            <div className="space-y-1">{renderSections(false)}</div>

            <div className="absolute right-4 bottom-4 left-4">
              <nav
                onClick={handleLogout}
                className="flex cursor-pointer gap-2.75 py-2 pr-2"
              >
                <Logout fill="var(--color-icon-default-subtle)" />
                <p className="text-sm leading-5 font-medium">Sign out</p>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </aside>
  );
};
