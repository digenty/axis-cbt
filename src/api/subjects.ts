/**
 * CBT Subjects API
 * Mirrors the pattern from the main app's subjects.ts
 */
import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ClassArmReportDtos {
  armId: number;
  classArmName: string;
  classId: number;
  reportStatus: string;
}
export interface ApiSubject {
  classArmReportDtos: ClassArmReportDtos[];
  subjectId: number;
  subjectName: string;
}

export interface TeacherSubjectsResponse {
  data: ApiSubject[];
  message: string;
  status: string;
}

export interface ApiSchoolResponse {
  active: boolean;
  address: string;
  adminId: number;
  country: string;
  createdAt: string;
  currency: string;
  email: string;
  id: number;
  logo: string;
  motto: string;
  name: string;
  phoneNumber: string;
  studentPopulation: number;
  timezone: string;
  updatedAt: string;
  uuid: string;
  version: number;
}

// ── API calls ──────────────────────────────────────────────────────────────────

export const getTeacherSubjects = async () => {
  try {
    const { data } = await api.get("/teacher/subject/my");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getClassDetails = async (id: number) => {
  try {
    const { data } = await api.get(`/classes/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getSubjectsByClass = async (
  className?: string,
  levelType?: string,
  branchId?: number,
): Promise<TeacherSubjectsResponse> => {
  try {
    const { data } = await api.get<TeacherSubjectsResponse>(
      `/subjects/class?className=${className}&levelType=${levelType}${branchId ? `&branchId=${branchId}` : ""}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
