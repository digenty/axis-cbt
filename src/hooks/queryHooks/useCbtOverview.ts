import { useQuery } from "@tanstack/react-query";
import { getCbtOverview, getMyAssessments } from "@/api/cbt-overview";

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

export const useGetMyAssessments = () =>
  useQuery({
    queryKey: ["my-assessments"],
    queryFn: getMyAssessments,
    staleTime: 1000 * 60 * 2,
  });
