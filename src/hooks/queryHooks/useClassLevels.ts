import { useQuery } from "@tanstack/react-query";
import { getClassLevelNames } from "@/api/class-levels";

export const useGetClassLevelNames = (branchId?: number) =>
  useQuery({
    queryKey: ["class-level-names", branchId],
    queryFn: () => getClassLevelNames(branchId ? { branchId } : undefined),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
