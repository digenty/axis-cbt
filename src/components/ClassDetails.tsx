"use client";

import { use, useEffect } from "react";
import { ClassSubjectsView } from "./ClassSubjectsView";
import Layout from "./Layout";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import { useGetSchools } from "@/hooks/queryHooks/useSchool";
import { ApiSchoolResponse } from "@/api/subjects";
import { BackButton } from "./PageHeader";

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
};

export default ClassDetails;
