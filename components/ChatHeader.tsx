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
    <header className="flex h-20 items-center justify-between border-b border-white/5 bg-brand-bg px-4 backdrop-blur-xl sm:px-8">
      {/* Left: Sidebar Toggle (Mobile only) + Brand (Desktop) */}
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-brand-muted hover:text-brand-text md:hidden"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden items-center gap-2 md:flex">
           <div className="h-8 w-1 rounded-full bg-brand-primary" />
           <span className="font-syne text-xs font-bold uppercase tracking-widest text-brand-muted opacity-50">Session Active</span>
        </div>
      </div>

      {/* Center: Current Subject Identity */}
      <div className="flex flex-col items-center justify-center text-center">
         <div className="flex items-center gap-2">
            <span className="text-xl">{subject.emoji}</span>
            <h2 className="font-syne text-lg font-extrabold text-brand-text">{subject.label}</h2>
         </div>
         <p className="hidden text-[10px] font-bold uppercase tracking-wider text-brand-muted opacity-60 sm:block">
            Taught by {agent.name}
         </p>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <button
          onClick={onClearChat}
          className="group flex h-10 w-10 items-center justify-center rounded-2xl text-brand-muted transition-all hover:bg-red-500/10 hover:text-red-400"
          title="Clear History"
        >
          <Trash2 size={18} className="transition-transform group-hover:scale-110" />
        </button>

        <div className="h-6 w-px bg-white/10" />

        <button
          onClick={onOpenHub}
          className="group flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-brand-muted transition-all hover:bg-brand-primary/20 hover:text-brand-primary hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
          title="Learning Hub"
        >
          <LayoutDashboard size={20} className="transition-transform group-hover:scale-110" />
        </button>

        <button
          onClick={onOpenQuiz}
          className="flex items-center gap-2 rounded-2xl bg-brand-accent px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-accent/20 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles size={14} fill="currentColor" />
          <span>Lo Quiz</span>
        </button>
      </div>
    </header>
  );
}
