import { Class, Subject, Topic, Question } from "@/types";

// ─── Shared subject name lists per level ──────────────────────────────────────

const JSS_SUBJECTS = [
	"Mathematics",
	"English Language",
	"Basic Science",
	"Basic Technology",
	"Social Studies",
	"Civic Education",
	"Agricultural Science",
	"Home Economics",
	"Physical & Health Education",
	"Christian Religious Studies",
	"Islamic Religious Studies",
	"Yoruba Language",
	"French",
	"Computer Studies",
	"Business Studies",
	"Fine Art",
	"Music",
	"Creative & Cultural Arts",
];

const SS_ART_SUBJECTS = [
	"English Language",
	"Mathematics",
	"Literature in English",
	"Government",
	"History",
	"Christian Religious Studies",
	"Islamic Religious Studies",
	"Yoruba Language",
	"French",
	"Fine Art",
	"Music",
	"Civic Education",
	"Physical & Health Education",
	"Geography",
	"Economics",
];

const SS_COMMERCIAL_SUBJECTS = [
	"English Language",
	"Mathematics",
	"Economics",
	"Commerce",
	"Accounting",
	"Government",
	"Civic Education",
	"Physical & Health Education",
	"French",
	"Yoruba Language",
	"Christian Religious Studies",
	"Islamic Religious Studies",
	"Computer Studies",
	"Marketing",
	"Office Practice",
];

const SS_SCIENCE_SUBJECTS = [
	"English Language",
	"Mathematics",
	"Physics",
	"Chemistry",
	"Biology",
	"Further Mathematics",
	"Agricultural Science",
	"Computer Studies",
	"Physical & Health Education",
	"Civic Education",
	"Geography",
	"Technical Drawing",
	"Food & Nutrition",
	"Christian Religious Studies",
	"Islamic Religious Studies",
];

// ─── Teachers ─────────────────────────────────────────────────────────────────

const TEACHERS: Record<string, string> = {
	Mathematics: "Adebayo Okafor",
	"English Language": "Chidinma Eze",
	Physics: "Emeka Nwosu",
	Chemistry: "Fatima Aliyu",
	Biology: "Gbenga Adeyemi",
	Economics: "Hauwa Musa",
	"Further Mathematics": "Ibrahim Suleiman",
	"Basic Science": "Janet Oluwole",
	"Basic Technology": "Kunle Adesola",
	"Social Studies": "Lola Balogun",
	"Civic Education": "Musa Garba",
	"Agricultural Science": "Ngozi Okonkwo",
	"Home Economics": "Olumide Akinyele",
	"Physical & Health Education": "Patricia Uche",
	"Christian Religious Studies": "Quadri Yusuf",
	"Islamic Religious Studies": "Remi Akinwale",
	"Yoruba Language": "Sola Adeniyi",
	French: "Taiwo Ogundele",
	"Computer Studies": "Uche Obiora",
	"Business Studies": "Victor Adeoye",
	"Fine Art": "Wale Olawale",
	Music: "Xochitl Badmus",
	"Creative & Cultural Arts": "Yetunde Fashola",
	"Literature in English": "Zainab Abdullahi",
	Government: "Akin Ojo",
	History: "Bola Abiodun",
	Geography: "Chukwuma Obi",
	Commerce: "Dupe Adekunle",
	Accounting: "Efosa Osagie",
	"Technical Drawing": "Femi Adeleke",
	"Food & Nutrition": "Grace Ikenna",
	Marketing: "Hakeem Lawal",
	"Office Practice": "Ifeoma Aneke",
};

// ─── Helper to build subjects for a class ────────────────────────────────────

function makeSubjects(classId: string, subjectNames: string[]): Subject[] {
	return subjectNames.map((name, i) => ({
		id: `${classId}-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
		name,
		classId,
		teacherName: i % 8 === 3 ? undefined : (TEACHERS[name] ?? "TBA"),
		questionsInBank: Math.floor(Math.random() * 180) + 20,
		tests: Math.floor(Math.random() * 4),
		topics: [],
		createdAt: "2024-01-01",
	}));
}

// ─── Build all subjects ───────────────────────────────────────────────────────

const jss1aSubjects = makeSubjects("jss1a", JSS_SUBJECTS);
const jss1bSubjects = makeSubjects("jss1b", JSS_SUBJECTS);
const jss2aSubjects = makeSubjects("jss2a", JSS_SUBJECTS);
const jss2bSubjects = makeSubjects("jss2b", JSS_SUBJECTS);
const jss3aSubjects = makeSubjects("jss3a", JSS_SUBJECTS);
const jss3bSubjects = makeSubjects("jss3b", JSS_SUBJECTS);
const ss1artSubs = makeSubjects("ss1art", SS_ART_SUBJECTS);
const ss1commSubs = makeSubjects("ss1commercial", SS_COMMERCIAL_SUBJECTS);
const ss1sciSubs = makeSubjects("ss1science", SS_SCIENCE_SUBJECTS);
const ss2artSubs = makeSubjects("ss2art", SS_ART_SUBJECTS);
const ss2commSubs = makeSubjects("ss2commercial", SS_COMMERCIAL_SUBJECTS);
const ss2sciSubs = makeSubjects("ss2science", SS_SCIENCE_SUBJECTS);

// ─── Classes ──────────────────────────────────────────────────────────────────

export const mockClasses: Class[] = [
	{
		id: "jss1a",
		name: "JSS 1 A",
		school: "Lawanson",
		level: "JSS",
		totalSubjects: jss1aSubjects.length,
		subjects: jss1aSubjects,
		createdAt: "2024-01-01",
	},
	{
		id: "jss1b",
		name: "JSS 1 B",
		school: "Lawanson",
		level: "JSS",
		totalSubjects: jss1bSubjects.length,
		subjects: jss1bSubjects,
		createdAt: "2024-01-01",
	},
	{
		id: "jss2a",
		name: "JSS 2 A",
		school: "Lawanson",
		level: "JSS",
		totalSubjects: jss2aSubjects.length,
		subjects: jss2aSubjects,
		createdAt: "2024-01-01",
	},
	{
		id: "jss2b",
		name: "JSS 2 B",
		school: "Lawanson",
		level: "JSS",
		totalSubjects: jss2bSubjects.length,
		subjects: jss2bSubjects,
		createdAt: "2024-01-01",
	},
	{
		id: "jss3a",
		name: "JSS 3 A",
		school: "Lawanson",
		level: "JSS",
		totalSubjects: jss3aSubjects.length,
		subjects: jss3aSubjects,
		createdAt: "2024-01-01",
	},
	{
		id: "jss3b",
		name: "JSS 3 B",
		school: "Lawanson",
		level: "JSS",
		totalSubjects: jss3bSubjects.length,
		subjects: jss3bSubjects,
		createdAt: "2024-01-01",
	},
	{
		id: "ss1art",
		name: "SS 1 Art",
		school: "Lawanson",
		level: "SS",
		totalSubjects: ss1artSubs.length,
		subjects: ss1artSubs,
		createdAt: "2024-01-01",
	},
	{
		id: "ss1commercial",
		name: "SS 1 Commercial",
		school: "Lawanson",
		level: "SS",
		totalSubjects: ss1commSubs.length,
		subjects: ss1commSubs,
		createdAt: "2024-01-01",
	},
	{
		id: "ss1science",
		name: "SS 1 Science",
		school: "Lawanson",
		level: "SS",
		totalSubjects: ss1sciSubs.length,
		subjects: ss1sciSubs,
		createdAt: "2024-01-01",
	},
	{
		id: "ss2art",
		name: "SS 2 Art",
		school: "Lawanson",
		level: "SS",
		totalSubjects: ss2artSubs.length,
		subjects: ss2artSubs,
		createdAt: "2024-01-01",
	},
	{
		id: "ss2commercial",
		name: "SS 2 Commercial",
		school: "Lawanson",
		level: "SS",
		totalSubjects: ss2commSubs.length,
		subjects: ss2commSubs,
		createdAt: "2024-01-01",
	},
	{
		id: "ss2science",
		name: "SS 2 Science",
		school: "Lawanson",
		level: "SS",
		totalSubjects: ss2sciSubs.length,
		subjects: ss2sciSubs,
		createdAt: "2024-01-01",
	},
];

// ─── Flat subjects list (used by the store) ───────────────────────────────────

export const mockSubjects: Subject[] = [
	...jss1aSubjects,
	...jss1bSubjects,
	...jss2aSubjects,
	...jss2bSubjects,
	...jss3aSubjects,
	...jss3bSubjects,
	...ss1artSubs,
	...ss1commSubs,
	...ss1sciSubs,
	...ss2artSubs,
	...ss2commSubs,
	...ss2sciSubs,
];

export const mockTopics: Topic[] = [
	{
		id: "algebra",
		name: "Algebra",
		subjectId: "jss2a-mathematics",
		questions: [],
		createdAt: "2024-01-01",
	},
	{
		id: "arithmetic",
		name: "Arithmetic",
		subjectId: "jss2a-mathematics",
		questions: [],
		createdAt: "2024-01-01",
	},
	{
		id: "angles",
		name: "Angles",
		subjectId: "jss2a-mathematics",
		questions: [],
		createdAt: "2024-01-01",
	},
];

export const mockQuestions: Question[] = [
	{
		id: "q1",
		topicId: "algebra",
		type: "multiple-choice",
		text: "Which of the following is an example of a renewable source of energy?",
		marks: 1,
		options: [
			{ id: "a", text: "Coal", isCorrect: false },
			{ id: "b", text: "Solar", isCorrect: true },
			{ id: "c", text: "Natural Gas", isCorrect: false },
			{ id: "d", text: "Petroleum", isCorrect: false },
		],
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q2",
		topicId: "algebra",
		type: "true-false",
		text: "Water boils at 100°C at sea level.",
		marks: 1,
		options: [
			{ id: "true", text: "True", isCorrect: true },
			{ id: "false", text: "False", isCorrect: false },
		],
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q3",
		topicId: "algebra",
		type: "essay",
		text: "Explain the causes and effects of climate change. Give at least two examples in your answer.",
		marks: 1,
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q4",
		topicId: "algebra",
		type: "matching",
		text: "Match each country with its capital city.",
		marks: 1,
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q5",
		topicId: "algebra",
		type: "fill-in-blank",
		text: "The capital city of France is ______.",
		marks: 1,
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q6",
		topicId: "algebra",
		type: "question-group",
		text: "Passage on Agriculture",
		marks: 10,
		subQuestions: [],
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q7",
		topicId: "algebra",
		type: "multiple-answers",
		text: "Select all the renewable sources of energy?",
		marks: 1,
		options: [
			{ id: "a", text: "Solar", isCorrect: true },
			{ id: "b", text: "Wind", isCorrect: true },
			{ id: "c", text: "Coal", isCorrect: false },
		],
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q8",
		topicId: "algebra",
		type: "numerical",
		text: "What is the chemical symbol for Oxygen?",
		marks: 1,
		correctAnswer: "O",
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
	{
		id: "q9",
		topicId: "algebra",
		type: "short-answer",
		text: "What is the chemical symbol for Oxygen?",
		marks: 1,
		correctAnswer: "O",
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	},
];
