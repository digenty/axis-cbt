import studentApi, { publicStudentApi } from "@/lib/axios-student";
import { isAxiosError } from "axios";
import type {
  ApiStudentDashboard,
  ApiAssessmentPreview,
  ApiStudentResult,
  ApiStudentPaper,
  ApiStartedAssessment,
  ApiSubmitAssessmentResponse,
  ApiAttemptReview,
  StartAssessmentPayload,
  StudentLoginResponse,
  SubmitAnswerPayload,
} from "@/types/student-api";

const handleError = (error: unknown): never => {
  if (isAxiosError(error)) throw error.response?.data;
  throw error;
};

export const studentLogin = async (
  admissionNumber: string,
  passcode: string,
): Promise<StudentLoginResponse> => {
  try {
    const { data } = await publicStudentApi.post("/auth/student/login", {
      admissionNumber,
      passcode,
    });
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getStudentDashboard = async (): Promise<ApiStudentDashboard> => {
  try {
    const { data } = await studentApi.get("/cbt/student/dashboard");
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getAssessmentPreview = async (
  assessmentId: number,
): Promise<{ data: ApiAssessmentPreview }> => {
  try {
    const { data } = await studentApi.get(
      `/cbt/student/assessments/${assessmentId}/preview`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getStudentResult = async (
  studentAssessmentId: number,
): Promise<ApiStudentResult> => {
  try {
    const { data } = await studentApi.get(
      `/cbt/student/results/${studentAssessmentId}`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const startAssessment = async (
  payload: StartAssessmentPayload,
): Promise<{ data: ApiStartedAssessment }> => {
  try {
    const { data } = await studentApi.post(
      "/api/cbt/assessments/start",
      payload,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getAssessmentPaper = async (
  studentAssessmentId: number,
): Promise<{ data: ApiStudentPaper }> => {
  try {
    const { data } = await studentApi.get(
      `/api/cbt/assessments/paper/${studentAssessmentId}`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const submitAnswer = async (
  payload: SubmitAnswerPayload,
): Promise<void> => {
  try {
    await studentApi.post("/api/cbt/assessments/answers", payload);
  } catch (e) {
    return handleError(e);
  }
};

export const submitAssessment = async (
  studentAssessmentId: number,
): Promise<ApiSubmitAssessmentResponse> => {
  try {
    const { data } = await studentApi.post(
      `/api/cbt/assessments/submit/${studentAssessmentId}`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getStudentAttemptReview = async (
  studentAssessmentId: number,
): Promise<{ data: ApiAttemptReview }> => {
  try {
    const { data } = await studentApi.get(
      `/api/cbt/assessments/student-attempts/${studentAssessmentId}/review`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};
