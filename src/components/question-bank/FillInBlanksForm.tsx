"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildDefaultOptions,
  buildFillInBlankData,
  generateId,
} from "@/utils/question";
import { FormTopBar, MarksInput, Section } from "@/utils/formPrimitives";
import {
  useCreateCbtQuestion,
  useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import { toast } from "@/components/Toast";
import type {
  ApiQuestion,
  BlankFormItem,
  CreateQuestionPayload,
} from "@/types/question";

// ─── Hydrate blanks from an existing question ─────────────────────────────────

function hydrateBlank(
  raw: NonNullable<
    Extract<
      ApiQuestion["typeSpecificData"],
      { questionType: "FILL_IN_THE_BLANK" }
    >["blanks"]
  >[number],
  idx: number,
): BlankFormItem {
  return {
    id: generateId(),
    label: raw?.blankLabel ?? `Blank ${idx + 1}`,
    answerType:
      raw?.answerType === "MULTIPLE_CHOICE"
        ? "multiple-choice"
        : "short-answer",
    answers: [], // not pre-filled — teacher marks later
    mark: raw?.marks ?? 1,
    options: buildDefaultOptions(),
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FillInBlanksFormProps {
  classId: number;
  subjectId: number;
  topicId: number;
  editQuestion?: ApiQuestion | null;
  onClose: () => void;
  onSaved: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const FillInBlanksForm = ({
  classId,
  subjectId,
  topicId,
  editQuestion,
  onClose,
  onSaved,
}: FillInBlanksFormProps) => {
  const existing =
    editQuestion?.typeSpecificData?.questionType === "FILL_IN_THE_BLANK"
      ? editQuestion.typeSpecificData
      : null;

  const [questionText, setQuestionText] = useState(
    editQuestion?.questionText ?? "",
  );
  const [instruction, setInstruction] = useState(existing?.instruction ?? "");
  const [blanks, setBlanks] = useState<BlankFormItem[]>(() =>
    existing?.blanks?.length ? existing?.blanks?.map(hydrateBlank) : [],
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync: createQuestion, isPending: isCreating } =
    useCreateCbtQuestion();
  const { mutateAsync: updateQuestion, isPending: isUpdating } =
    useUpdateCbtQuestion();
  const saving = isCreating || isUpdating;

  const insertBlank = () => {
    const n = blanks.length + 1;
    const blank: BlankFormItem = {
      id: generateId(),
      label: `Blank ${n}`,
      answerType: "short-answer",
      answers: [],
      mark: 1,
      options: buildDefaultOptions(),
    };
    setBlanks((prev) => [...prev, blank]);
    setQuestionText((t) => t + ` [Blank ${n}]`);
    setExpandedId(blank.id);
  };

  const updateBlank = <K extends keyof BlankFormItem>(
    id: string,
    key: K,
    val: BlankFormItem[K],
  ) =>
    setBlanks((prev) =>
      prev?.map((b) => (b.id === id ? { ...b, [key]: val } : b)),
    );

  const removeBlank = (id: string) =>
    setBlanks((prev) => prev?.filter((b) => b.id !== id));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!questionText?.trim()) errs.questionText = "Question text is required";
    if (blanks?.length === 0) errs.blanks = "Add at least one blank";
    setErrors(errs);
    return Object.keys(errs)?.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload: CreateQuestionPayload = {
      classId,
      subjectId,
      topicId,
      questionText,
      marks: blanks?.reduce((sum, b) => sum + b.mark, 0) || 1,
      explanation: instruction || undefined,
      questionType: "FILL_IN_THE_BLANK",
      typeSpecificData: buildFillInBlankData(blanks, instruction),
    };

    try {
      if (editQuestion) {
        await updateQuestion({ id: editQuestion?.id, payload });
        toast({ title: "Question updated", type: "success" });
      } else {
        await createQuestion(payload);
        toast({ title: "Question saved", type: "success" });
      }
      onSaved();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string })?.message)
          : "Could not save question";
      toast({ title: msg, type: "error" });
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <FormTopBar
        onCancel={onClose}
        onSave={handleSave}
        saving={saving}
        isEdit={!!editQuestion}
      />

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <Section
          title="Instruction"
          optional
          hint='e.g. "Fill in the gaps with the correct words"'
        >
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Fill in the gaps with the correct words"
            className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </Section>

        <Section
          title="Write your question"
          hint='Type normally, then click "Insert Blank" to add gaps'
        >
          <div
            className={cn(
              "min-h-[80px] rounded-xl border px-4 py-3 text-sm transition focus-within:ring-2 focus-within:ring-blue-500",
              errors.questionText ? "border-red-400" : "border-gray-200",
            )}
          >
            <textarea
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                setErrors((p) => ({ ...p, questionText: "" }));
              }}
              placeholder="London and Paris are examples of [Blank 1] in [Blank 2]"
              rows={3}
              className="w-full resize-none bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          {errors?.questionText && (
            <p className="mt-1 text-xs text-red-500">{errors?.questionText}</p>
          )}
          <button
            type="button"
            onClick={insertBlank}
            className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Insert Blank
          </button>
          {errors?.blanks && (
            <p className="mt-1 text-xs text-red-500">{errors?.blanks}</p>
          )}
        </Section>

        {blanks?.length > 0 && (
          <Section
            title="Blanks"
            hint="Set the label and marks for each blank — answers are set during marking"
          >
            <div className="space-y-3">
              {blanks?.map((blank, idx) => (
                <BlankConfigCard
                  key={blank.id}
                  blank={blank}
                  index={idx + 1}
                  isExpanded={expandedId === blank.id}
                  onToggle={() =>
                    setExpandedId(expandedId === blank.id ? null : blank.id)
                  }
                  onUpdate={(key, val) => updateBlank(blank.id, key, val)}
                  onRemove={() => removeBlank(blank.id)}
                />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

// ─── Blank Config Card ────────────────────────────────────────────────────────

const BlankConfigCard = ({
  blank,
  index,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
}: {
  blank: BlankFormItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: <K extends keyof BlankFormItem>(
    key: K,
    val: BlankFormItem[K],
  ) => void;
  onRemove: () => void;
}) => (
  <div className="overflow-hidden rounded-xl border border-gray-200">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
        {index}
      </div>
      <span className="flex-1 text-sm font-medium text-gray-800">
        {blank?.label}
      </span>
      <span className="text-xs text-gray-400">
        • {blank?.mark} mark{blank?.mark !== 1 ? "s" : ""}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="flex h-5 w-5 items-center justify-center text-gray-300 transition-colors hover:text-red-500"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
      {isExpanded ? (
        <ChevronUp className="h-4 w-4 text-gray-400" />
      ) : (
        <ChevronDown className="h-4 w-4 text-gray-400" />
      )}
    </button>

    {isExpanded && (
      <div className="space-y-3 border-t border-gray-100 px-4 py-4">
        {/* Label */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Blank Label
          </label>
          <input
            type="text"
            value={blank?.label}
            onChange={(e) => onUpdate("label", e.target.value)}
            placeholder="e.g. Blank 1"
            className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Marks */}
        <MarksInput
          value={blank?.mark}
          label={`${blank?.label} Mark:`}
          onChange={(v) => onUpdate("mark", v)}
        />

        <p className="text-xs italic text-gray-400">
          Correct answers are set during the marking stage.
        </p>
      </div>
    )}
  </div>
);
