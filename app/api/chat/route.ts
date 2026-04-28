import { streamText, type ModelMessage } from 'ai';
import { getAgent } from '@/lib/agents';
import { UserEducation } from '@/lib/boards';
import type { GeminiMessage } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ChatRequestBody {
  history: GeminiMessage[];
  message: string;
  imageBase64?: string;
  subject: string;
  education?: UserEducation;
}

function geminiHistoryToModelMessages(history: GeminiMessage[]): ModelMessage[] {
  return history.map((m) => {
    const text = m.parts.map((p) => p.text ?? '').join('');
    if (m.role === 'user') {
      return { role: 'user', content: text } satisfies ModelMessage;
    }
    return { role: 'assistant', content: text } satisfies ModelMessage;
  });
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { history, message, imageBase64, subject, education } = body;

  const messages: ModelMessage[] = geminiHistoryToModelMessages(history ?? []);

  const agent = getAgent(subject);

  // Education Context Injection
  let eduContext = education 
    ? `\n\nSTRICT SYLLABUS SCOPE: The student is in ${education.grade} grade, following the ${education.board} Board curriculum. Tailor your explanations, terminology, and complexity to match this specific syllabus.`
    : '';

  if (education?.lowData) {
    eduContext += `\n\nLOW-DATA MODE ENABLED: Keep your response extremely brief and concise (under 80 words). Avoid long explanations and heavy formatting.`;
  }

  if (imageBase64) {
    const dataUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: message },
        { type: 'image', image: dataUrl },
      ],
    });
  } else {
    messages.push({ role: 'user', content: message });
  }

  try {
    const result = streamText({
      model: 'google/gemini-2.0-flash',
      system: agent.systemPrompt + eduContext,
      messages,
      temperature: agent.temperature,
      onError: ({ error }) => {
        console.error('[chat] streamText error:', error);
      },
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error('[chat] route error:', err);
    return Response.json(
      { error: 'Yaar internet ka masla lag raha hai! 😅 Dobara try karo.' },
      { status: 500 },
    );
  }
}
