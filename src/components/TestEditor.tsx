"use client";
import { useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
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
import { Test, TestSection, Question, QuestionType } from "@/types";
import { useCBTStore } from "@/store";
import {
	generateId,
	getQuestionTypeLabel,
	getQuestionTypeBadgeColor,
	cn,
} from "@/lib/utils";
import {
	Pencil,
	Upload,
	Save,
	Plus,
	GripVertical,
	ChevronDown,
	ChevronUp,
	BookOpen,
	MessageSquare,
	Star,
	Clock,
	Tag,
} from "lucide-react";
import { AddAssessmentItemModal } from "./AddAssessmentItemModal";
import { SelectFromQuestionBankModal } from "./QuestionBankModal";
import { CreateTestModal } from "./CreateTestModal";

interface TestEditorProps {
	test: Test;
	classId: string;
	className: string;
	subjectName: string;
}

export const TestEditor = ({
	test: initialTest,
	classId,
	className,
	subjectName,
}: TestEditorProps) => {
	//   const router = useRouter();
	const {
		updateTest,
		questions: allQuestions,
		addQuestion,
		getTopicsBySubject,
	} = useCBTStore();
	const [test, setTest] = useState<Test>(initialTest);
	const [editDetailsOpen, setEditDetailsOpen] = useState(false);
	const [addItemModalOpen, setAddItemModalOpen] = useState<{
		sectionId: string;
	} | null>(null);
	const [selectFromBankOpen, setSelectFromBankOpen] = useState<{
		sectionId: string;
	} | null>(null);
	const [saving, setSaving] = useState(false);
	const [publishing, setPublishing] = useState(false);

	// Sync local state + persist
	const updateLocal = useCallback(
		(updater: (t: Test) => Test) => {
			setTest((prev) => {
				const next = updater(prev);
				updateTest(next.id, next);
				return next;
			});
		},
		[updateTest],
	);

	// ── Derived ────────────────────────────────────────────────────────────────
	const allSectionQuestionIds = test.sections.flatMap((s) => s.questionIds);
	const totalQuestions = allSectionQuestionIds.length;
	const totalMarks = allSectionQuestionIds.reduce((sum, qid) => {
		const q = allQuestions.find((q) => q.id === qid);
		return sum + (q?.marks || 0);
	}, 0);

	// ── Section actions ────────────────────────────────────────────────────────
	const addSection = () => {
		updateLocal((t) => ({
			...t,
			sections: [
				...t.sections,
				{
					id: generateId(),
					title: `Section ${String.fromCharCode(65 + t.sections.length)}`,
					instruction: "",
					questionIds: [],
				},
			],
		}));
	};

	const updateSection = (sectionId: string, data: Partial<TestSection>) => {
		updateLocal((t) => ({
			...t,
			sections: t.sections.map((s) =>
				s.id === sectionId ? { ...s, ...data } : s,
			),
		}));
	};

	const reorderSectionQuestions = (
		sectionId: string,
		orderedIds: string[],
	) => {
		updateLocal((t) => ({
			...t,
			sections: t.sections.map((s) =>
				s.id === sectionId ? { ...s, questionIds: orderedIds } : s,
			),
		}));
	};

	const addQuestionsToSection = (sectionId: string, qs: Question[]) => {
		// For questions from bank, they already exist; for new inline questions we add them
		updateLocal((t) => ({
			...t,
			sections: t.sections.map((s) =>
				s.id === sectionId
					? {
							...s,
							questionIds: [
								...s.questionIds,
								...qs
									.map((q) => q.id)
									.filter((id) => !s.questionIds.includes(id)),
							],
						}
					: s,
			),
			totalMarks: totalMarks + qs.reduce((s, q) => s + q.marks, 0),
		}));
	};

	const removeQuestionFromSection = (
		sectionId: string,
		questionId: string,
	) => {
		updateLocal((t) => ({
			...t,
			sections: t.sections.map((s) =>
				s.id === sectionId
					? {
							...s,
							questionIds: s.questionIds.filter(
								(id) => id !== questionId,
							),
						}
					: s,
			),
		}));
	};

	// ── Add inline question (new, not from bank) ───────────────────────────────
	const handleAddNewQuestion = (sectionId: string, type: QuestionType) => {
		const topics = getTopicsBySubject(test.subjectId);
		const topicId = topics[0]?.id || generateId();
		// We'll create a stub question and add to store + section
		// In a real app you'd open the question form in-context; here we create a stub
		const stub: Question = {
			id: generateId(),
			topicId,
			type,
			text: "New question",
			marks: 1,
			options: [
				"multiple-choice",
				"multiple-answers",
				"true-false",
			].includes(type)
				? [
						{ id: "a", text: "", isCorrect: false },
						{ id: "b", text: "", isCorrect: false },
						{ id: "c", text: "", isCorrect: false },
						{ id: "d", text: "", isCorrect: false },
					]
				: undefined,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		addQuestion(stub);
		addQuestionsToSection(sectionId, [stub]);
		setAddItemModalOpen(null);
	};

	const handleSaveDraft = async () => {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 500));
		updateLocal((t) => ({ ...t, status: "draft" }));
		setSaving(false);
	};

	const handlePublish = async () => {
		setPublishing(true);
		await new Promise((r) => setTimeout(r, 600));
		updateLocal((t) => ({ ...t, status: "published" }));
		setPublishing(false);
	};

	// Compute cumulative Q numbering across sections
	let qCounter = 0;
	const sectionStartIndices = test.sections.map((s) => {
		const start = qCounter;
		// eslint-disable-next-line react-hooks/immutability
		qCounter += s.questionIds.length;
		return start;
	});

	return (
		<>
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="mb-4 flex items-start justify-between">
					<h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setEditDetailsOpen(true)}
							className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
						>
							<Pencil className="h-3.5 w-3.5" />
							Edit Details
						</button>
						{test.status !== "published" && (
							<button
								onClick={handleSaveDraft}
								disabled={saving}
								className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
							>
								{saving ? (
									<span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-gray-800" />
								) : (
									<Save className="h-3.5 w-3.5" />
								)}
								Save as Draft
							</button>
						)}
						<button
							onClick={handlePublish}
							disabled={publishing}
							className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
						>
							{publishing ? (
								<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
							) : (
								<Upload className="h-3.5 w-3.5" />
							)}
							Publish Test
						</button>
					</div>
				</div>

				{/* Meta badges */}
				<div className="mb-6 flex flex-wrap items-center gap-2">
					<MetaBadge
						color="blue"
						icon={<BookOpen className="h-3 w-3" />}
						label={`${classId.toUpperCase()} • ${subjectName}`}
					/>
					<MetaBadge
						color="gray"
						icon={<MessageSquare className="h-3 w-3" />}
						label={`${totalQuestions} questions`}
					/>
					<MetaBadge
						color="amber"
						icon={<Star className="h-3 w-3" />}
						label={`${totalMarks} marks`}
					/>
					<MetaBadge
						color="purple"
						icon={<Clock className="h-3 w-3" />}
						label={`${test.duration} minutes`}
					/>
					{test.mappingLabel && (
						<MetaBadge
							color="green"
							icon={<Tag className="h-3 w-3" />}
							label={test.mappingLabel}
						/>
					)}
				</div>

				{/* Sections */}
				<div className="space-y-4">
					{test.sections.map((section, sIdx) => (
						<SectionCard
							key={section.id}
							section={section}
							startIndex={sectionStartIndices[sIdx]}
							allQuestions={allQuestions}
							onUpdateSection={(data) => updateSection(section.id, data)}
							onReorder={(ids) =>
								reorderSectionQuestions(section.id, ids)
							}
							onRemoveQuestion={(qid) =>
								removeQuestionFromSection(section.id, qid)
							}
							onAddQuestion={() =>
								setAddItemModalOpen({ sectionId: section.id })
							}
							onAddFromBank={() =>
								setSelectFromBankOpen({ sectionId: section.id })
							}
						/>
					))}
				</div>

				{/* Add New Section */}
				<button
					onClick={addSection}
					className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3.5 text-sm text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
				>
					<Plus className="h-4 w-4" />
					Add New Section
				</button>
			</div>

			{/* Modals */}
			<AddAssessmentItemModal
				open={!!addItemModalOpen}
				onClose={() => setAddItemModalOpen(null)}
				onSelectType={(type) => {
					handleAddNewQuestion(addItemModalOpen!.sectionId, type);
				}}
				onSelectGroup={() => {
					handleAddNewQuestion(
						addItemModalOpen!.sectionId,
						"question-group",
					);
				}}
				onSelectMultipleBlanks={() => {
					handleAddNewQuestion(
						addItemModalOpen!.sectionId,
						"multiple-blanks",
					);
				}}
				onSelectMatch={() => {
					handleAddNewQuestion(addItemModalOpen!.sectionId, "matching");
				}}
			/>

			{selectFromBankOpen && (
				<SelectFromQuestionBankModal
					open={true}
					subjectId={test.subjectId}
					alreadySelectedIds={allSectionQuestionIds}
					onClose={() => setSelectFromBankOpen(null)}
					onAdd={(qs) => {
						addQuestionsToSection(selectFromBankOpen.sectionId, qs);
						setSelectFromBankOpen(null);
					}}
				/>
			)}

			<CreateTestModal
				open={editDetailsOpen}
				onClose={() => setEditDetailsOpen(false)}
				subjectId={test.subjectId}
				classId={classId}
				className={className}
				subjectName={subjectName}
				editTest={test}
				onSaved={(updated) => {
					updateLocal(() => updated);
					setEditDetailsOpen(false);
				}}
			/>
		</>
	);
};

// ─── Meta badge ───────────────────────────────────────────────────────────────
const MetaBadge = ({
	color,
	icon,
	label,
}: {
	color: string;
	icon: React.ReactNode;
	label: string;
}) => {
	const colors: Record<string, string> = {
		blue: "bg-blue-50   text-blue-700   border-blue-200",
		gray: "bg-gray-100  text-gray-700   border-gray-200",
		amber: "bg-amber-50  text-amber-700  border-amber-200",
		purple: "bg-purple-50 text-purple-700 border-purple-200",
		green: "bg-green-50  text-green-700  border-green-200",
	};
	return (
		<span
			className={cn(
				"flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
				colors[color] || colors.gray,
			)}
		>
			{icon}
			{label}
		</span>
	);
};

// ─── Section Card ─────────────────────────────────────────────────────────────
interface SectionCardProps {
	section: TestSection;
	startIndex: number;
	allQuestions: Question[];
	onUpdateSection: (data: Partial<TestSection>) => void;
	onReorder: (ids: string[]) => void;
	onRemoveQuestion: (qid: string) => void;
	onAddQuestion: () => void;
	onAddFromBank: () => void;
}

const SectionCard = ({
	section,
	startIndex,
	allQuestions,
	onUpdateSection,
	onReorder,
	onRemoveQuestion,
	onAddQuestion,
	onAddFromBank,
}: SectionCardProps) => {
	const [collapsed, setCollapsed] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIdx = section.questionIds.indexOf(active.id as string);
		const newIdx = section.questionIds.indexOf(over.id as string);
		onReorder(arrayMove(section.questionIds, oldIdx, newIdx));
	};

	const sectionQs = section.questionIds
		.map((id) => allQuestions.find((q) => q.id === id))
		.filter(Boolean) as Question[];

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
			{/* Section header */}
			<div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
				<div className="min-w-0 flex-1">
					<input
						type="text"
						value={section.title}
						onChange={(e) => onUpdateSection({ title: e.target.value })}
						className="w-full border-0 bg-transparent text-base font-semibold text-gray-900 focus:ring-0 focus:outline-none"
					/>
					<input
						type="text"
						value={section.instruction}
						onChange={(e) =>
							onUpdateSection({ instruction: e.target.value })
						}
						placeholder="Instructions (optional)"
						className="mt-0.5 w-full border-0 bg-transparent text-xs text-gray-400 placeholder:text-gray-300 focus:ring-0 focus:outline-none"
					/>
				</div>
				<button
					onClick={() => setCollapsed((v) => !v)}
					className="ml-4 text-gray-400 transition-colors hover:text-gray-600"
				>
					{collapsed ? (
						<ChevronDown className="h-5 w-5" />
					) : (
						<ChevronUp className="h-5 w-5" />
					)}
				</button>
			</div>

			{!collapsed && (
				<div className="px-5 py-4">
					{/* Action buttons */}
					<div className="mb-4 flex items-center gap-2">
						<button
							onClick={onAddQuestion}
							className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
						>
							<Plus className="h-3.5 w-3.5" />
							Add Question
						</button>
						<button
							onClick={onAddFromBank}
							className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							<BookOpen className="h-3.5 w-3.5" />
							Add from Question Bank
						</button>
					</div>

					{/* Questions */}
					{sectionQs.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-10 text-center">
							<p className="mb-1 text-sm text-gray-500">
								No questions yet
							</p>
							<p className="mb-3 text-xs text-gray-400">
								Add question to get started
							</p>
							<button
								onClick={onAddQuestion}
								className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-1.5 text-sm transition-colors hover:bg-gray-50"
							>
								<Plus className="h-3.5 w-3.5" />
								Add Question
							</button>
						</div>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={section.questionIds}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-2">
									{sectionQs.map((q, idx) => (
										<SortableTestQuestion
											key={q.id}
											question={q}
											number={startIndex + idx + 1}
											onRemove={() => onRemoveQuestion(q.id)}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>
					)}

					{/* Bottom add buttons */}
					{sectionQs.length > 0 && (
						<div className="mt-3 grid grid-cols-2 gap-2">
							<button
								onClick={onAddQuestion}
								className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
							>
								<Plus className="h-3.5 w-3.5" />
								Add Question
							</button>
							<button
								onClick={onAddFromBank}
								className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs text-gray-500 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600"
							>
								<BookOpen className="h-3.5 w-3.5" />
								Add from Question Bank
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

// ─── Sortable question row in test ────────────────────────────────────────────
const SortableTestQuestion = ({
	question,
	number,
	onRemove,
}: {
	question: Question;
	number: number;
	onRemove: () => void;
}) => {
	const [expanded, setExpanded] = useState(false);
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
	};

	// Range label for groups
	const qLabel =
		question.type === "question-group" && question.subQuestions?.length
			? `Q${number} - Q${number + question.subQuestions.length - 1}`
			: question.type === "multiple-blanks" && question.blanks?.length
				? `Q${number} - Q${number + question.blanks.length - 1}`
				: `Q${number}`;

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"overflow-hidden rounded-xl border border-gray-200 bg-white transition-all",
				isDragging && "shadow-lg ring-2 ring-blue-200",
			)}
		>
			<div className="group flex items-center gap-3 px-4 py-3">
				<button
					{...attributes}
					{...listeners}
					className="shrink-0 cursor-grab text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:text-gray-500 active:cursor-grabbing"
				>
					<GripVertical className="h-4 w-4" />
				</button>
				<span className="w-12 shrink-0 text-xs font-semibold text-gray-400">
					{qLabel}
				</span>
				<div
					className="min-w-0 flex-1 cursor-pointer"
					onClick={() => setExpanded((v) => !v)}
				>
					<p className="truncate text-sm font-medium text-gray-800">
						{question.text}
					</p>
					<div className="mt-0.5 flex items-center gap-2">
						<span
							className={cn(
								"rounded-md border px-2 py-0.5 text-xs",
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
						{question.type === "multiple-blanks" && question.blanks && (
							<span className="text-xs text-gray-400">
								• {question.blanks.length} Blank Spaces
							</span>
						)}
					</div>
				</div>
				<button
					onClick={() => setExpanded((v) => !v)}
					className="text-gray-400 transition-colors hover:text-gray-600"
				>
					{expanded ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</button>
			</div>

			{expanded && question.options && (
				<div className="space-y-1.5 border-t border-gray-100 bg-gray-50/50 px-10 py-3">
					{question.options.map((opt) => (
						<div
							key={opt.id}
							className={cn(
								"flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
								opt.isCorrect
									? "border-green-200 bg-green-50 text-green-800"
									: "border-gray-200 bg-white text-gray-700",
							)}
						>
							<span className="w-4 font-mono text-gray-400 uppercase">
								{opt.id}.
							</span>
							{opt.text || (
								<em className="text-gray-300">Empty option</em>
							)}
							{opt.isCorrect && (
								<span className="ml-auto font-medium text-green-600">
									✓
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
