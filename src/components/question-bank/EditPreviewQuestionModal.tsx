"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { toast } from "@/components/common/Toast";
import { useEditPreviewQuestion } from "@/hooks/queryHooks/useQuestionBank";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { ImportPreviewQuestion } from "@/types/question";
import type { EditPreviewQuestionPayload } from "@/types/bulk-import";

// ─── Type helpers ──────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "TRUE_FALSE", label: "True / False" },
  { value: "ESSAY", label: "Essay" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "FILL_IN_THE_BLANK", label: "Fill in the Blank" },
  { value: "MATCH", label: "Matching" },
  { value: "THEORY", label: "Theory" },
];

const DIFFICULTY_OPTIONS = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

// ─── Component ────────────────────────────────────────────────────────────

interface EditPreviewQuestionModalProps {
  question: ImportPreviewQuestion;
  classId: number;
  subjectId: number;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updated: ImportPreviewQuestion) => void;
}

export const EditPreviewQuestionModal = ({
  question,
  classId,
  subjectId,
  isOpen,
  onClose,
  onSave,
}: EditPreviewQuestionModalProps) => {
  const [formData, setFormData] = useState({
    questionText: question.text,
    questionType: question.type,
    marks: 1,
    explanation: "",
    difficultyLevel: "",
    section: "",
    suggestedTopicName: "",
    options: question.options?.map((opt) => ({
      label: opt.label,
      text: opt.text,
      isCorrect: opt.label === question.correctAnswer,
    })) ?? [],
    correctAnswer: question.correctAnswer ?? "",
  });

  const isMobile = useIsMobile();
  const editMutation = useEditPreviewQuestion(classId, subjectId);
  const isLoading = editMutation.isPending;

  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      questionType: type,
      options: type !== "MULTIPLE_CHOICE" ? [] : prev.options,
    }));
  };

  const handleOptionTextChange = (label: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.label === label ? { ...opt, text } : opt,
      ),
    }));
  };

  const handleCorrectAnswerChange = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswer: label,
      options: prev.options.map((opt) => ({
        ...opt,
        isCorrect: opt.label === label,
      })),
    }));
  };

  const handleAddOption = () => {
    const nextLabel = String.fromCharCode(65 + formData.options.length);
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { label: nextLabel, text: "", isCorrect: false },
      ],
    }));
  };

  const handleRemoveOption = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.label !== label),
    }));
  };

  const handleSave = async () => {
    if (!formData.questionText.trim()) {
      toast({ title: "Question text is required", type: "error" });
      return;
    }
    if (formData.questionType === "MULTIPLE_CHOICE" && formData.options.length < 2) {
      toast({ title: "At least 2 options required for Multiple Choice", type: "error" });
      return;
    }
    if (formData.questionType === "MULTIPLE_CHOICE" && !formData.correctAnswer) {
      toast({ title: "Please select a correct answer", type: "error" });
      return;
    }

    const payload: EditPreviewQuestionPayload = {
      questionText: formData.questionText,
      questionType: formData.questionType,
      marks: formData.marks,
      explanation: formData.explanation || undefined,
      difficultyLevel: formData.difficultyLevel || undefined,
      section: formData.section || undefined,
      suggestedTopicName: formData.suggestedTopicName || undefined,
      options:
        formData.questionType === "MULTIPLE_CHOICE"
          ? formData.options.map((opt) => ({
              label: opt.label,
              text: opt.text,
              isCorrect: opt.isCorrect,
            }))
          : undefined,
      correctAnswer:
        formData.questionType === "MULTIPLE_CHOICE"
          ? formData.correctAnswer
          : undefined,
    };

    editMutation.mutate(
      { questionId: question.id, payload },
      {
        onSuccess: (response) => {
          toast({
            title: "Question updated",
            description: response.data.status === "needs_review" ? "Marked for review" : "Valid",
            type: "success",
          });
          onSave?.(response.data);
          onClose();
        },
        onError: () => {
          toast({ title: "Failed to update question", type: "error" });
        },
      },
    );
  };

  // ─── Shared form content ──────────────────────────────────────────────

  const formContent = (
    <div className="space-y-4 p-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text-default)]">
          Question Text *
        </label>
        <textarea
          value={formData.questionText}
          onChange={(e) => setFormData((p) => ({ ...p, questionText: e.target.value }))}
          className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          rows={3}
          placeholder="Enter question text..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-default)]">
            Question Type *
          </label>
          <select
            value={formData.questionType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-default)]">
            Marks
          </label>
          <input
            type="number"
            min="1"
            value={formData.marks}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              setFormData((p) => ({ ...p, marks: isNaN(n) ? 1 : n }));
            }}
            className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-default)]">
            Difficulty
          </label>
          <select
            value={formData.difficultyLevel}
            onChange={(e) => setFormData((p) => ({ ...p, difficultyLevel: e.target.value }))}
            className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          >
            <option value="">Select...</option>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text-default)]">
            Topic
          </label>
          <input
            type="text"
            value={formData.suggestedTopicName}
            onChange={(e) => setFormData((p) => ({ ...p, suggestedTopicName: e.target.value }))}
            className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
            placeholder="Topic name..."
          />
        </div>
      </div>

      {formData.questionType === "MULTIPLE_CHOICE" && (
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text-default)]">
            Options
          </label>
          <div className="space-y-2">
            {formData.options.map((opt) => (
              <div key={opt.label} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`correct-${opt.label}`}
                  name="correctAnswer"
                  checked={formData.correctAnswer === opt.label}
                  onChange={() => handleCorrectAnswerChange(opt.label)}
                  className="h-4 w-4 cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--color-text-muted)] w-5">{opt.label}.</span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(opt.label, e.target.value)}
                  className="flex-1 rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-1.5 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
                  placeholder="Option text..."
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(opt.label)}
                    className="text-[var(--color-icon-default-muted)] hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {formData.options.length < 5 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 text-sm font-medium text-[var(--blue-600)] hover:text-[var(--blue-700)]"
            >
              + Add option
            </button>
          )}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--color-text-default)]">
          Explanation
        </label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData((p) => ({ ...p, explanation: e.target.value }))}
          className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)]"
          rows={2}
          placeholder="Optional explanation..."
        />
      </div>
    </div>
  );

  const saveButton = (
    <Button onClick={handleSave} disabled={isLoading} className="gap-2">
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      Save Changes
    </Button>
  );

  return (
    <>
      {/* Desktop — uses project Modal (Radix Dialog) */}
      <Modal
        open={isOpen && !isMobile}
        setOpen={(v) => { if (!v) onClose(); }}
        title={`Edit Question ${question.number}`}
        ActionButton={saveButton}
        showFooter
      >
        {formContent}
      </Modal>

      {/* Mobile — uses project MobileDrawer (Radix Drawer) */}
      <MobileDrawer
        open={isOpen && isMobile}
        setIsOpen={(v) => { if (!v) onClose(); }}
        title={`Edit Question ${question.number}`}
      >
        <div className="overflow-y-auto max-h-[60vh]">
          {formContent}
        </div>
        <div className="border-t border-[var(--color-border-default)] p-4">
          {saveButton}
        </div>
      </MobileDrawer>
    </>
  );
};
