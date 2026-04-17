"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, UserX, Eye, Bell } from "lucide-react";
import { ApiClassSubject } from "@/api/subjects";
import { useGetSubjectsByClassId } from "@/hooks/queryHooks/useSubjects";
import { Badge, Button, Skeleton } from "./ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";

const COLUMNS = ["Subject", "Teacher", "Questions in Bank", "Tests", ""];

interface ClassSubjectsViewProps {
  classId: string;
}

export const ClassSubjectsView = ({ classId }: ClassSubjectsViewProps) => {
  const { data: response, isLoading } = useGetSubjectsByClassId(
    Number(classId),
  );

  const subjects = response?.data ?? [];

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border-default bg-white">
        <div className="grid grid-cols-5 border-b border-border-default bg-gray-50 px-5 py-3">
          {COLUMNS.map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 border-b border-border-default px-5 py-4"
          >
            {COLUMNS.map((_, j) => (
              <Skeleton key={j} className="h-4 w-24" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!subjects?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-gray-400">
          No subjects found for this class
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-white shadow-sm">
      <Table>
        <TableHeader className="[&_tr]:border-border-default">
          <TableRow className="bg-gray-50 hover:bg-gray-50 border-border-default">
            {COLUMNS.map((col, i) => (
              <TableHead
                key={i}
                className="px-5 py-3 text-xs font-medium text-gray-500"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects?.map((subject) => (
            <SubjectRow key={subject?.id} subject={subject} classId={classId} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const SubjectRow = ({
  subject,
  classId,
}: {
  subject: ApiClassSubject;
  classId: string;
}) => {
  const [notifying, setNotifying] = useState(false);

  const handleNotify = async () => {
    setNotifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setNotifying(false);
  };

  const cells: (() => React.ReactNode)[] = [
    () => (
      <span className="text-sm font-medium text-gray-800">{subject?.name}</span>
    ),

    () => (
      <div className="flex items-center gap-2">
        {subject?.teacherName ? (
          <>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <User className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-sm text-gray-700">
              {subject?.teacherName ?? "-"}
            </span>
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
    ),

    () => (
      <span className="text-sm text-gray-700">
        {subject?.questionsInBank ?? 0}
      </span>
    ),

    () => (
      <span className="text-sm text-gray-700">
        {subject?.assessmentCount ?? 0}
      </span>
    ),

    () => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Bell className="h-3 w-3" />}
          loading={notifying}
          onClick={handleNotify}
        >
          Notify Teacher
        </Button>
        <Link href={`/classes/${classId}/subjects/${subject?.id}`}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eye className="h-3 w-3" />}
          >
            View
          </Button>
        </Link>
      </div>
    ),
  ];

  return (
    <TableRow className="hover:bg-gray-50/70 border-border-default">
      {cells.map((renderCell, i) => (
        <TableCell key={i} className="px-5 py-3.5">
          {renderCell()}
        </TableCell>
      ))}
    </TableRow>
  );
};
