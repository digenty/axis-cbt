import { useQuery } from "@tanstack/react-query";
import { getTermsBySchool } from "@/api/terms";

export const useGetTermsBySchool = (schoolId?: number) =>
  useQuery({
    queryKey: ["terms", schoolId],
    queryFn: () => getTermsBySchool(schoolId!),
    enabled: !!schoolId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
