"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCBTStore } from "@/store";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";

export const MySubjectsView = () => {
  const { classes, subjects } = useCBTStore();

  const grouped = useMemo(() => {
    const byName = new Map<
      string,
      { classId: string; className: string; subjectId: string }[]
    >();
    for (const sub of subjects) {
      const cls = classes.find((c) => c.id === sub.classId);
      if (!cls) continue;
      if (!byName.has(sub.name)) byName.set(sub.name, []);
      byName.get(sub.name)!.push({
        classId: cls.id,
        className: cls.name,
        subjectId: sub.id,
      });
    }
    return Array.from(byName.entries()).map(([name, rows]) => ({
      name,
      rows: rows.slice(0, 6),
    }));
  }, [classes, subjects]);

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title="My Subjects" />

      <div className="mt-5 flex flex-col gap-5 max-w-160">
        {grouped.slice(0, 6).map((group) => (
          <section
            key={group.name}
            className="overflow-hidden rounded-xl p-3 bg-bg-muted"
          >
            <header className=" bg-bg-muted px-5 py-3">
              <h2 className="text-base font-semibold text-[var(--color-text-default)]">
                {group.name}
              </h2>
            </header>
            <ul className="border border-border-default bg-bg-card rounded-md">
              {group.rows.map((row) => (
                <li
                  key={`${row.classId}-${row.subjectId}`}
                  className="flex items-center justify-between border-b border-[var(--color-border-default)] px-6 py-5 last:border-b-0"
                >
                  <span className="text-base text-[var(--color-text-default)] font-semibold">
                    {row.className}
                  </span>
                  <Button asChild size="sm" className="h-7 bg-bg-state-primary">
                    <Link
                      href={`/classes/${row.classId}/subjects/${row.subjectId}`}
                    >
                      View Subject
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
