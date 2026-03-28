import { JWTPayload, QuestionType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";
import {
	differenceInDays,
	differenceInWeeks,
	differenceInMonths,
	isToday,
	isYesterday,
} from "date-fns";

export const MOBILE_VIEWPORT = 768;

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

const simpleHash = (text: string) => {
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		const char = text.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Ensure the number is a 32-bit integer
	}
	return Math.abs(hash) % 21;
};

export const generateRandomColor = (text: string) => {
	const tailwindColors = [
		"bg-red-100",
		"bg-blue-100",
		"bg-green-100",
		"bg-yellow-100",
		"bg-purple-100",
		"bg-pink-100",
		"bg-indigo-100",
		"bg-teal-100",
		"bg-orange-100",
		"bg-lime-100",
		"bg-cyan-100",
		"bg-sky-100",
		"bg-emerald-100",
		"bg-fuchsia-100",
		"bg-rose-100",
		"bg-violet-100",
		"bg-amber-100",
		"bg-gray-100",
		"bg-slate-100",
		"bg-stone-100",
	];

	return tailwindColors[simpleHash(text)];
};

export const formatDate = (dateInput: string | number | Date) => {
	const date = new Date(dateInput);
	if (isNaN(date.getTime())) return ""; // handle invalid dates safely

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

export const decodeJWT = (token: string) => {
	try {
		const decodedToken = jwtDecode(token);
		if (!decodedToken || !decodedToken.exp) {
			return null;
		} else {
			const decoded = jwtDecode(token);
			return decoded as JWTPayload;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return null;
	}
};

export const isTokenExpired = (token: string): boolean => {
	try {
		const decoded = jwtDecode<JWTPayload>(token);

		if (!decoded.exp) return true;

		const currentTime = Date.now() / 1000;
		return decoded.exp < currentTime;
	} catch {
		return true;
	}
};

export const parseCookieString = (string = "") => {
	try {
		return JSON.parse(string);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return null;
	}
};

export const getAcademicYears = (startYear = 2000) => {
	const currentYear = new Date().getFullYear();
	const years = [];

	for (let year = startYear; year < currentYear; year++) {
		years.push(`${year}/${year + 1}`);
	}
	return years;
};

export const getYearDifference = (from: string | Date) => {
	const start = new Date(from);
	const today = new Date();

	let years = today.getFullYear() - start.getFullYear();

	const isNotUpToYear =
		today.getMonth() < start.getMonth() ||
		(today.getMonth() === start.getMonth() &&
			today.getDate() < start.getDate());

	if (isNotUpToYear) {
		years -= 1;
	}

	return years;
};

export const formatRelativeDate = (date: Date) => {
	const now = new Date();

	if (isToday(date)) return "Today";
	if (isYesterday(date)) return "Yesterday";

	const days = differenceInDays(now, date);
	if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

	const weeks = differenceInWeeks(now, date);
	if (weeks === 1) return "Last week";
	if (weeks < 4) return `${weeks} weeks ago`;

	const months = differenceInMonths(now, date);
	if (months === 1) return "Last month";
	return `${months} months ago`;
};

export function generateId(): string {
	return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function getQuestionTypeLabel(type: QuestionType): string {
	const labels: Record<QuestionType, string> = {
		"multiple-choice": "Multiple Choice",
		"true-false": "True/False",
		essay: "Essay",
		"fill-in-blank": "Fill-in-blank",
		matching: "Match",
		"short-answer": "Short Answer",
		numerical: "Numerical Answer",
		"question-group": "Question Group",
		"multiple-answers": "Multiple Answers",
		"comprehension-passage": "Comprehension Passage",
		"multiple-blanks": "Multiple Blanks",
	};
	return labels[type] || type;
}

export function getQuestionTypeBadgeColor(type: QuestionType): string {
	const colors: Record<QuestionType, string> = {
		"multiple-choice": "bg-blue-50 text-blue-700 border-blue-200",
		"true-false": "bg-green-50 text-green-700 border-green-200",
		essay: "bg-amber-50 text-amber-700 border-amber-200",
		"fill-in-blank": "bg-purple-50 text-purple-700 border-purple-200",
		matching: "bg-cyan-50 text-cyan-700 border-cyan-200",
		"short-answer": "bg-indigo-50 text-indigo-700 border-indigo-200",
		numerical: "bg-rose-50 text-rose-700 border-rose-200",
		"question-group": "bg-orange-50 text-orange-700 border-orange-200",
		"multiple-answers": "bg-teal-50 text-teal-700 border-teal-200",
		"comprehension-passage": "bg-violet-50 text-violet-700 border-violet-200",
		"multiple-blanks": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
	};
	return colors[type] || "bg-gray-50 text-gray-700 border-gray-200";
}
