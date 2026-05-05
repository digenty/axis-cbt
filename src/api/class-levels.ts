import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type { ClassLevelNamesResponse } from "@/types/branch";

const handleError = (e: unknown): never => {
  if (isAxiosError(e)) throw e.response?.data;
  throw e;
};

export const getClassLevelNames = async (params?: {
  branchId?: number;
}): Promise<ClassLevelNamesResponse> => {
  try {
    const { data } = await api.get("/class-levels/names", { params });
    return data;
  } catch (e) {
    return handleError(e);
  }
};
