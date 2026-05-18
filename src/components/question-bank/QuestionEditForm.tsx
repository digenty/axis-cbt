"use client";

import { useRef, useState } from "react";
import { Copy, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { MultipleChoiceEditor } from "./answer-editors/MultipleChoiceEditor";
import { TrueFalseEditor } from "./answer-editors/TrueFalseEditor";
import { ShortAnswerEditor } from "./answer-editors/ShortAnswerEditor";
import { NumericalEditor } from "./answer-editors/NumericalEditor";
import { FillInBlankEditor } from "./answer-editors/FillInBlankEditor";
import { MatchingEditor } from "./answer-editors/MatchingEditor";
import { ComprehensionPassageEditor } from "./answer-editors/ComprehensionPassageEditor";
import { MultipleBlanksEditor } from "./answer-editors/MultipleBlanksEditor";
import { QuestionGroupEditor } from "./answer-editors/QuestionGroupEditor";
import type { MaterialKind } from "./answer-editors/QuestionGroupEditor";
import { RichTextEditor } from "@/components/question-bank/RichTextEditor";
import { generateId } from "@/lib/utils";
import { uploadImage } from "@/lib/uploads";
import type { Question, QuestionType, Option, Blank } from "@/types";

const SIMPLE_TYPES: QuestionType[] = [
  "multiple-choice",
  "multiple-answers",
  "true-false",
  "essay",
  "short-answer",
  "numerical",
  "fill-in-blank",
  "matching",
];

const GROUPED_TYPES: QuestionType[] = [
  "question-group",
  "comprehension-passage",
  "multiple-blanks",
];

const ALL_TYPES = [...SIMPLE_TYPES, ...GROUPED_TYPES];

type MatchingItem = { id: string; text: string };

type Patch = {
  type?: QuestionType;
  text?: string;
  marks?: number;
  instruction?: string;
  options?: Option[];
  tfAnswer?: "true" | "false" | null;
  shortAnswer?: string;
  matchItems?: MatchingItem[];
  matchOptions?: MatchingItem[];
  passage?: string;
  subQuestions?: Question[];
  blanks?: Blank[];
  groupName?: string;
  imageUrl?: string | null;
  stimulusImageUrl?: string | null;
};

interface QuestionEditFormProps {
  question: Question;
  onUpdate: (q: Question) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const QuestionEditForm = ({
  question,
  onUpdate,
  onDuplicate,
  onDelete,
}: QuestionEditFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questionImage, setQuestionImage] = useState<string | null>(
    question.imageUrl ?? null,
  );
  const [stimulusImage, setStimulusImage] = useState<string | null>(
    question.stimulusImageUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);

  const [type, setType] = useState<QuestionType>(question.type);
  const [text, setText] = useState(question.text ?? "");
  const [marks, setMarks] = useState(question.marks ?? 1);
  const [instruction, setInstruction] = useState(question.instruction ?? "");
  const [options, setOptions] = useState<Option[]>(
    question.options ?? [
      { id: "a", text: "", isCorrect: false },
      { id: "b", text: "", isCorrect: false },
      { id: "c", text: "", isCorrect: false },
      { id: "d", text: "", isCorrect: false },
    ],
  );
  const [tfAnswer, setTfAnswer] = useState<"true" | "false" | null>(
    question.type === "true-false"
      ? ((question.options?.find((o) => o.isCorrect)?.id as
          | "true"
          | "false"
          | null) ?? null)
      : null,
  );
  const [shortAnswer, setShortAnswer] = useState<string>(
    (question.correctAnswer as string | undefined) ?? "",
  );
  const [matchItems, setMatchItems] = useState<MatchingItem[]>(
    (question.matchItems as MatchingItem[] | undefined) ?? [
      { id: generateId(), text: "" },
      { id: generateId(), text: "" },
      { id: generateId(), text: "" },
    ],
  );
  const [matchOptions, setMatchOptions] = useState<MatchingItem[]>(
    (question.matchOptions as MatchingItem[] | undefined) ?? [
      { id: generateId(), text: "" },
      { id: generateId(), text: "" },
      { id: generateId(), text: "" },
    ],
  );
  const [passage, setPassage] = useState(question.passage ?? "");
  const [subQuestions, setSubQuestions] = useState<Question[]>(
    question.subQuestions ?? [],
  );
  const [blanks, setBlanks] = useState<Blank[]>(question.blanks ?? []);
  const [groupName, setGroupName] = useState(
    (question.text ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
  const [materialKind, setMaterialKind] = useState<MaterialKind>(() => {
    const st = question.metadata?.stimulusType?.toUpperCase();
    if (st === "TABLE") return "table";
    if (st === "CHART") return "chart";
    if (st === "COMPREHENSION" || st === "COMPREHENSION_PASSAGE")
      return "comprehension-passage";
    if (st === "MULTIPLE_BLANKS") return "multiple-blanks";
    return "diagram";
  });

  const save = (patch: Patch = {}) => {
    const t = patch.type ?? type;
    const grouped = GROUPED_TYPES.includes(t);
    const gn = patch.groupName ?? groupName;
    const tx = patch.text ?? text;
    const m = patch.marks ?? marks;
    const ins = patch.instruction ?? instruction;
    const opts = patch.options ?? options;
    const tf = patch.tfAnswer !== undefined ? patch.tfAnswer : tfAnswer;
    const sa = patch.shortAnswer ?? shortAnswer;
    const mi = patch.matchItems ?? matchItems;
    const mo = patch.matchOptions ?? matchOptions;
    const p = patch.passage ?? passage;
    const sq = patch.subQuestions ?? subQuestions;
    const bl = patch.blanks ?? blanks;
    const img = patch.imageUrl !== undefined ? patch.imageUrl : questionImage;
    const stimImg =
      patch.stimulusImageUrl !== undefined
        ? patch.stimulusImageUrl
        : stimulusImage;

    const base = {
      id: question.id,
      topicId: question.topicId,
      createdAt: question.createdAt,
      type: t,
      text: grouped ? gn : tx,
      marks: m,
      instruction: ins,
      imageUrl: img ?? undefined,
      stimulusImageUrl: stimImg ?? undefined,
      updatedAt: new Date().toISOString(),
    };

    let payload: Question;

    switch (t) {
      case "multiple-choice":
      case "multiple-answers":
        payload = { ...base, options: opts };
        break;
      case "true-false":
        payload = {
          ...base,
          options: [
            { id: "true", text: "True", isCorrect: tf === "true" },
            { id: "false", text: "False", isCorrect: tf === "false" },
          ],
        };
        break;
      case "essay":
        payload = { ...base, instruction: ins };
        break;
      case "short-answer":
      case "numerical":
      case "fill-in-blank":
        payload = { ...base, correctAnswer: sa };
        break;
      case "matching":
        payload = { ...base, matchItems: mi, matchOptions: mo };
        break;
      case "comprehension-passage":
        payload = {
          ...base,
          passage: p,
          subQuestions: sq,
          text: gn || p.slice(0, 60),
        };
        break;
      case "multiple-blanks":
        payload = { ...base, blanks: bl };
        break;
      case "question-group":
        payload = {
          ...base,
          subQuestions: sq,
          text: gn || "Question group",
          passage: p,
        };
        break;
    }

    onUpdate(payload);
  };

  const isGrouped = GROUPED_TYPES.includes(type);

  return (
    <>
      {/* ─── Type selector row ─── */}
      <div className="flex items-center gap-2 border-t border-[var(--color-border-default)] px-4 py-3">
        <QuestionTypeSelector
          value={type}
          onChange={(newType) => {
            setType(newType);
            save({ type: newType });
          }}
          options={ALL_TYPES}
        />
        {!isGrouped && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setUploading(true);
                try {
                  const url = await uploadImage(file, "cbt/questions");
                  setQuestionImage(url);
                  save({ imageUrl: url });
                } catch (err) {
                  toast({
                    title: err instanceof Error ? err.message : "Upload failed",
                    type: "error",
                  });
                } finally {
                  setUploading(false);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-state-soft-hover)] disabled:opacity-60"
              aria-label="Add image"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </button>
          </>
        )}
      </div>

      {/* ─── Content ─── */}
      <div className="flex flex-col gap-4 border-t border-[var(--color-border-default)] px-4 py-4">
        {type !== "multiple-blanks" &&
          (isGrouped ? (
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onBlur={(e) => save({ groupName: e.target.value })}
              placeholder={
                type === "comprehension-passage"
                  ? "Passage title (optional)"
                  : "Group name (optional)"
              }
            />
          ) : (
            <div onBlur={() => save({ text })}>
              <RichTextEditor
                value={text}
                onChange={setText}
                placeholder="Type your question"
              />
            </div>
          ))}

        {type === "comprehension-passage" && (
          <textarea
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            onBlur={(e) => save({ passage: e.target.value })}
            placeholder="Type or paste the comprehension passage"
            rows={4}
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        )}

        {/* Uploaded image preview */}
        {!isGrouped && questionImage && (
          <div className="flex flex-col gap-2">
            <div className="relative h-44 w-64 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={questionImage}
                alt="Question"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuestionImage(null);
                  save({ imageUrl: null });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border-default)] text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
            </div>
          </div>
        )}

        {type === "multiple-choice" && (
          <MultipleChoiceEditor
            options={options}
            onChange={(opts) => {
              setOptions(opts);
              save({ options: opts });
            }}
          />
        )}
        {type === "multiple-answers" && (
          <MultipleChoiceEditor
            options={options}
            multi
            onChange={(opts) => {
              setOptions(opts);
              save({ options: opts });
            }}
          />
        )}
        {type === "true-false" && (
          <TrueFalseEditor
            value={tfAnswer}
            onChange={(v) => {
              setTfAnswer(v);
              save({ tfAnswer: v });
            }}
          />
        )}
        {type === "essay" && (
          <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-state-soft)] px-3 py-3 text-sm text-[var(--color-text-muted)]">
            Students will see a text area to write their answer
          </div>
        )}
        {type === "short-answer" && (
          <ShortAnswerEditor
            answer={shortAnswer}
            onChange={(a) => {
              setShortAnswer(a);
              save({ shortAnswer: a });
            }}
          />
        )}
        {type === "numerical" && (
          <NumericalEditor
            answer={shortAnswer}
            onChange={(a) => {
              setShortAnswer(a);
              save({ shortAnswer: a });
            }}
          />
        )}
        {type === "fill-in-blank" && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => {
                const newText = `${text}______`;
                setText(newText);
                save({ text: newText });
              }}
            >
              + Add Blank Space
            </Button>
            <FillInBlankEditor
              answer={shortAnswer}
              onChange={(a) => {
                setShortAnswer(a);
                save({ shortAnswer: a });
              }}
            />
          </>
        )}
        {type === "matching" && (
          <MatchingEditor
            items={matchItems}
            options={matchOptions}
            onChange={(mi, mo) => {
              setMatchItems(mi);
              setMatchOptions(mo);
              save({ matchItems: mi, matchOptions: mo });
            }}
          />
        )}
        {type === "comprehension-passage" && (
          <ComprehensionPassageEditor
            subQuestions={subQuestions}
            instruction={instruction}
            onChangeInstruction={(ins) => {
              setInstruction(ins);
              save({ instruction: ins });
            }}
            onChangeSubQuestions={(sq) => {
              setSubQuestions(sq);
              save({ subQuestions: sq });
            }}
          />
        )}
        {type === "question-group" && (
          <QuestionGroupEditor
            materialKind={materialKind}
            onChangeMaterialKind={setMaterialKind}
            passage={passage}
            onChangePassage={(p) => {
              setPassage(p);
              save({ passage: p });
            }}
            instruction={instruction}
            onChangeInstruction={(ins) => {
              setInstruction(ins);
              save({ instruction: ins });
            }}
            subQuestions={subQuestions}
            onChangeSubQuestions={(sq) => {
              setSubQuestions(sq);
              save({ subQuestions: sq });
            }}
            stimulusImageUrl={stimulusImage ?? undefined}
            onChangeStimulusImage={(url) => {
              setStimulusImage(url ?? null);
              save({ stimulusImageUrl: url ?? null });
            }}
          />
        )}
        {type === "multiple-blanks" && (
          <MultipleBlanksEditor
            text={text}
            blanks={blanks}
            onChangeText={(t) => setText(t)}
            onChangeBlanks={(bl) => {
              setBlanks(bl);
              save({ blanks: bl });
            }}
          />
        )}
      </div>

      {/* ─── Marks ─── */}
      <div className="flex items-center gap-2 border-t border-[var(--color-border-default)] px-4 py-3">
        <span className="text-sm text-[var(--color-text-default)]">
          {type === "matching" ? "Marks for each:" : "Marks:"}
        </span>
        <Input
          type="number"
          min={0}
          value={marks}
          onChange={(e) => setMarks(Number(e.target.value) || 0)}
          onBlur={(e) => save({ marks: Number(e.target.value) || 0 })}
          className="h-7 w-16 text-sm"
        />
      </div>

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border-default)] bg-bg-state-soft px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicate}
          className="h-8 gap-1.5 px-3 text-sm"
        >
          <Copy className="h-3.5 w-3.5" />
          Duplicate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="h-8 gap-1.5 px-3 text-sm text-[var(--color-text-destructive)] hover:text-[var(--color-text-destructive)]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </>
  );
};
