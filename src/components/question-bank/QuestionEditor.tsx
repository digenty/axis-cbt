"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type {
  Blank,
  Option,
  Question,
  QuestionMetadata,
  QuestionType,
} from "@/types";
import type { ApiTopic } from "@/types/question";
import { toast } from "sonner";
import {
  useCreateCbtQuestion,
  useGetQuestion,
  useGetTopics,
  useUpdateCbtQuestion,
} from "@/hooks/queryHooks/useQuestionBank";
import {
  apiQuestionToUI,
  questionToCreatePayload,
} from "@/types/question.mapper";

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
  const {
    classId: classIdStr,
    subjectId: subjectIdStr,
    questionId,
  } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const router = useRouter();
  const search = useSearchParams();
  const topicIdParam = search.get("topicId") ?? "";
  const typeParam = search.get("type") as QuestionType | null;
  const returnTo = search.get("returnTo");
  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;

  const { data: topicsRes } = useGetTopics({ classId, subjectId });
  const apiTopics = topicsRes?.data ?? [];

  const numericQuestionId =
    mode === "edit" && questionId ? Number(questionId) : 0;
  const { data: existingRes, isLoading: existingLoading } =
    useGetQuestion(numericQuestionId);
  const existing =
    mode === "edit" && existingRes?.data
      ? apiQuestionToUI(existingRes.data)
      : null;

  if (mode === "edit" && existingLoading && !existing) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-text-muted)]" />
      </div>
    );
  }

  return (
    <QuestionEditorBody
      key={existing?.id ?? "new"}
      mode={mode}
      classId={classId}
      subjectId={subjectId}
      baseUrl={baseUrl}
      returnTo={returnTo}
      topicIdParam={topicIdParam}
      typeParam={typeParam}
      existing={existing}
      apiTopics={apiTopics}
      onClose={() => router.push(returnTo ?? `${baseUrl}/question-bank`)}
    />
  );
};

// ─── Editor body (uses lazy useState initializers, no hydration effect) ────

interface BodyProps {
  mode: "create" | "edit";
  classId: number;
  subjectId: number;
  baseUrl: string;
  returnTo: string | null;
  topicIdParam: string;
  typeParam: QuestionType | null;
  existing: Question | null;
  apiTopics: ApiTopic[];
  onClose: () => void;
}

const QuestionEditorBody = ({
  mode,
  classId,
  subjectId,
  returnTo,
  baseUrl,
  topicIdParam,
  typeParam,
  existing,
  apiTopics,
  onClose,
}: BodyProps) => {
  const createMutation = useCreateCbtQuestion();
  const updateMutation = useUpdateCbtQuestion();

  const [type, setType] = useState<QuestionType>(
    () => existing?.type ?? typeParam ?? "multiple-choice",
  );
  const [text, setText] = useState(() => existing?.text ?? "");
  const [marks, setMarks] = useState<number>(() => existing?.marks ?? 1);
  const [instruction, setInstruction] = useState(
    () => existing?.instruction ?? "",
  );
  const [topicId, setTopicId] = useState(() =>
    existing ? String(existing.topicId) : topicIdParam,
  );
  const [options, setOptions] = useState<Option[]>(
    () =>
      existing?.options ?? [
        { id: "a", text: "", isCorrect: false },
        { id: "b", text: "", isCorrect: false },
        { id: "c", text: "", isCorrect: false },
        { id: "d", text: "", isCorrect: false },
      ],
  );
  const [tfAnswer, setTfAnswer] = useState<"true" | "false" | null>(() => {
    if (existing?.type === "true-false") {
      const id = existing.options?.find((o) => o.isCorrect)?.id;
      return id === "true" || id === "false" ? id : null;
    }
    return null;
  });
  const [shortAnswer, setShortAnswer] = useState<string>(() =>
    typeof existing?.correctAnswer === "string" ? existing.correctAnswer : "",
  );
  const [matchItems, setMatchItems] = useState(
    () =>
      existing?.matchItems ?? [
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
      ],
  );
  const [matchOptions, setMatchOptions] = useState(
    () =>
      existing?.matchOptions ?? [
        { id: generateId(), text: "" },
        { id: generateId(), text: "" },
      ],
  );
  const [passage, setPassage] = useState(() => existing?.passage ?? "");
  const [subQuestions, setSubQuestions] = useState<Question[]>(
    () => existing?.subQuestions ?? [],
  );
  const [blanks, setBlanks] = useState<Blank[]>(() => existing?.blanks ?? []);
  const [groupName, setGroupName] = useState(() =>
    existing?.type === "question-group" ||
    existing?.type === "comprehension-passage"
      ? existing.text
      : "",
  );
  const [materialKind, setMaterialKind] = useState<MaterialKind>(() => {
    const t = existing?.metadata?.stimulusType;
    if (
      t === "comprehension-passage" ||
      t === "diagram" ||
      t === "table" ||
      t === "chart" ||
      t === "multiple-blanks"
    )
      return t;
    return "diagram";
  });
  const [metadata, setMetadata] = useState<QuestionMetadata>(
    () => existing?.metadata ?? {},
  );

  const handleSave = () => {
    if (!topicId) {
      toast.error("Topic missing");
      return;
    }
    if (!text && !isGrouped) {
      toast.error("Question text required");
      return;
    }

    const uiQuestion: Question = {
      id: existing?.id ?? generateId(),
      topicId: Number(topicId),
      type,
      text:
        type === "question-group" || type === "comprehension-passage"
          ? groupName ||
            (type === "comprehension-passage"
              ? passage.slice(0, 60)
              : "Question group")
          : text,
      marks,
      instruction,
      options:
        type === "true-false"
          ? [
              { id: "true", text: "True", isCorrect: tfAnswer === "true" },
              { id: "false", text: "False", isCorrect: tfAnswer === "false" },
            ]
          : type === "multiple-choice" || type === "multiple-answers"
            ? options
            : undefined,
      correctAnswer:
        type === "short-answer" ||
        type === "numerical" ||
        type === "fill-in-blank"
          ? shortAnswer
          : undefined,
      blanks: type === "multiple-blanks" ? blanks : undefined,
      passage:
        type === "comprehension-passage" || type === "question-group"
          ? passage
          : undefined,
      subQuestions:
        type === "comprehension-passage" || type === "question-group"
          ? subQuestions
          : undefined,
      matchItems: type === "matching" ? matchItems : undefined,
      matchOptions: type === "matching" ? matchOptions : undefined,
      metadata:
        type === "question-group" || type === "comprehension-passage"
          ? { ...metadata, stimulusType: materialKind }
          : metadata,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payload = questionToCreatePayload(uiQuestion, {
      classId,
      subjectId,
      topicId: Number(topicId),
    });

    if (mode === "edit" && existing) {
      updateMutation.mutate(
        { id: Number(existing.id), payload },
        {
          onSuccess: () => {
            toast.success("Question updated");
            onClose();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Question created");
          onClose();
        },
      });
    }
  };

  const isGrouped = GROUPED_TYPES.includes(type);
  const saving = createMutation.isPending || updateMutation.isPending;

  // Reference baseUrl/returnTo via the onClose callback only — keep linter happy
  void baseUrl;
  void returnTo;

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
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
          {mode === "edit" ? "Update" : "Save"}{" "}
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
            <EssayEditor
              guidance={instruction}
              onChange={setInstruction}
              metadata={metadata}
              onChangeMetadata={setMetadata}
            />
          )}
          {type === "short-answer" && (
            <ShortAnswerEditor answer={shortAnswer} onChange={setShortAnswer} />
          )}
          {type === "numerical" && (
            <NumericalEditor
              answer={shortAnswer}
              onChange={setShortAnswer}
              metadata={metadata}
              onChangeMetadata={setMetadata}
            />
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
                {apiTopics.map((t) => (
                  <option key={t.id} value={String(t.id)}>
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
