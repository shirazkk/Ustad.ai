'use client';

import { SUBJECTS } from '@/lib/subjects';
import { getAgent } from '@/lib/agents';
import type { Subject } from '@/types';

import { Settings, Flame } from 'lucide-react';

interface Props {
  currentSubject: Subject;
  onSubjectChange: (s: Subject) => void;
  onOpenSettings: () => void;
  streak: number;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentSubject, onSubjectChange, onOpenSettings, streak, open, onClose }: Props) {
  return (
    <>
      {/* Mobile backdrop - Deep Glass */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-md transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-[280px] flex-col border-r border-white/5 bg-brand-surface/40 backdrop-blur-3xl transition-transform duration-500 ease-out md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-bg text-xl font-black text-white shadow-lg shadow-brand-primary/20">
              U
            </div>
            <h1 className="font-syne text-xl font-extrabold tracking-tight text-brand-text">
              Ustaad<span className="text-brand-primary">.ai</span>
            </h1>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-text md:hidden">
            ✕
          </button>
        </div>

        {/* Subjects Section */}
        <div className="flex-1 overflow-y-auto px-4 chat-scroll">
          <div className="mb-4 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted opacity-40">
            Padhai ka Samaa
          </div>
          
          <nav className="space-y-1.5">
            {SUBJECTS.map((s) => {
              const active = s.id === currentSubject.id;
              const agent = getAgent(s.id);
              
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSubjectChange(s);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={`group relative flex w-full items-center gap-4 rounded-[20px] p-3 transition-all duration-300 ${
                    active 
                      ? 'bg-brand-primary/10 text-brand-text ring-1 ring-brand-primary/20' 
                      : 'text-brand-muted hover:bg-white/5 hover:text-brand-text'
                  }`}
                >
                  {/* Subject Avatar Container */}
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-xl transition-all duration-300 ${
                    active 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    {agent.avatar}
                  </div>

                  <div className="flex flex-col text-left">
                    <span className={`font-syne text-[13px] font-bold tracking-wide transition-colors ${
                      active ? 'text-brand-text' : 'text-brand-muted group-hover:text-brand-text'
                    }`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] font-bold text-brand-muted opacity-40">
                      Master {agent.name}
                    </span>
                  </div>

                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Activity & Settings Section (The Bottom Section) */}
        <div className="mt-auto border-t border-white/5 bg-black/20 p-6">
           <div className="mb-6 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted opacity-40">Your Progress</span>
                 <div className="mt-1 flex items-center gap-1.5 text-orange-400">
                    <Flame size={14} fill="currentColor" className="animate-pulse" />
                    <span className="font-syne text-sm font-black">{streak} DIN STREAK</span>
                 </div>
              </div>
           </div>

           <button
             onClick={onOpenSettings}
             className="flex w-full items-center gap-3 rounded-2xl bg-white/5 px-4 py-3.5 text-xs font-bold text-brand-muted transition-all hover:bg-brand-primary/10 hover:text-brand-primary hover:ring-1 hover:ring-brand-primary/30"
           >
             <Settings size={16} />
             <span>Syllabus Settings</span>
           </button>
        </div>
      </aside>
    </>
  );
}
