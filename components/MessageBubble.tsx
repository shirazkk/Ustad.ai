'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { getAgent } from '@/lib/agents';
import type { Subject, Message } from '@/types';

interface Props {
  message: Message;
  subject: Subject;
}

export default function MessageBubble({ message, subject }: Props) {
  const agent = getAgent(subject.id);
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex w-full animate-msg-slide ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${
            isUser
              ? 'bg-brand-card text-brand-text'
              : 'bg-gradient-to-br from-brand-primary to-brand-secondary'
          }`}
        >
          {isUser ? '🧑‍🎓' : agent.avatar}
        </div>

        <div
          className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
              isUser
                ? 'gradient-bg rounded-br-sm text-white shadow-lg shadow-brand-primary/20'
                : 'rounded-bl-sm bg-brand-card text-brand-text'
            }`}
          >
            {message.imageBase64 && (
              <img
                src={
                  message.imageBase64.startsWith('data:')
                    ? message.imageBase64
                    : `data:image/jpeg;base64,${message.imageBase64}`
                }
                alt="uploaded"
                className="mb-2 max-h-64 rounded-lg"
              />
            )}
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.text}</p>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_code]:rounded [&_code]:bg-black/40 [&_code]:px-1 [&_code]:py-0.5">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight]}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-xs text-brand-muted">{time}</span>
        </div>
      </div>
    </div>
  );
}
