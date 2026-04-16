"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Class } from "@/types";
import { cn } from "@/lib/utils";
import { Input, Skeleton } from "./ui";
import { useCBTStore } from "@/store";

const LEVELS = ["All", "JSS", "SS"];

export const AllClassesView = () => {
  const { classes } = useCBTStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = classes.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === "All" || c.level === level;
    return matchSearch && matchLevel;
  });

  const totalSubjects = classes.reduce((sum, c) => sum + c.totalSubjects, 0);

  return (
    <div>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <StatCard
          label="Total Classes"
          value={classes.length}
          color="green"
          loading={loading}
        />
        <StatCard
          label="Total Subjects"
          value={totalSubjects}
          color="amber"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="mb-5 flex items-center gap-3">
        <Input
          leftAddon={<Search className="h-3.5 w-3.5" />}
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          <SlidersHorizontal className="ml-1 h-3.5 w-3.5 text-gray-400" />
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                level === l
                  ? "bg-blue-600 font-medium text-white"
                  : "text-gray-500 hover:bg-gray-100",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Classes grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="mb-4 h-3 w-16" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-gray-400">
            No classes found for &quot;{search}&quot;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
};

const ClassCard = ({ cls }: { cls: Class }) => (
  <div className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md">
    <div className="mb-2 flex items-start justify-between">
      <h3 className="text-sm font-semibold text-gray-900">{cls.name}</h3>
      <span className="flex items-center gap-1 text-xs text-gray-500">
        <BookOpen className="h-3 w-3 text-gray-400" />
        {cls.totalSubjects} Subjects
      </span>
    </div>
    <p className="mb-4 text-xs text-gray-400">{cls.school}</p>
    <Link href={`/classes/${cls.id}`}>
      <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-sm text-gray-700 transition-all group-hover:border-blue-200 group-hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
        Open
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </Link>
  </div>
);

const StatCard = ({
  label,
  value,
  color,
  loading,
}: {
  label: string;
  value: number;
  color: "green" | "amber";
  loading: boolean;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <div className="mb-2 flex items-center gap-2">
      <div
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          color === "green" ? "bg-green-500" : "bg-amber-400",
        )}
      />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    {loading ? (
      <Skeleton className="h-8 w-12" />
    ) : (
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    )}
  </div>
);
