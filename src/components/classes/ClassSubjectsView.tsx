"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, UserX, Eye, Bell } from "lucide-react";
import { useGetSubjectsByClassId } from "@/hooks/queryHooks/useSubjects";
import { Badge, Button, Skeleton } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ApiClassSubject } from "@/types/subjects";

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
      <div className="overflow-hidden rounded-xl border border-border-default bg-bg-default">
        <div className="grid grid-cols-5 border-b border-border-default bg-bg-subtle px-5 py-3">
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
        <p className="text-text-muted text-sm">
          No subjects found for this class
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-bg-default shadow-sm">
      <Table>
        <TableHeader className="[&_tr]:border-border-default">
          <TableRow className="bg-bg-subtle hover:bg-bg-subtle border-border-default">
            {COLUMNS.map((col, i) => (
              <TableHead
                key={i}
                className="px-5 py-3 text-xs font-medium text-text-muted"
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
      <span className="text-text-default text-sm font-medium">{subject?.name}</span>
    ),

    () => (
      <div className="flex items-center gap-2">
        {subject?.teacherName ? (
          <>
            <div className="bg-bg-basic-blue-subtle flex h-6 w-6 items-center justify-center rounded-full">
              <User className="text-icon-informative h-3 w-3" />
            </div>
            <span className="text-text-subtle text-sm">
              {subject?.teacherName ?? "-"}
            </span>
          </>
        ) : (
          <>
            <div className="bg-bg-subtle flex h-6 w-6 items-center justify-center rounded-full">
              <UserX className="text-text-muted h-3 w-3" />
            </div>
            <Badge className="border-border-warning bg-bg-basic-amber-subtle text-text-warning">
              Unassigned
            </Badge>
          </>
        )}
      </div>
    ),

    () => (
      <span className="text-text-subtle text-sm">
        {subject?.questionsInBank ?? 0}
      </span>
    ),

    () => (
      <span className="text-text-subtle text-sm">
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
    <TableRow className="hover:bg-bg-subtle/70 border-border-default">
      {cells.map((renderCell, i) => (
        <TableCell key={i} className="px-5 py-3.5">
          {renderCell()}
        </TableCell>
      ))}
    </TableRow>
  );
};
