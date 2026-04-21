"use client";

import Image from "next/image";
import { useState } from "react";
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
          "border-border-default bg-bg-sidebar-subtle relative hidden h-screen overflow-y-auto overflow-x-hidden border-r p-4 md:flex md:flex-col md:space-y-8",
          isSidebarOpen ? "w-[276px]" : "w-16",
        )}
      >
        {/* Logo + toggle */}
        <div
          className={cn(
            "flex shrink-0",
            isSidebarOpen ? "justify-between" : "justify-center",
          )}
        >
          {isSidebarOpen && (
            <Image
              src="/icons/Logomark.svg"
              width={65}
              height={27}
              alt="Axis logo"
            />
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
                  width={32}
                  height={14}
                  alt="Axis logo"
                />
              ) : (
                <LeadIcon fill={ICON_COLOR} className="size-5 rotate-180" />
              )}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.cbt;
            return (
              <a
                key={item.key}
                href={
                  item.cbt
                    ? "/dashboard"
                    : item.key === "dashboard"
                      ? `${mainAppUrl}/staff`
                      : `${mainAppUrl}/staff/${item.key}`
                }
                className={cn(
                  "flex cursor-pointer items-center gap-[11px] rounded-md px-2 py-2 transition-colors",
                  !isSidebarOpen && "justify-center px-0",
                  isActive ? "bg-bg-state-soft" : "hover:bg-bg-state-soft",
                )}
              >
                <item.icon fill={ICON_COLOR} />
                {isSidebarOpen && (
                  <span className="text-text-subtle truncate text-sm font-medium leading-5">
                    {item.title}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer — sign out */}
        <div className="shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full cursor-pointer items-center gap-[11px] py-2",
              !isSidebarOpen && "justify-center",
            )}
          >
            <Logout fill={ICON_COLOR} />
            {isSidebarOpen && (
              <span className="text-text-subtle text-sm font-medium leading-5">
                Sign out
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
