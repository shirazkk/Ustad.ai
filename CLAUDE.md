# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Ustaad.ai** — Pakistani AI tutoring app. The product persona is "Ustaad Bilal," a Roman-Urdu+English (Hinglish) tutor that uses desi analogies (biryani, cricket, load shedding) and targets students aged 12–22. Full product spec lives in `prompt.md` — treat it as the source of truth for design, copy, persona, and behavior.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Gemini 2.0 Flash API.

## Commands

The project has not been scaffolded yet. Once `package.json` exists, the standard Next.js commands apply:

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm start` — run built app
- `npm run lint` — Next.js / ESLint

`GEMINI_API_KEY` must be set in `.env.local` (server-side only — never expose to client).

## Architecture

Single-page chat UI; all client state is owned by `components/ChatApp.tsx` (the only `"use client"` root). Two server routes wrap Gemini calls.

### State ownership
`ChatApp.tsx` is the single source of truth for: `messages` (display), `geminiHistory` (API turns), `currentSubject`, `isLoading`, `uploadedImage` (base64), `showQuiz`, and `streak` (persisted in `localStorage` key `ustaad_streak`). Children are presentational and receive callbacks.

### Two parallel message representations
`messages: Message[]` is for rendering (has `id`, `timestamp`, `imageBase64`). `geminiHistory: GeminiMessage[]` is the strict `user`/`model` alternating format Gemini requires. Keep them in sync but never conflate them. Images go into history **only on the turn they were sent** — don't carry `inline_data` forward.

### Subject switching
Changing subject clears both `messages` and `geminiHistory` (fresh context per subject). Streak persists across switches.

### API routes
- `POST /api/chat` — prepends `getSystemPrompt(subject)` as `system_instruction`, builds `contents` from history + new user turn, calls `gemini-2.0-flash` (`maxOutputTokens: 1024`, `temperature: 0.8`), returns `{ reply }`. Network-failure copy: `"Yaar internet ka masla lag raha hai! 😅 Dobara try karo."`
- `POST /api/quiz` — asks Gemini for a single MCQ as **raw JSON** (no markdown fences). Extract via `/\{[\s\S]*\}/` regex before `JSON.parse`. Failure returns `{ quiz: null }` with status 500.

### Persona
`lib/systemPrompt.ts` exports `getSystemPrompt(subject)`. The persona rules (Roman Urdu + English mix, mandatory Pakistani analogy per explanation, 3–5 lines simple / 8–10 lines complex, end with fun fact or follow-up) are part of the product, not stylistic preference — don't soften or "professionalize" them.

## Design system

Dark holographic theme. Tailwind `colors.brand` tokens (`primary` `#6C63FF`, `secondary` `#FF6584`, `accent` `#43E97B`, `bg` `#0D0D1A`, `surface` `#13131F`, `card` `#1A1A2E`, `text` `#F0F0FF`, `muted` `#8888AA`, `gold` `#FFD700`). Fonts: `Syne` (headings/brand), `Nunito` (body). Custom keyframes: `blobFloat`, `typingDot`, `msgSlide`, `avatarPulse`, `modalIn`, `shimmer` — all defined in Tailwind config / `globals.css`. Background is three blurred animated blobs (`opacity-10 blur-3xl`).

## Implementation rules (from spec)

- **No `<form>` elements** anywhere — use `onClick`/`onChange` handlers.
- **Send on `Enter`**, newline on `Shift+Enter`.
- **Textarea auto-resize:** set `height: auto` then `scrollHeight` (cap 120px) on every change.
- **Auto-scroll** via `useEffect` watching `messages` + `isLoading` → `scrollIntoView({ behavior: 'smooth' })`.
- **Timestamps** formatted with `toLocaleTimeString('en-PK')`.
- **Markdown** in AI bubbles via `react-markdown`.
- **Quiz "Agla Sawaal"** re-fetches a fresh question and resets `selected`/`quiz` state.
- **Gemini history invariant:** roles must strictly alternate `user`/`model`; never two consecutive same-role turns.

## Types

Canonical types live in `types/index.ts`: `Message`, `Subject`, `QuizQuestion`, `GeminiPart`, `GeminiMessage`. Quiz options are always exactly 4; `correct` is 0-indexed.
