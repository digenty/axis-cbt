import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/api/branches";

export const useGetBranches = () =>
  useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
