"use client";

import { useRef, useState } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
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
import { generateId } from "@/lib/utils";
import { toast } from "sonner";
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

interface InlineQuestionCardProps {
  initialType: QuestionType;
  initialMaterialKind?: MaterialKind;
  topicId: string;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const InlineQuestionCard = ({
  initialType,
  initialMaterialKind,
  topicId,
  onSave,
  onCancel,
}: InlineQuestionCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questionImage, setQuestionImage] = useState<string | null>(null);

  const [type, setType] = useState<QuestionType>(initialType);
  const [text, setText] = useState("");
  const [marks, setMarks] = useState(1);
  const [instruction, setInstruction] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: "a", text: "", isCorrect: false },
    { id: "b", text: "", isCorrect: false },
    { id: "c", text: "", isCorrect: false },
    { id: "d", text: "", isCorrect: false },
  ]);
  const [tfAnswer, setTfAnswer] = useState<"true" | "false" | null>(null);
  const [shortAnswer, setShortAnswer] = useState("");
  const [matchItems, setMatchItems] = useState([
    { id: generateId(), text: "" },
    { id: generateId(), text: "" },
    { id: generateId(), text: "" },
  ]);
  const [matchOptions, setMatchOptions] = useState([
    { id: generateId(), text: "" },
    { id: generateId(), text: "" },
    { id: generateId(), text: "" },
  ]);
  const [passage, setPassage] = useState("");
  const [subQuestions, setSubQuestions] = useState<Question[]>([]);
  const [blanks, setBlanks] = useState<Blank[]>([]);
  const [groupName, setGroupName] = useState("");
  const [materialKind, setMaterialKind] = useState<MaterialKind>(
    initialMaterialKind ?? "diagram",
  );

  const isGrouped = GROUPED_TYPES.includes(type);

  const handleSave = () => {
    if (!text && type !== "question-group" && type !== "multiple-blanks") {
      toast.error("Question text required");
      return;
    }

    const base = {
      id: generateId(),
      topicId: topicId as unknown as Question["topicId"],
      type,
      text,
      marks,
      instruction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let payload: Question;

    switch (type) {
      case "multiple-choice":
      case "multiple-answers":
        payload = { ...base, options };
        break;
      case "true-false":
        payload = {
          ...base,
          options: [
            { id: "true", text: "True", isCorrect: tfAnswer === "true" },
            { id: "false", text: "False", isCorrect: tfAnswer === "false" },
          ],
        };
        break;
      case "essay":
        payload = { ...base, instruction };
        break;
      case "short-answer":
      case "numerical":
      case "fill-in-blank":
        payload = { ...base, correctAnswer: shortAnswer };
        break;
      case "matching":
        payload = { ...base, matchItems, matchOptions };
        break;
      case "comprehension-passage":
        payload = {
          ...base,
          passage,
          subQuestions,
          text: groupName || passage.slice(0, 60),
        };
        break;
      case "multiple-blanks":
        payload = { ...base, blanks };
        break;
      case "question-group":
        payload = {
          ...base,
          subQuestions,
          text: groupName || "Question group",
          passage,
        };
        break;
    }

    onSave(payload);
  };

  return (
    <div className="rounded-lg border-2 border-blue-500 bg-[var(--color-bg-card)]">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <QuestionTypeSelector
          value={type}
          onChange={setType}
          options={ALL_TYPES}
        />
        {!isGrouped && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) =>
                  setQuestionImage(ev.target?.result as string);
                reader.readAsDataURL(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-state-soft-hover)]"
              aria-label="Add image"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* ─── Body ─── */}
      <div className="flex flex-col gap-4 border-t border-[var(--color-border-default)] px-4 py-4">
        {/* Question text */}
        {type !== "multiple-blanks" && (
          <Input
            value={isGrouped ? groupName : text}
            onChange={(e) =>
              isGrouped ? setGroupName(e.target.value) : setText(e.target.value)
            }
            placeholder={
              type === "comprehension-passage"
                ? "Passage title (optional)"
                : type === "question-group"
                  ? "Group name (optional)"
                  : "Type your question"
            }
            className="border-[var(--color-border-default)]"
          />
        )}

        {/* Image preview (shown once an image is attached) */}
        {!isGrouped && (
          <div className="flex flex-col gap-2">
            <div
              className="relative h-44 w-64 overflow-hidden rounded-lg"
              style={{
                backgroundImage: `linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)`,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
                backgroundColor: "#f9fafb",
              }}
            >
              {questionImage && (
                <img
                  src={questionImage}
                  alt="Question"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              {questionImage && (
                <button
                  type="button"
                  onClick={() => setQuestionImage(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-border-default)] text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {questionImage ? "Replace" : "Add Image"}
              </Button>
            </div>
          </div>
        )}

        {/* Passage text for comprehension only (question-group handles its own) */}
        {type === "comprehension-passage" && (
          <textarea
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            placeholder="Type or paste the comprehension passage"
            rows={4}
            className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        )}

        {/* Type-specific editors */}
        {type === "multiple-choice" && (
          <MultipleChoiceEditor options={options} onChange={setOptions} />
        )}
        {type === "multiple-answers" && (
          <MultipleChoiceEditor options={options} multi onChange={setOptions} />
        )}
        {type === "true-false" && (
          <TrueFalseEditor value={tfAnswer} onChange={setTfAnswer} />
        )}
        {type === "essay" && (
          <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-state-soft)] px-3 py-3 text-sm text-[var(--color-text-muted)]">
            Students will see a text area to write their answer
          </div>
        )}
        {type === "short-answer" && (
          <ShortAnswerEditor answer={shortAnswer} onChange={setShortAnswer} />
        )}
        {type === "numerical" && (
          <NumericalEditor answer={shortAnswer} onChange={setShortAnswer} />
        )}
        {type === "fill-in-blank" && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => setText((t) => `${t}______`)}
            >
              + Add Blank Space
            </Button>
            <FillInBlankEditor answer={shortAnswer} onChange={setShortAnswer} />
          </>
        )}
        {type === "matching" && (
          <MatchingEditor
            items={matchItems}
            options={matchOptions}
            onChange={(items, opts) => {
              setMatchItems(items);
              setMatchOptions(opts);
            }}
          />
        )}
        {type === "comprehension-passage" && (
          <ComprehensionPassageEditor
            subQuestions={subQuestions}
            instruction={instruction}
            onChangeInstruction={setInstruction}
            onChangeSubQuestions={setSubQuestions}
          />
        )}
        {type === "question-group" && (
          <QuestionGroupEditor
            materialKind={materialKind}
            onChangeMaterialKind={setMaterialKind}
            passage={passage}
            onChangePassage={setPassage}
            instruction={instruction}
            onChangeInstruction={setInstruction}
            subQuestions={subQuestions}
            onChangeSubQuestions={setSubQuestions}
          />
        )}
        {type === "multiple-blanks" && (
          <MultipleBlanksEditor
            text={text}
            blanks={blanks}
            onChangeText={setText}
            onChangeBlanks={setBlanks}
          />
        )}

        {/* Marks */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-default)]">
            {type === "matching" ? "Marks for each:" : "Marks:"}
          </span>
          <Input
            type="number"
            min={0}
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value) || 0)}
            className="h-7 w-16 text-sm"
          />
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border-default)] px-3 py-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="h-7 px-3 text-sm font-medium"
        >
          Discard
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          className="h-7 px-3 text-sm font-medium"
        >
          Save Question
        </Button>
      </div>
    </div>
  );
};
