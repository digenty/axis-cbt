import { useQuery } from "@tanstack/react-query";
import { getTeacherSubjects, getSubjectsByClass } from "@/api/subjects";

export const subjectKeys = {
	mySubjects: ["teacher-subjects"] as const,
	subjectsByClass: (
		className?: string,
		levelType?: string,
		branchId?: number,
	) => ["subjects-by-class", className, levelType, branchId] as const,
};

export const useGetTeacherSubjects = () => {
	return useQuery({
		queryKey: subjectKeys.mySubjects,
		queryFn: getTeacherSubjects,
		retry: 1,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useGetSubjectsByClass = (
	className?: string,
	levelType?: string,
	branchId?: number,
) => {
	return useQuery({
		queryKey: subjectKeys.subjectsByClass(className, levelType, branchId),
		queryFn: () => getSubjectsByClass(className, levelType, branchId),
		enabled: !!className && !!levelType,
		retry: 1,
	});
};
