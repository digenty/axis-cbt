# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server on port 8005
npm run build     # Production build
npm run lint      # ESLint
npm run format    # Prettier (src/**/*.{js,jsx,ts,tsx,css,json})
```

No test suite is configured.

## Architecture

**Axis-CBT** is a Computer-Based Testing management app for schools. It is a pure client-side SPA — no backend or database; all state is seeded from mock data and persisted to `localStorage` via Zustand.

### Routing (`/app`)

Next.js App Router. Pages are thin wrappers that render a single view component from `src/components/`. The hierarchy mirrors the domain model:

```
/subjects                                                → MySubjectsView
/classes                                                 → AllClassesView
/classes/[classId]                                       → ClassSubjectsView
/classes/[classId]/subjects/[subjectId]                  → SubjectDetailView
/classes/[classId]/subjects/[subjectId]/question-bank    → QuestionBankView
/classes/[classId]/subjects/[subjectId]/assessments      → TestListView
/classes/[classId]/subjects/[subjectId]/assessments/[assessmentId] → TestEditor
/classes/[classId]/subjects/[subjectId]/results          → Results
```

Root `/` redirects to `/subjects`.

### State (`src/store/index.ts`)

Single Zustand store `useCBTStore` holds all domain data: classes, subjects, topics, questions, and tests. It ships with seeded mock data (`src/lib/mock-data.ts`) and persists under the key `"cbt-store"`. Most components read from and write to this store directly — React Query is wired up but not yet used for data fetching.

### Domain model (`src/types/index.ts`)

```
Class → Subjects → Topics → Questions
Test/Assessment → Sections → Questions (referenced by id)
Results → Assessment answers
```

`JWTPayload` and JWT utilities (`src/lib/utils.ts`) exist for future auth integration but are not wired into any auth flow.

### Path alias

`@/*` resolves to `src/*`, `app/*`, and the project root (see `tsconfig.json`). Use `@/components/...`, `@/store/...`, etc.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Custom theme tokens are defined as CSS variables in `app/globals.css`. Use `tailwind-merge` (`twMerge`/`cn` from `src/lib/utils.ts`) when conditionally combining class names.

### Key libraries

| Library | Role |
|---|---|
| `zustand@5` | Global state + localStorage persistence |
| `@dnd-kit/*` | Drag-and-drop for question/topic reordering |
| `@tanstack/react-table` | Table rendering in results/question list views |
| `sonner` | Toast notifications |
| `lucide-react` | Icons |
| `date-fns` | Date formatting |
