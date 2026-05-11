// ─── Question type enum ───────────────────────────────────────────────────────

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "MULTIPLE_ANSWERS"
  | "TRUE_FALSE"
  | "ESSAY"
  | "SHORT_ANSWER"
  | "NUMERIC_ANSWER"
  | "FILL_IN_THE_BLANK"
  | "MATCH"
  | "QUESTION_GROUP"
  | "COMPREHENSION";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "";

// ─── Shared sub-shapes ────────────────────────────────────────────────────────

export interface OptionData {
  optionText: string;
  optionHtml?: string;
  optionLabel: string;
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

// ─── ResponseTypeSpecificData ─────────────────────────────────────────────────
// Discriminated on `questionType` — this is what the GET API returns.

export type ResponseTypeSpecificData =
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
      subQuestions?: ResponseSubQuestion[];
    }
  | {
      questionType: "COMPREHENSION";
      stimulusType?: string;
      stimulusContent?: string;
      stimulusHtml?: string;
      stimulusImageUrl?: string;
      subQuestions?: ResponseSubQuestion[];
    };

export interface ResponseSubQuestion {
  questionText: string;
  questionHtml?: string;
  imageUrl?: string;
  marks: number;
  explanation?: string;
  questionType: Exclude<QuestionType, "QUESTION_GROUP" | "COMPREHENSION">;
  typeSpecificData: Exclude<
    ResponseTypeSpecificData,
    { questionType: "QUESTION_GROUP" } | { questionType: "COMPREHENSION" }
  >;
}

// ─── PayloadTypeSpecificData ──────────────────────────────────────────────────
// Discriminated on `type` — this is what POST/PUT bodies must send.
// The Java backend's @JsonTypeInfo uses `type` as the property name.

export type PayloadTypeSpecificData =
  | { type: "MULTIPLE_CHOICE"; options: OptionData[] }
  | {
      type: "MULTIPLE_ANSWERS";
      options: OptionData[];
      minSelections?: number;
      maxSelections?: number;
      partialCredit?: boolean;
    }
  | { type: "TRUE_FALSE"; correctAnswer: boolean }
  | {
      type: "ESSAY";
      minWords?: number;
      maxWords?: number;
      modelAnswer?: string;
      rubric?: string;
    }
  | {
      type: "SHORT_ANSWER";
      correctAnswers?: string[];
      caseSensitive?: boolean;
      exactMatch?: boolean;
      maxLength?: number;
    }
  | {
      type: "NUMERIC_ANSWER";
      correctAnswer?: number;
      tolerance?: number;
      minValue?: number;
      maxValue?: number;
      unit?: string;
      decimalPlaces?: number;
    }
  | {
      type: "FILL_IN_THE_BLANK";
      blanks?: BlankData[];
      caseSensitive?: boolean;
      instruction?: string;
    }
  | {
      type: "MATCH";
      pairs: MatchPairData[];
      marksForEach?: number;
      shuffleItems?: boolean;
      partialCredit?: boolean;
    }
  | {
      type: "QUESTION_GROUP";
      stimulusType?: string;
      stimulusContent?: string;
      stimulusHtml?: string;
      stimulusImageUrl?: string;
      chartData?: string;
      tableData?: string;
      subQuestions?: PayloadSubQuestion[];
    }
  | {
      type: "COMPREHENSION";
      stimulusType?: string;
      stimulusContent?: string;
      stimulusHtml?: string;
      stimulusImageUrl?: string;
      subQuestions?: PayloadSubQuestion[];
    };

export type PayloadSubQuestionTypeSpecificData = Exclude<
  PayloadTypeSpecificData,
  { type: "QUESTION_GROUP" } | { type: "COMPREHENSION" }
>;

export type SubQuestionType = Exclude<
  QuestionType,
  "QUESTION_GROUP" | "COMPREHENSION"
>;

export interface PayloadSubQuestion {
  questionText: string;
  questionHtml?: string;
  imageUrl?: string;
  marks: number;
  explanation?: string;
  questionType: SubQuestionType;
  typeSpecificData: PayloadSubQuestionTypeSpecificData;
}

// ─── API Request payload (POST / PUT body) ────────────────────────────────────

export interface CreateQuestionPayload {
  classId: number;
  subjectId: number;
  topicId: number;
  questionText: string;
  questionHtml?: string;
  imageUrl?: string;
  marks: number;
  explanation?: string;
  difficultyLevel?: string;
  questionType: QuestionType;
  typeSpecificData: PayloadTypeSpecificData;
}

// ─── API Response shapes ──────────────────────────────────────────────────────

// export interface ApiOptions {
// 	id: number;
// 	optionText: string;
// 	optionHtml: string;
// 	optionLabel: string;
// 	optionOrder: number;
// 	imageUrl: string;
// 	isCorrect: boolean;
// }
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
  questionType: QuestionType;
  typeSpecificData: ResponseTypeSpecificData;
  options?: OptionData[];
  blanks?: BlankData[];
  pairs?: MatchPairData[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTopic {
  id: number;
  name: string;
  description?: string;
  classId: number;
  subjectId: number;
  branchId?: number;
  displayOrder?: number;
}

export interface CbtQueBankTopicPayload {
  name: string;
  classId: number;
  subjectId: number;
  // branchId: number;
  description: string;
  displayOrder: number;
  id?: number;
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

export interface ImportQuestionsResult {
  imported: number;
  failed: number;
  errors: string[];
}

// ─── Assessment settings (school-level CA/Exam definitions) ───────────────────

export interface AssessmentSetting {
  id: number;
  name: string;
  assessmentType: "CONTINUOUS_ASSESSMENT" | "EXAM";
  weight: number;
}

export interface AssessmentSettingsList {
  assessments: AssessmentSetting[];
  totalWeight: number;
}

export interface AssessmentSettingsListResponse {
  data: AssessmentSettingsList;
  message: string;
  status: string;
}

export interface QuestionBankStats {
  schoolId: number;
  classId: number;
  subjectId: number;
  questionCount: number;
  assessmentCount: number;
}

export interface QuestionBankStatsResponse {
  data: QuestionBankStats;
  message: string;
  status: string;
}

// ─── UI-only form state types ─────────────────────────────────────────────────

export interface OptionFormItem {
  id: string; // "a", "b", "c", "d"
  text: string;
  isCorrect: boolean;
}

export interface BlankFormItem {
  id: string;
  label: string;
  answerType: "short-answer" | "multiple-choice";
  answers: string[];
  mark: number;
  options?: OptionFormItem[];
}

export interface SubQuestionFormItem {
  id: string;
  type: SubQuestionType;
  text: string;
  marks: number;
  options: OptionFormItem[];
}

export type StimulusType =
  | "Comprehension Passage"
  | "Diagram"
  | "Table"
  | "Chart"
  | "Multiple Blanks";

// ─── Assessment API types ─────────────────────────────────────────────────────

export type ApiAssessmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ONGOING"
  | "COMPLETED"
  | "ARCHIVED";
export type ApiTerm = "FIRST" | "SECOND" | "THIRD";
export type ApiTestType =
  | "CONTINUOUS_ASSESSMENT"
  | "EXAMINATION"
  | "MOCK_EXAM"
  | "PRACTICE_TEST";

export interface SectionsSummary {
  id: number;
  name: string;
  questionCount: number;
}

export interface ApiAssessment {
  id: number;
  name: string;
  classId: number;
  subjectId: number;
  branchId: number;
  term: ApiTerm;
  testType: ApiTestType;
  assessmentSettingId: number | null;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  startDateTime: string;
  endDateTime: string;
  instructions: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
  status: ApiAssessmentStatus;
  questionCount: number;
  sectionCount?: number;
  sectionsSummary?: SectionsSummary[];
}

export interface ApiAssessmentDetail extends ApiAssessment {
  sections?: ApiSection[];
}

export interface ApiAssessmentQuestion {
  assessmentQuestionId: number;
  id: number;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  displayOrder: number;

  additionalData?: {
    correctAnswer: boolean;
  };
  branchId: number;
  classId: number;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  explanation: string | null;
  imageUrl: string | null;
  options: null;
  questionHtml: string | null;
  schoolId: number;
  subjectId: number;
  topicId: number;
}

export interface ApiSection {
  id: number;
  name: string;
  instructions: string;
  sectionOrder: number;
  timeLimitMinutes: number;
  questions: ApiAssessmentQuestion[];
}

export interface CreateAssessmentPayload {
  name: string;
  classId: number;
  subjectId: number;
  branchId: number;
  term: ApiTerm;
  testType: ApiTestType;
  assessmentSettingId: number | null;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  startDateTime: string;
  endDateTime: string;
  instructions: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  allowReview: boolean;
}

export type UpdateAssessmentPayload = Partial<CreateAssessmentPayload>;

export interface CreateSectionPayload {
  name: string;
  instructions: string;
  sectionOrder: number;
  timeLimitMinutes?: number;
  questionIds?: number[];
}

// PUT body shares the same shape; backend requires `name` + `sectionOrder` on every call.
export interface UpdateSectionPayload {
  name: string;
  instructions?: string;
  sectionOrder: number;
  timeLimitMinutes?: number;
  questionIds?: number[];
}

export interface GradeManuallyPayload {
  answerId: number;
  marksAwarded: number;
  feedback: string;
}

// ─── Enrollment ───────────────────────────────────────────────────────────────

export interface AssessmentEnrollment {
  studentId: number;
  studentName: string;
  studentAssessmentId: number | null;
  attemptStatus:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "PENDING"
    | "COMPLETED"
    | "ABSENT"
    | "TIMED_OUT";
}

export interface AssessmentEnrollmentResponse {
  data: AssessmentEnrollment[];
  message: string;
  status: string;
}

// ─── Per-attempt answers (manual grader source) ───────────────────────────────

export type GradingStatus =
  | "PENDING"
  | "AUTO_GRADED"
  | "MANUALLY_GRADED"
  | "REVIEW_REQUIRED";

export interface StudentAttemptAnswer {
  answerId: number;
  assessmentQuestionId: number;
  questionId: number;
  questionText: string;
  questionHtml?: string | null;
  questionType: QuestionType;
  maxMarks: number;
  answerData?: string | null;
  answerText?: string | null;
  selectedOptionId?: number | null;
  isCorrect?: boolean | null;
  marksAwarded?: number | null;
  gradingStatus: GradingStatus;
  autoGraded: boolean;
  feedback?: string | null;
  timeSpentSeconds?: number | null;
  flagged?: boolean | null;
  answeredAt?: string | null;
}

export interface StudentAttemptAnswersResponse {
  data: StudentAttemptAnswer[];
  message: string;
  status: string;
}

// ─── Teacher CBT overview (subjects-scoped) ───────────────────────────────────

export interface TeacherCbtSubjectSummary {
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  branchId: number;
  branchName: string;
  assessmentCount: number;
  questionCount: number;
}

export interface TeacherCbtOverview {
  subjects: TeacherCbtSubjectSummary[];
}

export type StudentResultStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PENDING"
  | "TIMED_OUT"
  | "ABSENT";

export interface AssessmentStudentResult {
  studentAssessmentId: number;
  studentId: number;
  studentName: string;
  admissionNumber: string;
  className: string;
  status: StudentResultStatus;
  score: number | null;
  totalMarks: number;
  percentage: number | null;
  passed: boolean | null;
  submissionTime: string | null;
  timeSpentSeconds: number | null;
}

export interface AssessmentResultsResponse {
  data: AssessmentStudentResult[];
  message: string;
  status: string;
}

export interface AssessmentStats {
  assessmentId: number;
  totalStudents: number;
  completed: number;
  pending: number;
  absent: number;
  averageScore: number;
  averagePercentage: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  failCount: number;
  passRate: number;
}

export interface AssessmentStatsResponse {
  data: AssessmentStats;
  message: string;
  status: string;
}

export interface AssessmentListResponse {
  data: ApiAssessment[];
  message: string;
  status: string;
}

export interface AssessmentResponse {
  data: ApiAssessment;
  message: string;
  status: string;
}

export interface AssessmentDetailResponse {
  data: ApiAssessmentDetail;
  message: string;
  status: string;
}

export interface SectionsResponse {
  data: ApiSection[];
  message: string;
  status: string;
}

export interface SectionResponse {
  data: ApiSection;
  message: string;
  status: string;
}
