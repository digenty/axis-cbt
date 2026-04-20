"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";

export const StudentHeader = () => (
  <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6">
    <div className="flex items-center gap-2">
      <Image src="/icons/Logomark.svg" width={24} height={24} alt="Digenty" />
      <span className="text-sm font-semibold text-gray-900">Digenty</span>
    </div>
    <button className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800">
      <LogOut className="h-4 w-4" />
      Log out
    </button>
  </header>
);
