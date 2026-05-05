import type {
  ApiAssessment,
  ApiSection,
  ApiTerm,
  ApiTestType,
  ApiAssessmentStatus,
} from "./question";
import type {
  Test,
  TermType,
  TestType,
  TestStatus,
  TestSection,
} from "./results";

// ─── Term ─────────────────────────────────────────────────────────────────────

export const apiTermToUi = (t: ApiTerm): TermType =>
  t === "FIRST" ? "First Term" : t === "SECOND" ? "Second Term" : "Third Term";

export const uiTermToApi = (t: TermType): ApiTerm =>
  t === "First Term" ? "FIRST" : t === "Second Term" ? "SECOND" : "THIRD";

// ─── Test type ────────────────────────────────────────────────────────────────

export const apiTestTypeToUi = (t: ApiTestType): TestType =>
  t === "EXAMINATION" ? "Examination" : "Continuous Assessment";

export const uiTestTypeToApi = (t: TestType): ApiTestType =>
  t === "Examination" ? "EXAMINATION" : "CONTINUOUS_ASSESSMENT";

// ─── Status ───────────────────────────────────────────────────────────────────

export const apiStatusToUi = (s: ApiAssessmentStatus | string): TestStatus => {
  if (s === "PUBLISHED" || s === "ONGOING") return "published";
  if (s === "COMPLETED" || s === "ARCHIVED") return "completed";
  return "draft";
};

// ─── Date split / compose ────────────────────────────────────────────────────
// CreateTestModal collects testDate + startHour + startMinute + amPm separately;
// the API wants ISO timestamps for `startDateTime` / `endDateTime`.

export const composeStartDateTime = ({
  testDate,
  startHour,
  startMinute,
  amPm,
}: {
  testDate: string;
  startHour: string;
  startMinute: string;
  amPm: "AM" | "PM";
}): string => {
  const h12 = Number(startHour);
  const m = Number(startMinute);
  const h24 = amPm === "PM" ? (h12 % 12) + 12 : h12 === 12 ? 0 : h12;
  // testDate is YYYY-MM-DD; build as local time then return ISO.
  const d = new Date(`${testDate}T00:00:00`);
  d.setHours(h24, m, 0, 0);
  return d.toISOString();
};

export const addMinutes = (iso: string, minutes: number): string => {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
};

export const splitStartDateTime = (
  iso: string,
): {
  testDate: string;
  startHour: string;
  startMinute: string;
  amPm: "AM" | "PM";
} => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const h24 = d.getHours();
  const amPm: "AM" | "PM" = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return {
    testDate: `${yyyy}-${mm}-${dd}`,
    startHour: String(h12).padStart(2, "0"),
    startMinute: String(d.getMinutes()).padStart(2, "0"),
    amPm,
  };
};

// ─── Assessment ───────────────────────────────────────────────────────────────

export const apiAssessmentToTest = (
  a: ApiAssessment,
  sections: ApiSection[] = [],
): Test => {
  const split = splitStartDateTime(a.startDateTime);
  return {
    id: String(a.id),
    title: a.name,
    subjectId: String(a.subjectId),
    classId: String(a.classId),
    term: apiTermToUi(a.term),
    testType: apiTestTypeToUi(a.testType),
    assessmentMapping: "",
    mappingLabel: a.assessmentMapping ?? "",
    testDate: split.testDate,
    startTime: `${split.startHour}:${split.startMinute}`,
    amPm: split.amPm,
    duration: a.durationMinutes,
    studentResultAccess: a.showResultsImmediately ?? false,
    status: apiStatusToUi(a.status),
    sections: sections.map(apiSectionToTestSection),
    totalMarks: a.totalMarks,
    createdAt: "",
    updatedAt: "",
  };
};

export const apiSectionToTestSection = (s: ApiSection): TestSection => ({
  id: String(s.id),
  title: s.name,
  instruction: s.instructions ?? "",
  questionIds: (s.questions ?? []).map((q) => String(q.questionId)),
});
