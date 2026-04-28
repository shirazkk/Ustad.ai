'use client';

import { SUBJECTS } from '@/lib/subjects';
import { getAgent } from '@/lib/agents';
import StreakHeatmap from './StreakHeatmap';
import { Settings } from 'lucide-react';
import type { Subject } from '@/types';

interface Props {
  currentSubject: Subject;
  onSubjectChange: (s: Subject) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentSubject, onSubjectChange, open, onClose }: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-white/5 bg-brand-surface transition-transform duration-300 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-8">
          <h1 className="font-syne text-2xl font-extrabold tracking-tight text-brand-text">
            Ustaad<span className="text-brand-primary">.ai</span>
          </h1>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-brand-muted hover:bg-white/5 hover:text-brand-text md:hidden"
          >
            ✕
          </button>
        </div>

        {/* Subjects List */}
        <div className="flex-1 overflow-y-auto px-4 chat-scroll">
          <div className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted opacity-50">
            Current Library
          </div>
          
          <nav className="space-y-1">
            {SUBJECTS.map((s) => {
              const active = s.id === currentSubject.id;
              const agent = getAgent(s.id);
              
              return (
                <button
                  key={s.id}
                  onClick={() => onSubjectChange(s)}
                  className={`group relative flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-all duration-200 ${
                    active
                      ? 'bg-brand-primary/10 text-brand-text'
                      : 'text-brand-muted hover:bg-white/5 hover:text-brand-text'
                  }`}
                >
                  {/* Subject Icon Container */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-300 ${
                    active 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    {agent.avatar}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <span className={`font-syne font-bold leading-tight transition-colors ${
                      active ? 'text-brand-text' : 'text-brand-muted'
                    }`}>
                      {s.label}
                    </span>
                    <span className="truncate text-[11px] font-medium text-brand-muted opacity-60">
                      With {agent.name}
                    </span>
                  </div>

                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Help/Support placeholder or empty space for clean look */}
        <div className="mt-auto p-6">
          <div className="rounded-2xl bg-gradient-to-br from-brand-primary/5 to-transparent p-4 border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted opacity-40">Version 1.0</p>
            <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">Har roz kuch naya seekho. 🚀</p>
          </div>
        </div>
      </aside>
    </>
  );
}
