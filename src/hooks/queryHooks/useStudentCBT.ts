import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAssessmentPaper,
  getAssessmentPreview,
  getStudentDashboard,
  getStudentResult,
  startAssessment,
  submitAnswer,
  submitAssessment,
} from "@/api/student";
import { submitAnswersBatch } from "@/api/assessment";
import type {
  StartAssessmentPayload,
  SubmitAnswerPayload,
} from "@/types/student-api";

export const studentKeys = {
  dashboard: ["student", "dashboard"] as const,
  preview: (assessmentId: number) =>
    ["student", "preview", assessmentId] as const,
  result: (studentAssessmentId: number) =>
    ["student", "result", studentAssessmentId] as const,
  paper: (studentAssessmentId: number) =>
    ["student", "paper", studentAssessmentId] as const,
};

export const useGetStudentDashboard = () =>
  useQuery({
    queryKey: studentKeys.dashboard,
    queryFn: getStudentDashboard,
    staleTime: 1000 * 60 * 2,
  });

export const useGetAssessmentPreview = (assessmentId: number) =>
  useQuery({
    queryKey: studentKeys.preview(assessmentId),
    queryFn: () => getAssessmentPreview(assessmentId),
    enabled: !!assessmentId,
    staleTime: 1000 * 60 * 5,
  });

export const useGetStudentResult = (studentAssessmentId: number) =>
  useQuery({
    queryKey: studentKeys.result(studentAssessmentId),
    queryFn: () => getStudentResult(studentAssessmentId),
    enabled: !!studentAssessmentId,
    staleTime: 1000 * 60 * 5,
  });

export const useGetAssessmentPaper = (studentAssessmentId: number) =>
  useQuery({
    queryKey: studentKeys.paper(studentAssessmentId),
    queryFn: () => getAssessmentPaper(studentAssessmentId),
    enabled: !!studentAssessmentId,
    staleTime: Infinity,
  });

export const useStartAssessment = () =>
  useMutation({
    mutationFn: (payload: StartAssessmentPayload) => startAssessment(payload),
  });

export const useSubmitAnswer = () =>
  useMutation({
    mutationFn: (payload: SubmitAnswerPayload) => submitAnswer(payload),
  });

export const useSubmitAnswersBatch = () =>
  useMutation({
    mutationFn: (payload: SubmitAnswerPayload[]) => submitAnswersBatch(payload),
  });

export const useSubmitAssessment = () =>
  useMutation({
    mutationFn: (studentAssessmentId: number) =>
      submitAssessment(studentAssessmentId),
  });
