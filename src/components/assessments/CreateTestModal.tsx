"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import type { TermType, TestType } from "@/types";
import type {
  AssessmentSetting,
  CreateAssessmentPayload,
} from "@/types/question";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  useCreateAssessment,
  useGetAssessmentSettingsByClass,
} from "@/hooks/queryHooks/useAssessment";
import {
  addMinutes,
  composeStartDateTime,
  uiTermToApi,
  uiTestTypeToApi,
} from "@/types/assessment.mapper";

interface CreateTestModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  classId: string;
  subjectId: string;
  branchId?: number;
  className: string;
  subjectName: string;
  onSuccess: (testId: string) => void;
}

const NONE_SETTING_VALUE = "none";

const defaultForm = {
  title: "",
  term: "First Term" as TermType,
  testType: "Continuous Assessment" as TestType,
  assessmentSettingId: null as number | null,
  testDate: "",
  startHour: "00",
  startMinute: "00",
  amPm: "AM" as "AM" | "PM",
  duration: 60,
  studentResultAccess: false,
};

type FormState = typeof defaultForm;

// ─── Form Body ────────────────────────────────────────────────────────────────

const FormBody = ({
  form,
  set,
  className,
  subjectName,
  settings,
  settingsLoading,
  onCancel,
  onSubmit,
  submitting,
  idPrefix,
}: {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  className: string;
  subjectName: string;
  settings: AssessmentSetting[];
  settingsLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  submitting: boolean;
  idPrefix: string;
}) => (
  <div className="flex flex-col gap-4 p-4">
    {/* Test Name */}
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">Test Name</Label>
      <Input
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        placeholder="e.g Mid-term mathematics test"
      />
    </div>

    {/* Class / Subject */}
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Class</Label>
        <Input
          value={className}
          readOnly
          className="bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Subject</Label>
        <Input
          value={subjectName}
          readOnly
          className="bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]"
        />
      </div>
    </div>

    {/* Term / Test Type */}
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Term</Label>
        <Select
          value={form.term}
          onValueChange={(v: string) => set("term", v as TermType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="First Term">First Term</SelectItem>
            <SelectItem value="Second Term">Second Term</SelectItem>
            <SelectItem value="Third Term">Third Term</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Test Type</Label>
        <Select
          value={form.testType}
          onValueChange={(v: string) => set("testType", v as TestType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Continuous Assessment">
              Continuous Assessment
            </SelectItem>
            <SelectItem value="Examination">Examination</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Assessment Mapping */}
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">Assessment Mapping</Label>
      <Select
        value={
          form.assessmentSettingId == null
            ? NONE_SETTING_VALUE
            : String(form.assessmentSettingId)
        }
        onValueChange={(v: string) =>
          set(
            "assessmentSettingId",
            v === NONE_SETTING_VALUE ? null : Number(v),
          )
        }
        disabled={settingsLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={settingsLoading ? "Loading…" : "Map assessment"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_SETTING_VALUE}>
            None / Manual Scoring
          </SelectItem>
          {settings.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.name} ({s.weight}%)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Test Date / Time */}
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Test Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "text-text-muted bg-bg-input-soft! focus-visible:border-border-default! hover:bg-bg-input-soft! w-full border-none text-sm font-normal shadow-none focus-visible:border!",
                form.testDate && "text-[var(--color-text-default)]",
              )}
            >
              {form.testDate ? (
                format(new Date(form.testDate + "T00:00:00"), "PPP")
              ) : (
                <span>dd / mm / yy</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-bg-card! p-0!" align="start">
            <Calendar
              mode="single"
              required
              selected={
                form.testDate
                  ? new Date(form.testDate + "T00:00:00")
                  : undefined
              }
              onSelect={(date) => {
                if (date) set("testDate", format(date, "yyyy-MM-dd"));
              }}
              captionLayout="dropdown"
              className="bg-bg-card w-full border-none"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Select Time</Label>
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            min={1}
            max={12}
            value={form.startHour}
            onChange={(e) => set("startHour", e.target.value.padStart(2, "0"))}
            className="w-14 text-center"
          />
          <span className="font-medium text-[var(--color-text-muted)]">:</span>
          <Input
            type="number"
            min={0}
            max={59}
            value={form.startMinute}
            onChange={(e) =>
              set("startMinute", e.target.value.padStart(2, "0"))
            }
            className="w-14 text-center"
          />
          <div className="flex rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => set("amPm", "AM")}
              className={cn(
                "h-auto rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                form.amPm === "AM"
                  ? "bg-white text-[var(--color-text-default)] shadow-sm hover:bg-white"
                  : "text-[var(--color-text-muted)] hover:bg-transparent hover:text-[var(--color-text-muted)]",
              )}
            >
              AM
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => set("amPm", "PM")}
              className={cn(
                "h-auto rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                form.amPm === "PM"
                  ? "bg-white text-[var(--color-text-default)] shadow-sm hover:bg-white"
                  : "text-[var(--color-text-muted)] hover:bg-transparent hover:text-[var(--color-text-muted)]",
              )}
            >
              PM
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Duration */}
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        Duration{" "}
        <span className="font-normal text-[var(--color-text-muted)]">
          (minutes)
        </span>
      </Label>
      <Input
        type="number"
        min={1}
        value={form.duration}
        onChange={(e) => set("duration", Number(e.target.value) || 0)}
      />
    </div>

    {/* Student result access */}
    <div className="flex items-start gap-3 border-t border-[var(--color-border-default)] pt-4">
      <Switch
        id={`${idPrefix}-result-access`}
        checked={form.studentResultAccess}
        onCheckedChange={(v) => set("studentResultAccess", v)}
        className="mt-0.5 shrink-0"
      />
      <div>
        <label
          htmlFor={`${idPrefix}-result-access`}
          className="cursor-pointer text-sm font-medium text-[var(--color-text-default)]"
        >
          Student result access
        </label>
        <p className="text-xs text-[var(--color-text-muted)]">
          Enable to allow students view their scores, answers, and feedback
          after submission.
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between border-t border-[var(--color-border-default)] pt-4">
      <Button variant="outline" onClick={onCancel} disabled={submitting}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={submitting}>
        {submitting && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
        Save &amp; Continue
      </Button>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const CreateTestModal = ({
  open,
  setOpen,
  classId,
  subjectId,
  branchId,
  className,
  subjectName,
  onSuccess,
}: CreateTestModalProps) => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const isMobile = useIsMobile();
  const createMutation = useCreateAssessment();

  const { data: settingsRes, isLoading: settingsLoading } =
    useGetAssessmentSettingsByClass(Number(classId));
  console.log(settingsRes);
  const settings: AssessmentSetting[] = settingsRes?.data?.assessments ?? [];

  const handleSetOpen = (v: boolean) => {
    if (!v) setForm(defaultForm);
    setOpen(v);
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.testDate) {
      toast.error("Please pick a test date");
      return;
    }
    if (branchId === undefined) {
      toast.error("Branch could not be resolved for this subject");
      return;
    }

    const startDateTime = composeStartDateTime({
      testDate: form.testDate,
      startHour: form.startHour,
      startMinute: form.startMinute,
      amPm: form.amPm,
    });
    const endDateTime = addMinutes(startDateTime, form.duration);

    const payload: CreateAssessmentPayload = {
      name: form.title.trim() || "Untitled Test",
      classId: Number(classId),
      subjectId: Number(subjectId),
      branchId,
      term: uiTermToApi(form.term),
      testType: uiTestTypeToApi(form.testType),
      assessmentSettingId: form.assessmentSettingId,
      durationMinutes: form.duration,
      totalMarks: 0,
      passingMarks: 0,
      startDateTime,
      endDateTime,
      instructions: "",
      shuffleQuestions: false,
      shuffleOptions: false,
      showResultsImmediately: form.studentResultAccess,
      allowReview: form.studentResultAccess,
    };

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success("Test created");
        handleSetOpen(false);
        onSuccess(String(res.data));
      },
      onError: (err) => {
        const msg =
          (err as { message?: string } | undefined)?.message ??
          "Failed to create test";
        toast.error(msg);
      },
    });
  };

  const formProps = {
    form,
    set,
    className,
    subjectName,
    settings,
    settingsLoading,
    onCancel: () => handleSetOpen(false),
    onSubmit: handleSubmit,
    submitting: createMutation.isPending,
  };

  const modalTitle = (
    <>
      <span className="block">Create Test</span>
      <span className="block text-xs font-normal text-[var(--color-text-muted)]">
        Set up the basic details. You&apos;ll add questions in the next step.
      </span>
    </>
  );

  return (
    <>
      {/* Desktop modal */}
      {!isMobile && (
        <Modal
          open={open}
          setOpen={handleSetOpen}
          title={modalTitle}
          showFooter={false}
          className="max-h-[90vh] overflow-y-auto"
        >
          <FormBody {...formProps} idPrefix="modal" />
        </Modal>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <MobileDrawer open={open} setIsOpen={handleSetOpen} title="Create Test">
          <div className="max-h-[80vh] overflow-y-auto">
            <FormBody {...formProps} idPrefix="drawer" />
          </div>
        </MobileDrawer>
      )}
    </>
  );
};
