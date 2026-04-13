import type {
	BlankFormItem,
	CreateQuestionPayload,
	OptionData,
	OptionFormItem,
	QuestionType,
	SubQuestionFormItem,
	SubQuestionType,
	SubQuestionTypeSpecificData,
	TypeSpecificData,
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

// ─── Local ID generator ───────────────────────────────────────────────────────

export const generateId = (): string => Math.random().toString(36).slice(2, 10);

// ─── TypeSpecificData builders ────────────────────────────────────────────────
// All builders use `questionType` as the discriminant to match the API.

export function buildMCQData(options: OptionFormItem[]): TypeSpecificData {
	return { questionType: "MULTIPLE_CHOICE", options: toApiOptions(options) };
}

export function buildMAData(
	options: OptionFormItem[],
	partialCredit = false,
): TypeSpecificData {
	return {
		questionType: "MULTIPLE_ANSWERS",
		options: toApiOptions(options),
		partialCredit,
	};
}

export function buildTrueFalseData(correctAnswer: boolean): TypeSpecificData {
	return { questionType: "TRUE_FALSE", correctAnswer };
}

export function buildEssayData(modelAnswer?: string): TypeSpecificData {
	return {
		questionType: "ESSAY",
		modelAnswer: modelAnswer || undefined,
	};
}

export function buildShortAnswerData(
	answersRaw: string,
	caseSensitive = false,
): TypeSpecificData {
	return {
		questionType: "SHORT_ANSWER",
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
): TypeSpecificData {
	return {
		questionType: "NUMERIC_ANSWER",
		correctAnswer,
		tolerance: tolerance || undefined,
		unit: unit || undefined,
	};
}

export function buildFillInBlankData(
	blanks: BlankFormItem[],
	instruction?: string,
): TypeSpecificData {
	return {
		questionType: "FILL_IN_THE_BLANK",
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
): TypeSpecificData {
	return {
		questionType: "MATCH",
		pairs,
		marksForEach,
		shuffleItems: true,
		partialCredit: false,
	};
}

export function buildSubQTypeSpecificData(
	sub: SubQuestionFormItem,
): SubQuestionTypeSpecificData {
	switch (sub.type) {
		case "MULTIPLE_CHOICE":
			return {
				questionType: "MULTIPLE_CHOICE",
				options: toApiOptions(sub.options),
			};
		case "MULTIPLE_ANSWERS":
			return {
				questionType: "MULTIPLE_ANSWERS",
				options: toApiOptions(sub.options),
				partialCredit: false,
			};
		case "TRUE_FALSE":
			return {
				questionType: "TRUE_FALSE",
				correctAnswer: sub.trueFalseAnswer,
			};
		case "SHORT_ANSWER":
			return {
				questionType: "SHORT_ANSWER",
				correctAnswers: sub.correctAnswerText
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
				caseSensitive: false,
			};
		case "NUMERIC_ANSWER":
			return {
				questionType: "NUMERIC_ANSWER",
				correctAnswer: Number(sub.correctAnswerText) || 0,
			};
		case "FILL_IN_THE_BLANK":
			return {
				questionType: "FILL_IN_THE_BLANK",
				blanks: [],
			};
		case "MATCH":
			return { questionType: "MATCH", pairs: [] };
		case "ESSAY":
		default:
			return { questionType: "ESSAY" };
	}
}

/**
 * Build the typeSpecificData for QUESTION_GROUP and COMPREHENSION.
 * COMPREHENSION is sent to the API exactly like QUESTION_GROUP —
 * the distinction is in stimulusType so the backend can differentiate.
 */
export function buildGroupData(params: {
	questionType: "QUESTION_GROUP" | "COMPREHENSION";
	stimulusType: string;
	stimulusContent: string;
	subQuestions: SubQuestionFormItem[];
}): TypeSpecificData {
	return {
		questionType: params.questionType,
		stimulusType: params.stimulusType,
		stimulusContent: params.stimulusContent,
		subQuestions: params.subQuestions.map((sq) => ({
			questionText: sq.text,
			marks: sq.marks,
			questionType: sq.type,
			typeSpecificData: buildSubQTypeSpecificData(sq),
		})),
	} as TypeSpecificData;
}

/**
 * Build a complete CreateQuestionPayload for single-type questions.
 * For QUESTION_GROUP / COMPREHENSION / FILL_IN_THE_BLANK / MATCH
 * use their dedicated form components which call the API directly.
 */
export function buildSingleQuestionPayload(params: {
	classId: number;
	subjectId: number;
	topicId: number;
	questionType: QuestionType;
	questionText: string;
	marks: number;
	explanation?: string;
	difficultyLevel?: string;
	imageUrl?: string;
	// type-specific
	options: OptionFormItem[];
	trueFalseAnswer: boolean;
	correctAnswerText: string;
	numericAnswer: number;
	numericTolerance: number;
	numericUnit: string;
}): CreateQuestionPayload {
	let typeSpecificData: TypeSpecificData;

	switch (params.questionType) {
		case "MULTIPLE_CHOICE":
			typeSpecificData = buildMCQData(params.options);
			break;
		case "MULTIPLE_ANSWERS":
			typeSpecificData = buildMAData(params.options);
			break;
		case "TRUE_FALSE":
			typeSpecificData = buildTrueFalseData(params.trueFalseAnswer);
			break;
		case "SHORT_ANSWER":
			typeSpecificData = buildShortAnswerData(params.correctAnswerText);
			break;
		case "NUMERIC_ANSWER":
			typeSpecificData = buildNumericData(
				params.numericAnswer,
				params.numericTolerance,
				params.numericUnit,
			);
			break;
		case "ESSAY":
		default:
			typeSpecificData = buildEssayData();
	}

	return {
		classId: params.classId,
		subjectId: params.subjectId,
		topicId: params.topicId,
		questionText: params.questionText,
		marks: params.marks,
		explanation: params.explanation || undefined,
		difficultyLevel: params.difficultyLevel || undefined,
		imageUrl: params.imageUrl || undefined,
		questionType: params.questionType,
		typeSpecificData,
	};
}
