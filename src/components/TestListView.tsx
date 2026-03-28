"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Test } from "@/types";
import { useCBTStore } from "@/store";
// import { CreateTestModal } from "./create-test-modal";
// import { DeleteTestModal } from "./delete-test-modal";
import { cn } from "@/lib/utils";
import {
	Plus,
	Trash2,
	Pencil,
	Monitor,
	MessageSquare,
	Star,
	Clock,
	Tag,
	Calendar,
	FileText,
	Upload,
	CheckCircle2,
} from "lucide-react";
import { CreateTestModal } from "./CreateTestModal";
import { DeleteTestModal } from "./DeleteTestModal";

interface TestListViewProps {
	subjectId: string;
	classId: string;
	className: string;
	subjectName: string;
}

const STATUS_CONFIG = {
	published: {
		label: "Published",
		icon: Upload,
		className: "bg-green-50 text-green-700 border-green-200",
	},
	draft: {
		label: "Draft",
		icon: FileText,
		className: "bg-gray-100 text-gray-600 border-gray-200",
	},
	completed: {
		label: "Completed",
		icon: CheckCircle2,
		className: "bg-blue-50 text-blue-700 border-blue-200",
	},
};

export const TestListView = ({
	subjectId,
	classId,
	className,
	subjectName,
}: TestListViewProps) => {
	const router = useRouter();
	const { getTestsBySubject, addTest, updateTest, deleteTest } = useCBTStore();
	const [createOpen, setCreateOpen] = useState(false);
	const [editingTest, setEditingTest] = useState<Test | null>(null);
	const [deletingTest, setDeletingTest] = useState<Test | null>(null);

	console.log({ subjectId });

	const tests = getTestsBySubject(subjectId);

	const handleSaveTest = (test: Test) => {
		if (editingTest) {
			updateTest(test.id, test);
		} else {
			addTest(test);
			router.push(
				`/classes/${classId}/subjects/${subjectId}/assessments/${test.id}`,
			);
		}
		setCreateOpen(false);
		setEditingTest(null);
	};

	const handleDelete = async () => {
		if (!deletingTest) return;
		await new Promise((r) => setTimeout(r, 400));
		deleteTest(deletingTest.id);
		setDeletingTest(null);
	};

	return (
		<>
			<div>
				{/* Header */}
				<div className="mb-5 flex items-center justify-between">
					<h1 className="text-lg font-bold text-gray-900">CBT</h1>
					<button
						onClick={() => setCreateOpen(true)}
						className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						<Plus className="h-4 w-4" />
						Create New Test
					</button>
				</div>

				{/* List or empty state */}
				{tests.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-24 text-center">
						{/* Cube icon */}
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
						<p className="mb-1 text-sm font-semibold text-gray-600">
							No Tests Yet
						</p>
						<p className="mb-4 text-xs text-gray-400">
							Add tests to view and manage their records here.
						</p>
						<button
							onClick={() => setCreateOpen(true)}
							className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm transition-colors hover:bg-gray-50"
						>
							<Plus className="h-4 w-4" />
							Create New Test
						</button>
					</div>
				) : (
					<div className="space-y-3">
						{tests.map((test) => (
							<TestCard
								key={test.id}
								test={test}
								onEdit={() => setEditingTest(test)}
								onDelete={() => setDeletingTest(test)}
								onClick={() =>
									router.push(
										`/classes/${classId}/subjects/${subjectId}/assessments/${test.id}`,
									)
								}
							/>
						))}
					</div>
				)}
			</div>

			<CreateTestModal
				open={createOpen || !!editingTest}
				onClose={() => {
					setCreateOpen(false);
					setEditingTest(null);
				}}
				subjectId={subjectId}
				classId={classId}
				className={className}
				subjectName={subjectName}
				editTest={editingTest}
				onSaved={handleSaveTest}
			/>

			<DeleteTestModal
				open={!!deletingTest}
				testTitle={deletingTest?.title || ""}
				onClose={() => setDeletingTest(null)}
				onConfirm={handleDelete}
			/>
		</>
	);
};

// ─── Test card ────────────────────────────────────────────────────────────────
const TestCard = ({
	test,
	onEdit,
	onDelete,
	onClick,
}: {
	test: Test;
	onEdit: () => void;
	onDelete: () => void;
	onClick: () => void;
}) => {
	const cfg = STATUS_CONFIG[test.status];
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

			{/* Main info */}
			<div className="min-w-0 flex-1">
				<div className="mb-0.5 flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-900">
						{test.title}
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
				<p className="mb-1 text-xs text-gray-400">{test.term}</p>
				<div className="flex flex-wrap items-center gap-3">
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<MessageSquare className="h-3 w-3 text-gray-400" />
						{test.sections.reduce(
							(s, sec) => s + sec.questionIds.length,
							0,
						)}{" "}
						questions
					</span>
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
						{test.totalMarks} marks
					</span>
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<Clock className="h-3 w-3 text-gray-400" />
						{test.duration} min
					</span>
					{test.mappingLabel && (
						<span className="flex items-center gap-1 text-xs text-gray-500">
							<Tag className="h-3 w-3 text-gray-400" />
							{test.mappingLabel}
						</span>
					)}
					{test.testDate && (
						<span className="flex items-center gap-1 text-xs text-gray-500">
							<Calendar className="h-3 w-3 text-gray-400" />
							{new Date(test.testDate).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					)}
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<FileText className="h-3 w-3 text-gray-400" />
						{test.testType}
					</span>
				</div>
			</div>

			{/* Actions */}
			<div
				className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onDelete}
					className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
				>
					<Trash2 className="h-4 w-4" />
				</button>
				<button
					onClick={onEdit}
					className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
				>
					<Pencil className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};
