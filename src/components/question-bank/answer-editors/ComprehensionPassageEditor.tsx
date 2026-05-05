"use client";

import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateId } from "@/lib/utils";
import { SubQuestionRow } from "./SubQuestionRow";
import type { Question } from "@/types";

interface ComprehensionPassageEditorProps {
  subQuestions: Question[];
  instruction: string;
  onChangeInstruction: (instruction: string) => void;
  onChangeSubQuestions: (qs: Question[]) => void;
}

const makeSubQuestion = (): Question => ({
  id: generateId(),
  topicId: 0 as unknown as Question["topicId"],
  type: "multiple-choice",
  text: "",
  marks: 1,
  options: [
    { id: "a", text: "", isCorrect: false },
    { id: "b", text: "", isCorrect: false },
    { id: "c", text: "", isCorrect: false },
    { id: "d", text: "", isCorrect: false },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const ComprehensionPassageEditor = ({
  subQuestions,
  instruction,
  onChangeInstruction,
  onChangeSubQuestions,
}: ComprehensionPassageEditorProps) => {
  const update = (id: string, patch: Question) =>
    onChangeSubQuestions(subQuestions.map((q) => (q.id === id ? patch : q)));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-[var(--color-text-default)]">
          Questions ({subQuestions.length})
        </h3>
      </div>

      <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-4">
        <Label className="text-sm font-medium text-[var(--color-text-default)]">
          Instruction{" "}
          <span className="text-[var(--color-text-muted)]">(optional)</span>
        </Label>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Add a brief instruction if needed. Example: &quot;Answer the following
          questions&quot;
        </p>
        <Input
          value={instruction}
          onChange={(e) => onChangeInstruction(e.target.value)}
          placeholder="Example: Answer the following questions"
          className="mt-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        {subQuestions.map((q, i) => (
          <SubQuestionRow
            key={q.id}
            index={i}
            question={q}
            onChange={(next) => update(q.id, next)}
            onDelete={() =>
              onChangeSubQuestions(subQuestions.filter((sq) => sq.id !== q.id))
            }
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full justify-center border-dashed"
        onClick={() =>
          onChangeSubQuestions([...subQuestions, makeSubQuestion()])
        }
      >
        <Plus className="mr-1 h-3.5 w-3.5" />
        Add Question
      </Button>
    </div>
  );
};
