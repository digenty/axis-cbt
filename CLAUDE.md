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

### Routing — Next.js 16 conventions

Pages unwrap async params with the `use()` hook (not `await` or destructuring directly):

```typescript
const { classId, subjectId } = use(params); // params is a Promise in Next.js 16
```

Read `node_modules/next/dist/docs/` before writing new pages or layouts — APIs differ from Next.js 13–15.

### State (`src/store/index.ts`)

Single Zustand store `useCBTStore` holds all domain data: classes, subjects, topics, questions, tests, and student attempts. It ships with seeded mock data (`src/lib/mock-data.ts`) and persists under the key `"cbt-store"`. A non-persisted `useSidebarStore` in `src/store/sidebar-store.ts` handles UI-only state. React Query is wired up but used for local mutation orchestration, not remote data fetching.

**Store mutation pattern:** All mutations spread immutably and update `updatedAt`:
```typescript
set(s => ({ questions: s.questions.map(q => q.id === id ? { ...q, ...data, updatedAt: new Date().toISOString() } : q) }))
```

Use `generateId()` from `src/lib/utils.ts` for new entity IDs. When passing `topicId`/`subjectId` between route params and store, coerce with `Number(id)` — params arrive as strings but domain types use `number`.

### Domain model

```
Class → Subjects → Topics → Questions
Test/Assessment → Sections → Questions (referenced by id)
Results → Assessment answers
```

**Type system friction:** Two parallel type conventions exist:
- Store/display types use kebab-case (`"multiple-choice"`, `"true-false"`)
- API/query types in `src/types/question.ts` use SCREAMING_SNAKE_CASE (`MULTIPLE_CHOICE`, `TRUE_FALSE`)

Components map between them at the boundary (see `TestEditor.tsx` for the mapping layer). Canonical Test/Assessment types live in `src/types/results.ts` (re-exported from `src/types/index.ts`).

`JWTPayload` and JWT utilities (`src/lib/utils.ts`) exist for future auth but are not wired into any auth flow.

### Code organisation

Use `// ─── SectionName ────` dividers to separate logical sections within files. Define the `Props` interface immediately after imports, before helpers and the component. Mark interactive components with `"use client"` at the top.

### Path alias

`@/*` resolves to `src/*`, `app/*`, and the project root (see `tsconfig.json`). Use `@/components/...`, `@/store/...`, etc.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. `app/globals.css` defines 700+ CSS variable tokens in a `@theme` block — semantic color, shadow, radius, and breakpoint tokens. Light mode is the default; dark mode inverts semantic tokens via `prefers-color-scheme: light` media query. Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional class names.

### Key utilities (`src/lib/utils.ts`)

| Function | Purpose |
|---|---|
| `cn(...classes)` | Conditional class names (clsx + tailwind-merge) |
| `generateId()` | Random + timestamp ID string |
| `generateRandomColor(text)` | Deterministic Tailwind color from text hash |
| `getQuestionTypeLabel(type)` | `"multiple-choice"` → `"Multiple Choice"` |
| `getQuestionTypeBadgeColor(type)` | Tailwind badge classes for question types |
| `formatDate(date)` | `DD/MM/YYYY` string |
| `formatRelativeDate(date)` | `"Today"` / `"X days ago"` |

### Key libraries

| Library | Role |
|---|---|
| `zustand@5` | Global state + localStorage persistence |
| `@tanstack/react-query@5` | Mutation orchestration (not remote fetching) |
| `@dnd-kit/*` | Drag-and-drop for question/topic reordering |
| `@tanstack/react-table` | Table rendering in results/question list views |
| `sonner` | Toast notifications |
| `lucide-react` | Icons |
| `date-fns` | Date formatting |
| `axios` | HTTP client (wired for future backend integration) |
