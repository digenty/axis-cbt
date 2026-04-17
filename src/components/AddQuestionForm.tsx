"use client";

import React, { useCallback, useState } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	buildDefaultOptions,
	buildEssayData,
	buildFillInBlankData,
	buildMAData,
	buildMCQData,
	buildNumericData,
	buildShortAnswerData,
	buildTrueFalseData,
	fromApiOptions,
} from "@/utils/question";
import {
	DifficultySelector,
	FormTopBar,
	InstructionInput,
	MarksInput,
	Section,
} from "@/utils/formPrimitives";
import {
	QuestionTypeDropdown,
	SINGLE_QUESTION_TYPES,
} from "@/utils/questionTypeSelector";
import {
	useCreateCbtQuestion,
	useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import { toast } from "@/components/Toast";
import type {
	ApiQuestion,
	CreateQuestionPayload,
	DifficultyLevel,
	OptionFormItem,
	PayloadTypeSpecificData,
	QuestionType,
} from "@/types/question";

// ─── Option Labels Editor ─────────────────────────────────────────────────────
// Teachers enter the option text only — no correct-answer marking here.

import { Plus, Trash2 as TrashIcon } from "lucide-react";
import { appendOption } from "@/utils/question";

// ─── Form state ───────────────────────────────────────────────────────────────
// No answer fields — teachers add questions first, marking happens separately.

interface FormState {
	questionType: QuestionType;
	questionText: string;
	instruction: string;
	marks: number;
	difficultyLevel: DifficultyLevel;
	imageUrl: string;
	// Option texts only — no isCorrect selection here
	options: OptionFormItem[];
}

const INITIAL: FormState = {
	questionType: "MULTIPLE_CHOICE",
	questionText: "",
	instruction: "",
	marks: 1,
	difficultyLevel: "",
	imageUrl: "",
	options: buildDefaultOptions(),
};

// ─── Hydrate from an existing API question ────────────────────────────────────

function hydrateForm(q: ApiQuestion): FormState {
	const tsd = q?.typeSpecificData;
	const base: FormState = {
		...INITIAL,
		questionType: q?.questionType,
		questionText: q?.questionText,
		marks: q?.marks,
		difficultyLevel: (q?.difficultyLevel as DifficultyLevel) ?? "",
		imageUrl: q?.imageUrl ?? "",
		instruction: q?.explanation ?? "",
	};

	// Restore option texts for MCQ / MA so the teacher can see what they wrote
	if (
		tsd?.questionType === "MULTIPLE_CHOICE" ||
		tsd?.questionType === "MULTIPLE_ANSWERS"
	) {
		base.options = fromApiOptions(tsd?.options);
	}

	return base;
}

// ─── Build payload ────────────────────────────────────────────────────────────

function buildPayload(
	form: FormState,
	classId: number,
	subjectId: number,
	topicId: number,
): CreateQuestionPayload {
	let typeSpecificData: PayloadTypeSpecificData;

	switch (form?.questionType) {
		case "MULTIPLE_CHOICE":
			// Options are included but isCorrect defaults to false — teacher marks later
			typeSpecificData = buildMCQData(form?.options);
			break;
		case "MULTIPLE_ANSWERS":
			typeSpecificData = buildMAData(form?.options);
			break;
		case "TRUE_FALSE":
			typeSpecificData = buildTrueFalseData(true); // default; teacher marks later
			break;
		case "SHORT_ANSWER":
			typeSpecificData = buildShortAnswerData("");
			break;
		case "FILL_IN_THE_BLANK":
			typeSpecificData = buildFillInBlankData([], form?.instruction);
			break;
		case "NUMERIC_ANSWER":
			typeSpecificData = buildNumericData(0);
			break;
		case "ESSAY":
		default:
			typeSpecificData = buildEssayData();
	}

	return {
		classId,
		subjectId,
		topicId,
		questionText: form?.questionText,
		imageUrl: form?.imageUrl || undefined,
		marks: form?.marks,
		explanation: form?.instruction || undefined,
		difficultyLevel: form?.difficultyLevel || undefined,
		questionType: form?.questionType,
		typeSpecificData,
	};
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddQuestionFormProps {
	classId: number;
	subjectId: number;
	topicId: number;
	editQuestion?: ApiQuestion | null;
	onClose: () => void;
	onSaved: (question?: ApiQuestion) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddQuestionForm = ({
	classId,
	subjectId,
	topicId,
	editQuestion,
	onClose,
	onSaved,
}: AddQuestionFormProps) => {
	const [form, setForm] = useState<FormState>(() =>
		editQuestion ? hydrateForm(editQuestion) : INITIAL,
	);
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormState, string>>
	>({});

	const { mutateAsync: createQuestion, isPending: isCreating } =
		useCreateCbtQuestion();
	const { mutateAsync: updateQuestion, isPending: isUpdating } =
		useUpdateCbtQuestion();
	const saving = isCreating || isUpdating;

	const update = useCallback(
		<K extends keyof FormState>(key: K, val: FormState[K]) => {
			setForm((prev) => ({ ...prev, [key]: val }));
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		},
		[],
	);

	const changeType = (questionType: QuestionType) => {
		setForm((prev) => ({
			...INITIAL,
			questionType,
			questionText: prev?.questionText,
			instruction: prev?.instruction,
			marks: prev?.marks,
			difficultyLevel: prev?.difficultyLevel,
			imageUrl: prev?.imageUrl,
		}));
	};

	const validate = (): boolean => {
		const errs: Partial<Record<keyof FormState, string>> = {};
		if (!form?.questionText.trim())
			errs.questionText = "Question text is required";
		setErrors(errs);
		return Object.keys(errs)?.length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		const payload = buildPayload(form, classId, subjectId, topicId);

		try {
			if (editQuestion) {
				await updateQuestion({ id: editQuestion?.id, payload });
				toast({ title: "Question updated", type: "success" });
				onSaved();
			} else {
				const res = await createQuestion(payload);
				toast({ title: "Question saved", type: "success" });
				onSaved(res?.data);
			}
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "message" in err
					? String((err as { message: string })?.message)
					: "Could not save question";
			toast({ title: msg, type: "error" });
		}
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<FormTopBar
				onCancel={onClose}
				onSave={handleSave}
				saving={saving}
				isEdit={!!editQuestion}
			/>

			<div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
				<InstructionInput
					value={form?.instruction}
					onChange={(v) => update("instruction", v)}
				/>

				{/* Question text + type picker */}
				<Section title="">
					<div className="mb-3 flex items-center gap-3">
						<QuestionTypeDropdown
							value={form?.questionType}
							onChange={changeType}
							types={SINGLE_QUESTION_TYPES}
						/>
						<button
							type="button"
							title="Add image"
							className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
						>
							<ImageIcon className="h-4 w-4" />
						</button>
					</div>

					<div className="relative">
						<textarea
							rows={2}
							value={form?.questionText}
							onChange={(e) => update("questionText", e.target.value)}
							placeholder="Type your question"
							className={cn(
								"w-full resize-none rounded-xl border px-4 py-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
								errors.questionText
									? "border-red-400"
									: "border-gray-200",
							)}
						/>
						{errors.questionText && (
							<p className="mt-1 text-xs text-red-500">
								{errors.questionText}
							</p>
						)}
					</div>

					{form?.imageUrl && (
						<div className="relative mt-3 h-40 w-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
							<img
								src={form?.imageUrl}
								alt=""
								className="h-full w-full object-cover"
							/>
							<button
								type="button"
								onClick={() => update("imageUrl", "")}
								className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/90 px-3 py-1.5 text-xs text-gray-700 shadow-sm hover:bg-white"
							>
								<Trash2 className="h-3 w-3" />
								Remove
							</button>
						</div>
					)}
				</Section>

				{/* Option labels for MCQ / MA — no correct-answer selection */}
				{(form?.questionType === "MULTIPLE_CHOICE" ||
					form?.questionType === "MULTIPLE_ANSWERS") && (
					<OptionLabelsEditor
						options={form?.options}
						onChange={(opts) => update("options", opts)}
					/>
				)}

				{/* Type hints for other types */}
				{form?.questionType === "TRUE_FALSE" && (
					<Section title="">
						<p className="py-1 text-sm text-gray-400">
							Students will select True or False. You can mark the
							correct answer when marking the assessment.
						</p>
					</Section>
				)}

				{form?.questionType === "SHORT_ANSWER" && (
					<Section title="">
						<p className="py-1 text-sm text-gray-400">
							Students will type a short text response.
						</p>
					</Section>
				)}

				{form?.questionType === "NUMERIC_ANSWER" && (
					<Section title="">
						<p className="py-1 text-sm text-gray-400">
							Students will enter a numeric answer.
						</p>
					</Section>
				)}

				{form?.questionType === "ESSAY" && (
					<Section title="">
						<p className="py-1 text-sm text-gray-400">
							Students will write a long-form response.
						</p>
					</Section>
				)}

				{form?.questionType === "FILL_IN_THE_BLANK" && (
					<Section title="">
						<p className="py-1 text-sm text-gray-400">
							Use the Fill-in-the-Blank form to add blanks and configure
							each gap. This is a simplified view.
						</p>
					</Section>
				)}

				<div className="flex flex-wrap items-center gap-5 pb-2">
					<MarksInput
						value={form?.marks}
						onChange={(v) => update("marks", v)}
					/>
					<DifficultySelector
						value={form?.difficultyLevel}
						onChange={(v) => update("difficultyLevel", v)}
					/>
				</div>
			</div>
		</div>
	);
};

const OptionLabelsEditor = ({
	options,
	onChange,
}: {
	options: OptionFormItem[];
	onChange: (opts: OptionFormItem[]) => void;
}) => {
	const updateText = (id: string, text: string) =>
		onChange(options?.map((o) => (o.id === id ? { ...o, text } : o)));

	const removeOption = (id: string) => {
		if (options?.length <= 2) return;
		onChange(options?.filter((o) => o.id !== id));
	};

	return (
		<Section
			title="Options"
			hint="Enter the option texts — you can mark the correct answer when reviewing results"
		>
			<div className="space-y-2">
				{options?.map((opt) => (
					<div key={opt.id} className="flex items-center gap-3">
						<span className="w-5 shrink-0 text-sm font-medium uppercase text-gray-500">
							{opt.id}.
						</span>
						<input
							type="text"
							value={opt.text}
							onChange={(e) => updateText(opt.id, e.target.value)}
							placeholder={`Option ${opt.id.toUpperCase()}`}
							className="h-9 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						{options?.length > 2 && (
							<button
								type="button"
								onClick={() => removeOption(opt.id)}
								className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-300 transition-colors hover:text-red-500"
							>
								<TrashIcon className="h-3.5 w-3.5" />
							</button>
						)}
					</div>
				))}
				{options?.length < 8 && (
					<button
						type="button"
						onClick={() => onChange(appendOption(options))}
						className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600"
					>
						<Plus className="h-3.5 w-3.5" />
						Add Option
					</button>
				)}
			</div>
		</Section>
	);
};
