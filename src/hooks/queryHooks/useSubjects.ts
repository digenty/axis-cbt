import { useQuery } from "@tanstack/react-query";
import {
<<<<<<< HEAD
  getTeacherSubjects,
  getClassDetails,
  getSubjectsByClassId,
=======
	getTeacherSubjects,
	getClassDetails,
	getSubjectsByClassId,
>>>>>>> new-cbt
} from "@/api/subjects";

export const useGetTeacherSubjects = () => {
  return useQuery({
    queryKey: ["teacher-subjects"],
    queryFn: getTeacherSubjects,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetClassDetails = (id: number) => {
  return useQuery({
    queryKey: ["get-class-details", id],
    queryFn: () => getClassDetails(id),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetSubjectsByClassId = (classId: number) => {
  return useQuery({
    queryKey: ["subjects-by-class", classId],
    queryFn: () => getSubjectsByClassId(classId),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!classId,
  });
};

export const useGetSubjectsByClassId = (classId: number) => {
	return useQuery({
		queryKey: ["subjects-by-class-id", classId],
		queryFn: () => getSubjectsByClassId(classId),
		retry: 1,
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: !!classId,
	});
};
