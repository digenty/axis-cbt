"use client";

import { use } from "react";
import { StudentAssessmentDetailView } from "@/components/students/StudentAssessmentDetailView";

export default function StudentAssessmentDetailPage({
	params,
}: {
	params: Promise<{ assessmentId: string }>;
}) {
	const { assessmentId } = use(params);
	return <StudentAssessmentDetailView assessmentId={assessmentId} />;
}
