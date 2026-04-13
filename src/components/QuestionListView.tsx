/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	ChevronDown,
	ChevronUp,
	FolderOpen,
	GripVertical,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getQuestionTypeBadge, getQuestionTypeLabel } from "@/utils/question";
import { ConfirmModal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import {
	useDeleteCbtQuestion,
	useGetQuestions,
} from "@/hooks/queryHooks/useQuestionBank";
import type { ApiQuestion, QuestionType } from "@/types/question";

// ─── Props ────────────────────────────────────────────────────────────────────

interface QuestionListViewProps {
	classId: number;
	subjectId: number;
	topicId: number;
	topicName: string;
	onAddQuestion: () => void;
	onEditQuestion: (question: ApiQuestion) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

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

	const { data: response, isLoading } = useGetQuestions({
		classId,
		subjectId,
		topicId,
	});
	const questions: ApiQuestion[] = (response?.data ?? []).filter(
		(q) => q.topicId === topicId,
	);

	const filtered = search
		? questions.filter((q) =>
				q.questionText.toLowerCase().includes(search.toLowerCase()),
			)
		: questions;

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

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
						type="button"
						onClick={onAddQuestion}
						className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						<Plus className="h-4 w-4" />
						Add question
					</button>
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 overflow-y-auto px-6 py-4">
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
					</div>
				) : filtered?.length === 0 ? (
					<EmptyQuestions search={search} onAdd={onAddQuestion} />
				) : (
					<>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={() => {
								/* TODO: reorder endpoint */
							}}
						>
							<SortableContext
								items={filtered?.map((q) => q.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-2">
									{filtered?.map((q, idx) => (
										<SortableQuestionCard
											key={q.id}
											question={q}
											index={idx + 1}
											classId={classId}
											subjectId={subjectId}
											isExpanded={expandedId === q.id}
											onToggle={() =>
												setExpandedId(
													expandedId === q.id ? null : q.id,
												)
											}
											onEdit={() => onEditQuestion(q)}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>

						<button
							type="button"
							onClick={onAddQuestion}
							className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3 text-xs text-gray-400 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500"
						>
							<Plus className="h-3.5 w-3.5" />
							Add Question
						</button>
					</>
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
				type="button"
				onClick={onAdd}
				className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
			>
				<Plus className="h-3.5 w-3.5" />
				Add Question
			</button>
		)}
	</div>
);

// ─── Sortable Question Card ───────────────────────────────────────────────────

const SortableQuestionCard = ({
	question,
	// classId,
	// subjectId,
	isExpanded,
	onToggle,
	onEdit,
}: {
	question: ApiQuestion;
	index: number;
	classId: number;
	subjectId: number;
	isExpanded: boolean;
	onToggle: () => void;
	onEdit: () => void;
}) => {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const { mutate: deleteQ, isPending: isDeleting } = useDeleteCbtQuestion();

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

	const qType = question.questionType as QuestionType;

	const handleDelete = () => {
		deleteQ(question.id, {
			onSuccess: () => {
				toast({ title: "Question deleted", type: "success" });
				setDeleteOpen(false);
			},
			onError: (e: unknown) => {
				const msg =
					e && typeof e === "object" && "message" in e
						? String((e as { message: string }).message)
						: "Error deleting";
				toast({ title: msg, type: "error" });
			},
		});
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
					<button
						{...attributes}
						{...listeners}
						type="button"
						className="shrink-0 cursor-grab text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-gray-500 active:cursor-grabbing"
						onClick={(e) => e.stopPropagation()}
					>
						<GripVertical className="h-4 w-4" />
					</button>

					{/* Text + meta — click to expand */}
					<div
						className="min-w-0 flex-1 cursor-pointer"
						onClick={onToggle}
					>
						<p className="text-sm font-medium leading-snug text-gray-800">
							{question?.questionText}
						</p>
						<div className="mt-1 flex flex-wrap items-center gap-2">
							<span
								className={cn(
									"rounded-md border px-2 py-0.5 text-xs font-medium",
									getQuestionTypeBadge(qType),
								)}
							>
								{getQuestionTypeLabel(qType)}
							</span>
							<span className="text-xs text-gray-400">
								• {question?.marks} mark
								{question?.marks !== 1 ? "s" : ""}
							</span>
							{question?.difficultyLevel && (
								<span className="text-xs text-gray-400">
									• {question?.difficultyLevel}
								</span>
							)}
							{(qType === "QUESTION_GROUP" ||
								qType === "COMPREHENSION") &&
								(() => {
									const tsd = question?.typeSpecificData as Extract<
										ApiQuestion["typeSpecificData"],
										| { questionType: "QUESTION_GROUP" }
										| { questionType: "COMPREHENSION" }
									>;
									return tsd?.subQuestions?.length ? (
										<span className="text-xs text-gray-400">
											• {tsd?.subQuestions?.length} sub-question
											{tsd?.subQuestions?.length !== 1 ? "s" : ""}
										</span>
									) : null;
								})()}
						</div>
					</div>

					{/* Hover actions */}
					<div
						className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							onClick={onEdit}
							className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
						>
							<Pencil className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							onClick={() => setDeleteOpen(true)}
							className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</div>

					<button
						type="button"
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

				{isExpanded && (
					<div className="border-t border-gray-100">
						<AnswerPreview question={question} onEdit={onEdit} />
					</div>
				)}
			</div>

			<ConfirmModal
				open={deleteOpen}
				onClose={() => setDeleteOpen(false)}
				onConfirm={handleDelete}
				title="Delete Question"
				description="Are you sure you want to delete this question? This cannot be undone."
				confirmLabel="Delete"
				confirmVariant="danger"
				loading={isDeleting}
			/>
		</>
	);
};

// ─── Answer Preview ───────────────────────────────────────────────────────────

const AnswerPreview = ({
	question,
	onEdit,
}: {
	question: ApiQuestion;
	onEdit: () => void;
}) => {
	const tsd = question.typeSpecificData;

	return (
		<div className="space-y-3 bg-gray-50/50 px-4 py-4">
			{/* MCQ / Multiple Answers */}
			{(tsd?.questionType === "MULTIPLE_CHOICE" ||
				tsd?.questionType === "MULTIPLE_ANSWERS") && (
				<div className="space-y-1.5">
					{tsd?.options?.map((opt) => (
						<div
							key={opt?.optionLabel}
							className={cn(
								"flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs",
								opt?.isCorrect
									? "border-green-200 bg-green-50 text-green-800"
									: "border-gray-200 bg-white text-gray-700",
							)}
						>
							<div
								className={cn(
									"flex h-4 w-4 shrink-0 items-center justify-center border-2",
									tsd?.questionType === "MULTIPLE_ANSWERS"
										? "rounded"
										: "rounded-full",
									opt?.isCorrect
										? "border-green-500 bg-green-500"
										: "border-gray-300",
								)}
							>
								{opt?.isCorrect && (
									<div
										className={cn(
											"bg-white",
											tsd?.questionType === "MULTIPLE_ANSWERS"
												? "h-2 w-2 rounded-sm"
												: "h-1.5 w-1.5 rounded-full",
										)}
									/>
								)}
							</div>
							<span className="w-5 shrink-0 font-mono uppercase text-gray-400">
								{opt?.optionLabel}.
							</span>
							<span className="flex-1">
								{opt?.optionText || (
									<em className="text-gray-300">No text</em>
								)}
							</span>
							{opt?.isCorrect && (
								<span className="ml-auto shrink-0 font-medium text-green-600">
									✓ Correct
								</span>
							)}
						</div>
					))}
				</div>
			)}

			{/* True / False */}
			{tsd?.questionType === "TRUE_FALSE" && (
				<div className="flex gap-2">
					{(["True", "False"] as const).map((label) => {
						const isCorrect =
							label === "True"
								? tsd?.correctAnswer === true
								: tsd?.correctAnswer === false;
						return (
							<span
								key={label}
								className={cn(
									"rounded-full border px-5 py-1.5 text-xs font-medium",
									isCorrect
										? "border-green-300 bg-green-50 text-green-700"
										: "border-gray-200 bg-white text-gray-500",
								)}
							>
								{label}
								{isCorrect && " ✓"}
							</span>
						);
					})}
				</div>
			)}

			{/* Short Answer */}
			{tsd?.questionType === "SHORT_ANSWER" && (
				<AnswerChips
					label="Expected Answers"
					values={tsd?.correctAnswers ?? []}
				/>
			)}

			{/* Fill-in-the-blank */}
			{tsd?.questionType === "FILL_IN_THE_BLANK" && (
				<div className="space-y-2">
					{tsd?.blanks && tsd?.blanks.length > 0 ? (
						tsd?.blanks?.map((blank, i) => (
							<div key={i} className="flex items-start gap-3">
								<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
									{i + 1}
								</span>
								<div className="flex-1">
									<p className="text-xs font-medium text-gray-600">
										{blank?.blankLabel || `Blank ${i + 1}`}
										{blank?.marks
											? ` — ${blank?.marks} mark${blank?.marks !== 1 ? "s" : ""}`
											: ""}
									</p>
									{blank?.correctAnswers?.length ? (
										<div className="mt-1 flex flex-wrap gap-1">
											{blank?.correctAnswers.map((a, j) => (
												<span
													key={j}
													className="rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-xs text-green-700"
												>
													{a}
												</span>
											))}
										</div>
									) : (
										<p className="mt-0.5 text-xs italic text-gray-400">
											No answer set
										</p>
									)}
								</div>
							</div>
						))
					) : (
						<p className="text-xs italic text-gray-400">
							No blanks defined
						</p>
					)}
				</div>
			)}

			{/* Numeric */}
			{tsd?.questionType === "NUMERIC_ANSWER" && (
				<div className="flex flex-wrap gap-3">
					<PreviewField
						label="Answer"
						value={
							tsd?.correctAnswer !== undefined
								? String(tsd?.correctAnswer)
								: "—"
						}
					/>
					{tsd?.tolerance !== undefined && tsd?.tolerance > 0 && (
						<PreviewField
							label="Tolerance (±)"
							value={String(tsd?.tolerance)}
						/>
					)}
					{tsd?.unit && <PreviewField label="Unit" value={tsd?.unit} />}
				</div>
			)}

			{/* Essay */}
			{tsd?.questionType === "ESSAY" && (
				<p className="text-xs italic text-gray-400">
					Open-ended essay — no expected answer defined
				</p>
			)}

			{/* Match */}
			{tsd?.questionType === "MATCH" && (
				<div className="space-y-1.5">
					{tsd?.pairs?.length > 0 ? (
						tsd?.pairs?.map((pair, i) => (
							<div
								key={i}
								className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs"
							>
								<span className="flex-1 text-gray-700">
									{pair?.itemText || "—"}
								</span>
								<span className="shrink-0 text-gray-400">→</span>
								<span className="flex-1 text-right text-gray-700">
									{pair?.matchText || "—"}
								</span>
							</div>
						))
					) : (
						<p className="text-xs italic text-gray-400">
							No pairs defined
						</p>
					)}
				</div>
			)}

			{/* Question Group / Comprehension */}
			{(tsd?.questionType === "QUESTION_GROUP" ||
				tsd?.questionType === "COMPREHENSION") && (
				<div className="space-y-2">
					{(tsd as any)?.stimulusContent && (
						<div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
							<p className="mb-1 text-xs font-medium text-gray-500">
								{tsd?.questionType === "COMPREHENSION"
									? "Comprehension Passage"
									: ((tsd as any)?.stimulusType ?? "Stimulus")}
							</p>
							<p className="line-clamp-4 text-xs text-gray-700">
								{(tsd as any)?.stimulusContent}
							</p>
						</div>
					)}
					{(tsd as any)?.subQuestions?.length > 0 && (
						<div className="space-y-1">
							<p className="text-xs font-medium text-gray-500">
								{(tsd as any)?.subQuestions?.length} Sub-question
								{(tsd as any)?.subQuestions?.length !== 1 ? "s" : ""}
							</p>
							{(tsd as any)?.subQuestions?.map((sq: any, i: number) => (
								<div
									key={i}
									className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs"
								>
									<span className="shrink-0 font-semibold text-gray-400">
										{i + 1}.
									</span>
									<span className="flex-1 text-gray-700">
										{sq?.questionText}
									</span>
									<span className="shrink-0 text-gray-400">
										{sq?.marks} mk
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* Explanation */}
			{question?.explanation && (
				<div className="border-t border-gray-100 pt-3">
					<p className="text-xs text-gray-500">
						<span className="font-semibold text-gray-600">
							Explanation:{" "}
						</span>
						{question?.explanation}
					</p>
				</div>
			)}

			{/* Edit button */}
			<div className="flex justify-end border-t border-gray-100 pt-2">
				<button
					type="button"
					onClick={onEdit}
					className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
				>
					<Pencil className="h-3 w-3" />
					Edit Full Question
				</button>
			</div>
		</div>
	);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AnswerChips = ({
	label,
	values,
}: {
	label: string;
	values: string[];
}) => (
	<div>
		<p className="mb-1.5 text-xs font-medium text-gray-500">{label}</p>
		{values?.length > 0 ? (
			<div className="flex flex-wrap gap-1.5">
				{values?.map((v, i) => (
					<span
						key={i}
						className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
					>
						{v}
					</span>
				))}
			</div>
		) : (
			<p className="text-xs italic text-gray-400">No answers defined</p>
		)}
	</div>
);

const PreviewField = ({ label, value }: { label: string; value: string }) => (
	<div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
		<p className="text-xs text-gray-400">{label}</p>
		<p className="mt-0.5 text-sm font-semibold text-gray-800">{value}</p>
	</div>
);
