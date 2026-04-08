"use client";

import { use, useEffect } from "react";
import { QuestionBankView } from "./QuestionBankView";
import Layout from "./Layout";
import {
	useGetClassDetails,
	useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import { ApiSubject } from "@/api/subjects";

export default function QuestionBank({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) {
	const { classId, subjectId } = use(params);
	console.log({ classId, subjectId });

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
	console.log({ classDetails, getCurrentSubject });

	return (
		<Layout href={`/classes/${classId}/subjects/${subjectId}`}>
			<div className="flex h-[calc(100vh-3rem)] flex-col">
				<div className="mb-4">
					<h1 className="text-base font-semibold text-gray-900">
						Question Bank
					</h1>
					<p className="mt-0.5 text-xs text-gray-400">
						{classDetails?.name} - {getCurrentSubject?.subjectName}
					</p>
				</div>
				<div className="flex-1 overflow-hidden">
					<QuestionBankView
						classId={Number(classId)}
						subjectId={Number(subjectId)}
					/>
				</div>
			</div>
		</Layout>
	);
}
