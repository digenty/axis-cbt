"use client";

import type { StudentProfile } from "@/types/students";

interface Props {
  profile: StudentProfile;
}

export const StudentProfileBanner = ({ profile }: Props) => (
  <div className="mb-8 rounded-2xl bg-indigo-900 px-6 py-5">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-lg font-bold text-white">
        {profile.name.charAt(0)}
      </div>
      <div>
        <p className="text-base font-semibold text-white">{profile.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-indigo-200">
          <span>{profile.admissionNumber}</span>
          <span className="text-indigo-400">•</span>
          <span>{profile.className}</span>
          <span className="text-indigo-400">•</span>
          <span>{profile.academicYear}</span>
          <span className="rounded-full bg-indigo-800 px-2.5 py-0.5 text-xs text-indigo-200">
            {profile.currentTerm}
          </span>
        </div>
      </div>
    </div>
  </div>
);
