"use client";

<<<<<<< HEAD
import { GradeAttemptView } from "@/components/GradeAttemptView";
import { useCBTStore } from "@/store";
=======
import { GradeAttemptView } from "@/components/results/GradeAttemptView";
>>>>>>> new-cbt
import { use } from "react";

export default function GradeAttemptPage({
	params,
}: {
	params: Promise<{ classId: string; subjectId: string; attemptId: string }>;
}) {
	const { classId, subjectId, attemptId } = use(params);
	const attempts = useCBTStore((s) => s.attempts);
	const attempt = attempts.find((a) => a.id === attemptId);

	if (!attempt) return null;

	return (
		<GradeAttemptView
			attempt={attempt}
			classId={classId}
			subjectId={subjectId}
		/>
	);
}
