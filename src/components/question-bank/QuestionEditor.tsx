"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCBTStore } from "@/store";
import { generateId } from "@/lib/utils";
import { RichTextEditor } from "./RichTextEditor";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { MultipleChoiceEditor } from "./answer-editors/MultipleChoiceEditor";
import { TrueFalseEditor } from "./answer-editors/TrueFalseEditor";
import { EssayEditor } from "./answer-editors/EssayEditor";
import { ShortAnswerEditor } from "./answer-editors/ShortAnswerEditor";
import { NumericalEditor } from "./answer-editors/NumericalEditor";
import { FillInBlankEditor } from "./answer-editors/FillInBlankEditor";
import { MatchingEditor } from "./answer-editors/MatchingEditor";
import { ComprehensionPassageEditor } from "./answer-editors/ComprehensionPassageEditor";
import { MultipleBlanksEditor } from "./answer-editors/MultipleBlanksEditor";
import { QuestionGroupEditor } from "./answer-editors/QuestionGroupEditor";
import type { MaterialKind } from "./answer-editors/QuestionGroupEditor";
import type { Question, QuestionType, Option, Blank } from "@/types";
import { toast } from "sonner";

interface QuestionEditorProps {
  params: Promise<{ classId: string; subjectId: string; questionId?: string }>;
  mode: "create" | "edit";
}

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

export const QuestionEditor = ({ params, mode }: QuestionEditorProps) => {
  const { classId, subjectId, questionId } = use(params);
  const router = useRouter();
  const search = useSearchParams();
  const topicIdParam = search.get("topicId") ?? "";
  const typeParam = search.get("type") as QuestionType | null;
  const returnTo = search.get("returnTo");
  const sectionId = search.get("sectionId");
  const assessmentIdParam = search.get("assessmentId");
  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

  const { topics, questions, tests, addQuestion, updateQuestion, updateTest } =
    useCBTStore();

  const existing =
    mode === "edit" && questionId
      ? questions.find((q) => q.id === questionId)
      : null;

  const [type, setType] = useState<QuestionType>(
    existing?.type ?? typeParam ?? "multiple-choice",
  );
  const [text, setText] = useState(existing?.text ?? "");
  const [marks, setMarks] = useState<number>(existing?.marks ?? 1);
  const [instruction, setInstruction] = useState(existing?.instruction ?? "");
  const [topicId, setTopicId] = useState(
    existing ? String(existing.topicId) : topicIdParam,
  );

  const [options, setOptions] = useState<Option[]>(
    existing?.options ?? [
      { id: "a", text: "", isCorrect: false },
      { id: "b", text: "", isCorrect: false },
      { id: "c", text: "", isCorrect: false },
      { id: "d", text: "", isCorrect: false },
    ],
  );
  const [tfAnswer, setTfAnswer] = useState<"true" | "false" | null>(
    existing && existing.type === "true-false"
      ? ((existing.options?.find((o) => o.isCorrect)?.id as
          | "true"
          | "false"
          | null) ?? null)
      : null,
  );
  const [shortAnswer, setShortAnswer] = useState(
    (existing?.correctAnswer as string) ?? "",
  );
  const [matchItems, setMatchItems] = useState(
    existing?.matchItems ?? [
      { id: generateId(), text: "" },
      { id: generateId(), text: "" },
    ],
  );
  const [matchOptions, setMatchOptions] = useState(
    existing?.matchOptions ?? [
      { id: generateId(), text: "" },
      { id: generateId(), text: "" },
    ],
  );
  const [passage, setPassage] = useState(existing?.passage ?? "");
  const [subQuestions, setSubQuestions] = useState<Question[]>(
    existing?.subQuestions ?? [],
  );
  const [blanks, setBlanks] = useState<Blank[]>(existing?.blanks ?? []);
  const [groupName, setGroupName] = useState(existing?.text ?? "");
  const [materialKind, setMaterialKind] = useState<MaterialKind>("diagram");

  const handleSave = () => {
    if (!topicId) {
      toast.error("Topic missing");
      return;
    }
    if (!text && type !== "question-group") {
      toast.error("Question text required");
      return;
    }

    const base = {
      id: existing?.id ?? generateId(),
      topicId: topicId as unknown as Question["topicId"],
      type,
      text,
      marks,
      instruction,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
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
        payload = {
          ...base,
          matchItems,
          matchOptions,
        };
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

    if (existing) {
      updateQuestion(existing.id, payload);
      toast.success("Question updated");
    } else {
      addQuestion(payload);
      if (sectionId && assessmentIdParam) {
        const test = tests.find((t) => t.id === assessmentIdParam);
        if (test) {
          updateTest(assessmentIdParam, {
            sections: test.sections.map((s) =>
              s.id === sectionId
                ? { ...s, questionIds: [...s.questionIds, payload.id] }
                : s,
            ),
          });
        }
      }
      toast.success("Question created");
    }
    router.push(returnTo ?? `${baseUrl}/question-bank`);
  };

  const isGrouped = GROUPED_TYPES.includes(type);

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col">
      {isGrouped && (
        <div className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-2 md:px-6">
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Question Group Name"
            className="border-0 bg-transparent text-base font-medium shadow-none focus-visible:ring-0"
          />
        </div>
      )}

      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 py-2.5 md:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(returnTo ?? `${baseUrl}/question-bank`)}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {existing ? "Update" : "Save"}{" "}
          {isGrouped
            ? type === "comprehension-passage" || type === "question-group"
              ? "Question Group"
              : "Question"
            : "Question"}
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto bg-[var(--color-bg-default)] px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {!isGrouped && (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-[var(--color-text-default)]">
                  Question text
                </Label>
                <QuestionTypeSelector
                  value={type}
                  onChange={setType}
                  options={ALL_TYPES}
                />
              </div>
              <RichTextEditor
                value={text}
                onChange={setText}
                placeholder="Type or paste your question"
              />
            </>
          )}

          {isGrouped && (
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[var(--color-text-default)]">
                Question Material
              </Label>
              <QuestionTypeSelector
                value={type}
                onChange={setType}
                options={ALL_TYPES}
              />
            </div>
          )}

          {type === "comprehension-passage" && (
            <RichTextEditor
              value={passage}
              onChange={setPassage}
              placeholder="Type or paste your comprehension passage"
            />
          )}

          {type === "multiple-choice" && (
            <MultipleChoiceEditor options={options} onChange={setOptions} />
          )}
          {type === "multiple-answers" && (
            <MultipleChoiceEditor
              options={options}
              multi
              onChange={setOptions}
            />
          )}
          {type === "true-false" && (
            <TrueFalseEditor value={tfAnswer} onChange={setTfAnswer} />
          )}
          {type === "essay" && (
            <EssayEditor guidance={instruction} onChange={setInstruction} />
          )}
          {type === "short-answer" && (
            <ShortAnswerEditor answer={shortAnswer} onChange={setShortAnswer} />
          )}
          {type === "numerical" && (
            <NumericalEditor answer={shortAnswer} onChange={setShortAnswer} />
          )}
          {type === "fill-in-blank" && (
            <FillInBlankEditor answer={shortAnswer} onChange={setShortAnswer} />
          )}
          {type === "matching" && (
            <MatchingEditor
              items={matchItems}
              options={matchOptions}
              onChange={(items, options) => {
                setMatchItems(items);
                setMatchOptions(options);
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Marks
              </Label>
              <Input
                type="number"
                min={0}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Topic
              </Label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="h-9 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="" disabled>
                  Choose a topic
                </option>
                {topics
                  .filter((t) => String(t.subjectId) === String(subjectId))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
