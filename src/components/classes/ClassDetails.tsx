"use client";

import { use, useEffect } from "react";
import { ClassSubjectsView } from "./ClassSubjectsView";
import Layout from "@/components/Layout";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import { useGetSchools } from "@/hooks/queryHooks/useSchool";
<<<<<<< HEAD:src/components/ClassDetails.tsx
import { ApiSchoolResponse } from "@/api/subjects";
import { BackButton } from "./PageHeader";
=======
import { ApiSchoolResponse } from "@/types/subjects";
>>>>>>> new-cbt:src/components/classes/ClassDetails.tsx

const ClassDetails = ({
  params,
}: Readonly<{
  params: Promise<{ classId: string }>;
}>) => {
  const { classId } = use(params);

  const { data: classDetailsResponse, refetch } = useGetClassDetails(
    Number(classId),
  );
  const { data: schoolsResponse, refetch: refetchSchool } = useGetSchools();

  useEffect(() => {
    refetch();
    refetchSchool();
  }, [refetch, refetchSchool]);

  const classDetails = classDetailsResponse?.data;
  const schools = schoolsResponse?.data;

  const currentSchool = schools?.find(
    (obj: ApiSchoolResponse) => obj?.id === classDetails?.schoolId,
  );

<<<<<<< HEAD:src/components/ClassDetails.tsx
  return (
    <Layout>
      <div className="mb-6 flex items-center gap-3">
        <BackButton href="/classes" />
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            {classDetails?.name ?? "Class"}
          </h1>
          {currentSchool?.name && (
            <p className="text-xs text-zinc-500">{currentSchool.name}</p>
          )}
        </div>
      </div>
      <ClassSubjectsView classId={classId} />
    </Layout>
  );
=======
	console.log({ classDetails, currentSchool });

	return (
		<Layout href="/classes">
			<div className="mb-5">
				<h1 className="text-lg font-semibold text-gray-900">
					{classDetails?.name || "Class Name"} - {"Subject Name"}
				</h1>
				<p className="mt-0.5 text-sm text-gray-500">
					{currentSchool?.name}
				</p>
			</div>
			<ClassSubjectsView classId={classId} />
		</Layout>
	);
>>>>>>> new-cbt:src/components/classes/ClassDetails.tsx
};

export default ClassDetails;
