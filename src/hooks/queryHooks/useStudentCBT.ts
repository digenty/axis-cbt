import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAssessmentPaper,
  getAssessmentPreview,
  getStudentAttemptReview,
  getStudentDashboard,
  getStudentResult,
  startAssessment,
  studentLogin,
  submitAnswer,
  submitAssessment,
} from "@/api/student";
import { getStudentAttemptAnswers, submitAnswersBatch } from "@/api/assessment";
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
  answers: (studentAssessmentId: number) =>
    ["student", "answers", studentAssessmentId] as const,
  review: (studentAssessmentId: number) =>
    ["student", "review", studentAssessmentId] as const,
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

export const useGetStudentAttemptAnswers = (studentAssessmentId: number) =>
  useQuery({
    queryKey: studentKeys.answers(studentAssessmentId),
    queryFn: () => getStudentAttemptAnswers(studentAssessmentId),
    enabled: studentAssessmentId > 0,
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

export const useGetStudentAttemptReview = (studentAssessmentId: number) =>
  useQuery({
    queryKey: studentKeys.review(studentAssessmentId),
    queryFn: () => getStudentAttemptReview(studentAssessmentId),
    enabled: !!studentAssessmentId,
    staleTime: Infinity,
  });

export const useStudentLogin = () =>
  useMutation({
    mutationFn: ({
      admissionNumber,
      passcode,
    }: {
      admissionNumber: string;
      passcode: string;
    }) => studentLogin(admissionNumber, passcode),
  });
