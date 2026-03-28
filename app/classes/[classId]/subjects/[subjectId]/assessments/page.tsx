"use client";

import { use } from "react";
import { BackButton } from "@/components/PageHeader";
import { TestListView } from "@/components/TestListView";
import { useCBTStore } from "@/src/store";

export default function AssessmentsPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string }>;
}) {
	const { classId, subjectId } = use(params);
	const cls = useCBTStore((s) => s.classes.find((c) => c.id === classId));
	const subject = useCBTStore((s) =>
		s.subjects.find((sub) => sub.id === subjectId),
	);

	return (
		<div className="p-8">
			<BackButton href={`/classes/${classId}/subjects/${subjectId}`} />
			<TestListView
				subjectId={subjectId}
				classId={classId}
				className={cls?.name || classId}
				subjectName={subject?.name || subjectId}
			/>
		</div>
	);
}
