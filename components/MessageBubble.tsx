'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { getAgent } from '@/lib/agents';
import { useSpeechOutput } from '@/hooks/useSpeechOutput';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import type { Subject, Message } from '@/types';

interface Props {
  message: Message;
  subject: Subject;
  onBookmark?: (m: Message) => void;
  isBookmarked?: boolean;
  lowData?: boolean;
}

export default function MessageBubble({ message, subject, onBookmark, isBookmarked, lowData }: Props) {
  const agent = getAgent(subject.id);
  const { speak, stop, isSpeaking, supported } = useSpeechOutput();
  const isUser = message.role === 'user';
  const time = message.timestamp ? message.timestamp.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  }) : '';

  return (
    <div
      className={`flex w-full ${!lowData ? 'animate-msg-slide' : ''} ${isUser ? 'justify-end' : 'justify-start'}`}
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-muted">{time}</span>
            {!isUser && supported && (
              <button
                onClick={() => (isSpeaking ? stop() : speak(message.text, agent.gender))}
                className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                  isSpeaking
                    ? 'bg-brand-accent/20 text-brand-accent animate-pulse'
                    : 'text-brand-muted hover:bg-white/5 hover:text-brand-primary'
                }`}
                title={isSpeaking ? "Stop" : "Listen"}
              >
                {isSpeaking ? '⏹️' : '🔊'}
              </button>
            )}

            {!isUser && onBookmark && (
              <button
                onClick={() => onBookmark(message)}
                className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                  isBookmarked
                    ? 'text-brand-primary'
                    : 'text-brand-muted hover:bg-white/5 hover:text-brand-primary'
                }`}
                title={isBookmarked ? "Remove from Notes" : "Save to Notes"}
              >
                <BookmarkIcon size={12} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
