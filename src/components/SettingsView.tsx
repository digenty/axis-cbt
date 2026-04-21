"use client";

import { Settings, Bell, Lock, Globe, Info } from "lucide-react";

// ─── Section ──────────────────────────────────────────────────────────────────

const Section = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
    <div className="flex items-center gap-3 border-b border-gray-50 px-5 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
    <div className="divide-y divide-gray-50">{children}</div>
  </div>
);

// ─── Row ──────────────────────────────────────────────────────────────────────

const Row = ({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-5 py-4">
    <div className="min-w-0 flex-1 pr-4">
      <p className="text-sm font-medium text-gray-800">{label}</p>
      {description && (
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      )}
    </div>
    {control}
  </div>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-200"}`}
  >
    <span
      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`}
    />
  </button>
);

// ─── View ─────────────────────────────────────────────────────────────────────

export const SettingsView = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your CBT preferences
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-4">
        {/* Notifications */}
        <Section
          icon={<Bell className="h-4 w-4" />}
          title="Notifications"
          description="Control when you receive alerts"
        >
          <Row
            label="Assessment reminders"
            description="Get notified before a scheduled assessment opens"
            control={<Toggle checked={true} onChange={() => {}} />}
          />
          <Row
            label="Submission alerts"
            description="Alert when a student submits an assessment"
            control={<Toggle checked={false} onChange={() => {}} />}
          />
          <Row
            label="Grading reminders"
            description="Remind when essay answers need manual grading"
            control={<Toggle checked={true} onChange={() => {}} />}
          />
        </Section>

        {/* Assessment defaults */}
        <Section
          icon={<Settings className="h-4 w-4" />}
          title="Assessment Defaults"
          description="Default settings applied to new assessments"
        >
          <Row
            label="Shuffle questions"
            description="Randomise question order for each student"
            control={<Toggle checked={false} onChange={() => {}} />}
          />
          <Row
            label="Shuffle answer options"
            description="Randomise MCQ option order"
            control={<Toggle checked={false} onChange={() => {}} />}
          />
          <Row
            label="Show results immediately"
            description="Students see their score right after submission"
            control={<Toggle checked={true} onChange={() => {}} />}
          />
          <Row
            label="Allow answer review"
            description="Students can review their submitted answers"
            control={<Toggle checked={true} onChange={() => {}} />}
          />
        </Section>

        {/* Security */}
        <Section
          icon={<Lock className="h-4 w-4" />}
          title="Security"
          description="Access and authentication settings"
        >
          <Row
            label="Session timeout"
            description="Automatically log out after inactivity"
            control={
              <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            }
          />
        </Section>

        {/* About */}
        <Section
          icon={<Info className="h-4 w-4" />}
          title="About"
          description="Application information"
        >
          <Row
            label="Version"
            control={
              <span className="text-xs text-gray-400">EduTest CBT v1.0</span>
            }
          />
          <Row
            label="Environment"
            control={
              <span className="text-xs text-gray-400">
                {process.env.NEXT_PUBLIC_API_BASE_URL ?? "—"}
              </span>
            }
          />
        </Section>
      </div>
    </div>
  );
};
