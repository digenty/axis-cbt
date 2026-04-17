// ─── Internal question types used in forms ────────────────────────────────────
// These are UI-only types. They get mapped to API DTOs before saving.

import { QuestionType } from "./question";

// export type QuestionType =
// 	| "multiple-choice"
// 	| "multiple-answers"
// 	| "true-false"
// 	| "essay"
// 	| "fill-in-blank"
// 	| "short-answer"
// 	| "numerical"
// 	| "matching"
// 	| "question-group"
// 	| "multiple-blanks"
// 	| "comprehension-passage";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Blank {
  id: string;
  label: string;
  answerType: "short-answer" | "multiple-choice";
  answers: string[];
  mark: number;
  options?: Option[];
}

export interface MatchItem {
  id: string;
  text: string;
}

// ─── The core form state for single questions ─────────────────────────────────

export interface SingleQuestionFormState {
  questionType: QuestionType;
  questionText: string;
  marks: number;
  instruction: string;
  options: Option[];
  correctAnswer: string;
  imageUrl: string | null;
}

// ─── Group / blanks form state lives in their own components ─────────────────

export interface SubQuestion {
  id: string;
  questionText: string;
  marks: number;
  instruction: string;
  options: Option[];
  correctAnswer: string;
}

export interface QuestionGroupFormState {
  groupName: string;
  materialType: string;
  passage: string;
  instruction: string;
  subQuestions: SubQuestion[];
}

export interface MultipleBlanksFormState {
  instruction: string;
  questionText: string;
  blanks: Blank[];
}

// ─── Shape returned from API, normalized for display ─────────────────────────

export interface NormalizedQuestion {
  id: number;
  topicId: number;
  questionType: QuestionType;
  questionText: string;
  marks: number;
  instruction?: string;
  options?: Option[];
  correctAnswer?: string | string[];
  blanks?: Blank[];
  passage?: string;
  subQuestions?: NormalizedQuestion[];
  matchItems?: MatchItem[];
  matchOptions?: MatchItem[];
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
