"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCBTStore } from "@/store";
import { generateId, cn } from "@/lib/utils";
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
import type { Test, TermType, TestType } from "@/types";
import type { AssessmentSetting } from "@/types/question";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGetAssessmentSettingsByClass } from "@/hooks/queryHooks/useAssessment";

interface CreateTestModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  classId: string;
  subjectId: string;
  className: string;
  subjectName: string;
  onSuccess: (testId: string) => void;
}

const defaultForm = {
  title: "",
  term: "First Term" as TermType,
  testType: "Continuous Assessment" as TestType,
  assessmentMapping: "",
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
  assessmentSettings,
  assessmentSettingsLoading,
  onCancel,
  onSubmit,
  idPrefix,
}: {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  className: string;
  subjectName: string;
  assessmentSettings: AssessmentSetting[];
  assessmentSettingsLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
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
        value={form.assessmentMapping}
        onValueChange={(v: string) => set("assessmentMapping", v)}
        disabled={assessmentSettingsLoading || assessmentSettings.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              assessmentSettingsLoading
                ? "Loading…"
                : assessmentSettings.length === 0
                  ? "No assessment mappings configured"
                  : "Map assessment"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {assessmentSettings.map((a) => (
            <SelectItem key={a.id} value={String(a.id)}>
              {a.name} ({a.weight}%)
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
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSubmit}>Save &amp; Continue</Button>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const CreateTestModal = ({
  open,
  setOpen,
  classId,
  subjectId,
  className,
  subjectName,
  onSuccess,
}: CreateTestModalProps) => {
  const { addTest } = useCBTStore();
  const [form, setForm] = useState<FormState>(defaultForm);
  const isMobile = useIsMobile();

  const { data: settingsRes, isLoading: assessmentSettingsLoading } =
    useGetAssessmentSettingsByClass(Number(classId));
  const assessmentSettings = settingsRes?.data?.assessments ?? [];

  const handleSetOpen = (v: boolean) => {
    if (!v) setForm(defaultForm);
    setOpen(v);
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    const selectedSetting = assessmentSettings.find(
      (a) => String(a.id) === form.assessmentMapping,
    );
    const mappingLabel = selectedSetting
      ? `${selectedSetting.name} (${selectedSetting.weight}%)`
      : "";

    const newTest: Test = {
      id: generateId(),
      title: form.title.trim() || "Untitled Test",
      subjectId,
      classId,
      term: form.term,
      testType: form.testType,
      assessmentMapping: form.assessmentMapping as Test["assessmentMapping"],
      mappingLabel,
      testDate: form.testDate,
      startTime: `${form.startHour}:${form.startMinute}`,
      amPm: form.amPm,
      duration: form.duration,
      studentResultAccess: form.studentResultAccess,
      status: "draft",
      sections: [
        {
          id: generateId(),
          title: "Section A",
          instruction: "",
          questionIds: [],
        },
      ],
      totalMarks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTest(newTest);
    handleSetOpen(false);
    onSuccess(newTest.id);
  };

  const formProps = {
    form,
    set,
    className,
    subjectName,
    assessmentSettings,
    assessmentSettingsLoading,
    onCancel: () => handleSetOpen(false),
    onSubmit: handleSubmit,
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
