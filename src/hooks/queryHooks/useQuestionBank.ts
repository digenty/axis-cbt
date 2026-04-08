import {
	addCbtQuestionBankTopics,
	getCbtQuestionBankTopics,
} from "@/api/question-bank";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCbtQuestionBankTopics = (payload: {
	classId?: number;
	subjectId?: number;
}) => {
	return useQuery({
		queryKey: ["get-cbt-questionBank-topics"],
		queryFn: () => getCbtQuestionBankTopics(payload),
		retry: 1,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useAddCbtQuestionBankTopics = () => {
	return useMutation({
		mutationKey: ["add-cbt-question-bank-topics"],
		mutationFn: addCbtQuestionBankTopics,
	});
};
