import { LevelType } from "@/types";

export const subjectKeys = {
	mysubjects: ["subjects"] as const,
	// studentsBySubjectClass: (subjectId: number, amrId: number) => [subjectId, amrId, "students"] as const,
	studentsBySubjectClass: ["studentsBySubjectClass"] as const,
	branchClassSubjects: [" branchClassSubjects"],
	addSubject: ["addSubject"] as const,
	deleteSubject: ["deleteSubject"] as const,
	subjectsByLevel: (levelType?: LevelType, branchId?: number) =>
		["subjectsByLevel", levelType, branchId] as const,
	subjectsByClass: (
		className?: string,
		levelType?: string,
		branchId?: number,
	) => ["subjectsByClass", className, levelType, branchId] as const,
};

export const REPORT_STATUS_CONFIG = {
	NOT_SUBMITTED: {
		label: "Not started",
		className: "bg-bg-badge-default text-text-subtle",
	},
	IN_PROGRESS: {
		label: "In Progress",
		className: "bg-bg-badge-orange text-bg-basic-orange-strong",
	},
	SUBMITTED: {
		label: "Submitted",
		className: "bg-bg-badge-green text-bg-basic-green-strong",
	},
	REQUESTED_EDIT_ACCESS: {
		label: "Edit Requested",
		className: "bg-bg-badge-orange text-bg-basic-orange-strong",
	},
} as const;
