/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildDefaultOptions,
  buildGroupData,
  // buildSubQTypeSpecificData,
  generateId,
} from "@/utils/question";
import { Section } from "@/utils/formPrimitives";
import {
  QuestionTypeDropdown,
  SINGLE_QUESTION_TYPES,
} from "@/utils/questionTypeSelector";
import {
  useCreateCbtQuestion,
  useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import { toast } from "@/components/Toast";
import type {
  ApiQuestion,
  CreateQuestionPayload,
  // OptionFormItem,
  // QuestionType,
  SubQuestionFormItem,
  SubQuestionType,
} from "@/types/question";
import { appendOption } from "@/utils/question";
import { Plus as PlusIcon, Trash2 as TrashIcon } from "lucide-react";

// ─── Stimulus options ─────────────────────────────────────────────────────────

type GroupQuestionType = "QUESTION_GROUP" | "COMPREHENSION";

const STIMULUS_OPTIONS: {
  label: string;
  stimulusType: string;
  questionType: GroupQuestionType;
  placeholder: string;
}[] = [
  {
    label: "Comprehension Passage",
    stimulusType: "TEXT",
    questionType: "COMPREHENSION",
    placeholder: "Type or paste your comprehension passage here",
  },
  {
    label: "Diagram",
    stimulusType: "DIAGRAM",
    questionType: "QUESTION_GROUP",
    placeholder: "Describe or reference the diagram for this question group",
  },
  {
    label: "Table",
    stimulusType: "TABLE",
    questionType: "QUESTION_GROUP",
    placeholder: "Enter the table data or description",
  },
  {
    label: "Chart",
    stimulusType: "CHART",
    questionType: "QUESTION_GROUP",
    placeholder: "Describe or reference the chart",
  },
];

// ─── Default sub-question ─────────────────────────────────────────────────────

const defaultSubQ = (): SubQuestionFormItem => ({
  id: generateId(),
  type: "MULTIPLE_CHOICE",
  text: "",
  marks: 1,
  options: buildDefaultOptions(),
});

// ─── Hydrate sub-questions from API ──────────────────────────────────────────

function hydrateSubQ(
  raw: NonNullable<
    Extract<
      ApiQuestion["typeSpecificData"],
      { questionType: "QUESTION_GROUP" } | { questionType: "COMPREHENSION" }
    >["subQuestions"]
  >[number],
): SubQuestionFormItem {
  const base = defaultSubQ();
  base.text = raw?.questionText;
  base.marks = raw?.marks;
  base.type = raw?.questionType as SubQuestionType;

  // Restore option text if MCQ/MA (no correct-answer selection)
  const d = raw?.typeSpecificData;
  if (
    d?.questionType === "MULTIPLE_CHOICE" ||
    d?.questionType === "MULTIPLE_ANSWERS"
  ) {
    base.options = d?.options?.map((o, i) => ({
      id: o.optionLabel?.toLowerCase() ?? String.fromCharCode(97 + i),
      text: o.optionText,
      isCorrect: false, // not shown in this form
    }));
  }

  return base;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface QuestionGroupFormProps {
  classId: number;
  subjectId: number;
  topicId: number;
  initialQuestionType?: GroupQuestionType;
  editQuestion?: ApiQuestion | null;
  onClose: () => void;
  onSaved: (question?: ApiQuestion) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const QuestionGroupForm = ({
  classId,
  subjectId,
  topicId,
  initialQuestionType,
  editQuestion,
  onClose,
  onSaved,
}: QuestionGroupFormProps) => {
  const getInitialStimulus = () => {
    if (editQuestion) {
      const tsd = editQuestion?.typeSpecificData;
      if (
        tsd?.questionType === "QUESTION_GROUP" ||
        tsd?.questionType === "COMPREHENSION"
      ) {
        const match = STIMULUS_OPTIONS?.find(
          (s) =>
            s.questionType === tsd?.questionType &&
            s.stimulusType === (tsd as any).stimulusType,
        );
        return match ?? STIMULUS_OPTIONS[0];
      }
    }
    if (initialQuestionType === "COMPREHENSION") return STIMULUS_OPTIONS[0];
    return STIMULUS_OPTIONS[0];
  };

  const [selectedStimulus, setSelectedStimulus] = useState(getInitialStimulus);
  const [stimulusDropOpen, setStimulusDropOpen] = useState(false);

  const existingTsd =
    editQuestion?.typeSpecificData?.questionType === "QUESTION_GROUP" ||
    editQuestion?.typeSpecificData?.questionType === "COMPREHENSION"
      ? editQuestion?.typeSpecificData
      : null;

  const [groupName, setGroupName] = useState(editQuestion?.questionText ?? "");
  const [stimulusContent, setStimulusContent] = useState(
    (existingTsd as any)?.stimulusContent ?? "",
  );
  const [instruction, setInstruction] = useState("");
  const [subQuestions, setSubQuestions] = useState<SubQuestionFormItem[]>(() =>
    (existingTsd as any)?.subQuestions?.length
      ? (existingTsd as any)?.subQuestions?.map(hydrateSubQ)
      : [defaultSubQ()],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync: createQuestion, isPending: isCreating } =
    useCreateCbtQuestion();
  const { mutateAsync: updateQuestion, isPending: isUpdating } =
    useUpdateCbtQuestion();
  const saving = isCreating || isUpdating;

  const totalMarks = subQuestions?.reduce((s, sq) => s + sq.marks, 0);

  const addSubQ = () => setSubQuestions((prev) => [...prev, defaultSubQ()]);
  const removeSubQ = (id: string) => {
    if (subQuestions?.length <= 1) return;
    setSubQuestions((prev) => prev.filter((sq) => sq.id !== id));
  };
  const updateSubQ = (
    id: string,
    updater: (sq: SubQuestionFormItem) => SubQuestionFormItem,
  ) =>
    setSubQuestions((prev) =>
      prev?.map((sq) => (sq.id === id ? updater(sq) : sq)),
    );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!groupName?.trim()) errs.groupName = "Group name is required";
    setErrors(errs);
    return Object.keys(errs)?.length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload: CreateQuestionPayload = {
      classId,
      subjectId,
      topicId,
      questionText: groupName,
      marks: totalMarks || 1,
      questionType: selectedStimulus?.questionType,
      typeSpecificData: buildGroupData({
        questionType: selectedStimulus?.questionType,
        stimulusType: selectedStimulus?.stimulusType,
        stimulusContent,
        subQuestions,
      }),
    };

    try {
      if (editQuestion) {
        await updateQuestion({ id: editQuestion?.id, payload });
        toast({ title: "Group updated", type: "success" });
        onSaved();
      } else {
        const res = await createQuestion(payload);
        toast({ title: "Group saved", type: "success" });
        onSaved(res?.data);
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string })?.message)
          : "Could not save";
      toast({ title: msg, type: "error" });
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-3">
        <input
          type="text"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            setErrors((p) => ({ ...p, groupName: "" }));
          }}
          placeholder={
            selectedStimulus?.questionType === "COMPREHENSION"
              ? "Comprehension Group Name"
              : "Question Group Name"
          }
          className={cn(
            "flex-1 border-0 bg-transparent text-sm font-medium placeholder:text-gray-400 focus:ring-0 focus:outline-none",
            errors?.groupName && "placeholder:text-red-400",
          )}
        />
        <div className="ml-4 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {editQuestion ? "Update" : "Save"}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        {/* Stimulus / material */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Question Material
            </h3>
            <div className="relative">
              <button
                type="button"
                onClick={() => setStimulusDropOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50"
              >
                {selectedStimulus?.label}
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>
              {stimulusDropOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setStimulusDropOpen(false)}
                  />
                  <div className="absolute top-full right-0 z-30 mt-1 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
                    {STIMULUS_OPTIONS?.map((opt) => (
                      <button
                        key={`${opt.questionType}-${opt.stimulusType}`}
                        type="button"
                        onClick={() => {
                          setSelectedStimulus(opt);
                          setStimulusDropOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {opt.label}
                        {selectedStimulus === opt && (
                          <Check className="h-3.5 w-3.5 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            This shared material will be displayed above all sub-questions.
          </p>
          <textarea
            value={stimulusContent}
            onChange={(e) => setStimulusContent(e.target.value)}
            placeholder={selectedStimulus?.placeholder}
            rows={selectedStimulus?.questionType === "COMPREHENSION" ? 8 : 5}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Sub-questions */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Questions ({subQuestions?.length})
            </h3>
            <span className="text-xs text-gray-500">
              Total: {totalMarks} marks
            </span>
          </div>

          <Section title="Instruction" optional className="mb-3">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Example: Answer the following questions"
              className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </Section>

          <div className="space-y-3">
            {subQuestions?.map((sq, idx) => (
              <SubQuestionCard
                key={sq.id}
                sq={sq}
                index={idx + 1}
                canDelete={subQuestions?.length > 1}
                onUpdateType={(type) =>
                  updateSubQ(sq.id, (prev) => ({
                    ...defaultSubQ(),
                    id: prev.id,
                    text: prev.text,
                    marks: prev.marks,
                    type,
                  }))
                }
                onUpdateField={(key, val) =>
                  updateSubQ(sq.id, (prev) => ({
                    ...prev,
                    [key]: val,
                  }))
                }
                onRemove={() => removeSubQ(sq.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addSubQ}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs text-gray-400 transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Sub-question
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Sub Question Card ────────────────────────────────────────────────────────

const SubQuestionCard = ({
  sq,
  index,
  canDelete,
  onUpdateType,
  onUpdateField,
  onRemove,
}: {
  sq: SubQuestionFormItem;
  index: number;
  canDelete: boolean;
  onUpdateType: (type: SubQuestionType) => void;
  onUpdateField: <K extends keyof SubQuestionFormItem>(
    key: K,
    val: SubQuestionFormItem[K],
  ) => void;
  onRemove: () => void;
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div
        className="group flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {index}
        </span>
        <span className="flex-1 truncate text-sm text-gray-700">
          {sq?.text || (
            <span className="italic text-gray-400">Question {index}</span>
          )}
        </span>
        <span className="text-xs text-gray-400">
          {sq?.marks} mark{sq?.marks !== 1 ? "s" : ""}
        </span>
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-6 w-6 items-center justify-center text-gray-300 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </div>

      {expanded && (
        <div
          className="space-y-3 border-t border-gray-100 px-4 py-4"
          onClick={(e) => e?.stopPropagation()}
        >
          <QuestionTypeDropdown
            value={sq?.type}
            onChange={(t) => onUpdateType(t as SubQuestionType)}
            types={SINGLE_QUESTION_TYPES}
          />

          <input
            type="text"
            value={sq?.text}
            onChange={(e) => onUpdateField("text", e.target.value)}
            placeholder="Type your question…"
            className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* Option labels only — no correct-answer selection */}
          {(sq?.type === "MULTIPLE_CHOICE" ||
            sq?.type === "MULTIPLE_ANSWERS") && (
            <div className="space-y-2">
              {sq?.options?.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-xs font-medium uppercase text-gray-500">
                    {opt.id}.
                  </span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) =>
                      onUpdateField(
                        "options",
                        sq?.options?.map((o) =>
                          o.id === opt.id ? { ...o, text: e.target.value } : o,
                        ),
                      )
                    }
                    placeholder={`Option ${opt?.id?.toUpperCase()}`}
                    className="h-8 flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
              {sq?.options?.length < 8 && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdateField("options", appendOption(sq?.options))
                  }
                  className="flex items-center gap-1.5 text-xs text-blue-600 transition-colors hover:text-blue-700"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add Option
                </button>
              )}
            </div>
          )}

          {sq?.type === "TRUE_FALSE" && (
            <p className="text-xs italic text-gray-400">
              True / False — correct answer set during marking.
            </p>
          )}

          {sq?.type === "SHORT_ANSWER" && (
            <p className="text-xs italic text-gray-400">
              Short answer — accepted answers set during marking.
            </p>
          )}

          {sq?.type === "ESSAY" && (
            <p className="text-xs italic text-gray-400">
              Open-ended — no expected answer needed.
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-gray-500">Marks:</span>
            <input
              type="number"
              min={1}
              value={sq?.marks}
              onChange={(e) =>
                onUpdateField("marks", Math.max(1, Number(e.target.value)))
              }
              className="h-7 w-14 rounded-lg border border-gray-200 text-center text-xs transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
