// ─── Topic ────────────────────────────────────────────────────────────────────

export interface CbtQueBankTopicPayload {
	name: string;
	classId: number;
	subjectId: number;
	branchId: number;
	description: string;
	displayOrder: number;
	id?: number;
}

export interface ApiTopic {
	id: number;
	name: string;
	description?: string;
	classId: number;
	subjectId: number;
	displayOrder?: number;
	branchId?: number;
}

export interface TopicsResponse {
	data: ApiTopic[];
	message: string;
	status: string;
}

export interface TopicResponse {
	data: ApiTopic;
	message: string;
	status: string;
}

// ─── Question type enums ──────────────────────────────────────────────────────

export type ApiQuestionType =
	| "MULTIPLE_CHOICE"
	| "TRUE_FALSE"
	| "ESSAY"
	| "FILL_IN_THE_BLANK"
	| "SHORT_ANSWER"
	| "MULTIPLE_ANSWERS"
	| "NUMERIC_ANSWER"
	| "MATCH"
	| "QUESTION_GROUP";

// ─── typeSpecificData variants ────────────────────────────────────────────────

export interface OptionData {
	optionText: string;
	optionHtml?: string;
	optionLabel?: string;
	imageUrl?: string;
	isCorrect: boolean;
}

export interface BlankData {
	blankLabel?: string;
	marks?: number;
	answerType?: "SHORT_ANSWER" | "MULTIPLE_CHOICE";
	correctAnswers?: string[];
}

export interface MatchPairData {
	itemText?: string;
	itemHtml?: string;
	matchText?: string;
	matchHtml?: string;
	itemImageUrl?: string;
	matchImageUrl?: string;
}

export interface SubQuestionRequest {
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	questionType: ApiQuestionType;
	typeSpecificData: TypeSpecificData;
}

export type TypeSpecificData =
	| { questionType: "MULTIPLE_CHOICE"; options: OptionData[] }
	| {
			questionType: "MULTIPLE_ANSWERS";
			options: OptionData[];
			minSelections?: number;
			maxSelections?: number;
			partialCredit?: boolean;
	  }
	| { questionType: "TRUE_FALSE"; correctAnswer: boolean }
	| {
			questionType: "ESSAY";
			minWords?: number;
			maxWords?: number;
			modelAnswer?: string;
			rubric?: string;
	  }
	| {
			questionType: "SHORT_ANSWER";
			correctAnswers?: string[];
			caseSensitive?: boolean;
			exactMatch?: boolean;
			maxLength?: number;
	  }
	| {
			questionType: "NUMERIC_ANSWER";
			correctAnswer?: number;
			tolerance?: number;
			minValue?: number;
			maxValue?: number;
			unit?: string;
			decimalPlaces?: number;
	  }
	| {
			questionType: "FILL_IN_THE_BLANK";
			blanks?: BlankData[];
			caseSensitive?: boolean;
			instruction?: string;
	  }
	| {
			questionType: "MATCH";
			pairs: MatchPairData[];
			marksForEach?: number;
			shuffleItems?: boolean;
			partialCredit?: boolean;
	  }
	| {
			questionType: "QUESTION_GROUP";
			stimulusType?: string;
			stimulusContent?: string;
			stimulusHtml?: string;
			stimulusImageUrl?: string;
			chartData?: string;
			tableData?: string;
			subQuestions?: SubQuestionRequest[];
	  };

// ─── Question request/response ────────────────────────────────────────────────

export interface CreateQuestionPayload {
	id?: number;
	classId: number;
	subjectId: number;
	topicId: number;
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	difficultyLevel?: string;
	questionType: ApiQuestionType;
	typeSpecificData: TypeSpecificData;
}

export interface UpdateQuestionPayload extends Partial<CreateQuestionPayload> {
	id: number;
}

/** Shape returned by the API for a single question */
export interface ApiQuestion {
	id: number;
	classId: number;
	subjectId: number;
	topicId: number;
	questionText: string;
	questionHtml?: string;
	imageUrl?: string;
	marks: number;
	explanation?: string;
	difficultyLevel?: string;
	questionType: ApiQuestionType;
	typeSpecificData: TypeSpecificData;
	createdAt?: string;
	updatedAt?: string;
}

export interface QuestionsListResponse {
	data: ApiQuestion[];
	message: string;
	status: string;
}

export interface QuestionResponse {
	data: ApiQuestion;
	message: string;
	status: string;
}
