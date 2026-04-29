# GEMINI.md

This file provides instructional context for Gemini CLI when interacting with the **Ustad.ai** project.

## Project Overview

**Ustad.ai** is a specialized AI tutoring application designed for Pakistani students (ages 12–22). The core feature is the AI persona **"Ustaad Bilal,"** a friendly, funny, and knowledgeable tutor who communicates in a mix of **Roman Urdu and English (Hinglish)** and uses relatable **Pakistani daily life analogies** (e.g., biryani, cricket, load shedding) to explain complex topics.

### Key Technologies
- **Framework:** Next.js 16+ (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **AI Integration:** Vercel AI SDK (`ai`, `@ai-sdk/react`)
- **Model:** Google Gemini 2.0 Flash
- **Icons/Components:** Lucide React, Framer Motion (inferred from design descriptions)

### Architecture
- **State Management:** `components/ChatApp.tsx` is the primary client-side state container. It manages chat history, subject selection, and image uploads.
- **AI Persona:** Defined in `lib/systemPrompt.ts` via the `getSystemPrompt(subject)` function.
- **API Routes:**
  - `POST /api/chat`: Streams responses from Gemini with a subject-specific system instruction.
  - `POST /api/quiz`: Generates a single MCQ for the current subject in raw JSON format.
- **Styling:** Dark holographic theme with custom brand colors and animated background blobs defined in `globals.css` and `tailwind.config`.

## Building and Running

### Prerequisites
- Node.js installed.
- A valid `GEMINI_API_KEY` obtained from [Google AI Studio](https://aistudio.google.com/).

### Environment Setup
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

### Key Commands
- `npm run dev`: Starts the development server at `http://localhost:3000`.
- `npm run build`: Compiles the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.

## Development Conventions

### AI Persona & Copy
- **Language Mix:** Always use a blend of Roman Urdu and English. Avoid pure English or pure Urdu.
- **Analogies:** Every explanation must include at least one Pakistani daily life analogy.
- **Guardrails:** Refuse off-topic questions politely (movies, gossip, etc.) and redirect back to the selected subject.
- **Network Errors:** Use the standard error message: `"Yaar internet ka masla lag raha hai! 😅 Dobara try karo."`

### Coding Standards
- **Form Handling:** Avoid using standard HTML `<form>` elements; use `onClick` and `onChange` handlers instead.
- **Textarea:** Implement auto-resizing (cap at 120px) and handle `Enter` for sending vs. `Shift+Enter` for newlines.
- **History Management:** Maintain `messages` (for UI) and `geminiHistory` (for API) separately. Images should only be included in the turn they are sent.
- **Types:** Use the canonical types defined in `types/index.ts`.
- **Auto-scroll:** Ensure the chat window automatically scrolls to the latest message.

### Design System
- **Theme:** Dark holographic (`bg: #0D0D1A`, `surface: #13131F`).
- **Typography:** `Syne` for headings and brand elements, `Nunito` for body text.
- **Visuals:** Use animated background blobs and custom keyframes (e.g., `blobFloat`, `avatarPulse`) for a premium feel.

## Roadmap & Planned Phases (from .claude/finalplan.md)

The project is currently transitioning through the following implementation phases:

### Phase 1: Foundation & Refactoring
- **Per-Subject Agent Architecture:** Moving from a single prompt to modular agents (e.g., Apa Sara for English, Bhai Code for CS, Chacha Anwar for History).
- **Consolidated UI State:** Fixing duplicate typing indicators and unifying loading flags.

### Phase 2: Core Quality
- **Math & Code Rendering:** Implementing KaTeX for math equations and highlight.js for code syntax highlighting in chat.
- **Rate Limiting:** (Planned) Implementing Upstash Redis for per-user request limiting.

### Phase 3: Persistence & Engagement
- **Persistent History:** Using `localStorage` to save and load chat history per subject.
- **Learning Features:** Adding adaptive quiz difficulty based on student performance and a GitHub-style activity heatmap.

### Phase 4: Accessibility & Localization
- **Voice Interaction:** Adding Speech-to-Text (STT) for input and Text-to-Speech (TTS) for Ustaad Bilal's responses.
- **Board Syllabus Mode:** Customizing responses based on specific Pakistani educational boards (Sindh, Punjab, Federal) and grade levels.

### Phase 5: PWA & Performance
- **Progressive Web App (PWA):** Adding a manifest and service worker for offline capabilities and homescreen installation.
- **Image Compression:** Compressing user-uploaded images before sending them to the API.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
