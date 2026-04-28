import { generateText } from 'ai';
import { getAgent } from '@/lib/agents';
import { UserEducation } from '@/lib/boards';
import type { QuizQuestion } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface QuizRequestBody {
  subject: string;
  topic?: string;
  streak?: number;
  education?: UserEducation;
}

function buildQuizPrompt(subject: string, topic?: string, streak: number = 0, education?: UserEducation): string {
  const agent = getAgent(subject);
  const context = topic 
    ? `Topic focus: ${topic}. Is topic par specific sawal poochiye.` 
    : `Quiz Style: ${agent.quizStyle}`;

  // Adaptive difficulty logic
  let difficultyInstruction = '';
  if (streak >= 2) {
    difficultyInstruction = `\nCRITICAL: The student has a streak of ${streak} correct answers. Make this question significantly HARDER and advanced.`;
  } else if (streak <= -2) {
    difficultyInstruction = `\nCRITICAL: The student has a streak of ${Math.abs(streak)} WRONG answers. Make this question EASIER and fundamental.`;
  }

  // Education Context logic
  let eduContext = education 
    ? `\nSTRICT SYLLABUS SCOPE: Student is in ${education.grade} grade, ${education.board} Board. Only ask what is relevant to this curriculum.` 
    : '';

  if (education?.lowData) {
    eduContext += `\nLOW-DATA MODE: Keep question and explanations very short.`;
  }

  return `Tum "${agent.name}" ho — Pakistani AI tutor.

Subject: ${subject}
${context}${difficultyInstruction}${eduContext}

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
      prompt: buildQuizPrompt(body.subject, body.topic, body.streak, body.education),
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
