import { CreateQuestionPayload } from "./question";
import { Blank } from "./question.types";

// ─── Multiple Blanks mapper ───────────────────────────────────────────────────

export function multipleBlanksToPayload(
  questionText: string,
  instruction: string,
  blanks: Blank[],
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
      blanks: blanks.map((b) => ({
        blankLabel: b.label,
        marks: b.mark,
        answerType:
          b.answerType === "multiple-choice"
            ? "MULTIPLE_CHOICE"
            : "SHORT_ANSWER",
        correctAnswers: b.answers,
      })),
    },
  };
}
