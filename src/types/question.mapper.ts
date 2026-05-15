import {
  ApiQuestion,
  BlankData,
  CreateQuestionPayload,
  MatchPairData,
  OptionData,
  PayloadSubQuestion,
  PayloadSubQuestionTypeSpecificData,
  PayloadTypeSpecificData,
  QuestionType as ApiQuestionType,
  ResponseSubQuestion,
  ResponseTypeSpecificData,
  SubQuestionType,
} from "./question";
import type {
  Blank as UIBlank,
  Option as UIOption,
  Question as UIQuestion,
  QuestionType as UIQuestionType,
} from "@/types";
import { generateId } from "@/lib/utils";

// ─── Type discriminator mapping (kebab ↔ SCREAMING_SNAKE_CASE) ────────────────

const KEBAB_TO_API: Record<UIQuestionType, ApiQuestionType> = {
  "multiple-choice": "MULTIPLE_CHOICE",
  "multiple-answers": "MULTIPLE_ANSWERS",
  "true-false": "TRUE_FALSE",
  essay: "ESSAY",
  "short-answer": "SHORT_ANSWER",
  numerical: "NUMERIC_ANSWER",
  "fill-in-blank": "FILL_IN_THE_BLANK",
  matching: "MATCH",
  "question-group": "QUESTION_GROUP",
  "comprehension-passage": "QUESTION_GROUP",
  "multiple-blanks": "FILL_IN_THE_BLANK",
};

export const kebabToApiType = (t: UIQuestionType): ApiQuestionType =>
  KEBAB_TO_API[t];

// FILL_IN_THE_BLANK on the response can map back to either "fill-in-blank" or
// "multiple-blanks" depending on how many blanks the response carries. The rest
// is a clean 1:1 inverse.
export const apiToKebabType = (
  t: ApiQuestionType,
  blanksCount = 0,
): UIQuestionType => {
  switch (t) {
    case "MULTIPLE_CHOICE":
      return "multiple-choice";
    case "MULTIPLE_ANSWERS":
      return "multiple-answers";
    case "TRUE_FALSE":
      return "true-false";
    case "ESSAY":
      return "essay";
    case "SHORT_ANSWER":
      return "short-answer";
    case "NUMERIC_ANSWER":
      return "numerical";
    case "FILL_IN_THE_BLANK":
      return blanksCount > 1 ? "multiple-blanks" : "fill-in-blank";
    case "MATCH":
      return "matching";
    case "QUESTION_GROUP":
      return "question-group";
    case "COMPREHENSION":
      return "comprehension-passage";
  }
};

// ─── Option / blank / match shape helpers ────────────────────────────────────

const uiOptionsToApi = (options: UIOption[]): OptionData[] =>
  options.map((o) => ({
    optionLabel: o.id,
    optionText: o.text,
    isCorrect: o.isCorrect ?? false,
    imageUrl: o.imageUrl,
  }));

const apiOptionsToUI = (options: OptionData[] = []): UIOption[] =>
  options.map((o) => ({
    id: o.optionLabel || generateId(),
    text: o.optionText ?? "",
    isCorrect: o.isCorrect,
    imageUrl: o.imageUrl,
  }));

const uiBlanksToApi = (blanks: UIBlank[]): BlankData[] =>
  blanks.map((b) => ({
    blankLabel: b.label,
    marks: b.mark,
    answerType:
      b.answerType === "multiple-choice" ? "MULTIPLE_CHOICE" : "SHORT_ANSWER",
    correctAnswers: b.answers,
    options:
      b.answerType === "multiple-choice" && b.options?.length
        ? uiOptionsToApi(b.options)
        : undefined,
  }));

const apiBlanksToUI = (blanks: BlankData[] = []): UIBlank[] =>
  blanks.map(
    (b): UIBlank => ({
      id: generateId(),
      label: b.blankLabel ?? "",
      mark: b.marks ?? 1,
      answerType:
        b.answerType === "MULTIPLE_CHOICE" ? "multiple-choice" : "short-answer",
      answers: b.correctAnswers ?? [],
      options: b.options?.length ? apiOptionsToUI(b.options) : undefined,
    }),
  );

const uiMatchToApi = (
  items: { id: string; text: string; imageUrl?: string }[] = [],
  options: { id: string; text: string; imageUrl?: string }[] = [],
): MatchPairData[] => {
  const len = Math.max(items.length, options.length);
  const pairs: MatchPairData[] = [];
  for (let i = 0; i < len; i++) {
    pairs.push({
      itemText: items[i]?.text ?? "",
      matchText: options[i]?.text ?? "",
      itemImageUrl: items[i]?.imageUrl,
      matchImageUrl: options[i]?.imageUrl,
    });
  }
  return pairs;
};

// ─── UI Question → API typeSpecificData ──────────────────────────────────────

const buildPayloadTypeSpecificData = (
  q: Pick<
    UIQuestion,
    | "type"
    | "options"
    | "correctAnswer"
    | "blanks"
    | "passage"
    | "instruction"
    | "subQuestions"
    | "matchItems"
    | "matchOptions"
    | "metadata"
    | "stimulusImageUrl"
  >,
): PayloadTypeSpecificData => {
  const m = q.metadata ?? {};
  switch (q.type) {
    case "multiple-choice":
      return {
        type: "MULTIPLE_CHOICE",
        options: uiOptionsToApi(q.options ?? []),
      };
    case "multiple-answers":
      return {
        type: "MULTIPLE_ANSWERS",
        options: uiOptionsToApi(q.options ?? []),
        minSelections: m.minSelections,
        maxSelections: m.maxSelections,
        partialCredit: m.partialCredit,
      };
    case "true-false": {
      const correct = q.options?.find((o) => o.isCorrect)?.id;
      return { type: "TRUE_FALSE", correctAnswer: correct === "true" };
    }
    case "essay":
      return {
        type: "ESSAY",
        minWords: m.minWords,
        maxWords: m.maxWords,
        modelAnswer: m.modelAnswer,
        rubric: m.rubric ?? q.instruction ?? undefined,
      };
    case "short-answer":
      return {
        type: "SHORT_ANSWER",
        correctAnswers: Array.isArray(q.correctAnswer)
          ? q.correctAnswer
          : q.correctAnswer
            ? [q.correctAnswer]
            : [],
        caseSensitive: m.caseSensitive,
        exactMatch: m.exactMatch,
        maxLength: m.maxLength,
      };
    case "numerical":
      return {
        type: "NUMERIC_ANSWER",
        correctAnswer:
          typeof q.correctAnswer === "string" && q.correctAnswer !== ""
            ? Number(q.correctAnswer)
            : undefined,
        tolerance: m.tolerance,
        minValue: m.minValue,
        maxValue: m.maxValue,
        unit: m.unit,
        decimalPlaces: m.decimalPlaces,
      };
    case "fill-in-blank":
      return {
        type: "FILL_IN_THE_BLANK",
        caseSensitive: m.caseSensitive,
        blanks: [
          {
            blankLabel: "blank-1",
            marks: 1,
            answerType: "SHORT_ANSWER",
            correctAnswers: Array.isArray(q.correctAnswer)
              ? q.correctAnswer
              : q.correctAnswer
                ? [q.correctAnswer]
                : [],
          },
        ],
      };
    case "matching":
      return {
        type: "MATCH",
        pairs: uiMatchToApi(q.matchItems, q.matchOptions),
        marksForEach: m.marksForEach,
        shuffleItems: m.shuffleItems,
        partialCredit: m.partialCredit,
      };
    case "multiple-blanks":
      return {
        type: "FILL_IN_THE_BLANK",
        instruction: q.instruction || undefined,
        caseSensitive: m.caseSensitive,
        blanks: uiBlanksToApi(q.blanks ?? []),
      };
    case "question-group":
      return {
        type: "QUESTION_GROUP",
        stimulusType: m.stimulusType,
        stimulusContent: q.passage || undefined,
        stimulusImageUrl: q.stimulusImageUrl,
        subQuestions: (q.subQuestions ?? []).map(uiSubQuestionToPayload),
      };
    case "comprehension-passage":
      return {
        type: "QUESTION_GROUP",
        stimulusType: m.stimulusType ?? "comprehension-passage",
        stimulusContent: q.passage || undefined,
        stimulusImageUrl: q.stimulusImageUrl,
        subQuestions: (q.subQuestions ?? []).map(uiSubQuestionToPayload),
      };
  }
};

const uiSubQuestionToPayload = (sq: UIQuestion): PayloadSubQuestion => {
  const subType: SubQuestionType = (
    sq.type === "question-group" || sq.type === "comprehension-passage"
      ? "MULTIPLE_CHOICE"
      : kebabToApiType(sq.type)
  ) as SubQuestionType;
  const tsd = buildPayloadTypeSpecificData(
    sq,
  ) as PayloadSubQuestionTypeSpecificData;
  return {
    questionText: sq.text,
    marks: sq.marks,
    explanation: sq.instruction || undefined,
    imageUrl: sq.imageUrl,
    questionType: subType,
    typeSpecificData: tsd,
  };
};

export const questionToCreatePayload = (
  q: UIQuestion,
  ctx: { classId: number; subjectId: number; topicId: number },
): CreateQuestionPayload => {
  const apiType = kebabToApiType(q.type);
  return {
    classId: ctx.classId,
    subjectId: ctx.subjectId,
    topicId: ctx.topicId,
    questionText: q.text,
    marks: q.marks,
    explanation: q.instruction || undefined,
    imageUrl: q.imageUrl,
    questionType: apiType,
    typeSpecificData: buildPayloadTypeSpecificData(q),
  };
};

// ─── API ApiQuestion → UI Question ───────────────────────────────────────────

const buildTsdFromFlatSubQuestion = (
  sq: ResponseSubQuestion,
  questionType: ApiQuestionType,
): ResponseTypeSpecificData | undefined => {
  switch (questionType) {
    case "MULTIPLE_CHOICE":
      return { questionType: "MULTIPLE_CHOICE", options: sq.options ?? [] };
    case "MULTIPLE_ANSWERS":
      return { questionType: "MULTIPLE_ANSWERS", options: sq.options ?? [] };
    case "TRUE_FALSE":
      return {
        questionType: "TRUE_FALSE",
        correctAnswer: (sq.additionalData?.correctAnswer as boolean) ?? false,
      };
    case "SHORT_ANSWER":
      return {
        questionType: "SHORT_ANSWER",
        additionalData: sq.additionalData as never,
      };
    case "NUMERIC_ANSWER":
      return {
        questionType: "NUMERIC_ANSWER",
        additionalData: {
          correctAnswer: sq.additionalData?.correctAnswer as number | undefined,
        },
      };
    case "ESSAY":
      return { questionType: "ESSAY" };
    case "FILL_IN_THE_BLANK":
      return { questionType: "FILL_IN_THE_BLANK" };
    default:
      return undefined;
  }
};

const apiSubQuestionToUI = (sq: ResponseSubQuestion): UIQuestion => {
  const questionType = (sq.questionType ?? sq.type) as ApiQuestionType;
  const tsd: ResponseTypeSpecificData | undefined =
    sq.typeSpecificData ?? buildTsdFromFlatSubQuestion(sq, questionType);

  const blanksCount =
    tsd?.questionType === "FILL_IN_THE_BLANK"
      ? ((tsd as { blanks?: unknown[] }).blanks?.length ?? 0)
      : 0;
  const uiType = apiToKebabType(
    questionType as Exclude<
      ApiQuestionType,
      "QUESTION_GROUP" | "COMPREHENSION"
    >,
    blanksCount,
  );
  const base: UIQuestion = {
    id: generateId(),
    topicId: 0,
    type: uiType,
    text: sq.questionText,
    marks: sq.marks,
    instruction: sq.explanation || undefined,
    imageUrl: sq.imageUrl || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return tsd ? tsdToUiFields(base, tsd) : base;
};

const tsdToUiFields = (
  base: UIQuestion,
  tsd: ResponseTypeSpecificData,
): UIQuestion => {
  switch (tsd.questionType) {
    case "MULTIPLE_CHOICE":
      return { ...base, options: apiOptionsToUI(tsd.options) };
    case "MULTIPLE_ANSWERS":
      return {
        ...base,
        options: apiOptionsToUI(tsd.options),
        metadata: {
          minSelections: tsd.minSelections,
          maxSelections: tsd.maxSelections,
          partialCredit: tsd.partialCredit,
        },
      };
    case "TRUE_FALSE":
      return {
        ...base,
        options: [
          { id: "true", text: "True", isCorrect: tsd.correctAnswer === true },
          {
            id: "false",
            text: "False",
            isCorrect: tsd.correctAnswer === false,
          },
        ],
      };
    case "ESSAY":
      return {
        ...base,
        instruction: tsd.rubric ?? base.instruction,
        metadata: {
          minWords: tsd.minWords,
          maxWords: tsd.maxWords,
          modelAnswer: tsd.modelAnswer,
          rubric: tsd.rubric,
        },
      };
    case "SHORT_ANSWER":
      return {
        ...base,
        correctAnswer: tsd.additionalData?.correctAnswers ?? [],
        metadata: {
          caseSensitive: tsd.additionalData?.caseSensitive,
          exactMatch: tsd.additionalData?.exactMatch,
          maxLength: tsd?.additionalData?.maxLength,
        },
      };
    case "NUMERIC_ANSWER":
      return {
        ...base,
        correctAnswer:
          tsd?.additionalData?.correctAnswer !== undefined
            ? String(tsd?.additionalData?.correctAnswer)
            : "",
        metadata: {
          tolerance: tsd?.additionalData?.tolerance,
          minValue: tsd?.additionalData.minValue,
          maxValue: tsd?.additionalData.maxValue,
          unit: tsd?.additionalData?.unit,
          decimalPlaces: tsd?.additionalData?.decimalPlaces,
        },
      };
    case "FILL_IN_THE_BLANK": {
      const blanks = tsd.blanks ?? [];
      if (blanks.length > 1) {
        return {
          ...base,
          type: "multiple-blanks",
          instruction: tsd.instruction ?? base.instruction,
          blanks: apiBlanksToUI(blanks),
          metadata: { caseSensitive: tsd.caseSensitive },
        };
      }
      return {
        ...base,
        type: "fill-in-blank",
        correctAnswer: blanks[0]?.correctAnswers?.[0] ?? "",
        metadata: { caseSensitive: tsd.caseSensitive },
      };
    }
    case "MATCH":
      return {
        ...base,
        matchItems: tsd.pairs.map((p) => ({
          id: generateId(),
          text: p.itemText ?? "",
          imageUrl: p.itemImageUrl,
        })),
        matchOptions: tsd.pairs.map((p) => ({
          id: generateId(),
          text: p.matchText ?? "",
          imageUrl: p.matchImageUrl,
        })),
        metadata: {
          marksForEach: tsd.marksForEach,
          shuffleItems: tsd.shuffleItems,
          partialCredit: tsd.partialCredit,
        },
      };
    case "QUESTION_GROUP":
      return {
        ...base,
        passage: tsd.stimulusContent,
        stimulusImageUrl: tsd.stimulusImageUrl,
        subQuestions: (tsd.subQuestions ?? []).map(apiSubQuestionToUI),
        metadata: { stimulusType: tsd.stimulusType },
      };
    case "COMPREHENSION":
      return {
        ...base,
        passage: tsd.stimulusContent,
        stimulusImageUrl: tsd.stimulusImageUrl,
        subQuestions: (tsd.subQuestions ?? []).map(apiSubQuestionToUI),
        metadata: { stimulusType: tsd.stimulusType },
      };
  }
};

export const apiQuestionToUI = (api: ApiQuestion): UIQuestion => {
  const blanksCount =
    api.questionType === "FILL_IN_THE_BLANK" ? (api?.blanks?.length ?? 0) : 0;
  const uiType = apiToKebabType(api.questionType, blanksCount);
  const base: UIQuestion = {
    id: String(api.id),
    topicId: api.topicId,
    type: uiType,
    text: api.questionText,
    marks: api.marks,
    instruction: api.explanation,
    imageUrl: api.imageUrl,
    createdAt: api.createdAt ?? new Date().toISOString(),
    updatedAt: api.updatedAt ?? new Date().toISOString(),
  };
  // Some API endpoints omit the `questionType` discriminant from typeSpecificData.
  // Inject it from the parent field so tsdToUiFields can match the correct case.
  const rawTsd = api.typeSpecificData;
  const tsd: ResponseTypeSpecificData = (() => {
    if (rawTsd?.questionType) return rawTsd;
    if (rawTsd)
      return {
        ...(rawTsd as unknown as Record<string, unknown>),
        questionType: api.questionType,
      } as ResponseTypeSpecificData;
    // QUESTION_GROUP: backend puts stimulusContent / subQuestions inside additionalData
    if (api.questionType === "QUESTION_GROUP" && api.additionalData) {
      return {
        ...api.additionalData,
        questionType: api.questionType,
      } as ResponseTypeSpecificData;
    }
    const ad = (api.additionalData ?? {}) as Record<string, unknown>;
    switch (api.questionType) {
      case "MULTIPLE_CHOICE":
        return { questionType: "MULTIPLE_CHOICE", options: api.options ?? [] };
      case "MULTIPLE_ANSWERS":
        return {
          questionType: "MULTIPLE_ANSWERS",
          options: api.options ?? [],
          minSelections: ad.minSelections as number | undefined,
          maxSelections: ad.maxSelections as number | undefined,
          partialCredit: ad.partialCredit as boolean | undefined,
        };
      case "TRUE_FALSE":
        return {
          questionType: "TRUE_FALSE",
          correctAnswer: (ad.correctAnswer as boolean) ?? false,
        };
      case "ESSAY":
        return {
          questionType: "ESSAY",
          rubric: ad.rubric as string | undefined,
          modelAnswer: ad.modelAnswer as string | undefined,
          minWords: ad.minWords as number | undefined,
          maxWords: ad.maxWords as number | undefined,
        };
      case "SHORT_ANSWER":
        return {
          questionType: "SHORT_ANSWER",
          additionalData: {
            correctAnswers: ad.correctAnswers as string[] | undefined,
            caseSensitive: ad.caseSensitive as boolean | undefined,
            exactMatch: ad.exactMatch as boolean | undefined,
            maxLength: ad.maxLength as number | undefined,
          },
        };
      case "NUMERIC_ANSWER":
        return {
          questionType: "NUMERIC_ANSWER",
          additionalData: {
            correctAnswer: ad.correctAnswer as number | undefined,
            tolerance: ad.tolerance as number | undefined,
            minValue: ad.minValue as number | undefined,
            maxValue: ad.maxValue as number | undefined,
            unit: ad.unit as string | undefined,
            decimalPlaces: ad.decimalPlaces as number | undefined,
          },
        };
      case "FILL_IN_THE_BLANK":
        return {
          questionType: "FILL_IN_THE_BLANK",
          blanks: api.blanks ?? (ad.blanks as BlankData[] | undefined),
          caseSensitive: ad.caseSensitive as boolean | undefined,
          instruction: ad.instruction as string | undefined,
        };
      case "MATCH":
        return {
          questionType: "MATCH",
          pairs: api.pairs ?? (ad.pairs as MatchPairData[] | undefined) ?? [],
          marksForEach: ad.marksForEach as number | undefined,
          shuffleItems: ad.shuffleItems as boolean | undefined,
          partialCredit: ad.partialCredit as boolean | undefined,
        };
      default:
        return {
          ...(api as unknown as Record<string, unknown>),
          questionType: api.questionType,
        } as ResponseTypeSpecificData;
    }
  })();
  return tsdToUiFields(base, tsd);
};

// ─── Multiple-Blanks form-state mapper (kept for existing callers) ───────────

export function multipleBlanksToPayload(
  questionText: string,
  instruction: string,
  blanks: UIBlank[],
  classId: number,
  subjectId: number,
  topicId: number,
): CreateQuestionPayload {
  return {
    classId,
    subjectId,
    topicId,
    questionText,
    marks: blanks.reduce((s, b) => s + b.mark, 0) || 1,
    explanation: instruction || undefined,
    questionType: "FILL_IN_THE_BLANK",
    typeSpecificData: {
      type: "FILL_IN_THE_BLANK",
      instruction,
      blanks: uiBlanksToApi(blanks),
    },
  };
}
