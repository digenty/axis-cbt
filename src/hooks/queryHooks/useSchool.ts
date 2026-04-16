import { getSchools } from "@/api/school";
import { useQuery } from "@tanstack/react-query";

export const useGetSchools = () => {
  return useQuery({
    queryKey: ["getSchools"],
    queryFn: getSchools,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
