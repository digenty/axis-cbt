"use client";

import { useCBTStore } from "@/store";
import React, { use } from "react";
import { BackButton } from "./PageHeader";
import { SubjectDetailView } from "./SubjectDetailView";

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
		<div className="p-8">
			<BackButton href={`/classes/${classId}`} />
			<div className="mb-5">
				<h1 className="text-lg font-semibold text-gray-900">
					{cls?.name} — {subject?.name || subjectId}
				</h1>
			</div>
			<SubjectDetailView classId={classId} subjectId={subjectId} />
		</div>
	);
};

export default SubjectDetails;
