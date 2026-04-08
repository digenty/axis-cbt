"use client";

import { use, useEffect } from "react";
import { ClassSubjectsView } from "./ClassSubjectsView";
import Layout from "./Layout";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import { useGetSchools } from "@/hooks/queryHooks/useSchool";
import { ApiSchoolResponse } from "@/api/subjects";

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

	console.log({ classDetails, currentSchool });

	return (
		<Layout href="/subjects">
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
};

export default ClassDetails;
