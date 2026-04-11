import { addAssessment, getAssessments } from "@/api/assessment";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAssessments = (payload: {
	branchId: number;
	classId: number;
	subjectId: number;
}) => {
	return useQuery({
		queryKey: ["get-assessments"],
		queryFn: () => getAssessments(payload),
		retry: 1,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useAddAssessment = () => {
	return useMutation({
		mutationKey: ["add-assessment"],
		mutationFn: addAssessment,
	});
};
