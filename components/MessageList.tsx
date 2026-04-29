'use client';

import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { getAgent } from '@/lib/agents';
import { ArrowDown } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const agent = getAgent(subject.id);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
    setAtBottom(isAtBottom);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    endRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (atBottom) {
      scrollToBottom('auto');
    }
  }, [messages, isLoading, atBottom]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="chat-scroll h-full w-full overflow-y-auto px-4 py-6 md:px-6 md:py-8"
      >
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-5xl shadow-2xl shadow-brand-primary/30 animate-avatar-pulse">
                {agent.avatar}
              </div>
              <h2 className="font-syne text-3xl font-bold gradient-text">
                Assalam-o-alaikum!
              </h2>
              <p className="mt-2 text-brand-muted">
                Main hoon <span className="text-brand-text font-semibold">{agent.name}</span> — aaj{' '}
                <span className="text-brand-primary">{subject.label}</span> mein kya seekhna hai?
              </p>

              <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {agent.starterPrompts.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => onQuickSend(p.text)}
                    className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-brand-card/60 px-5 py-4 text-left text-sm text-brand-text transition-all hover:border-brand-primary/40 hover:bg-brand-card"
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <span className="flex-1">{p.text}</span>
                    <span className="text-brand-muted transition group-hover:translate-x-1 group-hover:text-brand-primary">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
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
            </div>
          )}
          <div ref={endRef} className="h-4" />
        </div>
      </div>

      {/* Floating Scroll Button */}
      {!atBottom && messages.length > 0 && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-6 right-6 flex h-12 w-12 animate-msg-slide items-center justify-center rounded-full border border-white/10 bg-brand-surface/80 text-brand-primary shadow-2xl backdrop-blur-xl hover:scale-110 active:scale-95 transition-all"
        >
          <ArrowDown size={20} />
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand-accent animate-pulse" />
        </button>
      )}
    </div>
  );
}
