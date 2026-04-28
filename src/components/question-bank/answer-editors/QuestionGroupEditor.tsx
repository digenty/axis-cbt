"use client";

import { ComprehensionPassageEditor } from "./ComprehensionPassageEditor";
import type { Question } from "@/types";

type MaterialKind = "comprehension-passage" | "diagram" | "table" | "chart";

interface QuestionGroupEditorProps {
  materialKind: MaterialKind;
  onChangeMaterialKind: (k: MaterialKind) => void;
  instruction: string;
  onChangeInstruction: (i: string) => void;
  subQuestions: Question[];
  onChangeSubQuestions: (qs: Question[]) => void;
}

export const QuestionGroupEditor = ({
  instruction,
  onChangeInstruction,
  subQuestions,
  onChangeSubQuestions,
}: QuestionGroupEditorProps) => (
  <ComprehensionPassageEditor
    instruction={instruction}
    onChangeInstruction={onChangeInstruction}
    subQuestions={subQuestions}
    onChangeSubQuestions={onChangeSubQuestions}
  />
);
