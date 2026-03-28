"use client";
import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useCBTStore } from "@/store";
import { Question, Blank } from "@/types";
import { generateId, cn } from "@/lib/utils";

interface MultipleBlanksFormProps {
	topicId: string;
	editQuestion?: Question | null;
	onClose: () => void;
	onSaved: () => void;
}

export const MultipleBlanksForm = ({
	topicId,
	editQuestion,
	onClose,
	onSaved,
}: MultipleBlanksFormProps) => {
	const { addQuestion, updateQuestion } = useCBTStore();
	const [instruction, setInstruction] = useState(
		editQuestion?.instruction || "",
	);
	const [questionText, setQuestionText] = useState(
		editQuestion?.text?.replace(/<[^>]*>/g, "") || "",
	);
	const [blanks, setBlanks] = useState<Blank[]>(() => {
		if (editQuestion?.blanks?.length) return editQuestion.blanks;
		return [];
	});
	const [expandedBlankId, setExpandedBlankId] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const insertBlank = () => {
		const n = blanks.length + 1;
		const blank: Blank = {
			id: generateId(),
			label: `Blank ${n}`,
			answerType: "short-answer",
			answers: [],
			mark: 1,
		};
		setBlanks((prev) => [...prev, blank]);
		setQuestionText((t) => t + ` Blank ${n} `);
		setExpandedBlankId(blank.id);
	};

	const updateBlank = (id: string, key: keyof Blank, val: unknown) =>
		setBlanks((prev) =>
			prev.map((b) => (b.id === id ? { ...b, [key]: val } : b)),
		);

	const handleSave = async () => {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 400));
		const qData: Question = {
			id: editQuestion?.id || generateId(),
			topicId,
			type: "multiple-blanks",
			text: questionText,
			marks: blanks.reduce((s, b) => s + b.mark, 0) || 1,
			instruction: instruction || undefined,
			blanks,
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
			<div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-3">
				<button
					onClick={onClose}
					className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
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
					Save Question
				</button>
			</div>

			{/* Body */}
			<div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
				{/* Instruction */}
				<div className="rounded-xl border border-gray-200 bg-white p-4">
					<h3 className="mb-0.5 text-sm font-semibold text-gray-900">
						Instruction{" "}
						<span className="text-xs font-normal text-gray-400">
							(optional)
						</span>
					</h3>
					<p className="mb-2 text-xs text-gray-400">
						Add a brief instruction if needed. Example: &quot;Fill in the
						gaps&quot; or &quot;Complete the sentence&quot;
					</p>
					<input
						type="text"
						value={instruction}
						onChange={(e) => setInstruction(e.target.value)}
						placeholder="Example: fill in the gaps with the correct words"
						className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				{/* Write your question */}
				<div className="rounded-xl border border-gray-200 bg-white p-4">
					<h3 className="mb-0.5 text-sm font-semibold text-gray-900">
						Write your question
					</h3>
					<p className="mb-3 text-xs text-gray-400">
						Type normally, then click &quot;Insert Blank&quot; to add gaps
					</p>
					{/* Question text with visual blank chips */}
					<div className="min-h-[80px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 transition focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
						<BlankAwareInput
							value={questionText}
							blanks={blanks}
							onChange={setQuestionText}
						/>
					</div>
					<button
						onClick={insertBlank}
						className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600"
					>
						<Plus className="h-3.5 w-3.5" />
						Insert Blank
					</button>
				</div>

				{/* Blanks configuration */}
				{blanks.length > 0 && (
					<div className="rounded-xl border border-gray-200 bg-white p-4">
						<h3 className="mb-1 text-sm font-semibold text-gray-900">
							Blanks
						</h3>
						<p className="mb-3 text-xs text-gray-400">
							Set correct answers and marks for each blank
						</p>
						<div className="space-y-3">
							{blanks.map((blank, idx) => (
								<BlankConfigCard
									key={blank.id}
									blank={blank}
									index={idx + 1}
									isExpanded={expandedBlankId === blank.id}
									onToggle={() =>
										setExpandedBlankId(
											expandedBlankId === blank.id ? null : blank.id,
										)
									}
									onUpdate={(key, val) =>
										updateBlank(blank.id, key, val)
									}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// ─── Blank-aware input ────────────────────────────────────────────────────────
// Shows blank chips inline in the text input
const BlankAwareInput = ({
	value,
	blanks,
	onChange,
}: {
	value: string;
	blanks: Blank[];
	onChange: (v: string) => void;
}) => {
	console.log({ BlankAwareInput: blanks });
	// Simple fallback: plain textarea — chips are visual only in screenshot
	return (
		<textarea
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="London and Paris are examples of Blank 1 in Blank 2"
			rows={3}
			className="w-full resize-none bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
		/>
	);
};

// ─── Blank Config Card ────────────────────────────────────────────────────────
const BlankConfigCard = ({
	blank,
	index,
	isExpanded,
	onToggle,
	onUpdate,
}: {
	blank: Blank;
	index: number;
	isExpanded: boolean;
	onToggle: () => void;
	onUpdate: (key: keyof Blank, val: unknown) => void;
}) => (
	<div className="overflow-hidden rounded-xl border border-gray-200">
		<button
			onClick={onToggle}
			className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
		>
			<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
				{index}
			</div>
			<span className="text-sm font-medium text-gray-800">
				{blank.label}
			</span>
			<div className="ml-2 flex items-center gap-2">
				<span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
					Student types
				</span>
				<span className="text-xs text-gray-400">
					• {blank.mark} mark{blank.mark !== 1 ? "s" : ""}
				</span>
			</div>
			<div className="ml-auto">
				{isExpanded ? (
					<ChevronUp className="h-4 w-4 text-gray-400" />
				) : (
					<ChevronDown className="h-4 w-4 text-gray-400" />
				)}
			</div>
		</button>

		{isExpanded && (
			<div className="space-y-4 border-t border-gray-100 px-4 py-4">
				{/* Answer type toggle */}
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => onUpdate("answerType", "short-answer")}
						className={cn(
							"flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
							blank.answerType === "short-answer"
								? "border-blue-500 bg-blue-50 text-blue-700"
								: "border-gray-200 text-gray-600 hover:border-gray-300",
						)}
					>
						<div
							className={cn(
								"flex h-4 w-4 items-center justify-center rounded-full border-2",
								blank.answerType === "short-answer"
									? "border-blue-500 bg-blue-500"
									: "border-gray-300",
							)}
						>
							{blank.answerType === "short-answer" && (
								<div className="h-1.5 w-1.5 rounded-full bg-white" />
							)}
						</div>
						Short Answer
					</button>
					<button
						type="button"
						onClick={() => onUpdate("answerType", "multiple-choice")}
						className={cn(
							"flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
							blank.answerType === "multiple-choice"
								? "border-blue-500 bg-blue-50 text-blue-700"
								: "border-gray-200 text-gray-600 hover:border-gray-300",
						)}
					>
						<div
							className={cn(
								"flex h-4 w-4 items-center justify-center rounded-full border-2",
								blank.answerType === "multiple-choice"
									? "border-blue-500 bg-blue-500"
									: "border-gray-300",
							)}
						>
							{blank.answerType === "multiple-choice" && (
								<div className="h-1.5 w-1.5 rounded-full bg-white" />
							)}
						</div>
						Multiple Choice
					</button>
				</div>

				{/* Short answer: expected answers */}
				{blank.answerType === "short-answer" && (
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-700">
							{blank.label} Answer(s)
						</label>
						<input
							type="text"
							value={blank.answers[0] || ""}
							onChange={(e) => onUpdate("answers", [e.target.value])}
							placeholder="Expected Answer"
							className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<p className="mt-1 text-xs text-gray-400">
							Add multiple by separating with a comma
						</p>
					</div>
				)}

				{/* Multiple choice options */}
				{blank.answerType === "multiple-choice" && (
					<div className="space-y-1.5">
						{(
							blank.options || [
								{ id: "a", text: "", isCorrect: false },
								{ id: "b", text: "", isCorrect: false },
								{ id: "c", text: "", isCorrect: false },
								{ id: "d", text: "", isCorrect: false },
							]
						).map((opt, j) => (
							<div key={opt.id} className="flex items-center gap-2">
								<button
									type="button"
									onClick={() =>
										onUpdate(
											"options",
											(blank.options || []).map((o) => ({
												...o,
												isCorrect: o.id === opt.id,
											})),
										)
									}
									className={cn(
										"flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all",
										opt.isCorrect
											? "border-blue-500 bg-blue-500"
											: "border-gray-300",
									)}
								>
									{opt.isCorrect && (
										<div className="h-1.5 w-1.5 rounded-full bg-white" />
									)}
								</button>
								<span className="w-5 text-xs font-medium text-gray-400 uppercase">
									{opt.id}.
								</span>
								<input
									type="text"
									value={opt.text}
									onChange={(e) => {
										const opts = [...(blank.options || [])];
										opts[j] = { ...opts[j], text: e.target.value };
										onUpdate("options", opts);
									}}
									placeholder={`Option ${opt?.id?.toUpperCase()}`}
									className="h-8 flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
								/>
								<button
									onClick={() => {
										const opts = (blank.options || []).filter(
											(o) => o.id !== opt.id,
										);
										onUpdate("options", opts);
									}}
									className="flex h-6 w-6 items-center justify-center text-gray-300 transition-colors hover:text-red-500"
								>
									<Trash2 className="h-3 w-3" />
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => {
								const opts = blank.options || [];
								const next = String.fromCharCode(97 + opts.length);
								onUpdate("options", [
									...opts,
									{ id: next, text: "", isCorrect: false },
								]);
							}}
							className="mt-1 flex items-center gap-1.5 text-xs text-blue-600 transition-colors hover:text-blue-700"
						>
							<Plus className="h-3.5 w-3.5" />
							Add Option
						</button>
					</div>
				)}

				{/* Marks */}
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600">
						{blank.label} Mark:
					</span>
					<input
						type="number"
						min={1}
						value={blank.mark}
						onChange={(e) =>
							onUpdate("mark", Math.max(1, Number(e.target.value)))
						}
						className="h-8 w-16 rounded-lg border border-gray-200 text-center text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		)}
	</div>
);
