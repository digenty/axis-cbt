"use client";

import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import { deleteSession } from "@/lib/cookies";
import Home2 from "@/Icons/Home2";
import Group from "@/Icons/Group";
import GraduationCap from "@/Icons/GraduationCap";
import ListCheck3 from "@/Icons/ListCheck3";
import CalendarCheck from "@/Icons/CalendarCheck";
import LeadIcon from "@/Icons/LeadIcon";
import Logout from "@/Icons/Logout";

// ─── Nav items ────────────────────────────────────────────────────────────────

const ICON_COLOR = "var(--color-icon-default-subtle)";

const NAV_ITEMS = [
  { title: "Dashboard", key: "dashboard", icon: Home2, cbt: false },
  {
    title: "Student & Parent Record",
    key: "student-and-parent-record",
    icon: Group,
    cbt: false,
  },
  {
    title: "Classes & Subjects",
    key: "classes-and-subjects",
    icon: GraduationCap,
    cbt: false,
  },
  { title: "CBT", key: "cbt", icon: ListCheck3, cbt: true },
  { title: "Attendance", key: "attendance", icon: CalendarCheck, cbt: false },
] as const;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();
  const [showLogo, setShowLogo] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const mainAppUrl =
    process.env.NEXT_PUBLIC_MAIN_APP_URL?.replace(/\/$/, "") ?? "";

  const handleLogout = () => {
    deleteSession();
    if (mainAppUrl) window.location.href = `${mainAppUrl}/staff`;
  };

  return (
    <aside className="h-screen shrink-0">
      <div
        className={cn(
          "border-border-default bg-bg-sidebar-subtle hide-scrollbar relative hidden h-screen w-69 space-y-4 overflow-y-auto border-r p-4 md:block md:space-y-8",
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
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-0 opacity-70 hover:opacity-100"
            >
              <LeadIcon fill={ICON_COLOR} className="size-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              onMouseEnter={() => setShowLogo(false)}
              onMouseLeave={() => setShowLogo(true)}
              className="p-0 opacity-70 hover:opacity-100"
            >
              {showLogo ? (
                <Image
                  src="/icons/Logomark.svg"
                  width={49}
                  height={20}
                  alt="Axis logo"
                />
              ) : (
                <LeadIcon fill={ICON_COLOR} className="size-5 rotate-180" />
              )}
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="space-y-5 md:space-y-6">
          <div>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.cbt ||
                (!item.cbt &&
                  item.key !== "dashboard" &&
                  pathname.includes(item.key));
              return (
                <nav
                  key={item.key}
                  className={cn(
                    "flex cursor-pointer items-center gap-[11px] px-2 py-2",
                    !isSidebarOpen && "justify-center px-0",
                    isActive && "bg-bg-state-soft rounded-md",
                  )}
                  onClick={() =>
                    item.cbt
                      ? router.push("/subjects")
                      : item.key === "dashboard"
                        ? (window.location.href = `${mainAppUrl}/staff`)
                        : (window.location.href = `${mainAppUrl}/staff/${item.key}`)
                  }
                >
                  <item.icon fill={ICON_COLOR} />
                  {isSidebarOpen && (
                    <p className="text-text-subtle text-sm leading-5 font-medium">
                      {item.title}
                    </p>
                  )}
                </nav>
              );
            })}
          </div>
        </div>

        {/* Footer — sign out */}
        <div className="absolute right-4 bottom-4 left-4">
          <div>
            <nav
              onClick={handleLogout}
              className={cn(
                "flex cursor-pointer items-center gap-[11px] py-2",
                !isSidebarOpen && "justify-center",
              )}
            >
              <Logout fill={ICON_COLOR} />
              {isSidebarOpen && (
                <p className="text-text-subtle text-sm leading-5 font-medium">
                  Sign out
                </p>
              )}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};
