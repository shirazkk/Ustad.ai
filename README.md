
# Ustaad.ai 🇵🇰

**Pakistan ka apna AI Tutor** — A culturally-rooted, multi-agent AI tutoring platform for Pakistani students aged 12–22, built for the AI Seekho Hackathon.

Global AI tutors explain physics with American football and ignore local boards. Ustaad.ai fixes that: six dedicated subject "Ustaads" teach in **Roman Urdu + English (Hinglish)**, use **desi analogies** (biryani, cricket, load shedding, rickshaw), and scope every answer to the student's **board and grade**.


---

## ✨ Features

- **6 Subject Agents** — Science, Math, English, Urdu, Pakistan Studies, Computer Science. Each has its own persona, temperature, quiz style, and starter prompts (`lib/agents/`).
- **Hinglish-first persona** — mandatory Pakistani analogy on every explanation; jailbreak-resistant; refuses off-subject questions politely.
- **Board-aware syllabus scope** — Federal / Sindh / Punjab / KPK / Balochistan × grades 9–12. Every prompt is contextualized so a 10th-grader on Sindh Board gets exactly that syllabus.
- **Streaming chat** with multimodal image input — snap a homework photo and the agent identifies the subject, validates scope, and walks through the solution.
- **Adaptive quizzes** — difficulty auto-adjusts based on streak (`>= 2` correct → harder, `<= -2` → easier). Explanations *teach* the concept, not just mark right/wrong.
- **Streak heatmap** — daily activity tracking with a yesterday-grace period.
- **Bookmarks** — auto-categorized as Formula / Definition / Concept / General.
- **Per-subject chat history** persisted in `localStorage` (last 50 messages per subject).
- **Math + code rendering** — KaTeX (`remark-math` + `rehype-katex`) and syntax highlighting (`rehype-highlight`).
- **Installable PWA** — `app/manifest.ts` ships a standalone web-app manifest (icons, theme, start URL) so students can install Ustaad.ai to their home screen and launch it like a native app.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **Styling:** Tailwind CSS v4 · custom dark holographic theme · Framer Motion
- **AI:** Google Gemini 2.0 Flash via [Vercel AI SDK v6](https://ai-sdk.dev/) (`ai`, `@ai-sdk/google`)
- **Deployment:** Docker → Google Cloud Run (`output: 'standalone'`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Install & run locally

```bash
git clone https://github.com/<your-handle>/ustad-ai.git
cd ustad-ai
npm install
```

Create `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (standalone output) |
| `npm start` | Run the built app |
| `npm run lint` | ESLint (flat config) |

---

## ☁️ Deploy to Google Cloud Run

The included `Dockerfile` produces a small standalone Next.js image suitable for Cloud Run.

```bash
# 1. Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ustad-ai

# 3. Deploy
gcloud run deploy ustad-ai \
  --image gcr.io/YOUR_PROJECT_ID/ustad-ai \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

> Choose `asia-south1` (Mumbai) for low latency to Pakistani users.

---

## 🧠 Architecture

```
ustad-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # streamText (Gemini) — multimodal, board-aware
│   │   └── quiz/route.ts      # generateText — strict JSON MCQ, adaptive
│   ├── layout.tsx
│   └── page.tsx
├── components/                 # ChatApp (state root) + presentational UI
├── lib/
│   ├── agents/                 # Per-subject personas (the brain)
│   │   ├── science.ts | math.ts | english.ts | urdu.ts | history.ts | cs.ts
│   │   ├── shared.ts           # Cross-cutting persona rules
│   │   └── index.ts            # getAgent(id)
│   ├── boards.ts               # Education context (board + grade)
│   ├── bookmarks.ts            # Auto-categorized message bookmarks
│   ├── storage.ts              # Per-subject chat persistence
│   ├── streak.ts               # Daily activity + streak calculation
│   └── subjects.ts             # Subject registry
├── types/index.ts              # Message, Subject, QuizQuestion, GeminiMessage
├── Dockerfile                  # Cloud Run-ready
└── next.config.ts              # output: 'standalone'
```

### How a chat turn flows
1. User sends message (+ optional image) in `ChatApp.sendMessage`.
2. Client appends to `messages` (UI) and builds `geminiHistory` (strict alternating `user`/`model`).
3. `POST /api/chat` injects `getAgent(subject).systemPrompt` + education context into `streamText`.
4. Response streams back as plain text; client decodes chunks and updates the AI bubble in place.
5. On success, history is committed and persisted to `localStorage`.

### How a quiz works
- `POST /api/quiz` builds a prompt with the agent's `quizStyle`, the student's board/grade, and the current streak (for adaptive difficulty).
- Gemini returns raw JSON; we extract via regex and validate against the `QuizQuestion` schema (4 options, `correct` 0–3, both explanations).

---

## 🎯 Hackathon Context

Built for the **AI Seekho Hackathon** (Google Cloud × Google AI Studio track). Showcases:

- **Gemini 2.0 Flash** for fast, multimodal, streaming education
- **Cultural localization** as a first-class product concern (not a translation layer)
- **Cloud Run** for cost-effective regional deployment

---

## 🙏 Credits

Built by **Shiraz Ali** ([@shirazkk](https://github.com/shirazkk)) — Frontend & Agentic AI Developer, Karachi 🇵🇰.

- Portfolio: [shirazali-portfolio.vercel.app](https://shirazali-portfolio.vercel.app)
- LinkedIn: [shirazali8](https://linkedin.com/in/shirazali8)

---

## 📄 License

This is a hackathon project. Use freely for learning; please credit if you fork.
