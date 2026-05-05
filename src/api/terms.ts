import api from "@/lib/axios-auth";
import { isAxiosError } from "axios";
import type { TermsResponse } from "@/types/term";

const handleError = (e: unknown): never => {
  if (isAxiosError(e)) throw e.response?.data;
  throw e;
};

export const getTermsBySchool = async (
  schoolId: number,
): Promise<TermsResponse> => {
  try {
    const { data } = await api.get(
      `/academic/session/school/${schoolId}/terms`,
    );
    return data;
  } catch (e) {
    return handleError(e);
  }
};
