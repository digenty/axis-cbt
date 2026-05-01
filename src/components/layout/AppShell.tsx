"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSidebarStore } from "@/store/sidebar";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  isAdmin?: boolean;
}

export const AppShell = ({
  children,
  title,
  isAdmin = false,
}: AppShellProps) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-default)]">
      <div className="hidden md:block">
        <Sidebar isAdmin={isAdmin} />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar isAdmin={isAdmin} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="hide-scrollbar flex-1 overflow-y-auto bg-[var(--color-bg-default)]">
          {children}
        </main>
      </div>
    </div>
  );
};
