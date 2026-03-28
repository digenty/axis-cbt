"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Check, Image as ImageIcon } from "lucide-react";
import { Question, QuestionType, Option } from "@/types";
import { generateId, getQuestionTypeLabel, cn } from "@/lib/utils";
import { useCBTStore } from "../store";

interface AddQuestionFormProps {
	topicId: string;
	editQuestion?: Question | null;
	onClose: () => void;
	onSaved: () => void;
}

// ─── MCQ question type list for the inline dropdown ───────────────────────────
const SINGLE_TYPES: { type: QuestionType; label: string }[] = [
	{ type: "multiple-choice", label: "Multiple Choice" },
	{ type: "true-false", label: "True/False" },
	{ type: "essay", label: "Essay" },
	{ type: "fill-in-blank", label: "Fill-in-the-Blank" },
	{ type: "short-answer", label: "Short Answer" },
	{ type: "multiple-answers", label: "Multiple Answers" },
	{ type: "numerical", label: "Numeric Answers" },
];

// ─── Form state ───────────────────────────────────────────────────────────────
type FormState = {
	type: QuestionType;
	text: string;
	marks: number;
	instruction: string;
	options: Option[];
	correctAnswer: string;
	image: string | null;
};

const defaultOptions = () => [
	{ id: "a", text: "", isCorrect: false },
	{ id: "b", text: "", isCorrect: false },
	{ id: "c", text: "", isCorrect: false },
	{ id: "d", text: "", isCorrect: false },
];

const defaultForm = (type: QuestionType = "multiple-choice"): FormState => ({
	type,
	text: "",
	marks: 1,
	instruction: "",
	options:
		type === "true-false"
			? [
					{ id: "true", text: "True", isCorrect: false },
					{ id: "false", text: "False", isCorrect: false },
				]
			: defaultOptions(),
	correctAnswer: "",
	image: null,
});

// ─── Main component ───────────────────────────────────────────────────────────
export const AddQuestionForm = ({
	topicId,
	editQuestion,
	onClose,
	onSaved,
}: AddQuestionFormProps) => {
	const { addQuestion, updateQuestion } = useCBTStore();
	const [saving, setSaving] = useState(false);
	const [typeDropOpen, setTypeDropOpen] = useState(false);
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormState, string>>
	>({});

	const [form, setForm] = useState<FormState>(() => {
		if (editQuestion) {
			return {
				type: editQuestion.type,
				text: editQuestion.text,
				marks: editQuestion.marks,
				instruction: editQuestion.instruction || "",
				options: editQuestion.options || defaultOptions(),
				correctAnswer: Array.isArray(editQuestion.correctAnswer)
					? editQuestion.correctAnswer.join(", ")
					: editQuestion.correctAnswer || "",
				image: null,
			};
		}
		return defaultForm();
	});

	const update = useCallback(
		<K extends keyof FormState>(key: K, val: FormState[K]) => {
			setForm((prev) => ({ ...prev, [key]: val }));
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		},
		[],
	);

	const changeType = (type: QuestionType) => {
		setForm((prev) => ({
			...defaultForm(type),
			instruction: prev.instruction,
			marks: prev.marks,
		}));
		setTypeDropOpen(false);
	};

	const validate = () => {
		const errs: Partial<Record<keyof FormState, string>> = {};
		if (!form.text.replace(/<[^>]*>/g, "").trim())
			errs.text = "Question text is required";
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
			type: form.type,
			text: form.text,
			marks: form.marks,
			instruction: form.instruction || undefined,
			options: [
				"multiple-choice",
				"multiple-answers",
				"true-false",
			].includes(form.type)
				? form.options
				: undefined,
			correctAnswer: ["short-answer", "fill-in-blank", "numerical"].includes(
				form.type,
			)
				? form.correctAnswer
				: undefined,
			createdAt: editQuestion?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// editQuestion ? updateQuestion(editQuestion.id, qData) : addQuestion(qData);

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
			{/* Sticky top bar: Cancel + Save */}
			<div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
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
					{editQuestion ? "Update Question" : "Save Question"}
				</button>
			</div>

			{/* Scrollable form body */}
			<div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
				{/* Instruction */}
				<Section title="Instruction" optional>
					<p className="mb-2 text-xs text-gray-400">
						Add a brief instruction if needed. Example: &quot;Fill in the
						gaps&quot; or &quot;Complete the sentence&quot;
					</p>
					<input
						type="text"
						value={form.instruction}
						onChange={(e) => update("instruction", e.target.value)}
						placeholder="Example: fill in the gaps with the correct words"
						className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</Section>

				{/* Question text + type selector */}
				<Section title="">
					{/* Type selector row */}
					<div className="mb-3 flex items-center gap-3">
						<div className="relative">
							<button
								onClick={() => setTypeDropOpen((v) => !v)}
								className="flex h-8 items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
							>
								{getQuestionTypeLabel(form.type)}
								<svg
									className="h-3.5 w-3.5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							{typeDropOpen && (
								<div className="absolute top-full left-0 z-30 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
									{SINGLE_TYPES.map(({ type, label }) => (
										<button
											key={type}
											onClick={() => changeType(type)}
											className={cn(
												"w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50",
												form.type === type
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
						{/* Image upload stub */}
						<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
							<ImageIcon className="h-4 w-4" />
						</button>
					</div>

					{/* Question text input */}
					<div className="relative">
						<input
							type="text"
							value={form.text.replace(/<[^>]*>/g, "")}
							onChange={(e) => update("text", e.target.value)}
							placeholder="Type your question"
							className={cn(
								"h-11 w-full rounded-xl border px-4 py-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
								errors.text ? "border-red-400" : "border-gray-200",
							)}
						/>
						{errors.text && (
							<p className="mt-1 text-xs text-red-500">{errors.text}</p>
						)}
					</div>

					{/* Image placeholder */}
					{form.image === "placeholder" && (
						<div className="relative mt-3 h-40 w-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
							<div
								className="absolute inset-0"
								style={{
									backgroundImage:
										"repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%)",
									backgroundSize: "20px 20px",
								}}
							/>
							<div className="absolute bottom-2 left-2 flex gap-2">
								<button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/90 px-3 py-1.5 text-xs text-gray-700 shadow-sm transition-colors hover:bg-white">
									<Trash2 className="h-3 w-3" />
								</button>
								<button className="rounded-lg border border-gray-200 bg-white/90 px-3 py-1.5 text-xs text-gray-700 shadow-sm transition-colors hover:bg-white">
									Replace
								</button>
							</div>
						</div>
					)}
					{form.image === null && (
						<button
							onClick={() => update("image", "placeholder")}
							className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-all hover:border-blue-300 hover:text-blue-500"
						>
							<ImageIcon className="h-3.5 w-3.5" />
							Add image
						</button>
					)}
				</Section>

				{/* Type-specific fields */}
				{(form.type === "multiple-choice" ||
					form.type === "multiple-answers") && (
					<OptionsEditor
						form={form}
						update={update}
						multiSelect={form.type === "multiple-answers"}
					/>
				)}
				{form.type === "true-false" && (
					<TrueFalseEditor form={form} update={update} />
				)}
				{["short-answer", "fill-in-blank", "numerical"].includes(
					form.type,
				) && (
					<Section title="Expected Answer" optional>
						<input
							type="text"
							value={form.correctAnswer}
							onChange={(e) => update("correctAnswer", e.target.value)}
							placeholder="Add multiple by separating with a comma"
							className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</Section>
				)}
				{form.type === "essay" && (
					<Section title="">
						<p className="py-2 text-sm text-gray-400 italic">
							Students will provide a long-form written response. No
							expected answer needed.
						</p>
					</Section>
				)}

				{/* Marks */}
				<div className="flex items-center gap-3 pb-2">
					<span className="text-sm font-medium text-gray-700">Marks:</span>
					<input
						type="number"
						min={1}
						value={form.marks}
						onChange={(e) =>
							update("marks", Math.max(1, Number(e.target.value)))
						}
						className="h-8 w-16 rounded-lg border border-gray-200 text-center text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	);
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({
	title,
	optional,
	children,
}: {
	title: string;
	optional?: boolean;
	children: React.ReactNode;
}) => (
	<div className="rounded-xl border border-gray-200 bg-white p-4">
		{title && (
			<h3 className="mb-2 text-sm font-semibold text-gray-900">
				{title}{" "}
				{optional && (
					<span className="text-xs font-normal text-gray-400">
						(optional)
					</span>
				)}
			</h3>
		)}
		{children}
	</div>
);

// ─── Options Editor ───────────────────────────────────────────────────────────
const OptionsEditor = ({
	form,
	update,
	multiSelect,
}: {
	form: FormState;
	update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
	multiSelect: boolean;
}) => {
	const toggleCorrect = (id: string) => {
		const next = multiSelect
			? form.options.map((o) =>
					o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
				)
			: form.options.map((o) => ({ ...o, isCorrect: o.id === id }));
		update("options", next);
	};

	const updateText = (id: string, text: string) =>
		update(
			"options",
			form.options.map((o) => (o.id === id ? { ...o, text } : o)),
		);

	const removeOption = (id: string) => {
		if (form.options.length <= 2) return;
		update(
			"options",
			form.options.filter((o) => o.id !== id),
		);
	};

	const addOption = () => {
		const next = String.fromCharCode(97 + form.options.length);
		update("options", [
			...form.options,
			{ id: next, text: "", isCorrect: false },
		]);
	};

	return (
		<div className="space-y-2">
			{form.options.map((opt) => (
				<div key={opt.id} className="flex items-center gap-3">
					{/* Radio/checkbox to mark correct */}
					<button
						type="button"
						onClick={() => toggleCorrect(opt.id)}
						className={cn(
							"flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-all",
							multiSelect ? "rounded" : "rounded-full",
							opt.isCorrect
								? "border-blue-500 bg-blue-500 text-white"
								: "border-gray-300 hover:border-blue-400",
						)}
					>
						{opt.isCorrect && <Check className="h-3 w-3" />}
					</button>
					<span className="w-5 text-sm font-medium text-gray-500 uppercase">
						{opt.id}.
					</span>
					<input
						type="text"
						value={opt.text}
						onChange={(e) => updateText(opt.id, e.target.value)}
						placeholder={`Option ${opt.id.toUpperCase()}`}
						className="h-9 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					{form.options.length > 2 && (
						<button
							onClick={() => removeOption(opt.id)}
							className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-300 transition-colors hover:text-red-500"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					)}
				</div>
			))}

			{form.options.length < 8 && (
				<button
					type="button"
					onClick={addOption}
					className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600"
				>
					<Plus className="h-3.5 w-3.5" />
					Add Option
				</button>
			)}
		</div>
	);
};

// ─── True/False Editor ────────────────────────────────────────────────────────
const TrueFalseEditor = ({
	form,
	update,
}: {
	form: FormState;
	update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) => {
	const setCorrect = (id: "true" | "false") =>
		update(
			"options",
			form.options.map((o) => ({ ...o, isCorrect: o.id === id })),
		);
	const current = form.options.find((o) => o.isCorrect)?.id;

	return (
		<div className="flex gap-3">
			{(["true", "false"] as const).map((val) => (
				<button
					key={val}
					type="button"
					onClick={() => setCorrect(val)}
					className={cn(
						"flex-1 rounded-xl border py-2.5 text-sm font-medium capitalize transition-all",
						current === val
							? "border-blue-500 bg-blue-50 text-blue-700"
							: "border-gray-200 text-gray-600 hover:border-gray-300",
					)}
				>
					{val.charAt(0).toUpperCase() + val.slice(1)}
				</button>
			))}
		</div>
	);
};
