"use client";

import { GradeAttemptView } from "@/components/results/GradeAttemptView";
import { use } from "react";

export default function GradeAttemptPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string; attemptId: string }>;
}) {
	const { classId, subjectId } = use(params);

	return (
		<GradeAttemptView
			// attempt={attempt}
			classId={classId}
			subjectId={subjectId}
		/>
	);
}
