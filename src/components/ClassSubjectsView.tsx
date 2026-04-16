"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, UserX, Eye, Bell } from "lucide-react";
import { Subject } from "@/types";
import { useCBTStore } from "@/store";
import { Badge, Button, Skeleton } from "./ui";

interface ClassSubjectsViewProps {
  classId: string;
}

export const ClassSubjectsView = ({ classId }: ClassSubjectsViewProps) => {
  const { getSubjectsByClass } = useCBTStore();
  const [loading, setLoading] = useState(true);

  const subjects = getSubjectsByClass(classId);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-0 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
          {["Subject", "Teacher", "Questions in Bank", "Tests", ""].map(
            (col, i) => (
              <Skeleton key={i} className="h-3 w-20" />
            ),
          )}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-0 border-b border-gray-50 px-4 py-3.5"
          >
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-24" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-gray-400">
          No subjects found for this class
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_auto] border-b border-gray-100 bg-gray-50 px-5 py-3">
        {["Subject", "Teacher", "Questions in Bank", "Tests", ""].map(
          (col, i) => (
            <span key={i} className="text-xs font-medium text-gray-500">
              {col}
            </span>
          ),
        )}
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {subjects.map((subject) => (
          <SubjectRow key={subject.id} subject={subject} classId={classId} />
        ))}
      </div>
    </div>
  );
};

const SubjectRow = ({
  subject,
  classId,
}: {
  subject: Subject;
  classId: string;
}) => {
  const [notifying, setNotifying] = useState(false);

  const handleNotify = async () => {
    setNotifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setNotifying(false);
  };

  return (
    <div className="group grid grid-cols-[2fr_2fr_1.5fr_1fr_auto] items-center px-5 py-3.5 transition-colors hover:bg-gray-50/70">
      {/* Subject */}
      <span className="text-sm font-medium text-gray-800">{subject.name}</span>

      {/* Teacher */}
      <div className="flex items-center gap-2">
        {subject.teacherName ? (
          <>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <User className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">{subject.teacherName}</span>
          </>
        ) : (
          <>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
              <UserX className="h-3 w-3 text-gray-400" />
            </div>
            <Badge className="border-amber-200 bg-amber-50 text-amber-600">
              Unassigned
            </Badge>
          </>
        )}
      </div>

      {/* Questions */}
      <span className="text-sm text-gray-700">{subject.questionsInBank}</span>

      {/* Tests */}
      <span className="text-sm text-gray-700">{subject.tests}</span>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-100 transition-opacity group-hover:opacity-100">
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Bell className="h-3 w-3" />}
          loading={notifying}
          onClick={handleNotify}
        >
          Notify Teacher
        </Button>
        <Link href={`/classes/${classId}/subjects/${subject.id}`}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eye className="h-3 w-3" />}
          >
            View
          </Button>
        </Link>
      </div>
    </div>
  );
};
