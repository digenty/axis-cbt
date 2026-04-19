"use client";

import Link from "next/link";
import { ArrowLeft, Building2, BookOpen, Clock, FileText, AlertTriangle, CheckCircle2, XCircle, ChevronRight, MessageSquare } from "lucide-react";
import { StudentHeader } from "./StudentHeader";
import { mockAssessmentDetails } from "@/lib/mock-student-data";
import type { AssessmentDetail } from "@/types/students";

// ─── Info card ────────────────────────────────────────────────────────────────

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
	<div className="flex flex-col gap-1.5 border-r border-gray-100 px-6 last:border-r-0">
		<div className="flex items-center gap-1.5 text-xs text-gray-400">
			{icon}
			{label}
		</div>
		<p className="text-sm font-semibold text-gray-900">{value}</p>
	</div>
);

// ─── Pre-test detail ──────────────────────────────────────────────────────────

const PreTestView = ({ detail }: { detail: AssessmentDetail }) => (
	<>
		{/* Title + marks */}
		<div className="mb-6">
			<h1 className="mb-2 text-xl font-bold text-gray-900">{detail.title}</h1>
			<span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
				{detail.totalMarks} marks
			</span>
		</div>

		{/* Info grid */}
		<div className="mb-6 flex overflow-hidden rounded-xl border border-gray-200 bg-white">
			<InfoCard icon={<Building2 className="h-3.5 w-3.5" />} label="Class" value={detail.className} />
			<InfoCard icon={<BookOpen className="h-3.5 w-3.5" />} label="Subject" value={detail.subject} />
			<InfoCard icon={<Clock className="h-3.5 w-3.5" />} label="Duration" value={`${detail.durationMinutes} minutes`} />
			<InfoCard icon={<FileText className="h-3.5 w-3.5" />} label="Questions" value={String(detail.questionsCount)} />
		</div>

		{/* Instructions */}
		<div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
			<div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
				<FileText className="h-4 w-4 text-gray-400" />
				<span className="text-sm font-semibold text-gray-800">Instructions</span>
			</div>
			<div className="px-5 py-4 text-sm text-gray-700">
				<p className="mb-3" dangerouslySetInnerHTML={{ __html: detail.instructions }} />
				{detail.rules.length > 0 && (
					<>
						<p className="mb-2 font-semibold">Rules:</p>
						<ul className="space-y-1.5">
							{detail.rules.map((rule, i) => (
								<li key={i} className="flex items-start gap-2">
									<ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
									<span dangerouslySetInnerHTML={{ __html: rule }} />
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</div>

		{/* Important notes */}
		{detail.importantNotes.length > 0 && (
			<div className="mb-8 rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
				<div className="mb-2 flex items-center gap-2">
					<AlertTriangle className="h-4 w-4 text-amber-500" />
					<span className="text-sm font-semibold text-amber-700">Important Notes</span>
				</div>
				<ul className="space-y-1.5 text-xs text-amber-800">
					{detail.importantNotes.map((note, i) => (
						<li key={i} className="flex items-start gap-2">
							<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
							{note}
						</li>
					))}
				</ul>
			</div>
		)}

		{/* Begin button */}
		<div className="flex justify-end">
			<Link
				href={`/students/${detail.id}/take`}
				className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
			>
				Begin Assessment
			</Link>
		</div>
	</>
);

// ─── Result states ────────────────────────────────────────────────────────────

const GradedView = ({ detail }: { detail: AssessmentDetail }) => (
	<div className="space-y-6">
		{/* Score circle */}
		<div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white py-10">
			<div className="mb-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-green-400 bg-green-50">
				<span className="text-2xl font-bold text-green-700">{detail.score}</span>
				<span className="text-xs text-green-600">/{detail.scoreDenominator}</span>
			</div>
			<p className="text-base font-semibold text-gray-900">{detail.title} Score</p>
			{detail.teacherFeedback && (
				<div className="mt-6 w-full max-w-lg rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
					<div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
						<MessageSquare className="h-3.5 w-3.5" />
						Teacher&apos;s Feedback
					</div>
					<p className="text-sm italic text-gray-700">&ldquo;{detail.teacherFeedback}&rdquo;</p>
				</div>
			)}
		</div>
	</div>
);

const SubmittedView = ({ detail }: { detail: AssessmentDetail }) => (
	<div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white py-16">
		<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
			L
		</div>
		<h2 className="mb-2 text-lg font-bold text-gray-900">Awaiting Result</h2>
		<p className="max-w-sm text-center text-sm text-gray-500">
			Your answers have been submitted successfully. Your teacher is reviewing your answer for{" "}
			<span className="font-medium">{detail.title}</span>.
		</p>
	</div>
);

const MissedView = ({ detail }: { detail: AssessmentDetail }) => (
	<div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12">
		<div className="flex flex-col items-center text-center">
			<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
				<XCircle className="h-8 w-8 text-red-500" />
			</div>
			<h2 className="mb-2 text-base font-bold text-red-800">Test Window Closed</h2>
			<p className="mb-6 max-w-sm text-sm text-red-600">
				This test is no longer available. You did not complete this test within the scheduled window. Please contact
				your teacher if you believe this was an error.
			</p>
			<button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
				<CheckCircle2 className="h-4 w-4" />
				Contact Teacher
			</button>
		</div>
	</div>
);

// ─── Meta strip (for result pages) ────────────────────────────────────────────

const MetaStrip = ({ detail }: { detail: AssessmentDetail }) => (
	<div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-400">
		<span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{detail.durationMinutes} mins</span>
		<span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{detail.questionsCount} Questions</span>
	</div>
);

// ─── View ─────────────────────────────────────────────────────────────────────

export const StudentAssessmentDetailView = ({ assessmentId }: { assessmentId: string }) => {
	const detail: AssessmentDetail | undefined = mockAssessmentDetails[assessmentId];

	const isResultState = ["graded", "submitted", "missed"].includes(detail?.status ?? "");

	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			<StudentHeader />

			<main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
				{/* Back link */}
				<Link href="/students" className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800">
					<ArrowLeft className="h-4 w-4" />
					{isResultState ? "Back to Dashboard" : "Go Back"}
				</Link>

				{/* Title + status for result states */}
				{isResultState && detail && (
					<div className="mb-6 text-center">
						<h1 className="mb-1 text-lg font-bold text-gray-900">{detail.title}</h1>
						<p className="mb-3 text-sm text-gray-400">{detail.subject}</p>
						<span className={`rounded-full px-3 py-1 text-xs font-semibold ${
							detail.status === "graded" ? "bg-green-50 text-green-700" :
							detail.status === "submitted" ? "bg-blue-50 text-blue-700" :
							"bg-red-50 text-red-600"
						}`}>
							{detail.status.charAt(0).toUpperCase() + detail.status.slice(1)}
						</span>
					</div>
				)}

				{/* Body based on status */}
				{!detail ? (
					<div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
						Assessment not found
					</div>
				) : detail.status === "not-started" || detail.status === "in-progress" ? (
					<PreTestView detail={detail} />
				) : detail.status === "graded" ? (
					<>
						<GradedView detail={detail} />
						<MetaStrip detail={detail} />
					</>
				) : detail.status === "submitted" ? (
					<>
						<SubmittedView detail={detail} />
						<MetaStrip detail={detail} />
					</>
				) : (
					<>
						<MissedView detail={detail} />
						<MetaStrip detail={detail} />
					</>
				)}
			</main>
		</div>
	);
};
