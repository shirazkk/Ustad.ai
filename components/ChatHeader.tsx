'use client';

import { getAgent } from '@/lib/agents';
import { LayoutDashboard, Sparkles, Menu, Trash2 } from 'lucide-react';
import type { Subject } from '@/types';

interface Props {
  subject: Subject;
  onOpenQuiz: () => void;
  onOpenSidebar: () => void;
  onOpenHub: () => void;
  onClearChat: () => void;
}

export default function ChatHeader({ subject, onOpenQuiz, onOpenSidebar, onOpenHub, onClearChat }: Props) {
  const agent = getAgent(subject.id);

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/5 bg-brand-bg/80 px-4 backdrop-blur-2xl sm:px-8">
      {/* Left: Menu & Identity */}
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-brand-muted hover:text-brand-text md:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-3">
           <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-xl md:flex">
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

      {/* Right: Primary Actions */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        {/* Secondary Utility (Hidden on mobile, in Hub) */}
        <button
          onClick={onClearChat}
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-brand-muted transition-all hover:bg-red-500/10 hover:text-red-400 sm:flex"
          title="Clear Chat"
        >
          <Trash2 size={18} />
        </button>

        <div className="hidden h-6 w-px bg-white/10 sm:block" />

        {/* The "Brain" / Hub Trigger */}
        <button
          onClick={onOpenHub}
          className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-xs font-bold text-brand-text ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-brand-primary/50 sm:px-5 sm:py-2.5"
        >
          <LayoutDashboard size={16} className="text-brand-primary" />
          <span className="hidden sm:inline">Learning Hub</span>
          <span className="sm:hidden">Hub</span>
        </button>

        {/* High Impact Action */}
        <button
          onClick={onOpenQuiz}
          className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl gradient-bg text-white shadow-lg shadow-brand-accent/20 transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-6"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <Sparkles size={16} fill="currentColor" className="sm:mr-2" />
          <span className="hidden font-syne font-bold sm:inline text-[13px]">LO QUIZ</span>
        </button>
      </div>
    </header>
  );
}
