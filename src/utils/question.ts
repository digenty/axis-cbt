/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
	BlankFormItem,
	OptionData,
	OptionFormItem,
	PayloadSubQuestionTypeSpecificData,
	PayloadTypeSpecificData,
	QuestionType,
	ResponseTypeSpecificData,
	SubQuestionFormItem,
	// SubQuestionType,
} from "@/types/question";

// ─── Type labels ──────────────────────────────────────────────────────────────

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
	MULTIPLE_CHOICE: "Multiple Choice",
	MULTIPLE_ANSWERS: "Multiple Answers",
	TRUE_FALSE: "True / False",
	ESSAY: "Essay",
	SHORT_ANSWER: "Short Answer",
	NUMERIC_ANSWER: "Numeric Answer",
	FILL_IN_THE_BLANK: "Fill-in-the-Blank",
	MATCH: "Matching",
	QUESTION_GROUP: "Question Group",
	COMPREHENSION: "Comprehension",
};

export const getQuestionTypeLabel = (type: QuestionType): string =>
	QUESTION_TYPE_LABELS[type] ?? type;

// ─── Badge colours ────────────────────────────────────────────────────────────

export const QUESTION_TYPE_BADGE: Record<QuestionType, string> = {
	MULTIPLE_CHOICE: "bg-blue-50 text-blue-700 border-blue-200",
	MULTIPLE_ANSWERS: "bg-violet-50 text-violet-700 border-violet-200",
	TRUE_FALSE: "bg-teal-50 text-teal-700 border-teal-200",
	ESSAY: "bg-amber-50 text-amber-700 border-amber-200",
	SHORT_ANSWER: "bg-orange-50 text-orange-700 border-orange-200",
	NUMERIC_ANSWER: "bg-cyan-50 text-cyan-700 border-cyan-200",
	FILL_IN_THE_BLANK: "bg-pink-50 text-pink-700 border-pink-200",
	MATCH: "bg-emerald-50 text-emerald-700 border-emerald-200",
	QUESTION_GROUP: "bg-gray-100 text-gray-700 border-gray-200",
	COMPREHENSION: "bg-purple-50 text-purple-700 border-purple-200",
};

export const getQuestionTypeBadge = (type: QuestionType): string =>
	QUESTION_TYPE_BADGE[type] ?? "bg-gray-100 text-gray-600 border-gray-200";

// ─── Option helpers ───────────────────────────────────────────────────────────

export const buildDefaultOptions = (count = 4): OptionFormItem[] =>
	Array.from({ length: count }, (_, i) => ({
		id: String.fromCharCode(97 + i),
		text: "",
		isCorrect: false,
	}));

export const appendOption = (opts: OptionFormItem[]): OptionFormItem[] => [
	...opts,
	{ id: String.fromCharCode(97 + opts.length), text: "", isCorrect: false },
];

/** UI OptionFormItem[] → API OptionData[] */
export const toApiOptions = (items: OptionFormItem[]): OptionData[] =>
	items.map((o) => ({
		optionText: o.text,
		optionLabel: o.id.toUpperCase(),
		isCorrect: o.isCorrect,
	}));

/** API OptionData[] → UI OptionFormItem[] */
export const fromApiOptions = (items: OptionData[]): OptionFormItem[] =>
	items.map((o, i) => ({
		id: o.optionLabel?.toLowerCase() ?? String.fromCharCode(97 + i),
		text: o.optionText,
		isCorrect: o.isCorrect,
	}));

export const generateId = (): string => Math.random().toString(36).slice(2, 10);

// ─── PayloadTypeSpecificData builders ────────────────────────────────────────
// All builders use `type` as the discriminant key — required by the Java backend.
// GET responses use `questionType`; POST/PUT bodies must use `type`.

export function buildMCQData(
	options: OptionFormItem[],
): PayloadTypeSpecificData {
	return { type: "MULTIPLE_CHOICE", options: toApiOptions(options) };
}

export function buildMAData(
	options: OptionFormItem[],
	partialCredit = false,
): PayloadTypeSpecificData {
	return {
		type: "MULTIPLE_ANSWERS",
		options: toApiOptions(options),
		partialCredit,
	};
}

export function buildTrueFalseData(
	correctAnswer: boolean,
): PayloadTypeSpecificData {
	return { type: "TRUE_FALSE", correctAnswer };
}

export function buildEssayData(modelAnswer?: string): PayloadTypeSpecificData {
	return { type: "ESSAY", modelAnswer: modelAnswer || undefined };
}

export function buildShortAnswerData(
	answersRaw: string,
	caseSensitive = false,
): PayloadTypeSpecificData {
	return {
		type: "SHORT_ANSWER",
		correctAnswers: answersRaw
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean),
		caseSensitive,
		exactMatch: false,
	};
}

export function buildNumericData(
	correctAnswer: number,
	tolerance?: number,
	unit?: string,
): PayloadTypeSpecificData {
	return {
		type: "NUMERIC_ANSWER",
		correctAnswer,
		tolerance: tolerance || undefined,
		unit: unit || undefined,
	};
}

export function buildFillInBlankData(
	blanks: BlankFormItem[],
	instruction?: string,
): PayloadTypeSpecificData {
	return {
		type: "FILL_IN_THE_BLANK",
		instruction: instruction || undefined,
		blanks: blanks.map((b) => ({
			blankLabel: b.label,
			marks: b.mark,
			answerType:
				b.answerType === "multiple-choice"
					? "MULTIPLE_CHOICE"
					: "SHORT_ANSWER",
			correctAnswers:
				b.answerType === "short-answer"
					? b.answers
					: (b.options ?? [])
							.filter((o) => o.isCorrect)
							.map((o) => o.text),
		})),
	};
}

export function buildMatchData(
	pairs: { itemText: string; matchText: string }[],
	marksForEach = 1,
): PayloadTypeSpecificData {
	return {
		type: "MATCH",
		pairs,
		marksForEach,
		shuffleItems: true,
		partialCredit: false,
	};
}

export function buildSubQTypeSpecificData(
	sub: SubQuestionFormItem,
): PayloadSubQuestionTypeSpecificData {
	switch (sub.type) {
		case "MULTIPLE_CHOICE":
			return { type: "MULTIPLE_CHOICE", options: toApiOptions(sub.options) };
		case "MULTIPLE_ANSWERS":
			return {
				type: "MULTIPLE_ANSWERS",
				options: toApiOptions(sub.options),
				partialCredit: false,
			};
		case "TRUE_FALSE":
			// For sub-questions we default true; teacher sets correct answer in the form
			return { type: "TRUE_FALSE", correctAnswer: true };
		case "SHORT_ANSWER":
			return { type: "SHORT_ANSWER", correctAnswers: [] };
		case "NUMERIC_ANSWER":
			return { type: "NUMERIC_ANSWER", correctAnswer: 0 };
		case "FILL_IN_THE_BLANK":
			return { type: "FILL_IN_THE_BLANK", blanks: [] };
		case "MATCH":
			return { type: "MATCH", pairs: [] };
		case "ESSAY":
		default:
			return { type: "ESSAY" };
	}
}

export function buildGroupData(params: {
	questionType: "QUESTION_GROUP" | "COMPREHENSION";
	stimulusType: string;
	stimulusContent: string;
	subQuestions: SubQuestionFormItem[];
}): PayloadTypeSpecificData {
	const subQs = params?.subQuestions?.map((sq) => ({
		questionText: sq.text,
		marks: sq.marks,
		questionType: sq.type,
		typeSpecificData: buildSubQTypeSpecificData(sq),
	}));

	if (params?.questionType === "COMPREHENSION") {
		return {
			type: "COMPREHENSION",
			stimulusType: params?.stimulusType,
			stimulusContent: params?.stimulusContent,
			subQuestions: subQs,
		};
	}

	return {
		type: "QUESTION_GROUP",
		stimulusType: params?.stimulusType,
		stimulusContent: params?.stimulusContent,
		subQuestions: subQs,
	};
}

/**
 * Convert a GET response typeSpecificData (uses `questionType`)
 * back to a POST/PUT payload typeSpecificData (uses `type`).
 * Used when editing an existing question.
 */
export function responseToPayloadTypeSpecificData(
	tsd: ResponseTypeSpecificData,
): PayloadTypeSpecificData {
	// All fields are the same — only the discriminant key differs.
	const { questionType, ...rest } = tsd as any;
	return { type: questionType, ...rest } as PayloadTypeSpecificData;
}
