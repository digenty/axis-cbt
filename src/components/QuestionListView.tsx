"use client";

import { useState } from "react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
	arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Search,
	Plus,
	ChevronDown,
	ChevronUp,
	Trash2,
	Copy,
	GripVertical,
} from "lucide-react";
import { useCBTStore } from "@/store";
import { Question } from "@/types";
import {
	getQuestionTypeLabel,
	getQuestionTypeBadgeColor,
	cn,
} from "@/lib/utils";
import { FolderOpen } from "lucide-react";
import { ConfirmModal } from "./Modal";

interface QuestionListViewProps {
	topicId: string;
	topicName: string;
	onAddQuestion: () => void;
	onEditQuestion: (question: Question) => void;
}

export const QuestionListView = ({
	topicId,
	topicName,
	onAddQuestion,
	onEditQuestion,
}: QuestionListViewProps) => {
	const { getQuestionsByTopic, reorderQuestions } = useCBTStore();
	const [search, setSearch] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const questions = getQuestionsByTopic(topicId);
	const filtered = search
		? questions.filter((q) =>
				q.text.toLowerCase().includes(search.toLowerCase()),
			)
		: questions;

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIdx = questions.findIndex((q) => q.id === active.id);
		const newIdx = questions.findIndex((q) => q.id === over.id);
		const reordered = arrayMove(questions, oldIdx, newIdx);
		reorderQuestions(
			topicId,
			reordered.map((q) => q.id),
		);
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

			{/* Questions */}
			<div className="flex-1 overflow-y-auto px-6 py-4">
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<FolderOpen className="mb-3 h-12 w-12 text-gray-200" />
						<p className="mb-1 text-sm font-medium text-gray-500">
							{search
								? `No questions matching "${search}"`
								: "No questions yet"}
						</p>
						<p className="mb-5 text-xs text-gray-400">
							{search
								? "Try a different search term"
								: "Questions added under this topic will appear here"}
						</p>
						{!search && (
							<button
								onClick={onAddQuestion}
								className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
							>
								<Plus className="h-3.5 w-3.5" />
								Add Question
							</button>
						)}
					</div>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={filtered.map((q) => q.id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-2">
								{filtered.map((question, idx) => (
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
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				)}

				{filtered.length > 0 && (
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

// ─── Sortable Question Card ───────────────────────────────────────────────────
interface SortableQuestionCardProps {
	question: Question;
	index: number;
	isExpanded: boolean;
	onToggle: () => void;
	onEdit: () => void;
}

const SortableQuestionCard = ({
	question,
	isExpanded,
	onToggle,
	onEdit,
}: SortableQuestionCardProps) => {
	const { deleteQuestion, duplicateQuestion } = useCBTStore();
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
		await new Promise((r) => setTimeout(r, 300));
		deleteQuestion(question.id);
		setDeleting(false);
		setDeleteOpen(false);
	};

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
					{/* Drag handle */}
					<button
						{...attributes}
						{...listeners}
						className="shrink-0 cursor-grab text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-gray-500 focus:opacity-100 active:cursor-grabbing"
						onClick={(e) => e.stopPropagation()}
						aria-label="Drag to reorder"
					>
						<GripVertical className="h-4 w-4" />
					</button>

					{/* Question text + meta — clicks to expand */}
					<div
						className="min-w-0 flex-1 cursor-pointer"
						onClick={onToggle}
					>
						<p
							className="text-sm leading-snug font-medium text-gray-800"
							dangerouslySetInnerHTML={{ __html: question.text }}
						/>
						<div className="mt-1 flex items-center gap-2">
							<span
								className={cn(
									"rounded-md border px-2 py-0.5 text-xs font-medium",
									getQuestionTypeBadgeColor(question.type),
								)}
							>
								{getQuestionTypeLabel(question.type)}
							</span>
							<span className="text-xs text-gray-400">
								• {question.marks} mark{question.marks !== 1 ? "s" : ""}
							</span>
							{question.type === "question-group" &&
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
							onClick={() => duplicateQuestion(question.id)}
							className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
							title="Duplicate"
						>
							<Copy className="h-3.5 w-3.5" />
						</button>
						<button
							onClick={() => setDeleteOpen(true)}
							className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
							title="Delete"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</div>

					{/* Expand chevron */}
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

				{/* Expanded body - inline editor */}
				{isExpanded && (
					<div className="border-t border-gray-100">
						<InlineQuestionEditor question={question} onEdit={onEdit} />
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

// ─── Inline Question Editor (expanded view) ───────────────────────────────────
const InlineQuestionEditor = ({
	question,
	onEdit,
}: {
	question: Question;
	onEdit: () => void;
}) => {
	const { updateQuestion } = useCBTStore();

	return (
		<div className="space-y-3 bg-gray-50/40 px-4 py-3">
			{/* Question type selector dropdown */}
			<div className="flex flex-wrap items-center gap-3">
				<QuestionTypeDropdown question={question} />
				<div className="ml-auto flex items-center gap-2">
					<button
						onClick={onEdit}
						className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
					>
						Edit Full Question
					</button>
					<div className="flex items-center gap-1.5">
						<span className="text-xs text-gray-500">Marks:</span>
						<input
							type="number"
							min={1}
							value={question.marks}
							onChange={(e) =>
								updateQuestion(question.id, {
									marks: Number(e.target.value),
								})
							}
							className="h-7 w-14 rounded-lg border border-gray-200 text-center text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
				</div>
			</div>

			{/* Options preview */}
			{(question.type === "multiple-choice" ||
				question.type === "multiple-answers") && (
				<OptionsPreview question={question} />
			)}
			{question.type === "true-false" && (
				<TrueFalsePreview question={question} />
			)}
			{question.correctAnswer && (
				<p className="text-xs text-gray-600">
					<span className="font-medium text-gray-700">
						Expected Answer:{" "}
					</span>
					{Array.isArray(question.correctAnswer)
						? question.correctAnswer.join(", ")
						: question.correctAnswer}
				</p>
			)}
			{question.type === "essay" && (
				<p className="text-xs text-gray-400 italic">
					Open-ended essay question
				</p>
			)}

			{/* Duplicate / Delete footer */}
			<div className="flex justify-end gap-2 border-t border-gray-100 pt-1">
				<button
					onClick={() =>
						useCBTStore.getState().duplicateQuestion(question.id)
					}
					className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-100"
				>
					<Copy className="h-3 w-3" />
					Duplicate
				</button>
				<button
					onClick={() => {
						if (confirm("Delete this question?"))
							useCBTStore.getState().deleteQuestion(question.id);
					}}
					className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50"
				>
					<Trash2 className="h-3 w-3" />
					Delete
				</button>
			</div>
		</div>
	);
};

// ─── Question Type Dropdown ───────────────────────────────────────────────────
const SINGLE_TYPES: { type: Question["type"]; label: string }[] = [
	{ type: "multiple-choice", label: "Multiple Choice" },
	{ type: "true-false", label: "True/False" },
	{ type: "essay", label: "Essay" },
	{ type: "fill-in-blank", label: "Fill-in-the-Blank" },
	{ type: "short-answer", label: "Short Answer" },
	{ type: "multiple-answers", label: "Multiple Answers" },
	{ type: "numerical", label: "Numeric Answers" },
];

const QuestionTypeDropdown = ({ question }: { question: Question }) => {
	const { updateQuestion } = useCBTStore();
	const [open, setOpen] = useState(false);
	const [isGroupType] = useState(
		question.type === "question-group" ||
			question.type === "multiple-blanks" ||
			question.type === "matching",
	);

	if (isGroupType) return null;

	return (
		<div className="relative">
			<button
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-100"
			>
				{getQuestionTypeLabel(question.type)}
				<ChevronDown className="h-3.5 w-3.5 text-gray-400" />
			</button>
			{open && (
				<div className="absolute top-full left-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
					{SINGLE_TYPES.map(({ type, label }) => (
						<button
							key={type}
							onClick={() => {
								updateQuestion(question.id, { type });
								setOpen(false);
							}}
							className={cn(
								"w-full px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50",
								question.type === type
									? "font-semibold text-blue-700"
									: "text-gray-700",
							)}
						>
							{label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

// ─── Options Preview ──────────────────────────────────────────────────────────
const OptionsPreview = ({ question }: { question: Question }) => (
	<div className="space-y-1.5">
		{question.options?.map((opt) => (
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

const TrueFalsePreview = ({ question }: { question: Question }) => (
	<div className="flex gap-2">
		{question.options?.map((opt) => (
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
