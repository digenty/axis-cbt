// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   PanelLeftClose,
//   PanelLeftOpen,
//   Receipt,
//   Wallet,
//   CreditCard,
//   Package,
//   CircleDollarSign,
//   TrendingUp,
//   Megaphone,
//   Palette,
//   Globe,
//   Monitor,
// } from "lucide-react";
// import { Home2, Group, GraduationCap, CalendarCheck, ListCheck3, Logout } from "@digenty/icons";
// import { AxisLogo } from "./AxisLogo";
// import { useSidebarStore } from "@/store/sidebar-store";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";

"use client";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LeadIcon, Line, ListCheck3, Logout } from "@digenty/icons";
import User from "../Icons/User";
import { Tooltip } from "../Tooltip";
import { Button } from "../ui/button";

type Menu = {
  title: string;
  url: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
};

type NavigationType = {
  title: string;
  menu: Menu[];
};

type NavItem = {
  label: string;
  href?: string;
  matchPrefix?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
};

// const mainNav: NavItem[] = [
//   { label: "Dashboard", Icon: Home2, disabled: true },
//   { label: "Student & Parent Record", Icon: Group, disabled: true },
//   { label: "Classes & Subjects", Icon: GraduationCap, disabled: true },
//   {
//     label: "CBT",
//     Icon: CBTIcon,
//     href: "/subjects",
//     matchPrefix: "/subjects|/classes",
//   },
//   { label: "Attendance", Icon: CalendarCheck, disabled: true },
//   { label: "Admission Management", Icon: ListCheck3, disabled: true },
// ];

// const financeNav: NavItem[] = [
//   { label: "Invoices", Icon: Receipt, disabled: true },
//   { label: "Fees", Icon: Wallet, disabled: true },
//   { label: "Expenses", Icon: CreditCard, disabled: true },
//   { label: "Stock", Icon: Package, disabled: true },
//   { label: "Fee Collection", Icon: CircleDollarSign, disabled: true },
//   { label: "Finance Report", Icon: TrendingUp, disabled: true },
// ];

// const commsNav: NavItem[] = [
//   { label: "Communications", Icon: Megaphone, disabled: true },
//   { label: "Website Customization", Icon: Palette, disabled: true },
//   { label: "Domain", Icon: Globe, disabled: true },
//   { label: "Website Overview", Icon: Monitor, disabled: true },
// ];

const navigation = [
  {
    title: "",
    menu: [
      {
        title: "CBT",
        url: "/",
        icon: ListCheck3,
      },

      // ...(canViewStudentParentRecords(user?.permissions)
      //   ? [
      //       {
      //         title: "Student & Parent Record",
      //         url: "student-and-parent-record",
      //         icon: Group,
      //       },
      //     ]
      //   : []),
    ],
  },
];

// const SidebarItem = ({
//   item,
//   active,
//   onDisabledClick,
// }: {
//   item: NavItem;
//   active: boolean;
//   onDisabledClick?: () => void;
// }) => {
//   const className = cn(
//     "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
//     active
//       ? "bg-[var(--color-bg-state-soft)] font-medium text-[var(--color-text-default)]"
//       : "text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)] hover:text-[var(--color-text-default)]",
//     item.disabled && "cursor-not-allowed opacity-60",
//   );

//   const content = (
//     <>
//       <item.Icon className="h-[18px] w-[18px] shrink-0" fill="currentColor" />
//       <span className="truncate">{item.label}</span>
//     </>
//   );

//   if (item.disabled || !item.href) {
//     return (
//       <button
//         type="button"
//         className={cn(className, "w-full text-left")}
//         onClick={onDisabledClick}
//         aria-disabled={item.disabled}
//       >
//         {content}
//       </button>
//     );
//   }

//   return (
//     <Link href={item.href} className={className}>
//       {content}
//     </Link>
//   );
// };

// const NavSection = ({
//   title,
//   items,
//   currentPath,
//   onDisabledClick,
// }: {
//   title?: string;
//   items: NavItem[];
//   currentPath: string;
//   onDisabledClick: () => void;
// }) => (
//   <div className="flex flex-col gap-0.5">
//     {title && (
//       <div className="px-3 pb-1 pt-3 text-xs font-medium text-[var(--color-text-muted)]">
//         {title}
//       </div>
//     )}
//     {items.map((item) => {
//       const matchRegex = item.matchPrefix
//         ? new RegExp(`^(${item.matchPrefix})`)
//         : null;
//       const active = !!(
//         item.href &&
//         (matchRegex
//           ? matchRegex.test(currentPath)
//           : currentPath.startsWith(item.href))
//       );
//       return (
//         <SidebarItem
//           key={item.label}
//           item={item}
//           active={active}
//           onDisabledClick={onDisabledClick}
//         />
//       );
//     })}
//   </div>
// );

export const Sidebar = () => {
  const pathname = usePathname();
  // const { isSidebarOpen, setIsSidebarOpen } = useSidebarStore();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [showLogo, setShowLogo] = useState(true);
  const { setIsSidebarOpen, isSidebarOpen, activeNav, setActiveNav } =
    useSidebarStore();
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   const segments = pathname.split("/");
  //   if (segments[2] === "settings" && segments[3] === "profile") {
  //     setActiveNav("profile");
  //   } else {
  //     setActiveNav(segments[2]);
  //   }
  // }, [pathname, setActiveNav]);

  const logout = () => {
    queryClient.clear();
    // deleteSession();
  };

  const handleDisabledClick = () => {
    toast.info("Coming soon", {
      description: "This module isn't part of the CBT preview.",
    });
  };

  return (
    // <aside
    //   className={cn(
    //     "flex h-screen flex-col border-r border-[var(--color-border-default)] bg-[var(--color-bg-sidebar)]",
    //     "w-[240px]",
    //   )}
    // >
    //   <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] px-4">
    //     <AxisLogo />
    //     <button
    //       type="button"
    //       onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    //       className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-icon-default-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
    //       aria-label="Toggle sidebar"
    //     >
    //       {isSidebarOpen ? (
    //         <PanelLeftClose className="h-4 w-4" />
    //       ) : (
    //         <PanelLeftOpen className="h-4 w-4" />
    //       )}
    //     </button>
    //   </div>

    //   <nav className="hide-scrollbar flex-1 overflow-y-auto px-3 py-3">
    //     <NavSection
    //       items={mainNav}
    //       currentPath={pathname}
    //       onDisabledClick={handleDisabledClick}
    //     />
    //     <NavSection
    //       title="Finance"
    //       items={financeNav}
    //       currentPath={pathname}
    //       onDisabledClick={handleDisabledClick}
    //     />
    //     <NavSection
    //       title="Communication & Portal"
    //       items={commsNav}
    //       currentPath={pathname}
    //       onDisabledClick={handleDisabledClick}
    //     />
    //   </nav>

    //   <div className="shrink-0 border-t border-[var(--color-border-default)] px-3 py-3">
    //     <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-3">
    //       <div className="mb-2 flex items-center justify-between text-sm">
    //         <span className="font-medium text-[var(--color-text-default)]">
    //           Setup Guide
    //         </span>
    //         <span className="text-[var(--color-text-muted)]">50%</span>
    //       </div>
    //       <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
    //         <div
    //           className="h-full rounded-full bg-[var(--green-500)]"
    //           style={{ width: "50%" }}
    //         />
    //       </div>
    //     </div>
    //     <button
    //       type="button"
    //       className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]"
    //       onClick={() =>
    //         toast.info("Sign out", {
    //           description: "Auth flow isn't part of the CBT preview.",
    //         })
    //       }
    //     >
    //       <Logout className="h-[18px] w-[18px]" fill="currentColor" />
    //       Sign Out
    //     </button>
    //   </div>
    // </aside>

    <aside className="h-screen">
      <div
        className={cn(
          "border-border-default bg-bg-sidebar-subtle hide-scrollbar relative hidden h-screen w-69 space-y-4 overflow-y-auto border-r p-4 md:block md:space-y-8",
          !isSidebarOpen && "w-16",
        )}
      >
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
                className="text-icon-default-subtle"
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

        <div className="space-y-5 md:space-y-6">
          {navigation.map((nav: NavigationType) => {
            return (
              <div key={nav.menu[0].title}>
                {!isSidebarOpen && nav.title ? ( // Exclude divider and title for  groups without title
                  <Line fill="var(--color-icon-default-subtle)" />
                ) : (
                  <p className="text-text-subtle text-xs leading-4 font-medium">
                    {nav.title}
                  </p>
                )}

                {nav.menu.map((menu) => {
                  const isActive =
                    activeNav === menu.url ||
                    (!activeNav && menu.title === "Dashboard");
                  return (
                    <Tooltip
                      key={menu.title}
                      description={menu.title}
                      Trigger={
                        <nav
                          className={cn(
                            "flex cursor-pointer items-center gap-[11px] px-2 py-2",
                            !isSidebarOpen && "justify-center px-0",
                            isActive && "bg-bg-state-soft rounded-md",
                          )}
                          onClick={() => router.push(`/staff/${menu.url}`)}
                        >
                          <menu.icon fill="var(--color-icon-default-subtle)" />
                          {isSidebarOpen && (
                            <p className="text-text-subtle text-sm leading-5 font-medium">
                              {menu.title}
                            </p>
                          )}
                        </nav>
                      }
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className={cn("absolute right-4 bottom-4 left-4")}>
          {/* <div className="right-10">{isSidebarOpen && user?.isMain && <SetupGuideProgress />}</div> */}

          <div>
            {/* <Tooltip
              description="Profile"
              Trigger={
                <nav
                  className={cn(
                    "flex cursor-pointer items-center gap-[11px] px-2 py-2",
                    !isSidebarOpen && "justify-center px-0",
                    activeNav === "profile" && "bg-bg-state-soft rounded-md",
                  )}
                  onClick={() => router.push(`/staff/profile`)}
                >
                  <User fill="var(--color-icon-default-subtle)" />
                  {isSidebarOpen && <p className="text-text-subtle text-sm leading-5 font-medium">Profile</p>}
                </nav>
              }
            />

            {canViewSettings(user?.permissions) && (
              <Tooltip
                description="Settings"
                Trigger={
                  <nav
                    className={cn(
                      "flex cursor-pointer items-center gap-[11px] py-2 pr-2 pl-1",
                      !isSidebarOpen && "justify-center px-0",
                      activeNav === "settings" && "bg-bg-state-soft rounded-md",
                    )}
                    onClick={() => router.push(`/staff/settings`)}
                  >
                    <Settings4 fill="var(--color-icon-default-subtle)" />
                    {isSidebarOpen && <p className="text-text-subtle text-sm leading-5 font-medium">Settings</p>}
                  </nav>
                }
              />
            )} */}

            <nav
              onClick={logout}
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
      </div>

      {/* Mobile */}

      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetOverlay className="block md:hidden" />
          <SheetContent
            side="left"
            className="2xs:w-81 hide-scrollbar border-border-default bg-bg-sidebar-subtle text-text-subtle flex h-screen w-69 overflow-y-auto p-4 text-left md:hidden"
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

              {/* <Button variant="ghost" onClick={() => setIsSidebarOpen(false)} className="p-0">
              <CloseLarge fill="var(--color-icon-default-subtle)" />
            </Button> */}
            </div>
            <div className="space-y-5 md:space-y-6">
              {navigation.map((nav: NavigationType) => {
                return (
                  <div key={nav.menu[0].title}>
                    <p className="text-xs leading-4 font-medium">{nav.title}</p>

                    {nav.menu.map((menu) => {
                      const isActive =
                        activeNav === menu.url ||
                        (!activeNav && menu.title === "Dashboard");

                      return (
                        <nav
                          key={menu.title}
                          className={cn(
                            "flex cursor-pointer gap-2.75 p-2",
                            !isSidebarOpen && "justify-center px-0",
                            isActive && "bg-bg-state-soft rounded-md",
                          )}
                          onClick={() => router.push(`/staff/${menu.url}`)}
                        >
                          <menu.icon fill="var(--color-icon-default-subtle)" />
                          <p className="text-sm leading-5 font-medium">
                            {menu.title}
                          </p>
                        </nav>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className={cn("absolute right-4 bottom-4 left-4")}>
              {/* {user?.isMain && (
                <div className="right-10">
                  <SetupGuideProgress />
                </div>
              )} */}

              <div className="space-y-2">
                {/* <nav
                  className={cn(
                    "flex cursor-pointer gap-2.75 p-2",
                    !isSidebarOpen && "justify-center px-0",
                    activeNav === "profile" && "bg-bg-state-soft rounded-md",
                  )}
                  onClick={() => router.push("/staff/profile")}
                >
                  <User fill="var(--color-icon-default-subtle)" />
                  <p className="text-sm leading-5 font-medium">Profile</p>
                </nav>

                {canViewSettings(user?.permissions) && (
                  <nav
                    className={cn(
                      "flex cursor-pointer gap-2.75 p-2",
                      !isSidebarOpen && "justify-center px-0",
                      activeNav === "settings" && "bg-bg-state-soft rounded-md",
                    )}
                    onClick={() => router.push("/staff/settings")}
                  >
                    <Settings4 fill="var(--color-icon-default-subtle)" />
                    <p className="text-sm leading-5 font-medium">Settings</p>
                  </nav>
                )} */}

                <nav
                  onClick={logout}
                  className={cn("flex cursor-pointer gap-2.75 py-2 pr-2")}
                >
                  <Logout fill="var(--color-icon-default-subtle)" />
                  <p className="text-sm leading-5 font-medium">Sign out</p>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </aside>
  );
};
