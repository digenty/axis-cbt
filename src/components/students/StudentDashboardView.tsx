"use client";

import { Star } from "lucide-react";
import { StudentHeader } from "./StudentHeader";
import { StudentProfileBanner } from "./StudentProfileBanner";
import { AssessmentCard } from "./AssessmentCard";
import { mockStudentProfile, mockActiveAssessments, mockUpcomingAssessments, mockCompletedAssessments } from "@/lib/mock-student-data";
import type { StudentAssessmentCard } from "@/types/students";

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, count }: { title: string; count: number }) => (
	<div className="mb-4 flex items-center gap-2">
		<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
		<h2 className="text-sm font-semibold text-gray-800">{title}</h2>
		<span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
			{count}
		</span>
	</div>
);

// ─── Grid layouts ─────────────────────────────────────────────────────────────

const TwoColGrid = ({ cards }: { cards: StudentAssessmentCard[] }) => (
	<div className="grid grid-cols-2 gap-4">
		{cards.map((c) => (
			<AssessmentCard key={c.id} card={c} />
		))}
	</div>
);

const ThreeColGrid = ({ cards }: { cards: StudentAssessmentCard[] }) => (
	<div className="grid grid-cols-3 gap-4">
		{cards.map((c) => (
			<AssessmentCard key={c.id} card={c} />
		))}
	</div>
);

// ─── View ─────────────────────────────────────────────────────────────────────

export const StudentDashboardView = () => (
	<div className="flex min-h-screen flex-col bg-gray-50">
		<StudentHeader />

		<main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
			<StudentProfileBanner profile={mockStudentProfile} />

			{/* Active */}
			{mockActiveAssessments.length > 0 && (
				<section className="mb-8">
					<SectionHeader title="Active Assessments" count={mockActiveAssessments.length} />
					<TwoColGrid cards={mockActiveAssessments} />
				</section>
			)}

			{/* Upcoming */}
			{mockUpcomingAssessments.length > 0 && (
				<section className="mb-8">
					<SectionHeader title="Upcoming Assessments" count={mockUpcomingAssessments.length} />
					<TwoColGrid cards={mockUpcomingAssessments} />
				</section>
			)}

			{/* Completed */}
			{mockCompletedAssessments.length > 0 && (
				<section>
					<SectionHeader title="Completed Assessments" count={mockCompletedAssessments.length} />
					<ThreeColGrid cards={mockCompletedAssessments} />
				</section>
			)}
		</main>
	</div>
);
