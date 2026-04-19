"use client";

import React, { Suspense } from "react";
import { Header } from "./Header";
import { Spinner } from "./ui";

export default function Layout({
  children,
  href,
<<<<<<< HEAD
  title,
  subtitle,
  controls,
}: Readonly<{
  children: React.ReactNode;
  href?: string;
  title?: string;
  subtitle?: string;
  controls?: React.ReactNode;
=======
}: Readonly<{
  children: React.ReactNode;
  href?: string;
>>>>>>> new-cbt
}>) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <div className="bg-bg-default fixed inset-0 flex overflow-hidden leading-5">
        <div className="flex min-h-0 flex-1 flex-col">
<<<<<<< HEAD
          <Header
            href={href}
            title={title}
            subtitle={subtitle}
            controls={controls}
          />
=======
          <Header href={href} />
>>>>>>> new-cbt
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
        </div>
      </div>
    </Suspense>
  );
}
