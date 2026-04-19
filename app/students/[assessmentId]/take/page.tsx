"use client";

import { use } from "react";
import { StudentTestTakerView } from "@/components/students/StudentTestTakerView";

export default function StudentTestTakerPage({
	params,
}: {
	params: Promise<{ assessmentId: string }>;
}) {
	const { assessmentId } = use(params);
	return <StudentTestTakerView assessmentId={assessmentId} />;
}
