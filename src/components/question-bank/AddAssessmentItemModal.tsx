"use client";

import { useState } from "react";
import { LayoutList, Layers, Minus, X, ChevronDown } from "lucide-react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import type { QuestionType } from "@/types";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSelectType: (type: QuestionType, materialKind?: string) => void;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SINGLE_TYPES: { label: string; type: QuestionType }[] = [
  { label: "MCQ", type: "multiple-choice" },
  { label: "True / False", type: "true-false" },
  { label: "Essay", type: "essay" },
  { label: "Fill-in-the-blank", type: "fill-in-blank" },
  { label: "Short Answer", type: "short-answer" },
  { label: "Multiple Answers", type: "multiple-answers" },
  { label: "Numeric Answers", type: "numerical" },
];

const GROUP_TYPES: {
  label: string;
  type: QuestionType;
  materialKind?: string;
}[] = [
  { label: "Comprehension Passage", type: "comprehension-passage" },
  { label: "Diagram", type: "question-group", materialKind: "diagram" },
  { label: "Table", type: "question-group", materialKind: "table" },
  { label: "Chart", type: "question-group", materialKind: "chart" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Tag = ({ label }: { label: string }) => (
  <span className="rounded-md bg-bg-state-soft px-2.5 py-1 text-xs text-text-subtle">
    {label}
  </span>
);

const TypeButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
  materialKind?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border border-border-default px-3 py-1.5 text-sm font-medium text-text-default hover:bg-bg-state-soft-hover transition-colors"
  >
    {label}
  </button>
);

interface CollapsibleCardProps {
  expanded: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  tags: string[];
  types: { label: string; type: QuestionType; materialKind?: string }[];
  onSelectType: (type: QuestionType, materialKind?: string) => void;
}

const CollapsibleCard = ({
  expanded,
  onToggle,
  icon,
  iconBg,
  title,
  description,
  tags,
  types,
  onSelectType,
}: CollapsibleCardProps) => (
  <div
    className={cn(
      "rounded-xl border transition-colors",
      expanded
        ? "border-blue-500 bg-white dark:bg-bg-card"
        : "border-border-default bg-bg-card hover:bg-bg-state-soft cursor-pointer",
    )}
  >
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start gap-3 p-4 text-left"
    >
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-default">{title}</p>
        <p className="mt-0.5 text-xs text-text-subtle">{description}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
      <ChevronDown
        className={cn(
          "mt-0.5 h-4 w-4 flex-shrink-0 text-icon-default-muted transition-transform",
          expanded && "rotate-180",
        )}
      />
    </button>

    {expanded && (
      <div className=" px-4 pb-4 pt-3">
        <p className="mb-2.5 text-sm font-semibold text-text-default">
          Select Question Type
        </p>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <TypeButton
              key={t.label}
              label={t.label}
              onClick={() => onSelectType(t.type, t.materialKind)}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

interface DirectCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  tag: string;
  onClick: () => void;
}

const DirectCard = ({
  icon,
  iconBg,
  title,
  description,
  tag,
  onClick,
}: DirectCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-start gap-3 rounded-xl border border-border-default bg-bg-card p-4 text-left hover:bg-bg-state-soft transition-colors"
  >
    <span
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
      style={{ background: iconBg }}
    >
      {icon}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-text-default">{title}</p>
      <p className="mt-0.5 text-xs text-text-subtle">{description}</p>
      <div className="mt-2">
        <Tag label={tag} />
      </div>
    </div>
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const AddAssessmentItemModal = ({
  open,
  setOpen,
  onSelectType,
}: Props) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState<"single" | "group" | null>(null);

  const handleClose = () => {
    setExpanded(null);
    setOpen(false);
  };

  const handleSelect = (type: QuestionType, materialKind?: string) => {
    onSelectType(type, materialKind);
    handleClose();
  };

  const toggle = (section: "single" | "group") =>
    setExpanded((prev) => (prev === section ? null : section));

  const body = (
    <div className="flex flex-col gap-3 px-4 py-4">
      <p className="text-sm text-text-subtle">
        Choose the type of item you want to add to the Question Bank
      </p>

      <CollapsibleCard
        expanded={expanded === "single"}
        onToggle={() => toggle("single")}
        icon={<LayoutList className="h-5 w-5 text-white" />}
        iconBg="#F97316"
        title="Single Question"
        description="For standalone assessment items"
        tags={[
          "MCQ",
          "True/False",
          "Essay",
          "Fill-in-the-Blank",
          "Short Answer",
          "Multiple Answers",
          "Numeric Answers",
        ]}
        types={SINGLE_TYPES}
        onSelectType={handleSelect}
      />

      <CollapsibleCard
        expanded={expanded === "group"}
        onToggle={() => toggle("group")}
        icon={<Layers className="h-5 w-5 text-white" />}
        iconBg="#22C55E"
        title="Question Groups (Shared Material)"
        description="For multiple questions about the same stimulus"
        tags={["Comprehension Passage", "Diagram", "Table", "Chart"]}
        types={GROUP_TYPES}
        onSelectType={handleSelect}
      />

      <DirectCard
        icon={<Minus className="h-5 w-5 text-white" />}
        iconBg="#14B8A6"
        title="Multiple Blanks"
        description="Write naturally and insert blanks where students fill in answers"
        tag="Multiple blanks"
        onClick={() => handleSelect("multiple-blanks")}
      />

      <DirectCard
        icon={<X className="h-5 w-5 text-white" />}
        iconBg="#A855F7"
        title="Match"
        description="Match choices to options"
        tag="Match"
        onClick={() => handleSelect("matching")}
      />
    </div>
  );

  return (
    <>
      {!isMobile && (
        <Modal
          open={open}
          setOpen={handleClose}
          title="Add Assessment Item"
          showFooter={false}
          className="sm:max-w-203"
        >
          {body}
        </Modal>
      )}

      {isMobile && (
        <MobileDrawer
          open={open}
          setIsOpen={handleClose}
          title="Add Assessment Item"
        >
          {body}
        </MobileDrawer>
      )}
    </>
  );
};
