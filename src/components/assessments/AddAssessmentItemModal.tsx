"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import type { QuestionType } from "@/types/question";

// ─── Sub-type options per category ───────────────────────────────────────────

const SINGLE_SUB_TYPES: { type: QuestionType; label: string; hint: string }[] =
  [
    {
      type: "MULTIPLE_CHOICE",
      label: "MCQ",
      hint: "One correct answer from options",
    },
    {
      type: "MULTIPLE_ANSWERS",
      label: "Multiple Answers",
      hint: "More than one correct option",
    },
    {
      type: "TRUE_FALSE",
      label: "True / False",
      hint: "Students pick True or False",
    },
    {
      type: "SHORT_ANSWER",
      label: "Short Answer",
      hint: "Brief typed response",
    },
    { type: "ESSAY", label: "Essay", hint: "Long-form written response" },
    {
      type: "NUMERIC_ANSWER",
      label: "Numeric Answer",
      hint: "A number, with optional tolerance",
    },
  ];

/**
 * All group / comprehension options map to QUESTION_GROUP or COMPREHENSION.
 * The stimulus type chosen here is passed into QuestionGroupForm which then
 * sets stimulusType accordingly on the API payload.
 */
const GROUP_SUB_TYPES: { type: QuestionType; label: string; hint: string }[] = [
  {
    type: "QUESTION_GROUP",
    label: "Diagram",
    hint: "Image or diagram with sub-questions",
  },
  {
    type: "QUESTION_GROUP",
    label: "Table",
    hint: "Table / data set with sub-questions",
  },
  {
    type: "QUESTION_GROUP",
    label: "Chart",
    hint: "Chart or graph with sub-questions",
  },
];

const COMPREHENSION_SUB_TYPES: {
  type: QuestionType;
  label: string;
  hint: string;
}[] = [
  {
    type: "COMPREHENSION",
    label: "Comprehension Passage",
    hint: "Reading passage with sub-questions",
  },
];

const BLANKS_SUB_TYPES: { type: QuestionType; label: string; hint: string }[] =
  [
    {
      type: "FILL_IN_THE_BLANK",
      label: "Multiple Blanks",
      hint: "Write a sentence and insert gaps",
    },
  ];

const MATCH_SUB_TYPES: { type: QuestionType; label: string; hint: string }[] = [
  {
    type: "MATCH",
    label: "Matching Pairs",
    hint: "Match items in column A to column B",
  },
];

// ─── Category definitions ─────────────────────────────────────────────────────

const ITEM_TYPES = [
  {
    id: "single" as const,
    icon: "🟠",
    iconBg: "bg-orange-100",
    title: "Single Question",
    description: "For standalone assessment items",
    tags: [
      "MCQ",
      "True/False",
      "Essay",
      "Short Answer",
      "Multiple Answers",
      "Numeric",
    ],
    subTypes: SINGLE_SUB_TYPES,
  },
  {
    id: "comprehension" as const,
    icon: "📖",
    iconBg: "bg-purple-100",
    title: "Comprehension",
    description: "Reading passage followed by sub-questions",
    tags: ["Comprehension Passage"],
    subTypes: COMPREHENSION_SUB_TYPES,
  },
  {
    id: "group" as const,
    icon: "🟢",
    iconBg: "bg-green-100",
    title: "Question Groups (Shared Material)",
    description: "Multiple questions sharing a diagram, table, or chart",
    tags: ["Diagram", "Table", "Chart"],
    subTypes: GROUP_SUB_TYPES,
  },
  {
    id: "blanks" as const,
    icon: "🔵",
    iconBg: "bg-blue-100",
    title: "Fill-in-the-Blank",
    description: "Write naturally and insert blanks where students answer",
    tags: ["Multiple Blanks"],
    subTypes: BLANKS_SUB_TYPES,
  },
  {
    id: "match" as const,
    icon: "🔴",
    iconBg: "bg-red-100",
    title: "Match",
    description: "Students match items from two columns",
    tags: ["Matching Pairs"],
    subTypes: MATCH_SUB_TYPES,
  },
] as const;

type ItemTypeId = (typeof ITEM_TYPES)[number]["id"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddAssessmentItemModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Called with the resolved QuestionType. The parent (QuestionBankView)
   * routes QUESTION_GROUP → QuestionGroupForm, COMPREHENSION → QuestionGroupForm
   * with a comprehension flag, FILL_IN_THE_BLANK → FillInBlanksForm, etc.
   */
  onSelectType: (type: QuestionType) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AddAssessmentItemModal = ({
  open,
  onClose,
  onSelectType,
}: AddAssessmentItemModalProps) => {
  const [expandedId, setExpandedId] = useState<ItemTypeId | null>(null);

  const handleClose = () => {
    onClose();
    setExpandedId(null);
  };

  const handleSubTypeSelect = (type: QuestionType) => {
    handleClose();
    onSelectType(type);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Assessment Item"
      subtitle="Choose the type of item you want to add to the Question Bank"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-2 px-5 py-4">
        {ITEM_TYPES.map((item) => (
          <div key={item?.id}>
            {/* Category row */}
            <button
              type="button"
              onClick={() =>
                setExpandedId(expandedId === item?.id ? null : item?.id)
              }
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all",
                expandedId === item?.id
                  ? "border-blue-300 bg-blue-50/50 ring-1 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg",
                  item?.iconBg,
                )}
              >
                {item?.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {item?.title}
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                      expandedId === item?.id && "rotate-90",
                    )}
                  />
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {item?.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>

            {/* Sub-type picker */}
            {expandedId === item?.id && (
              <div className="mt-2 ml-12 pl-1">
                <p className="mb-2 text-xs font-medium text-gray-500">
                  Select Type
                </p>
                <div className="flex flex-col gap-1.5">
                  {item?.subTypes.map(({ type, label, hint }) => (
                    <button
                      key={`${type}-${label}`}
                      type="button"
                      onClick={() => handleSubTypeSelect(type)}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-left transition-all hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">
                          {label}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">{hint}</p>
                      </div>
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
};
