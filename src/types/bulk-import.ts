// ─── Bulk Import Edit Request ─────────────────────────────────────────────────

export interface EditPreviewQuestionPayload {
  questionText: string;
  questionType: string;
  marks: number;
  explanation?: string;
  difficultyLevel?: string;
  options?: EditPreviewOption[];
  correctAnswer?: string;
  correctAnswers?: string[];
  blanks?: EditPreviewBlank[];
  suggestedTopicName?: string;
  imageUrl?: string | null;
  questionHtml?: string | null;
  section?: string;
}

export interface EditPreviewOption {
  label: string;
  text: string;
  isCorrect: boolean;
  optionHtml?: string | null;
  imageUrl?: string | null;
}

export interface EditPreviewBlank {
  label: string;
  acceptedAnswers: string[];
}

// ─── Bulk Import Edit Response ────────────────────────────────────────────────

export interface EditPreviewQuestionResponse {
  status: "success" | "error";
  message: string;
  data?: EditedPreviewQuestion;
  errors?: string[];
  warnings?: string[];
}

export interface EditedPreviewQuestion {
  id: string;
  number: number;
  type: string;
  status: "valid" | "needs_review";
  text: string;
  options?: EditPreviewOption[];
  correctAnswer?: string;
  explanation?: string;
  difficultyLevel?: string;
  marks: number;
  section?: string;
  suggestedTopicName?: string;
}

// ─── Batch validation error response ───────────────────────────────────────────

export interface PreviewValidationError {
  questionId: string;
  questionNumber: number;
  errors: string[];
  warnings?: string[];
}

export interface BatchValidationResponse {
  status: "error" | "partial" | "success";
  message: string;
  errors: PreviewValidationError[];
}
