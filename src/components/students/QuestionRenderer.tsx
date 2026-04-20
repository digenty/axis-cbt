"use client";

import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TakerQuestion, AnswerValue } from "@/types/students";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  question: TakerQuestion;
  number: number;
  answer: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
}

// ─── Multiple Choice ──────────────────────────────────────────────────────────

const MCQRenderer = ({
  question,
  answer,
  onAnswer,
}: Pick<Props, "question" | "answer" | "onAnswer">) => (
  <div className="space-y-2">
    {question.options?.map((opt) => (
      <button
        key={opt.label}
        onClick={() => onAnswer(opt.label)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
          answer === opt.label
            ? "border-blue-300 bg-blue-50 text-blue-800"
            : "border-gray-200 hover:bg-gray-50",
        )}
      >
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
            answer === opt.label
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-gray-300 text-gray-500",
          )}
        >
          {opt.label}
        </span>
        {opt.text}
      </button>
    ))}
  </div>
);

// ─── Multiple Answers ─────────────────────────────────────────────────────────

const MARenderer = ({
  question,
  answer,
  onAnswer,
}: Pick<Props, "question" | "answer" | "onAnswer">) => {
  const selected: string[] = Array.isArray(answer) ? (answer as string[]) : [];

  const toggle = (label: string) => {
    const next = selected.includes(label)
      ? selected.filter((l) => l !== label)
      : [...selected, label];
    onAnswer(next);
  };

  return (
    <div className="space-y-2">
      {question.options?.map((opt) => (
        <button
          key={opt.label}
          onClick={() => toggle(opt.label)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
            selected.includes(opt.label)
              ? "border-blue-300 bg-blue-50 text-blue-800"
              : "border-gray-200 hover:bg-gray-50",
          )}
        >
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-semibold border",
              selected.includes(opt.label)
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-300 text-gray-500",
            )}
          >
            {selected.includes(opt.label) ? "✓" : opt.label}
          </span>
          {opt.text}
        </button>
      ))}
    </div>
  );
};

// ─── True / False ─────────────────────────────────────────────────────────────

const TrueFalseRenderer = ({
  answer,
  onAnswer,
}: Pick<Props, "answer" | "onAnswer">) => (
  <div className="grid grid-cols-2 gap-3">
    {(["True", "False"] as const).map((val) => (
      <button
        key={val}
        onClick={() => onAnswer(val.toLowerCase())}
        className={cn(
          "rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
          answer === val.toLowerCase()
            ? "border-blue-300 bg-blue-50 text-blue-800"
            : "border-gray-200 hover:bg-gray-50",
        )}
      >
        {val}
      </button>
    ))}
  </div>
);

// ─── Fill in blank ────────────────────────────────────────────────────────────

const FillBlankRenderer = ({
  question,
  answer,
  onAnswer,
}: Pick<Props, "question" | "answer" | "onAnswer">) => {
  const values: Record<string, string> = (
    typeof answer === "object" && !Array.isArray(answer) ? answer : {}
  ) as Record<string, string>;

  const set = (blankId: string, val: string) => {
    onAnswer({ ...values, [blankId]: val });
  };

  return (
    <p className="flex flex-wrap items-center gap-1 text-sm leading-8 text-gray-800">
      {question.segments?.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.content}</span>;
        const val = values[seg.blankId] ?? "";
        if (seg.inputType === "dropdown") {
          return (
            <select
              key={i}
              value={val}
              onChange={(e) => set(seg.blankId, e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
            >
              {seg.choices?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            key={i}
            type="text"
            value={val}
            onChange={(e) => set(seg.blankId, e.target.value)}
            placeholder="___"
            className="w-20 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-400 focus:outline-none"
          />
        );
      })}
    </p>
  );
};

// ─── Match ────────────────────────────────────────────────────────────────────

const MatchRenderer = ({
  question,
  answer,
  onAnswer,
}: Pick<Props, "question" | "answer" | "onAnswer">) => {
  const values: Record<string, string> = (
    typeof answer === "object" && !Array.isArray(answer) ? answer : {}
  ) as Record<string, string>;

  const set = (pairId: string, val: string) =>
    onAnswer({ ...values, [pairId]: val });

  return (
    <div className="space-y-2">
      {question.pairs?.map((pair) => (
        <div key={pair.id} className="flex items-center gap-3">
          <div className="flex h-9 flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">
            {pair.left}
          </div>
          <select
            value={values[pair.id] ?? ""}
            onChange={(e) => set(pair.id, e.target.value)}
            className="flex h-9 flex-1 items-center rounded-lg border border-gray-200 px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"
          >
            {pair.choices.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

// ─── Essay ────────────────────────────────────────────────────────────────────

const EssayRenderer = ({
  answer,
  onAnswer,
}: Pick<Props, "answer" | "onAnswer">) => (
  <textarea
    rows={5}
    value={(answer as string) ?? ""}
    onChange={(e) => onAnswer(e.target.value)}
    placeholder="Type your answer here..."
    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
  />
);

// ─── Short Answer ─────────────────────────────────────────────────────────────

const ShortAnswerRenderer = ({
  answer,
  onAnswer,
}: Pick<Props, "answer" | "onAnswer">) => (
  <input
    type="text"
    value={(answer as string) ?? ""}
    onChange={(e) => onAnswer(e.target.value)}
    placeholder="Type your answer here..."
    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
  />
);

// ─── Question wrapper ─────────────────────────────────────────────────────────

export const QuestionRenderer = ({
  question,
  number,
  answer,
  onAnswer,
}: Props) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    {/* Header */}
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {number}
        </span>
        <div>
          {question.text && (
            <p className="text-sm font-medium text-gray-800">{question.text}</p>
          )}
          <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {question.marks} mark{question.marks !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <button className="shrink-0 text-gray-300 transition-colors hover:text-amber-400">
        <Flag className="h-4 w-4" />
      </button>
    </div>

    {/* Answer area */}
    {question.type === "multiple-choice" && (
      <MCQRenderer question={question} answer={answer} onAnswer={onAnswer} />
    )}
    {question.type === "multiple-answers" && (
      <MARenderer question={question} answer={answer} onAnswer={onAnswer} />
    )}
    {question.type === "true-false" && (
      <TrueFalseRenderer answer={answer} onAnswer={onAnswer} />
    )}
    {question.type === "fill-in-blank" && (
      <FillBlankRenderer
        question={question}
        answer={answer}
        onAnswer={onAnswer}
      />
    )}
    {question.type === "match" && (
      <MatchRenderer question={question} answer={answer} onAnswer={onAnswer} />
    )}
    {question.type === "essay" && (
      <EssayRenderer answer={answer} onAnswer={onAnswer} />
    )}
    {question.type === "short-answer" && (
      <ShortAnswerRenderer answer={answer} onAnswer={onAnswer} />
    )}
  </div>
);
