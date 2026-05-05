import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type { BranchesResponse } from "@/types/branch";

const handleError = (e: unknown): never => {
  if (isAxiosError(e)) throw e.response?.data;
  throw e;
};

export const getBranches = async (): Promise<BranchesResponse> => {
  try {
    const { data } = await api.get("/branches", {
      params: { page: 0, size: 100 },
    });
    return data;
  } catch (e) {
    return handleError(e);
  }
};
