import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
  ApiStudentDashboard,
  ApiAssessmentPreview,
  ApiStudentResult,
  ApiStudentPaper,
  ApiStartedAssessment,
  StartAssessmentPayload,
  SubmitAnswerPayload,
} from "@/types/student-api";

const handleError = (error: unknown): never => {
  if (isAxiosError(error)) throw error.response?.data;
  throw error;
};

export const getStudentDashboard = async (): Promise<ApiStudentDashboard> => {
  try {
    const { data } = await api.get("/cbt/student/dashboard");
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getAssessmentPreview = async (
  assessmentId: number,
): Promise<ApiAssessmentPreview> => {
  try {
    const { data } = await api.get(
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
    const { data } = await api.get(
      `/cbt/student/results/${studentAssessmentId}`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const startAssessment = async (
  payload: StartAssessmentPayload,
): Promise<ApiStartedAssessment> => {
  try {
    const { data } = await api.post("/api/cbt/assessments/start", payload);
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getAssessmentPaper = async (
  studentAssessmentId: number,
): Promise<ApiStudentPaper> => {
  try {
    const { data } = await api.get(
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
    await api.post("/api/cbt/assessments/answers", payload);
  } catch (e) {
    return handleError(e);
  }
};

export const submitAssessment = async (
  studentAssessmentId: number,
): Promise<ApiStartedAssessment> => {
  try {
    const { data } = await api.post(
      `/api/cbt/assessments/submit/${studentAssessmentId}`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};
