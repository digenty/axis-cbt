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

**Axis-CBT** is a Computer-Based Testing management app for schools. Pure client-side SPA — no backend; all state is seeded from mock data and persisted to `localStorage` via Zustand.

### Routing (`/app`)

Next.js App Router. Pages are thin wrappers rendering a single view component from `src/components/`. The hierarchy mirrors the domain:

```
/subjects                                                              → MySubjectsView
/classes                                                               → AllClassesView
/classes/[classId]                                                     → ClassSubjectsView
/classes/[classId]/subjects/[subjectId]                                → SubjectDetailView
/classes/[classId]/subjects/[subjectId]/question-bank                  → QuestionBankView
/classes/[classId]/subjects/[subjectId]/assessments                    → TestListView
/classes/[classId]/subjects/[subjectId]/assessments/[assessmentId]     → TestEditor
/classes/[classId]/subjects/[subjectId]/results                        → Results
/classes/[classId]/subjects/[subjectId]/results/[attemptId]            → GradeAttemptView
```

Root `/` redirects to `/subjects`.

### State (`src/store/`)

Three Zustand stores:

- **`useCBTStore`** (`store/index.ts`) — primary store persisted to `localStorage:"cbt-store"`. Holds `classes`, `subjects`, `topics`, `questions`, `tests`, `attempts`. Seeded from `src/lib/mock-data.ts`. All mutations are synchronous; no async thunks.
- **`useAuthStore`** (`store/auth-store.ts`) — persisted to `localStorage:"cbt-auth"`. Holds `token: string | null` for Axios Bearer auth.
- **`useSidebarStore`** (`store/sidebar-store.ts`) — in-memory UI state for mobile nav (`isSidebarOpen`, `activeNav`).

React Query is wired up (`src/hooks/queryHooks/`, `src/api/`) but Zustand is the primary data source — the app is not yet backend-connected. `NEXT_PUBLIC_API_BASE_URL` env var is required when connecting.

### Domain Model (`src/types/index.ts`, `src/types/results.ts`)

```
Class → Subjects → Topics → Questions
Test → Sections → questionIds (ordered string[] of Question IDs)
StudentAttempt → StudentAnswer[] → awardedMarks (teacher override)
```

Key type subtleties:
- `topicId` is typed as `string` on `Question` but `number` on `Topic.id` in the store — a known mismatch.
- `Question.type` uses **kebab-case** (e.g. `"multiple-choice"`) in the store/display layer; the API layer in `src/types/question.ts` uses **SCREAMING_SNAKE_CASE** (e.g. `"MULTIPLE_CHOICE"`). Components handle the conversion.
- `TestSection.questionIds` is an ordered list — position determines display order.

Supported question types: `multiple-choice`, `true-false`, `essay`, `fill-in-blank`, `matching`, `short-answer`, `numerical`, `question-group`, `multiple-answers`, `comprehension-passage`, `multiple-blanks`.

### Path Alias

`@/*` resolves to `src/*`, `app/*`, and the project root (see `tsconfig.json`). Use `@/components/...`, `@/store/...`, etc.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Custom theme tokens defined as CSS variables in `app/globals.css`. Use `cn()` from `src/lib/utils.ts` (`clsx` + `tailwind-merge`) when combining classes conditionally.

### Key Libraries

| Library | Role |
|---|---|
| `zustand@5` | Global state + localStorage persistence |
| `@dnd-kit/*` | Drag-and-drop for question/topic/section reordering |
| `@tanstack/react-table` | Tables in results and question list views |
| `@tanstack/react-query` | Server state (wired but not yet primary) |
| `sonner` | Toast notifications |
| `lucide-react` | Icons |
| `date-fns` | Date formatting |
| `axios` | HTTP client with Bearer token + 401/403 interceptors |

### Notable Utilities (`src/lib/utils.ts`)

- `cn()` — Tailwind class merging
- `generateId()` — random ID for new entities
- `getQuestionTypeLabel(type)` / `getQuestionTypeBadgeColor(type)` — display helpers for question types
- `formatDate()`, `formatRelativeDate()` — date display
- `decodeJWT()`, `isTokenExpired()` — JWT helpers (unused, for future auth)
