"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
  Bell,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/classes", icon: Users, label: "Classes" },
  { href: "/subjects", icon: BookOpen, label: "My Subjects" },
  { href: "/results", icon: BarChart3, label: "Results" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-30 flex h-full w-56 flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <GraduationCap className="h-4.5 w-4.5 text-white" size={18} />
        </div>
        <span className="text-sm font-bold tracking-tight text-gray-900">
          EduTest
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600",
                )}
              />
              {label}
              {active && (
                <ChevronRight className="ml-auto h-3 w-3 text-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to main app */}
      {process.env.NEXT_PUBLIC_MAIN_APP_URL && (
        <div className="border-t border-gray-100 px-3 py-2">
          <a
            href={process.env.NEXT_PUBLIC_MAIN_APP_URL}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Digenty
          </a>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
            DJ
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-900">
              Damilare John
            </p>
            <p className="truncate text-xs text-gray-400">Teacher</p>
          </div>
          <Bell className="h-3.5 w-3.5 text-gray-400" />
        </div>
      </div>
    </aside>
  );
};
