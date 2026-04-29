'use client';

import { useState } from 'react';
import { getAgent } from '@/lib/agents';
import { LayoutDashboard, Sparkles, Trash2, Share2, Check } from 'lucide-react';
import { chatToMarkdown, shareChat } from '@/lib/share';
import type { Subject, Message } from '@/types';

interface Props {
  subject: Subject;
  messages: Message[];
  onOpenQuiz: () => void;
  onOpenSidebar: () => void;
  onOpenHub: () => void;
  onClearChat: () => void;
}

export default function ChatHeader({ subject, messages, onOpenQuiz, onOpenHub, onClearChat }: Props) {
  const agent = getAgent(subject.id);
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'copied'>('idle');

  const handleShare = async () => {
    if (messages.length < 2) return; // nothing meaningful to share
    const md = chatToMarkdown(messages, subject.label, agent.name);
    const result = await shareChat(md, subject.label);
    if (result === 'shared') setShareState('shared');
    else if (result === 'copied') setShareState('copied');
    setTimeout(() => setShareState('idle'), 2000);
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/5 bg-brand-bg/80 px-4 backdrop-blur-2xl sm:px-8">
      {/* Left: Identity */}
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-xl">
             {subject.emoji}
           </div>
           <div className="flex flex-col">
              <h2 className="font-syne text-sm font-black uppercase tracking-widest text-brand-text sm:text-base">
                {subject.label}
              </h2>
              <p className="text-[10px] font-bold text-brand-muted opacity-60">
                AI Session with {agent.name}
              </p>
           </div>
        </div>
      </div>

      {/* Clear Chat — visible on ALL screens */}
      <button
        onClick={onClearChat}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-muted transition-all hover:bg-red-500/10 hover:text-red-400 md:hidden"
        title="Clear Chat"
      >
        <Trash2 size={18} />
      </button>

      {/* Right: Primary Actions (desktop only — mobile/tablet uses bottom nav) */}
      <div className="hidden flex-1 items-center justify-end gap-2 md:flex md:gap-4">
        {/* Share */}
        <button
          onClick={handleShare}
          disabled={messages.length < 2}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-muted transition-all hover:bg-brand-primary/10 hover:text-brand-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-muted"
          title={shareState === 'copied' ? 'Copied!' : shareState === 'shared' ? 'Shared!' : 'Share chat'}
        >
          {shareState === 'idle' ? <Share2 size={18} /> : <Check size={18} className="text-brand-accent" />}
        </button>

        {/* Clear */}
        <button
          onClick={onClearChat}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-muted transition-all hover:bg-red-500/10 hover:text-red-400"
          title="Clear Chat"
        >
          <Trash2 size={18} />
        </button>

        <div className="h-6 w-px bg-white/10" />

        {/* Hub */}
        <button
          onClick={onOpenHub}
          className="flex items-center gap-2 rounded-2xl bg-white/5 px-5 py-2.5 text-xs font-bold text-brand-text ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-brand-primary/50"
        >
          <LayoutDashboard size={16} className="text-brand-primary" />
          <span>Learning Hub</span>
        </button>

        {/* Quiz */}
        <button
          onClick={onOpenQuiz}
          className="group relative flex items-center justify-center overflow-hidden rounded-2xl gradient-bg px-6 py-2.5 text-white shadow-lg shadow-brand-accent/20 transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <Sparkles size={16} fill="currentColor" className="mr-2" />
          <span className="font-syne font-bold text-[13px]">LO QUIZ</span>
        </button>
      </div>
    </header>
  );
}
