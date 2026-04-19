import type {
	StudentProfile,
	StudentAssessmentCard,
	AssessmentDetail,
	TestAttemptData,
} from "@/types/students";

export const mockStudentProfile: StudentProfile = {
	name: "Damilare John",
	admissionNumber: "DFA/2023/1045",
	className: "JSS 1A",
	academicYear: "2024/2025",
	currentTerm: "Second Term",
};

export const mockActiveAssessments: StudentAssessmentCard[] = [
	{
		id: "active-1",
		subject: "Physics",
		subjectColor: "blue",
		title: "Mid Term Physics Test",
		status: "in-progress",
		durationMinutes: 60,
		questionsCount: 40,
		scheduledAt: "2026-02-18T14:00:00Z",
	},
	{
		id: "active-2",
		subject: "Mathematics",
		subjectColor: "blue",
		title: "Mathematics Mock Exam",
		status: "not-started",
		durationMinutes: 60,
		questionsCount: 40,
		scheduledAt: "2026-02-18T14:00:00Z",
	},
];

export const mockUpcomingAssessments: StudentAssessmentCard[] = [
	{
		id: "upcoming-1",
		subject: "Economics",
		subjectColor: "purple",
		title: "CA",
		status: "scheduled",
		durationMinutes: 60,
		questionsCount: 40,
		scheduledAt: "2026-02-18T14:00:00Z",
	},
];

export const mockCompletedAssessments: StudentAssessmentCard[] = [
	{
		id: "completed-1",
		subject: "Biology",
		subjectColor: "green",
		title: "Biology Exam",
		status: "graded",
		durationMinutes: 60,
		questionsCount: 40,
		scheduledAt: "2026-02-18T14:00:00Z",
		score: 48,
		totalMarks: 50,
	},
	{
		id: "completed-2",
		subject: "Mathematics",
		subjectColor: "blue",
		title: "Final Exam",
		status: "submitted",
		durationMinutes: 60,
		questionsCount: 40,
		scheduledAt: "2026-02-18T14:00:00Z",
	},
	{
		id: "completed-3",
		subject: "Mathematics",
		subjectColor: "blue",
		title: "CA 2",
		status: "missed",
		durationMinutes: 60,
		questionsCount: 40,
		scheduledAt: "2026-02-18T14:00:00Z",
	},
];

export const mockAssessmentDetails: Record<string, AssessmentDetail> = {
	"active-2": {
		id: "active-2",
		title: "Mid-Term Mathematics Test",
		subject: "Mathematics",
		totalMarks: 60,
		className: "SS 1 Commercial",
		durationMinutes: 60,
		questionsCount: 20,
		status: "not-started",
		scheduledAt: "2026-02-18T14:00:00Z",
		instructions:
			"This test covers topics from <b>chapters 1-5</b> of your mathematics textbook.",
		rules: [
			"You have 45 minutes to complete this test",
			"Each question carries equal marks",
			"There is no negative marking",
			"Once submitted you cannot change your answers",
			"Make sure you have a stable internet connection. <b>Good luck!</b>",
		],
		importantNotes: [
			"Once you start the assessment, the timer will begin automatically",
			"You cannot pause the test once started",
			"Make sure you have a stable internet connection",
			"All questions must be answered before submission",
			"You can navigate between questions using Next/Previous buttons",
			"If you run out of time, tests are automatically submitted",
		],
	},
	"active-1": {
		id: "active-1",
		title: "Mid Term Physics Test",
		subject: "Physics",
		totalMarks: 80,
		className: "JSS 1A",
		durationMinutes: 60,
		questionsCount: 40,
		status: "in-progress",
		scheduledAt: "2026-02-18T14:00:00Z",
		instructions: "Answer all questions carefully.",
		rules: [
			"You have 60 minutes to complete this test",
			"Each question carries equal marks",
			"There is no negative marking",
		],
		importantNotes: [
			"Once you start the assessment, the timer will begin automatically",
			"You cannot pause the test once started",
		],
	},
	"completed-1": {
		id: "completed-1",
		title: "Biology Exam",
		subject: "Biology",
		totalMarks: 50,
		className: "JSS 1A",
		durationMinutes: 60,
		questionsCount: 40,
		status: "graded",
		scheduledAt: "2026-02-18T14:00:00Z",
		score: 48,
		scoreDenominator: 50,
		teacherFeedback:
			"Damilare, you did very well in your test but you refused to use the right words and sentences I gave during in your note. Also refrain from using slangs and shortcuts in your answer.",
		instructions: "",
		rules: [],
		importantNotes: [],
	},
	"completed-2": {
		id: "completed-2",
		title: "Final Exam",
		subject: "Mathematics",
		totalMarks: 100,
		className: "JSS 1A",
		durationMinutes: 60,
		questionsCount: 40,
		status: "submitted",
		scheduledAt: "2026-02-18T14:00:00Z",
		instructions: "",
		rules: [],
		importantNotes: [],
	},
	"completed-3": {
		id: "completed-3",
		title: "CA 2",
		subject: "Mathematics",
		totalMarks: 40,
		className: "JSS 1A",
		durationMinutes: 60,
		questionsCount: 40,
		status: "missed",
		scheduledAt: "2026-02-18T14:00:00Z",
		instructions: "",
		rules: [],
		importantNotes: [],
	},
};

const PASSAGE = `In many cities around the world, empty spaces between buildings are being transformed into green areas filled with vegetables, fruits, and flowers. These spaces are called urban gardens. Unlike large farms in the countryside, urban gardens are created in small plots of land, on rooftops, or even in containers placed along sidewalks. Despite their size, they have a powerful impact on communities.

Urban gardens provide fresh food to people who may not have easy access to supermarkets. In some neighborhoods, fresh fruits and vegetables are expensive or difficult to find. By growing their own tomatoes, spinach, and carrots, residents can enjoy healthier meals while saving money. This is especially important for families with limited incomes.

Urban gardens also bring people together. Neighbors who may not have spoken to each other before begin to share gardening tips, exchange seeds, and work side by side. Young people often learn from older gardeners who have years of experience. Through this cooperation, friendships are formed and a stronger sense of community develops.

In addition, urban gardens help the environment. Plants absorb carbon dioxide and release oxygen, improving air quality. Gardens also reduce the amount of heat in cities by providing shade and cooling the surrounding area. Furthermore, when people grow food locally, fewer trucks are needed to transport produce from distant farms, which reduces pollution.

Schools have also started creating gardens as outdoor classrooms. Students learn about biology by observing how plants grow. They practice responsibility by watering and caring for the crops. Many students say that working in the garden helps them feel calmer and more focused in school.`;

const MCQ_OPTIONS = [
	{ label: "A", text: "They replace all supermarkets" },
	{ label: "B", text: "They provide fresh food to communities" },
	{ label: "C", text: "They create more traffic in cities" },
	{ label: "D", text: "They increase food prices" },
];

const MCQ_OPTIONS_2 = [
	{ label: "A", text: "By increasing pollution" },
	{ label: "B", text: "By absorbing carbon dioxide" },
	{ label: "C", text: "By cutting down trees" },
	{ label: "D", text: "By using more fuel" },
];

export const mockTestAttempt: TestAttemptData = {
	id: "test-active-2",
	title: "Mid-Term Mathematics Test",
	durationSeconds: 3600,
	sections: [
		{
			id: "section-a",
			title: "Section A (Comprehension)",
			isComprehension: true,
			passage: PASSAGE,
			questions: [
				{ id: "q1", type: "multiple-choice", text: "What is one benefit of urban gardens?", marks: 2, options: MCQ_OPTIONS },
				{ id: "q2", type: "multiple-choice", text: "How do urban gardens help the environment according to the passage?", marks: 2, options: MCQ_OPTIONS_2 },
				{ id: "q3", type: "multiple-choice", text: "What do schools use urban gardens for?", marks: 2, options: MCQ_OPTIONS },
				{ id: "q4", type: "multiple-choice", text: "According to the passage, what makes urban gardens special despite their size?", marks: 2, options: MCQ_OPTIONS_2 },
			],
		},
		{
			id: "section-b",
			title: "Section B (Multiple Choice)",
			questions: [
				{ id: "q5", type: "multiple-choice", text: "What is one benefit of urban gardens?", marks: 2, options: MCQ_OPTIONS },
				{ id: "q6", type: "multiple-answers", text: "What is one benefit of urban gardens? (Select all that apply)", marks: 2, options: MCQ_OPTIONS_2 },
				{
					id: "q7",
					type: "fill-in-blank",
					text: "",
					marks: 10,
					segments: [
						{ type: "text", content: "The man is a " },
						{ type: "blank", blankId: "b7_1", inputType: "dropdown", choices: ["Select Option", "farmer", "teacher", "doctor", "lawyer"] },
						{ type: "text", content: " who " },
						{ type: "blank", blankId: "b7_2", inputType: "text" },
						{ type: "text", content: " a lot and he is a family man with " },
						{ type: "blank", blankId: "b7_3", inputType: "text" },
						{ type: "text", content: " and a dog." },
					],
				},
				{
					id: "q7b",
					type: "fill-in-blank",
					text: "",
					marks: 5,
					segments: [
						{ type: "text", content: "He is a male " },
						{ type: "blank", blankId: "b7b_1", inputType: "dropdown", choices: ["Select Option", "who", "which", "that"] },
						{ type: "text", content: " who married a female " },
						{ type: "blank", blankId: "b7b_2", inputType: "text" },
						{ type: "text", content: " they both have " },
						{ type: "blank", blankId: "b7b_3", inputType: "text" },
						{ type: "text", content: " children." },
					],
				},
				{ id: "q8", type: "true-false", text: "Water boils at 100°C at sea level", marks: 3 },
				{
					id: "q9",
					type: "match",
					text: "Match each country with its capital city",
					marks: 4,
					pairs: [
						{ id: "p1", left: "Choice", choices: ["Select", "London", "Paris", "Berlin", "Rome"] },
						{ id: "p2", left: "Choice", choices: ["Select", "London", "Paris", "Berlin", "Rome"] },
						{ id: "p3", left: "Choice", choices: ["Select", "London", "Paris", "Berlin", "Rome"] },
						{ id: "p4", left: "Choice", choices: ["Select", "London", "Paris", "Berlin", "Rome"] },
					],
				},
				{ id: "q10", type: "essay", text: "Explain the causes and effects of climate change. Give at least two examples in your answer.", marks: 5 },
				{ id: "q11", type: "short-answer", text: "What is the chemical symbol for oxygen?", marks: 1 },
				{
					id: "q12",
					type: "fill-in-blank",
					text: "",
					marks: 3,
					segments: [
						{ type: "text", content: "The man is a " },
						{ type: "blank", blankId: "b12_1", inputType: "dropdown", choices: ["Select Option", "farmer", "teacher"] },
						{ type: "text", content: " ✕" },
					],
				},
			],
		},
		{
			id: "section-c",
			title: "Section C (Table, Chart)",
			isComprehension: true,
			isImageBased: true,
			passage: "",
			questions: [
				{ id: "q13", type: "multiple-choice", text: "What is one benefit of urban gardens?", marks: 2, options: MCQ_OPTIONS },
				{ id: "q14", type: "multiple-choice", text: "What is one benefit of urban gardens?", marks: 2, options: MCQ_OPTIONS_2 },
			],
		},
	],
};
