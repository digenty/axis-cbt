"use client";

import { useState } from "react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
	arrayMove,
	// arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Search,
	Plus,
	ChevronDown,
	ChevronUp,
	Trash2,
	// Copy,
	GripVertical,
	FolderOpen,
	Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "./Modal";
import { NormalizedQuestion } from "@/types/question.types";
import {
	useDeleteCbtQuestion,
	useGetCbtQuestions,
} from "@/hooks/queryHooks/useQuestionBank";
import { normalizeApiQuestion } from "@/types/question.mapper";
import { reorderByGroup } from "./reorder";

interface QuestionListViewProps {
	classId: number;
	subjectId: number;
	topicId: number;
	topicName: string;
	onAddQuestion: () => void;
	onEditQuestion: (question: NormalizedQuestion) => void;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
	"multiple-choice": "MCQ",
	"multiple-answers": "Multiple Answers",
	"true-false": "True / False",
	"short-answer": "Short Answer",
	"fill-in-blank": "Fill-in-Blank",
	essay: "Essay",
	numerical: "Numeric",
	matching: "Matching",
	"question-group": "Group",
	"multiple-blanks": "Multiple Blanks",
	"comprehension-passage": "Passage",
};

const QUESTION_TYPE_BADGE_COLORS: Record<string, string> = {
	"multiple-choice": "bg-blue-50 text-blue-700 border-blue-200",
	"multiple-answers": "bg-purple-50 text-purple-700 border-purple-200",
	"true-false": "bg-emerald-50 text-emerald-700 border-emerald-200",
	"short-answer": "bg-amber-50 text-amber-700 border-amber-200",
	"fill-in-blank": "bg-orange-50 text-orange-700 border-orange-200",
	essay: "bg-gray-100 text-gray-700 border-gray-200",
	numerical: "bg-cyan-50 text-cyan-700 border-cyan-200",
	matching: "bg-pink-50 text-pink-700 border-pink-200",
	"question-group": "bg-indigo-50 text-indigo-700 border-indigo-200",
	"multiple-blanks": "bg-teal-50 text-teal-700 border-teal-200",
};

export const QuestionListView = ({
	classId,
	subjectId,
	topicId,
	topicName,
	onAddQuestion,
	onEditQuestion,
}: QuestionListViewProps) => {
	const [search, setSearch] = useState("");
	const [expandedId, setExpandedId] = useState<number | null>(null);

	const { data: questionsResponse, isLoading } = useGetCbtQuestions({
		classId,
		subjectId,
		topicId,
	});

	const questions: NormalizedQuestion[] = (questionsResponse?.data ?? []).map(
		normalizeApiQuestion,
	);

	const filtered = search
		? questions.filter((q) =>
				q.questionText.toLowerCase().includes(search.toLowerCase()),
			)
		: questions;

	console.log({ questions });

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	// Drag-and-drop reordering — optimistic UI only until a reorder API endpoint exists
	const handleDragEnd = (_event: DragEndEvent) => {
		const { active, over } = _event;

		if (!over || active.id === over.id || !filtered) return;

		const oldIdx = filtered?.findIndex((q) => q.id === active.id);
		const newIdx = filtered?.findIndex((q) => q.id === over.id);

		if (oldIdx === -1 || newIdx === -1) return;

		const reordered = arrayMove(filtered, oldIdx, newIdx);

		const orderedIds = reordered.map((q) => q.id); // ✅ FIX

		const reorderToApi = reorderByGroup(
			filtered,
			"topicId",
			topicId,
			orderedIds,
		);

		console.log({ reorderToApi });
	};

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
				<h2 className="text-base font-semibold text-gray-900">
					{topicName}
				</h2>
				<div className="flex items-center gap-3">
					<div className="relative flex items-center">
						<Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-gray-400" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search questions"
							className="h-9 w-52 rounded-lg border border-gray-200 py-2 pr-3 pl-8 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<button
						onClick={onAddQuestion}
						className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						<Plus className="h-4 w-4" />
						Add question
					</button>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto px-6 py-4">
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="h-6 w-6 animate-spin text-gray-300" />
					</div>
				) : filtered?.length === 0 ? (
					<EmptyQuestions search={search} onAdd={onAddQuestion} />
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={filtered?.map((q) => q.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-2">
								{filtered?.map((question, idx) => (
									<SortableQuestionCard
										key={question.id}
										question={question}
										index={idx + 1}
										isExpanded={expandedId === question.id}
										onToggle={() =>
											setExpandedId(
												expandedId === question.id
													? null
													: question.id,
											)
										}
										onEdit={() => onEditQuestion(question)}
										classId={classId}
										subjectId={subjectId}
										topicId={topicId}
										badgeColors={QUESTION_TYPE_BADGE_COLORS}
										typeLabels={QUESTION_TYPE_LABELS}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				)}

				{filtered?.length > 0 && (
					<button
						onClick={onAddQuestion}
						className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3 text-xs text-gray-400 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500"
					>
						<Plus className="h-3.5 w-3.5" />
						Add Question
					</button>
				)}
			</div>
		</div>
	);
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyQuestions = ({
	search,
	onAdd,
}: {
	search: string;
	onAdd: () => void;
}) => (
	<div className="flex flex-col items-center justify-center py-20 text-center">
		<FolderOpen className="mb-3 h-12 w-12 text-gray-200" />
		<p className="mb-1 text-sm font-medium text-gray-500">
			{search ? `No questions matching "${search}"` : "No questions yet"}
		</p>
		<p className="mb-5 text-xs text-gray-400">
			{search
				? "Try a different search term"
				: "Questions added under this topic will appear here"}
		</p>
		{!search && (
			<button
				onClick={onAdd}
				className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
			>
				<Plus className="h-3.5 w-3.5" />
				Add Question
			</button>
		)}
	</div>
);

// ─── Sortable question card ───────────────────────────────────────────────────

interface SortableQuestionCardProps {
	question: NormalizedQuestion;
	index: number;
	isExpanded: boolean;
	onToggle: () => void;
	onEdit: () => void;
	classId: number;
	subjectId: number;
	topicId: number;
	badgeColors: Record<string, string>;
	typeLabels: Record<string, string>;
}

const SortableQuestionCard = ({
	question,
	isExpanded,
	onToggle,
	onEdit,
	// classId,
	// subjectId,
	// topicId,
	badgeColors,
	typeLabels,
}: SortableQuestionCardProps) => {
	const { mutateAsync: deleteQuestion } = useDeleteCbtQuestion();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: question.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
		zIndex: isDragging ? 10 : undefined,
		position: isDragging ? ("relative" as const) : undefined,
	};

	const handleDelete = async () => {
		setDeleting(true);
		await deleteQuestion(question.id);
		setDeleting(false);
		setDeleteOpen(false);
	};

	const badgeColor =
		badgeColors[question.questionType] ??
		"bg-gray-100 text-gray-700 border-gray-200";
	const typeLabel =
		typeLabels[question.questionType] ?? question.questionType.toUpperCase();

	return (
		<>
			<div
				ref={setNodeRef}
				style={style}
				className={cn(
					"overflow-hidden rounded-xl border bg-white transition-all",
					isExpanded ? "border-blue-200 shadow-sm" : "border-gray-200",
					isDragging && "shadow-lg ring-2 ring-blue-300",
				)}
			>
				{/* Card header */}
				<div className="group flex items-center gap-2 px-4 py-3">
					<button
						{...attributes}
						{...listeners}
						className="shrink-0 cursor-grab text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-gray-500 focus:opacity-100 active:cursor-grabbing"
						onClick={(e) => e.stopPropagation()}
					>
						<GripVertical className="h-4 w-4" />
					</button>

					<div
						className="min-w-0 flex-1 cursor-pointer"
						onClick={onToggle}
					>
						<p className="text-sm leading-snug font-medium text-gray-800">
							{question.questionText}
						</p>
						<div className="mt-1 flex items-center gap-2">
							<span
								className={cn(
									"rounded-md border px-2 py-0.5 text-xs font-medium",
									badgeColor,
								)}
							>
								{typeLabel}
							</span>
							<span className="text-xs text-gray-400">
								• {question.marks} mark{question.marks !== 1 ? "s" : ""}
							</span>
							{question.questionType === "question-group" &&
								question.subQuestions && (
									<span className="text-xs text-gray-400">
										• {question.subQuestions.length} questions
									</span>
								)}
						</div>
					</div>

					{/* Actions */}
					<div
						className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={onEdit}
							className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
							title="Edit"
						>
							<svg
								className="h-3.5 w-3.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
						</button>
						<button
							onClick={() => setDeleteOpen(true)}
							className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
							title="Delete"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</div>

					<button
						onClick={onToggle}
						className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
					>
						{isExpanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</button>
				</div>

				{/* Expanded preview */}
				{isExpanded && (
					<div className="border-t border-gray-100">
						<QuestionPreview question={question} onEdit={onEdit} />
					</div>
				)}
			</div>

			<ConfirmModal
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				onConfirm={handleDelete}
				title="Delete Question"
				description="Are you sure you want to delete this question? This action cannot be undone."
				confirmLabel="Delete"
				confirmVariant="danger"
				loading={deleting}
			/>
		</>
	);
};

// ─── Question preview (expanded) ─────────────────────────────────────────────

const QuestionPreview = ({
	question,
	onEdit,
}: {
	question: NormalizedQuestion;
	onEdit: () => void;
}) => (
	<div className="space-y-3 bg-gray-50/40 px-4 py-3">
		<div className="flex items-center justify-end">
			<button
				onClick={onEdit}
				className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
			>
				Edit Question
			</button>
		</div>

		{(question.questionType === "multiple-choice" ||
			question.questionType === "multiple-answers") &&
			question.options && <OptionsPreview options={question.options} />}

		{question.questionType === "true-false" && question.options && (
			<TrueFalsePreview options={question.options} />
		)}

		{question.correctAnswer && (
			<p className="text-xs text-gray-600">
				<span className="font-medium text-gray-700">Expected Answer: </span>
				{Array.isArray(question.correctAnswer)
					? question.correctAnswer.join(", ")
					: question.correctAnswer}
			</p>
		)}

		{question.questionType === "essay" && (
			<p className="text-xs text-gray-400 italic">
				Open-ended essay question
			</p>
		)}

		{question.questionType === "question-group" && question.subQuestions && (
			<div className="space-y-1">
				<p className="text-xs font-medium text-gray-600">
					Sub-questions ({question.subQuestions.length}):
				</p>
				{question.subQuestions.slice(0, 3).map((sq, idx) => (
					<p key={sq.id} className="text-xs text-gray-500">
						{idx + 1}. {sq.questionText || <em>Untitled</em>}
					</p>
				))}
				{question.subQuestions.length > 3 && (
					<p className="text-xs text-gray-400">
						+{question.subQuestions.length - 3} more…
					</p>
				)}
			</div>
		)}
	</div>
);

const OptionsPreview = ({
	options,
}: {
	options: NormalizedQuestion["options"];
}) => (
	<div className="space-y-1.5">
		{options?.map((opt) => (
			<div
				key={opt.id}
				className={cn(
					"flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs",
					opt.isCorrect
						? "border-green-200 bg-green-50 text-green-800"
						: "border-gray-200 bg-white text-gray-700",
				)}
			>
				<div
					className={cn(
						"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
						opt.isCorrect
							? "border-green-500 bg-green-500"
							: "border-gray-300",
					)}
				>
					{opt.isCorrect && (
						<div className="h-1.5 w-1.5 rounded-full bg-white" />
					)}
				</div>
				<span className="w-4 font-mono text-gray-400 uppercase">
					{opt.id}.
				</span>
				<span>{opt.text || <em className="text-gray-300">Empty</em>}</span>
				{opt.isCorrect && (
					<span className="ml-auto text-xs font-medium text-green-600">
						✓ Correct
					</span>
				)}
			</div>
		))}
	</div>
);

const TrueFalsePreview = ({
	options,
}: {
	options: NormalizedQuestion["options"];
}) => (
	<div className="flex gap-2">
		{options?.map((opt) => (
			<span
				key={opt.id}
				className={cn(
					"rounded-full border px-4 py-1.5 text-xs font-medium",
					opt.isCorrect
						? "border-green-300 bg-green-50 text-green-700"
						: "border-gray-200 bg-white text-gray-500",
				)}
			>
				{opt.text}
				{opt.isCorrect && " ✓"}
			</span>
		))}
	</div>
);
