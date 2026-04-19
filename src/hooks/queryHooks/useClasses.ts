import { useQuery } from "@tanstack/react-query";
import { getAllClasses } from "@/api/classes";

export const useGetAllClasses = () => {
	return useQuery({
		queryKey: ["all-classes"],
		queryFn: () => getAllClasses(),
		retry: 1,
		staleTime: 1000 * 60 * 5,
	});
};
