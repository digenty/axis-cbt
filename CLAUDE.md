# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server on port 8005
npm run build     # Production build (Next.js)
npm run start     # Run the production build
npm run lint      # ESLint (next/core-web-vitals + @tanstack/query)
npm run format    # Prettier (src/**/*.{js,jsx,ts,tsx,css,json})
```

No test suite is configured.

## Architecture

**Axis-CBT** is a Computer-Based Testing management app for schools, embedded in a larger Digenty platform. It runs as a pure client-side SPA today — all domain state is seeded from mock data and persisted to `localStorage` via Zustand. The React Query + Axios layer is wired up against `NEXT_PUBLIC_API_BASE_URL` for an upcoming backend cutover, but is not the primary data source yet.

### Routing — Next.js 16 (App Router)

Pages are thin wrappers that render a single view component from `src/components/`. They are split across **three top-level role areas** under `app/`:

```
app/
├── (teacher)/                              # route group; uses AppShell layout
│   ├── subjects                            → MySubjectsView
│   ├── classes                             → AllClassesView
│   └── classes/[classId]
│       ├── (page)                          → ClassSubjectsView
│       └── subjects/[subjectId]
│           ├── (page)                      → SubjectDetailView
│           ├── question-bank               → QuestionBankView
│           ├── question-bank/new           → new-question editor
│           ├── question-bank/[questionId]  → edit-question editor
│           ├── question-bank/import        → CSV/bulk import
│           ├── assessments                 → TestListView
│           ├── assessments/[assessmentId]  → TestEditor
│           ├── results                     → Results
│           └── results/[attemptId]         → GradeAttemptView
├── student/cbt                             → StudentDashboard (StudentShell)
├── student/cbt/[testId]                    → student test runner
├── student/cbt/[testId]/result             → student result view
└── auth-entry                              → AuthRedirect (re-auth bridge)
```

Root `/` redirects to `/subjects`. `/student` redirects to `/student/cbt`.

**Next.js 16 conventions to follow:**
- `params` arrives as a `Promise` in pages and layouts. Unwrap with the `use()` hook in client components, or `await` in server components — never destructure directly.
  ```tsx
  const { classId, subjectId } = use(params);
  ```
- Read `node_modules/next/dist/docs/` before adding new pages or layouts. APIs differ from Next.js 13–15.

### Auth

Auth is enforced by Edge middleware at `app/middleware.ts`. It looks for an httpOnly `token` cookie set by the parent Digenty app. If absent, requests are redirected to `/auth-entry`, which re-routes back to the main login (with `returnTo` preserved). `/auth-entry`, `/_next`, `/favicon`, `/api/`, `/robots`, `/sitemap` are exempted.

Server-side cookie helpers live in `src/lib/cookies.ts` (`"use server"`). The Axios client in `src/lib/axios-auth.ts` reads the same token via `getSessionToken()` and attaches it as `Bearer`; 401/403 responses trigger `deleteSession()`.

### State (`src/store/`)

Three Zustand stores:

- **`useCBTStore`** (`store/index.ts`) — primary domain store, persisted to `localStorage:"cbt-store"`. Holds `classes`, `subjects`, `topics`, `questions`, `tests`, `attempts`. Seeded from `src/lib/mock-data.ts`. All mutations are synchronous and immutable; spread the prior state and stamp `updatedAt` on edits.
  ```ts
  set(s => ({ questions: s.questions.map(q =>
    q.id === id ? { ...q, ...data, updatedAt: new Date().toISOString() } : q) }))
  ```
- **`useAuthStore`** (`store/auth-store.ts`) — persisted to `localStorage:"cbt-auth"`. Belt-and-suspenders fallback for the cookie token; not currently consumed anywhere but kept for the dev cross-port case.
- **`useSidebarStore`** (`store/sidebar.ts`) — in-memory UI state for mobile nav (`isSidebarOpen`, `activeNav`).

React Query (`src/api/`, `src/hooks/queryHooks/`, `src/queries/`) is wired up with the @tanstack/eslint-plugin-query rules but not yet the primary data source — the app reads/writes through `useCBTStore` for now. When connecting the backend, `NEXT_PUBLIC_API_BASE_URL` must be set.

### Domain model (`src/types/index.ts`, `src/types/results.ts`)

```
Class → Subjects → Topics → Questions
Test → Sections → questionIds (ordered string[] of Question IDs)
StudentAttempt → StudentAnswer[] → awardedMarks (teacher override)
```

Canonical `Test` / `Assessment` / `StudentAttempt` types live in `src/types/results.ts` and are re-exported from `@/types`. Always import from `@/types`.

**Type system friction worth knowing:**
- `topicId` is typed as `string` on `Question` but `Topic.id` is `number` in the store — known mismatch.
- `Question.type` uses **kebab-case** (`"multiple-choice"`) in the store/display layer; the API layer in `src/types/question.ts` uses **SCREAMING_SNAKE_CASE** (`"MULTIPLE_CHOICE"`). Components map between them at the boundary — see `TestEditor.tsx` for the pattern.
- `TestSection.questionIds` is order-sensitive — array position is the display order.
- Route params arrive as strings; coerce with `Number(id)` when matching against `subjectId`/`topicId` in the store.

Supported question types: `multiple-choice`, `true-false`, `essay`, `fill-in-blank`, `matching`, `short-answer`, `numerical`, `question-group`, `multiple-answers`, `comprehension-passage`, `multiple-blanks`.

### Path alias

`@/*` resolves to `src/*`, `app/*`, then the project root (see `tsconfig.json`). Use `@/components/...`, `@/store/...`, `@/lib/...` — never deep relative paths.

### Code organisation

- Mark interactive components with `"use client"` at the top.
- Define the `Props` interface immediately after imports, before helpers and the component.
- Use `// ─── SectionName ────` dividers to separate logical sections inside larger files.
- Use `generateId()` from `src/lib/utils.ts` for new entity IDs.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. `app/globals.css` defines the full token set (semantic colors, shadows, radii, breakpoints) in a `@theme` block; dark mode is driven through a `prefers-color-scheme` media query, not a class toggle. Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge) when combining classes conditionally.

### Key utilities (`src/lib/utils.ts`)

| Function | Purpose |
|---|---|
| `cn(...classes)` | Conditional class names (clsx + tailwind-merge) |
| `generateId()` | Random + timestamp ID string for new entities |
| `generateRandomColor(text)` | Deterministic Tailwind color from text hash |
| `getQuestionTypeLabel(type)` | `"multiple-choice"` → `"Multiple Choice"` |
| `getQuestionTypeBadgeColor(type)` | Tailwind badge classes per question type |
| `formatDate(date)` | `DD/MM/YYYY` |
| `formatRelativeDate(date)` | `"Today"` / `"X days ago"` |
| `decodeJWT()`, `isTokenExpired()` | JWT helpers (used by `cookies.ts`) |

### Key libraries

| Library | Role |
|---|---|
| `next@16` / `react@19` | App Router, async params, RSC defaults |
| `zustand@5` | Global state + localStorage persistence |
| `@tanstack/react-query@5` | Server-state layer (wired, not yet primary) |
| `axios` | HTTP client with Bearer token + 401/403 interceptors |
| `@dnd-kit/*` | Drag-and-drop for question/topic/section reordering |
| `@tanstack/react-table` | Tables in results and question-list views |
| `radix-ui` + `class-variance-authority` | Headless UI primitives + variant styling |
| `next-themes` | Theme provider |
| `react-day-picker`, `date-fns` | Date pickers and formatting |
| `sonner` | Toast notifications (mounted in root layout) |
| `lucide-react` | Icons |
| `vaul` | Mobile drawer primitive |
