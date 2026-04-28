'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { getAgent } from '@/lib/agents';
import type { Message, Subject } from '@/types';

interface Props {
  messages: Message[];
  isLoading: boolean;
  subject: Subject;
  onQuickSend: (text: string) => void;
  onBookmark: (m: Message) => void;
  bookmarkedIds: Set<string>;
  lowData?: boolean;
}

export default function MessageList({ 
  messages, 
  isLoading, 
  subject, 
  onQuickSend,
  onBookmark,
  bookmarkedIds,
  lowData 
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const agent = getAgent(subject.id);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="chat-scroll flex h-full flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-5xl shadow-2xl shadow-brand-primary/30 animate-avatar-pulse">
            {agent.avatar}
          </div>
          <h2 className="font-syne text-3xl font-bold gradient-text">
            Assalam-o-alaikum!
          </h2>
          <p className="mt-2 max-w-md text-brand-muted">
            Main hoon <span className="text-brand-text font-semibold">{agent.name}</span> — aaj{' '}
            <span className="text-brand-primary">{subject.label}</span> mein kya seekhna hai?
          </p>

          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            {agent.starterPrompts.map((p) => (
              <button
                key={p.text}
                onClick={() => onQuickSend(p.text)}
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-brand-card/60 px-4 py-3 text-left text-sm text-brand-text transition hover:border-brand-primary/40 hover:bg-brand-card"
              >
                <span className="text-xl">{p.emoji}</span>
                <span className="flex-1">{p.text}</span>
                <span className="text-brand-muted transition group-hover:translate-x-1 group-hover:text-brand-primary">→</span>
              </button>
            ))}
          </div>
        </div>
        <div ref={endRef} />
      </div>
    );
  }

  return (
    <div className="chat-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {messages.map((m) => (
          <MessageBubble 
            key={m.id} 
            message={m} 
            subject={subject} 
            onBookmark={onBookmark}
            isBookmarked={bookmarkedIds.has(m.id)}
            lowData={lowData}
          />
        ))}
        {isLoading && <TypingIndicator subject={subject} />}
        <div ref={endRef} />
      </div>
    </div>
  );
}
