'use client';

import { getAgent } from '@/lib/agents';
import type { Subject } from '@/types';

interface Props {
  subject: Subject;
  onOpenQuiz: () => void;
  onOpenSidebar: () => void;
  onClearChat: () => void;
}

export default function ChatHeader({ subject, onOpenQuiz, onOpenSidebar, onClearChat }: Props) {
  const agent = getAgent(subject.id);

  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-brand-surface/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-muted hover:bg-white/5 hover:text-brand-text md:hidden"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-xl">
          {subject.emoji}
        </div>
        <div>
          <div className="font-syne font-semibold text-brand-text">{subject.label}</div>
          <div className="text-xs text-brand-muted">{agent.name} · {agent.tagline}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClearChat}
          className="flex h-9 w-9 items-center justify-center rounded-full text-brand-muted hover:bg-brand-secondary/10 hover:text-brand-secondary transition"
          title="Clear Chat"
        >
          🗑️
        </button>
        <button
          onClick={onOpenQuiz}
          className="flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-brand-accent transition hover:bg-brand-accent/20"
        >
          ⚡ <span className="hidden sm:inline">Lo Quiz</span>
        </button>
      </div>
    </header>
  );
}
