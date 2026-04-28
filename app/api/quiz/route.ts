import { generateText } from 'ai';
import { getAgent } from '@/lib/agents';
import type { QuizQuestion } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface QuizRequestBody {
  subject: string;
  topic?: string;
}

function buildQuizPrompt(subject: string, topic?: string): string {
  const agent = getAgent(subject);
  const context = topic 
    ? `Topic focus: ${topic}. Is topic par specific sawal poochiye.` 
    : `Quiz Style: ${agent.quizStyle}`;

  return `Tum "${agent.name}" ho — Pakistani AI tutor.

Subject: ${subject}
${context}

Ek MCQ (multiple choice question) banao Pakistani school/college student ke liye (age 12-22).
Mix Roman Urdu + English use karo question aur explanations mein.

STRICTLY return ONLY raw JSON. No markdown fences, no extra text, no commentary.
Schema:
{
  "question": "string (Roman Urdu + English mix)",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation_correct": "Roman Urdu celebration + brief explanation",
  "explanation_wrong": "Roman Urdu gentle roast + correct explanation"
}

Rules:
- "options" array must have EXACTLY 4 items.
- "correct" must be 0, 1, 2, or 3 (zero-indexed).
- Use a Pakistani daily life analogy in at least one explanation.
- Keep options short and distinct.`;
}

function parseQuiz(raw: string): QuizQuestion | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as Partial<QuizQuestion>;
    if (
      typeof parsed.question !== 'string' ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      !parsed.options.every((o) => typeof o === 'string') ||
      typeof parsed.correct !== 'number' ||
      parsed.correct < 0 ||
      parsed.correct > 3 ||
      typeof parsed.explanation_correct !== 'string' ||
      typeof parsed.explanation_wrong !== 'string'
    ) {
      return null;
    }
    return parsed as QuizQuestion;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: QuizRequestBody;
  try {
    body = (await request.json()) as QuizRequestBody;
  } catch {
    return Response.json({ quiz: null, error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const { text } = await generateText({
      model: 'google/gemini-2.0-flash',
      prompt: buildQuizPrompt(body.subject, body.topic),
      temperature: 0.9,
    });

    const quiz = parseQuiz(text);
    if (!quiz) {
      return Response.json({ quiz: null }, { status: 500 });
    }
    return Response.json({ quiz });
  } catch (err) {
    console.error('[quiz] route error:', err);
    return Response.json({ quiz: null }, { status: 500 });
  }
}
