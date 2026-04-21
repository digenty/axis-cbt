import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type {
  ApiCbtOverview,
  TeacherAssessmentListItem,
} from "@/types/student-api";

const handleError = (error: unknown): never => {
  if (isAxiosError(error)) throw error.response?.data;
  throw error;
};

export const getCbtOverview = async (params?: {
  branchId?: number;
  levelId?: number;
  search?: string;
}): Promise<ApiCbtOverview> => {
  try {
    const { data } = await api.get("/api/cbt/overview", { params });
    return data;
  } catch (e) {
    return handleError(e);
  }
};

export const getMyAssessments = async (): Promise<
  TeacherAssessmentListItem[]
> => {
  try {
    const { data } = await api.get("/api/cbt/assessments/my");
    return data;
  } catch (e) {
    return handleError(e);
  }
};
