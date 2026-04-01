"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StudentAttempt, AttemptStatus } from "@/types";
import { DEMO_TEST_ID } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Download, ChevronDown, Check, MoreVertical, User } from "lucide-react";
import { useCBTStore } from "@/store";

interface ResultsViewProps {
	subjectId: string;
	classId: string;
	className: string;
	subjectName: string;
}

const STATUS_CFG: Record<AttemptStatus, { label: string; className: string }> =
	{
		"in-progress": {
			label: "In Progress",
			className: "bg-orange-50 text-orange-600 border-orange-200",
		},
		submitted: {
			label: "Submitted",
			className: "bg-purple-50 text-purple-600 border-purple-200",
		},
		missed: {
			label: "Missed",
			className: "bg-red-50 text-red-600 border-red-200",
		},
		graded: {
			label: "Graded",
			className: "bg-green-50 text-green-600 border-green-200",
		},
		"retake-pending": {
			label: "Retake Pending",
			className: "bg-blue-50 text-blue-600 border-blue-200",
		},
	};

export const ResultsView = ({
	subjectId,
	classId,
	className,
	subjectName,
}: ResultsViewProps) => {
	const router = useRouter();
	const { tests, getAttemptsByTest, updateAttempt } = useCBTStore();

	// Tests for this subject + demo test
	const subjectTests = tests.filter((t) => t.subjectId === subjectId);
	// For demo: inject a synthetic test entry if no real tests exist yet
	const allTests: { id: string; title: string }[] =
		subjectTests.length > 0
			? subjectTests
			: [
					{ id: DEMO_TEST_ID, title: "CA Test" },
					{ id: "exam-demo", title: "Examination" },
					{ id: "extra-demo", title: "Extra Test" },
				];

	const [selectedTestId, setSelectedTestId] = useState(allTests[0]?.id || "");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const h = (e: MouseEvent) => {
			if (dropRef.current && !dropRef.current.contains(e.target as Node))
				setDropdownOpen(false);
		};
		document.addEventListener("mousedown", h);
		return () => document.removeEventListener("mousedown", h);
	}, []);

	const attempts = getAttemptsByTest(selectedTestId);
	const selectedTest = allTests.find((t) => t.id === selectedTestId);

	// Stats
	const graded = attempts.filter(
		(a) => a.status === "graded" && a.score !== undefined,
	);
	const totalStudents = attempts.length;
	const avgScore =
		graded.length > 0
			? Math.round(
					(graded.reduce((s, a) => s + (a.score || 0), 0) /
						graded.reduce((s, a) => s + (a.totalMarks || 100), 0)) *
						1000,
				) / 10
			: 0;
	const highestScore =
		graded.length > 0 ? Math.max(...graded.map((a) => a.score || 0)) : 0;
	const lowestScore =
		graded.length > 0 ? Math.min(...graded.map((a) => a.score || 0)) : 0;
	const maxMarks = graded[0]?.totalMarks || 100;

	return (
		<div>
			{/* Title */}
			<div className="flex items-center gap-3 mb-5">
				<h1 className="text-lg font-bold text-gray-900">Results</h1>
				<span className="text-sm text-gray-400">
					{className} • {subjectName}
				</span>
			</div>

			{/* Filter row */}
			<div className="flex items-center justify-between mb-5">
				{/* Test selector */}
				<div className="relative" ref={dropRef}>
					<button
						onClick={() => setDropdownOpen((v) => !v)}
						className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
					>
						{selectedTest?.title || "Select test"}
						<ChevronDown className="w-3.5 h-3.5 text-gray-400" />
					</button>
					{dropdownOpen && (
						<div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-xl z-30 overflow-hidden py-1">
							{allTests.map((t) => (
								<button
									key={t.id}
									onClick={() => {
										setSelectedTestId(t.id);
										setDropdownOpen(false);
									}}
									className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
								>
									{t.title}
									{selectedTestId === t.id && (
										<Check className="w-3.5 h-3.5 text-blue-600" />
									)}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Export */}
				<button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
					<Download className="w-3.5 h-3.5" />
					Export Result
				</button>
			</div>

			{/* Stat cards */}
			<div className="grid grid-cols-4 gap-4 mb-6">
				<StatCard
					icon="👥"
					color="blue"
					label="Total Students"
					value={totalStudents}
				/>
				<StatCard
					icon="📊"
					color="amber"
					label="Average Score"
					value={avgScore}
					suffix={`/${maxMarks}`}
				/>
				<StatCard
					icon="🏆"
					color="green"
					label="Highest Score"
					value={highestScore}
					suffix={`/${maxMarks}`}
				/>
				<StatCard
					icon="📉"
					color="red"
					label="Lowest Score"
					value={lowestScore}
					suffix={`/${maxMarks}`}
				/>
			</div>

			{/* Table */}
			{attempts.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-200 rounded-xl">
					<p className="text-sm text-gray-400">
						No attempts yet for this test
					</p>
				</div>
			) : (
				<div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-100 bg-gray-50/60">
								{[
									"Student Name",
									"Score",
									"Percentage",
									"Weighted Score",
									"Status",
								].map((h) => (
									<th
										key={h}
										className="px-5 py-3 text-left text-xs font-medium text-gray-500"
									>
										{h}
									</th>
								))}
								<th className="px-3 py-3 w-10" />
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{attempts.map((attempt) => (
								<AttemptRow
									key={attempt.id}
									attempt={attempt}
									classId={classId}
									subjectId={subjectId}
									onGradeAttempt={() =>
										router.push(
											`/classes/${classId}/subjects/${subjectId}/results/${attempt.id}`,
										)
									}
									onUpdateStatus={(status) =>
										updateAttempt(attempt.id, { status })
									}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
	icon,
	color,
	label,
	value,
	suffix,
}: {
	icon: string;
	color: string;
	label: string;
	value: number;
	suffix?: string;
}) => {
	const colors: Record<string, string> = {
		blue: "bg-blue-50  text-blue-600",
		amber: "bg-amber-50 text-amber-500",
		green: "bg-green-50 text-green-600",
		red: "bg-red-50   text-red-500",
	};
	return (
		<div className="border border-gray-200 rounded-xl p-4 bg-white">
			<div className="flex items-center gap-2 mb-2">
				<div
					className={cn(
						"w-7 h-7 rounded-lg flex items-center justify-center text-sm",
						colors[color],
					)}
				>
					{icon}
				</div>
				<span className="text-xs text-gray-500">{label}</span>
			</div>
			<p className="text-2xl font-bold text-gray-900">
				{value}
				{suffix && (
					<span className="text-sm font-normal text-gray-400">
						{suffix}
					</span>
				)}
			</p>
		</div>
	);
};

// ─── Attempt Row ──────────────────────────────────────────────────────────────
const AttemptRow = ({
	attempt,
	classId,
	subjectId,
	onGradeAttempt,
	onUpdateStatus,
}: {
	attempt: StudentAttempt;
	classId: string;
	subjectId: string;
	onGradeAttempt: () => void;
	onUpdateStatus: (s: AttemptStatus) => void;
}) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const cfg = STATUS_CFG[attempt.status];

	useEffect(() => {
		if (!menuOpen) return;
		const h = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node))
				setMenuOpen(false);
		};
		document.addEventListener("mousedown", h);
		return () => document.removeEventListener("mousedown", h);
	}, [menuOpen]);

	const canGrade =
		attempt.status === "submitted" || attempt.status === "graded";

	return (
		<tr className="hover:bg-gray-50/50 transition-colors group">
			{/* Student name */}
			<td className="px-5 py-3.5">
				<div className="flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
						<User className="w-3.5 h-3.5 text-gray-500" />
					</div>
					<span className="text-sm font-medium text-gray-800">
						{attempt.studentName}
					</span>
				</div>
			</td>
			{/* Score */}
			<td className="px-5 py-3.5 text-sm text-gray-700">
				{attempt.score !== undefined && attempt.totalMarks !== undefined
					? `${attempt.score} / ${attempt.totalMarks}`
					: "-"}
			</td>
			{/* Percentage */}
			<td className="px-5 py-3.5 text-sm text-gray-700">
				{attempt.percentage !== undefined ? `${attempt.percentage}%` : "-"}
			</td>
			{/* Weighted */}
			<td className="px-5 py-3.5 text-sm text-gray-700">
				{attempt.weightedScore !== undefined ? attempt.weightedScore : "-"}
			</td>
			{/* Status */}
			<td className="px-5 py-3.5">
				<span
					className={cn(
						"inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border",
						cfg.className,
					)}
				>
					{cfg.label}
				</span>
			</td>
			{/* Actions */}
			<td className="px-3 py-3.5">
				{attempt.status === "in-progress" ? (
					// In-progress: no menu, show subtle circle
					<div className="w-6 h-6 flex items-center justify-center">
						<div className="w-4 h-4 rounded-full border-2 border-gray-200" />
					</div>
				) : (
					<div className="relative" ref={menuRef}>
						<button
							onClick={() => setMenuOpen((v) => !v)}
							className={cn(
								"w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all",
								menuOpen
									? "opacity-100"
									: "opacity-0 group-hover:opacity-100",
							)}
						>
							<MoreVertical className="w-4 h-4" />
						</button>
						{menuOpen && (
							<div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-gray-200 shadow-xl z-30 overflow-hidden py-1">
								{canGrade && (
									<button
										onClick={() => {
											setMenuOpen(false);
											onGradeAttempt();
										}}
										className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
									>
										<Check className="w-3.5 h-3.5 text-gray-400" />
										Grade attempt
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</td>
		</tr>
	);
};
