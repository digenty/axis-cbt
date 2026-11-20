import { useQuery } from "@tanstack/react-query";
import {
  getCbtOverview,
  getMyAssessments,
  getMyCbtOverview,
} from "@/api/cbt-overview";

export const useGetCbtOverview = (params?: {
  branchId?: number;
  levelId?: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["cbt-overview", params],
    queryFn: () => getCbtOverview(params),
    staleTime: 1000 * 60 * 5,
  });

export const useGetMyAssessments = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["my-assessments"],
    queryFn: getMyAssessments,
    staleTime: 1000 * 60 * 2,
    enabled: options?.enabled ?? true,
  });

export const useGetMyCbtOverview = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["cbt-overview", "my"],
    queryFn: getMyCbtOverview,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
