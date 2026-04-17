"use client";

import { use, useEffect } from "react";
import { QuestionBankView } from "./QuestionBankView";
import Layout from "./Layout";
import {
	useGetClassDetails,
	useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import { ApiSubject } from "@/api/subjects";
import { Loader2 } from "lucide-react";
import { BackButton } from "./PageHeader";

export default function QuestionBank({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) {
	const { classId, subjectId } = use(params);

	const {
		data: response,
		isFetching: isFetchingSubjectDetails,
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

	const { data: classDetailsResponse, isFetching: isFetchingClassDetails } =
		useGetClassDetails(Number(classId));
	const classDetails = classDetailsResponse?.data;

	const isLoading = isFetchingSubjectDetails || isFetchingClassDetails;

	return (
		<Layout>
			<div className="flex h-[calc(100vh-3rem)] flex-col">
				<div className="mb-4">
					<div className="mb-1 flex items-center gap-3">
						<BackButton
							href={`/classes/${classId}/subjects/${subjectId}`}
						/>
						<div className="">
							<h1 className="text-base font-semibold text-gray-900">
								Question Bank
							</h1>
							<div className="text-xs text-gray-400">
								{isLoading ? (
									<Loader2 className="h-3.5 w-3.5 animate-spin text-gray-300" />
								) : (
									`${classDetails?.name} - ${getCurrentSubject?.subjectName}`
								)}
							</div>
						</div>
					</div>
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
