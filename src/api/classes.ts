import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import { ClassesResponse } from "@/types/classes";

export const getAllClasses = async (params?: {
  page?: number;
  size?: number;
  branchId?: number;
  schoolId?: number;
}): Promise<ClassesResponse> => {
  try {
    const { data } = await api.get<ClassesResponse>("/classes", { params });
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
