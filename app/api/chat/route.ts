import { streamText, type ModelMessage } from 'ai';
import { getAgent } from '@/lib/agents';
import type { GeminiMessage } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ChatRequestBody {
  history: GeminiMessage[];
  message: string;
  imageBase64?: string;
  subject: string;
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

  const { history, message, imageBase64, subject } = body;

  const messages: ModelMessage[] = geminiHistoryToModelMessages(history ?? []);

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

  const agent = getAgent(subject);

  try {
    const result = streamText({
      model: 'google/gemini-2.0-flash',
      system: agent.systemPrompt,
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
