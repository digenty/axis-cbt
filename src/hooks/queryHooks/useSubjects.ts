import {
  getClassDetails,
  getSubjectsByArmId,
  getSubjectsByClassId,
  getTeacherSubjects,
  notifyTeacher,
} from "@/api/subjects";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    queryKey: ["subjects-by-class-id", classId],
    queryFn: () => getSubjectsByClassId(classId),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!classId,
  });
};

export const useGetSubjectsByArmId = (armId: number) => {
  return useQuery({
    queryKey: ["subjects-by-arm-id", armId],
    queryFn: () => getSubjectsByArmId(armId),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!armId,
  });
};

export const useNotifyTeacher = (armId: number) => {
  return useMutation({
    mutationFn: (subjectId: number) => notifyTeacher(armId, subjectId),
  });
};
