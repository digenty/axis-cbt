"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	MessageSquare,
	Monitor,
	Pencil,
	Plus,
	Star,
	Trash2,
	Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateTestModal } from "./CreateTestModal";
import { DeleteTestModal } from "./DeleteTestModal";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import {
	useGetAssessments,
	usePublishAssessment,
} from "@/hooks/queryHooks/useAssessment";
import type {
	ApiAssessment,
	ApiAssessmentSummary,
	AssessmentStatus,
} from "@/types/assessment";
import { TERM_LABELS, TEST_TYPE_LABELS } from "@/types/assessment";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TestListViewProps {
	subjectId: number;
	classId: number;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
	AssessmentStatus,
	{ label: string; icon: React.ElementType; className: string }
> = {
	PUBLISHED: {
		label: "Published",
		icon: Upload,
		className: "bg-green-50 text-green-700 border-green-200",
	},
	DRAFT: {
		label: "Draft",
		icon: FileText,
		className: "bg-gray-100 text-gray-600 border-gray-200",
	},
	ONGOING: {
		label: "Ongoing",
		icon: Clock,
		className: "bg-blue-50 text-blue-700 border-blue-200",
	},
	COMPLETED: {
		label: "Completed",
		icon: CheckCircle2,
		className: "bg-purple-50 text-purple-700 border-purple-200",
	},
	ARCHIVED: {
		label: "Archived",
		icon: FileText,
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TestListView = ({ subjectId, classId }: TestListViewProps) => {
	const router = useRouter();
	const [createOpen, setCreateOpen] = useState(false);
	const [editingAssessment, setEditingAssessment] =
		useState<ApiAssessmentSummary | null>(null);
	const [deletingAssessment, setDeletingAssessment] =
		useState<ApiAssessmentSummary | null>(null);

	const { data: classDetailsResponse } = useGetClassDetails(classId);
	const classDetails = classDetailsResponse?.data;
	const branchId = classDetails?.branchId;

	const {
		data: assessmentsResponse,
		isLoading,
		refetch,
	} = useGetAssessments({
		classId,
		subjectId,
		branchId: branchId ?? 0,
	});

	const assessments: ApiAssessmentSummary[] =
		(assessmentsResponse?.data as ApiAssessmentSummary[]) ?? [];

	const { mutateAsync: publishAssessment } = usePublishAssessment();

	useEffect(() => {
		if (branchId) refetch();
	}, [branchId, refetch]);

	const handleSaved = (assessment: ApiAssessment) => {
		setCreateOpen(false);
		setEditingAssessment(null);
		if (!editingAssessment) {
			router.push(
				`/classes/${classId}/subjects/${subjectId}/assessments/${assessment.uuid}`,
			);
		}
	};

	const handlePublish = async (uuid: string) => {
		try {
			await publishAssessment(uuid);
		} catch {
			// error handled inside hook
		}
	};

	return (
		<>
			<div>
				{/* Header */}
				<div className="mb-5 flex items-center justify-between">
					<h1 className="text-lg font-bold text-gray-900">CBT</h1>
					<button
						type="button"
						onClick={() => setCreateOpen(true)}
						className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						<Plus className="h-4 w-4" />
						Create New Test
					</button>
				</div>

				{/* Body */}
				{isLoading ? (
					<div className="flex items-center justify-center py-24">
						<span className="h-7 w-7 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
					</div>
				) : !assessments.length ? (
					<EmptyState onCreate={() => setCreateOpen(true)} />
				) : (
					<div className="space-y-3">
						{assessments.map((assessment) => (
							<AssessmentCard
								key={assessment.uuid}
								assessment={assessment}
								onEdit={() => setEditingAssessment(assessment)}
								onDelete={() => setDeletingAssessment(assessment)}
								onPublish={() => handlePublish(assessment.uuid)}
								onClick={() =>
									router.push(
										`/classes/${classId}/subjects/${subjectId}/assessments/${assessment.uuid}`,
									)
								}
							/>
						))}
					</div>
				)}
			</div>

			{/* Create / Edit modal */}
			{branchId && (
				<CreateTestModal
					open={createOpen || !!editingAssessment}
					onClose={() => {
						setCreateOpen(false);
						setEditingAssessment(null);
					}}
					classId={classId}
					subjectId={subjectId}
					branchId={branchId}
					editAssessment={editingAssessment}
					onSaved={handleSaved}
				/>
			)}

			{/* Delete modal */}
			<DeleteTestModal
				open={!!deletingAssessment}
				testTitle={deletingAssessment?.name ?? ""}
				onClose={() => setDeletingAssessment(null)}
				onConfirm={() => setDeletingAssessment(null)} // wire DELETE endpoint when available
			/>
		</>
	);
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
	<div className="flex flex-col items-center justify-center py-24 text-center">
		<svg
			className="mb-4 h-14 w-14 text-gray-200"
			viewBox="0 0 56 56"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<path d="M28 4L52 18V38L28 52L4 38V18L28 4Z" />
			<path d="M28 4V52M4 18L28 32L52 18" />
		</svg>
		<p className="mb-1 text-sm font-semibold text-gray-600">No Tests Yet</p>
		<p className="mb-4 text-xs text-gray-400">
			Add tests to view and manage their records here.
		</p>
		<button
			type="button"
			onClick={onCreate}
			className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
		>
			<Plus className="h-4 w-4" />
			Create New Test
		</button>
	</div>
);

// ─── Assessment card ──────────────────────────────────────────────────────────

const AssessmentCard = ({
	assessment,
	onEdit,
	onDelete,
	onPublish,
	onClick,
}: {
	assessment: ApiAssessmentSummary;
	onEdit: () => void;
	onDelete: () => void;
	onPublish: () => void;
	onClick: () => void;
}) => {
	const cfg = STATUS_CONFIG[assessment.status];
	const StatusIcon = cfg.icon;

	return (
		<div
			className="group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm"
			onClick={onClick}
		>
			{/* Icon */}
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500">
				<Monitor className="h-5 w-5 text-white" />
			</div>

			{/* Info */}
			<div className="min-w-0 flex-1">
				<div className="mb-0.5 flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-900">
						{assessment.name}
					</span>
					<span
						className={cn(
							"flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
							cfg.className,
						)}
					>
						<StatusIcon className="h-3 w-3" />
						{cfg.label}
					</span>
				</div>

				<p className="mb-1 text-xs text-gray-400">
					{TERM_LABELS[assessment.term]}
				</p>

				<div className="flex flex-wrap items-center gap-3">
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<MessageSquare className="h-3 w-3 text-gray-400" />
						{assessment.questionCount ?? 0} question
						{(assessment.questionCount ?? 0) !== 1 ? "s" : ""}
					</span>
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
						{assessment.totalMarks} marks
					</span>
					{assessment.durationMinutes && (
						<span className="flex items-center gap-1 text-xs text-gray-500">
							<Clock className="h-3 w-3 text-gray-400" />
							{assessment.durationMinutes} min
						</span>
					)}
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<FileText className="h-3 w-3 text-gray-400" />
						{TEST_TYPE_LABELS[assessment.testType]}
					</span>
					{assessment.startDateTime && (
						<span className="flex items-center gap-1 text-xs text-gray-500">
							<Calendar className="h-3 w-3 text-gray-400" />
							{new Date(assessment.startDateTime).toLocaleDateString(
								"en-US",
								{ month: "short", day: "numeric", year: "numeric" },
							)}
						</span>
					)}
				</div>
			</div>

			{/* Actions */}
			<div
				className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
				onClick={(e) => e.stopPropagation()}
			>
				{assessment.status === "DRAFT" && (
					<button
						type="button"
						onClick={onPublish}
						title="Publish"
						className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
					>
						<Upload className="h-3.5 w-3.5" />
						Publish
					</button>
				)}
				<button
					type="button"
					onClick={onEdit}
					className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
				>
					<Pencil className="h-4 w-4" />
				</button>
				<button
					type="button"
					onClick={onDelete}
					className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
				>
					<Trash2 className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};
