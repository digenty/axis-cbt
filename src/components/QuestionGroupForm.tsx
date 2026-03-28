"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useCBTStore } from "@/store";
import { Question, Option } from "@/types";
import { generateId, cn } from "@/lib/utils";

type MaterialType =
	| "Comprehension Passage"
	| "Diagram"
	| "Table"
	| "Chart"
	| "Multiple Blanks";

const MATERIAL_TYPES: MaterialType[] = [
	"Comprehension Passage",
	"Diagram",
	"Table",
	"Chart",
	"Multiple Blanks",
];

const PLACEHOLDER: Record<MaterialType, string> = {
	"Comprehension Passage": "Type or paste your comprehension passage",
	Diagram: "Describe your diagram",
	Table: "Create table content",
	Chart: "Describe your chart",
	"Multiple Blanks": "Type your passage with blanks",
};

interface SubQuestion {
	id: string;
	text: string;
	marks: number;
	instruction: string;
	options: Option[];
	correctAnswer: string;
}

const defaultSubQ = (): SubQuestion => ({
	id: generateId(),
	text: "",
	marks: 1,
	instruction: "",
	options: [
		{ id: "a", text: "", isCorrect: false },
		{ id: "b", text: "", isCorrect: false },
		{ id: "c", text: "", isCorrect: false },
		{ id: "d", text: "", isCorrect: false },
	],
	correctAnswer: "",
});

interface QuestionGroupFormProps {
	topicId: string;
	editQuestion?: Question | null;
	onClose: () => void;
	onSaved: () => void;
}

export const QuestionGroupForm = ({
	topicId,
	editQuestion,
	onClose,
	onSaved,
}: QuestionGroupFormProps) => {
	const { addQuestion, updateQuestion } = useCBTStore();
	const [groupName, setGroupName] = useState(editQuestion?.text || "");
	const [materialType, setMaterialType] = useState<MaterialType>(
		"Comprehension Passage",
	);
	const [materialDropOpen, setMaterialDropOpen] = useState(false);
	const [passage, setPassage] = useState(editQuestion?.passage || "");
	const [instruction, setInstruction] = useState(
		editQuestion?.instruction || "",
	);
	const [subQuestions, setSubQuestions] = useState<SubQuestion[]>(() => {
		if (editQuestion?.subQuestions?.length) {
			return (editQuestion.subQuestions as SubQuestion[]).map((q) => ({
				...defaultSubQ(),
				...q,
				options: q.options || defaultSubQ().options,
			}));
		}
		return [defaultSubQ()];
	});
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const totalMarks = subQuestions.reduce((s, q) => s + q.marks, 0);

	const updateSubQ = (id: string, key: keyof SubQuestion, val: unknown) =>
		setSubQuestions((prev) =>
			prev.map((q) => (q.id === id ? { ...q, [key]: val } : q)),
		);

	const addSubQ = () => setSubQuestions((prev) => [...prev, defaultSubQ()]);

	const removeSubQ = (id: string) => {
		if (subQuestions.length <= 1) return;
		setSubQuestions((prev) => prev.filter((q) => q.id !== id));
	};

	const validate = () => {
		const errs: Record<string, string> = {};
		if (!groupName.trim()) errs.groupName = "Group name is required";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		setSaving(true);
		await new Promise((r) => setTimeout(r, 400));

		const qData: Question = {
			id: editQuestion?.id || generateId(),
			topicId,
			type: "question-group",
			text: groupName,
			marks: totalMarks,
			instruction: instruction || undefined,
			passage,
			subQuestions: subQuestions as Question[],
			createdAt: editQuestion?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		//  editQuestion ? updateQuestion(editQuestion.id, qData) : addQuestion(qData);

		if (editQuestion) {
			updateQuestion(editQuestion.id, qData);
		} else {
			addQuestion(qData);
		}

		setSaving(false);
		onSaved();
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			{/* Top bar */}
			<div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-3">
				<input
					type="text"
					value={groupName}
					onChange={(e) => {
						setGroupName(e.target.value);
						setErrors((p) => ({ ...p, groupName: "" }));
					}}
					placeholder="Question Group Name"
					className={cn(
						"flex-1 border-0 bg-transparent text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none",
						errors.groupName && "placeholder:text-red-400",
					)}
				/>
				<div className="ml-4 flex shrink-0 items-center gap-2">
					<button
						onClick={onClose}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={saving}
						className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
					>
						{saving && (
							<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
						)}
						Save Question Group
					</button>
				</div>
			</div>

			{/* Body */}
			<div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
				{/* Question Material */}
				<div className="rounded-xl border border-gray-200 bg-white p-5">
					<div className="mb-3 flex items-start gap-3">
						<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
							<svg
								className="h-4 w-4 text-blue-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div className="flex-1">
							<div className="mb-1 flex items-center justify-between">
								<h3 className="text-sm font-semibold text-gray-900">
									Question Material
								</h3>
								{/* Material type dropdown */}
								<div className="relative">
									<button
										onClick={() => setMaterialDropOpen((v) => !v)}
										className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
									>
										{materialType}
										<ChevronDown className="h-3.5 w-3.5 text-gray-400" />
									</button>
									{materialDropOpen && (
										<div className="absolute top-full right-0 z-30 mt-1 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
											{MATERIAL_TYPES.map((t) => (
												<button
													key={t}
													onClick={() => {
														setMaterialType(t);
														setMaterialDropOpen(false);
													}}
													className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
												>
													{t}
													{materialType === t && (
														<Check className="h-3.5 w-3.5 text-blue-600" />
													)}
												</button>
											))}
										</div>
									)}
								</div>
							</div>
							<p className="text-xs text-gray-500">
								This is the shared content that all questions in this
								group will reference.
							</p>
						</div>
					</div>

					{/* Simple textarea for the passage */}
					<textarea
						value={passage}
						onChange={(e) => setPassage(e.target.value)}
						placeholder={PLACEHOLDER[materialType]}
						rows={5}
						className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				{/* Sub-questions */}
				<div>
					<div className="mb-3 flex items-center justify-between">
						<h3 className="text-sm font-semibold text-gray-900">
							Questions ({subQuestions.length})
						</h3>
						<span className="text-xs text-gray-500">
							Total: {totalMarks} marks
						</span>
					</div>

					{/* Instruction */}
					<div className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
						<h4 className="mb-0.5 text-sm font-semibold text-gray-900">
							Instruction{" "}
							<span className="text-xs font-normal text-gray-400">
								(optional)
							</span>
						</h4>
						<p className="mb-2 text-xs text-gray-400">
							Add a brief instruction if needed. Example: &quot;Answer
							the following questions&quot;
						</p>
						<input
							type="text"
							value={instruction}
							onChange={(e) => setInstruction(e.target.value)}
							placeholder="Example: Answer the following questions"
							className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>

					<div className="space-y-3">
						{subQuestions.map((sq, idx) => (
							<SubQuestionCard
								key={sq.id}
								sq={sq}
								index={idx + 1}
								canDelete={subQuestions.length > 1}
								onUpdate={(key, val) => updateSubQ(sq.id, key, val)}
								onRemove={() => removeSubQ(sq.id)}
							/>
						))}
					</div>

					{/* Add Question */}
					<button
						onClick={addSubQ}
						className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs text-gray-400 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500"
					>
						<Plus className="h-3.5 w-3.5" />
						Add Question
					</button>
				</div>
			</div>
		</div>
	);
};

// ─── Sub Question Card ────────────────────────────────────────────────────────
const SubQuestionCard = ({
	sq,
	index,
	canDelete,
	onUpdate,
	onRemove,
}: {
	sq: SubQuestion;
	index: number;
	canDelete: boolean;
	onUpdate: (key: keyof SubQuestion, val: unknown) => void;
	onRemove: () => void;
}) => {
	const [expanded, setExpanded] = useState(true);

	const toggleCorrect = (id: string) =>
		onUpdate(
			"options",
			sq.options.map((o) => ({ ...o, isCorrect: o.id === id })),
		);

	const updateOptionText = (id: string, text: string) =>
		onUpdate(
			"options",
			sq.options.map((o) => (o.id === id ? { ...o, text } : o)),
		);

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
			<div
				className="group flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
				onClick={() => setExpanded((v) => !v)}
			>
				<span className="text-xs font-semibold text-gray-500">{index}</span>
				<span className="flex-1 truncate text-sm text-gray-700">
					{sq.text || (
						<span className="text-gray-400 italic">Question {index}</span>
					)}
				</span>
				<span className="text-xs text-gray-400">
					{sq.marks} mark{sq.marks !== 1 ? "s" : ""}
				</span>
				{canDelete && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onRemove();
						}}
						className="flex h-6 w-6 items-center justify-center text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
					>
						<Trash2 className="h-3.5 w-3.5" />
					</button>
				)}
				{expanded ? (
					<ChevronUp className="h-4 w-4 text-gray-400" />
				) : (
					<ChevronDown className="h-4 w-4 text-gray-400" />
				)}
			</div>

			{expanded && (
				<div className="space-y-3 border-t border-gray-100 px-4 py-4">
					<input
						type="text"
						value={sq.text}
						onChange={(e) => onUpdate("text", e.target.value)}
						placeholder="Type your question..."
						className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<div className="space-y-1.5">
						{sq.options.map((opt) => (
							<div key={opt.id} className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => toggleCorrect(opt.id)}
									className={cn(
										"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
										opt.isCorrect
											? "border-blue-500 bg-blue-500"
											: "border-gray-300 hover:border-blue-400",
									)}
								>
									{opt.isCorrect && (
										<div className="h-1.5 w-1.5 rounded-full bg-white" />
									)}
								</button>
								<span className="w-4 font-mono text-xs text-gray-400 uppercase">
									{opt.id}.
								</span>
								<input
									type="text"
									value={opt.text}
									onChange={(e) =>
										updateOptionText(opt.id, e.target.value)
									}
									placeholder={`Option ${opt.id.toUpperCase()}`}
									className="h-8 flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								/>
							</div>
						))}
					</div>
					<div className="flex items-center gap-2 pt-1">
						<span className="text-xs text-gray-500">Marks:</span>
						<input
							type="number"
							min={1}
							value={sq.marks}
							onChange={(e) =>
								onUpdate("marks", Math.max(1, Number(e.target.value)))
							}
							className="h-7 w-14 rounded-lg border border-gray-200 text-center text-xs transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
				</div>
			)}
		</div>
	);
};
