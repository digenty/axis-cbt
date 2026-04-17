"use client";

import { use, useEffect } from "react";
import { SubjectDetailView } from "./SubjectDetailView";
import Layout from "./Layout";
import {
  useGetClassDetails,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import { ApiSubject } from "@/api/subjects";
import { BackButton } from "./PageHeader";

const SubjectDetails = ({
  params,
}: Readonly<{
  params: Promise<{ classId: string; subjectId: string }>;
}>) => {
  const { classId, subjectId } = use(params);
  console.log({ params });

  const {
    data: response,
    // isLoading,
    // error,
    refetch,
  } = useGetTeacherSubjects();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const subjects: ApiSubject[] = response?.data ?? [];
  const getCurrentSubject = subjects?.find(
    (obj) => obj.subjectId === Number(subjectId),
  );

  const { data: classDetailsResponse } = useGetClassDetails(Number(classId));
  const classDetails = classDetailsResponse?.data;

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-3">
        <BackButton href={`/classes/${classId}`} />
        <h1 className="text-lg font-semibold text-zinc-900">
          {[classDetails?.name, getCurrentSubject?.subjectName]
            .filter(Boolean)
            .join(" ") || "Subject"}
        </h1>
      </div>
      <SubjectDetailView classId={classId} subjectId={subjectId} />
    </Layout>
  );
};

export default SubjectDetails;
