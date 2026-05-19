// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface StudentLoginResponse {
  data: { token: string; assessmentId: number };
  message: string;
  status: string;
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type AttemptStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING"
  | "COMPLETED"
  | "ABSENT"
  | "TIMED_OUT";

export type ApiTestType =
  | "CONTINUOUS_ASSESSMENT"
  | "EXAMINATION"
  | "MOCK_EXAM"
  | "PRACTICE_TEST";

export type ApiTerm = "FIRST" | "SECOND" | "THIRD";

export type ApiAssessmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ONGOING"
  | "COMPLETED"
  | "ARCHIVED";

// ─── Student dashboard ────────────────────────────────────────────────────────

export interface ApiStudentAssessmentItem {
  assessmentId: number;
  name: string;
  subjectName: string;
  className: string;
  testType: ApiTestType;
  term: ApiTerm;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  startDateTime: string;
  endDateTime: string;
  studentAssessmentId: number | null;
  attemptStatus: AttemptStatus | null;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  canStart?: boolean;
  canResume?: boolean;
}

export interface ApiStudentDashboard {
  studentId: number;
  studentName: string;
  armDisplay: string;
  activeAssessments: ApiStudentAssessmentItem[];
  upcomingAssessments: ApiStudentAssessmentItem[];
  completedAssessments: ApiStudentAssessmentItem[];
}

// ─── Assessment preview ───────────────────────────────────────────────────────

export interface ApiAssessmentPreview {
  assessmentId: number;
  name: string;
  className: string;
  subjectName: string;
  branchName: string;
  testType: ApiTestType;
  term: ApiTerm;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  instructions: string | null;
  startDateTime: string;
  endDateTime: string;
  allowReview: boolean;
  showResultsImmediately: boolean;
  studentAssessmentId: number | null;
  attemptStatus: AttemptStatus | null;
}

// ─── Student result ───────────────────────────────────────────────────────────

export type StudentAnswerGradingStatus =
  | "PENDING"
  | "AUTO_GRADED"
  | "MANUALLY_GRADED"
  | "REVIEW_REQUIRED";

export interface StudentAnswerSummary {
  assessmentQuestionId: number;
  questionText: string;
  questionType: string;
  maxMarks: number;
  answerData?: string | null;
  isCorrect?: boolean | null;
  marksAwarded?: number | null;
  gradingStatus: StudentAnswerGradingStatus;
  feedback?: string | null;
}

export interface ApiStudentResult {
  studentAssessmentId: number;
  assessmentId: number;
  assessmentName: string;
  status: AttemptStatus;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  submissionTime: string;
  timeSpentSeconds: number;
  answers?: StudentAnswerSummary[];
}

// ─── Assessment paper ─────────────────────────────────────────────────────────

export interface ApiStudentOption {
  id: number;
  optionText: string;
  optionHtml: string | null;
  optionLabel: string;
  optionOrder: number;
  imageUrl: string | null;
}

export interface ApiMatchLeftItem {
  pairId: number;
  itemOrder: number;
  itemText: string;
  itemHtml: string | null;
  imageUrl: string | null;
}

export interface ApiMatchRightItem {
  matchId: number;
  matchText: string;
  matchHtml: string | null;
  imageUrl: string | null;
}

export interface ApiSubQuestion {
  subQuestionId: number;
  questionText: string;
  questionHtml: string | null;
  marks: number;
  questionType: string;
  options?: ApiStudentOption[];
}

export interface ApiStudentQuestion {
  assessmentQuestionId: number;
  questionId: number;
  questionText: string;
  questionHtml: string | null;
  imageUrl: string | null;
  marks: number;
  questionType: string;
  typeData: unknown;
}

export interface ApiStudentSection {
  sectionId: number;
  name: string;
  instructions: string | null;
  sectionOrder: number;
  timeLimitMinutes: number | null;
  questions: ApiStudentQuestion[];
}

export interface ApiStudentPaper {
  studentAssessmentId: number;
  assessmentId: number;
  assessmentName: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: string | null;
  timeRemainingSeconds: number | null;
  examEndTime: string | null;
  sections: ApiStudentSection[];
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface StartAssessmentPayload {
  assessmentId: number;
  studentId?: number;
  ipAddress?: string;
  browserInfo?: string;
}

export interface SubmitAnswerPayload {
  studentAssessmentId: number;
  assessmentQuestionId: number;
  answerData: unknown;
  timeSpentSeconds?: number;
  flagged?: boolean;
}

// ─── Started assessment (response from start) ────────────────────────────────

export interface ApiStartedAssessment {
  id: number;
  assessmentId: number;
  studentId: number;
  status: AttemptStatus;
  startTime: string;
  endTime: string | null;
  submissionTime: string | null;
  score: number | null;
  totalMarks: number | null;
}

// ─── Submit assessment response ───────────────────────────────────────────────

export interface ApiSubmitAssessmentResponse {
  data: {
    studentAssessmentId: number;
    status: AttemptStatus;
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
    lateSubmission: boolean;
    submissionTime: string;
    showResultsImmediately: boolean;
  };
}

// ─── Answer review (GET /api/cbt/assessments/student-attempts/{id}/review) ────

export interface ApiAnswerReview {
  answerId: number;
  assessmentQuestionId: number;
  questionId: number;
  questionText: string;
  questionHtml: string;
  questionType: string;
  maxMarks: number;
  marksAwarded: number;
  isCorrect: boolean;
  gradingStatus: StudentAnswerGradingStatus;
  feedback: string;
  answerData: string;
  correctAnswer: unknown;
}

export interface ApiReviewQuestion {
  answerId: number | null;
  assessmentQuestionId: number;
  questionId: number;
  questionText: string;
  questionHtml: string | null;
  questionType: string;
  imageUrl: string | null;
  typeData: unknown;
  maxMarks: number;
  marksAwarded: number | null;
  isCorrect: boolean | null;
  gradingStatus: StudentAnswerGradingStatus | null;
  feedback: string | null;
  answerData: string | null;
  correctAnswer: unknown;
}

export interface ApiReviewSection {
  sectionId: number;
  name: string;
  instructions: string | null;
  sectionOrder: number;
  questions: ApiReviewQuestion[];
}

export interface ApiAttemptReview {
  sections: ApiReviewSection[];
}

// ─── CBT Overview (teacher/admin dashboard) ───────────────────────────────────

export interface ApiCbtArmSummary {
  armId: number;
  armName: string;
  className: string;
  displayName: string;
  classId: number;
  branchId: number;
  branchName: string;
  levelId: number;
  subjectCount: number;
}

export interface ApiCbtOverview {
  totalClasses: number;
  totalSubjects: number;
  arms: ApiCbtArmSummary[];
}

// ─── Teacher's assessments (global results) ───────────────────────────────────

export interface TeacherAssessmentListItem {
  id: number;
  name: string;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  branchId: number;
  testType: ApiTestType;
  term: ApiTerm;
  status: ApiAssessmentStatus;
  durationMinutes: number;
  totalMarks: number;
  startDateTime: string | null;
  endDateTime: string | null;
  questionCount: number;
}
