/**
 * CBT Subjects API
 * Mirrors the pattern from the main app's subjects.ts
 */
import api from "@/lib/axios-auth";
import {
  ClassSubjectsResponse,
  TeacherSubjectsResponse,
} from "@/types/subjects";
import { isAxiosError } from "axios";

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

export const getSubjectsByClassId = async (
  classId: number,
): Promise<ClassSubjectsResponse> => {
  try {
    const { data } = await api.get<ClassSubjectsResponse>(
      `/subjects/class/${classId}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
