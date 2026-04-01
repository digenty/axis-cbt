"use client";

import { useCBTStore } from "@/store";
import { use } from "react";
import { SubjectDetailView } from "./SubjectDetailView";
import Layout from "./Layout";

const SubjectDetails = ({
	params,
}: Readonly<{
	params: Promise<{ classId: string; subjectId: string }>;
}>) => {
	const { classId, subjectId } = use(params);
	console.log({ classId, subjectId });
	const subject = useCBTStore((s) =>
		s.subjects.find((sub) => sub.id === subjectId),
	);
	const cls = useCBTStore((s) => s.classes.find((c) => c.id === classId));

	return (
		<Layout href={`/classes/${classId}`}>
			<div className="mb-5">
				<h1 className="text-lg font-semibold text-gray-900">
					{cls?.name} — {subject?.name || subjectId}
				</h1>
			</div>
			<SubjectDetailView classId={classId} subjectId={subjectId} />
		</Layout>
	);
};

export default SubjectDetails;
