'use client';

import { SUBJECTS } from '@/lib/subjects';
import { getAgent } from '@/lib/agents';
import type { Subject } from '@/types';

interface Props {
  currentSubject: Subject;
  streak: number;
  onSubjectChange: (s: Subject) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentSubject, streak, onSubjectChange, open, onClose }: Props) {
  const agent = getAgent(currentSubject.id);

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
        className={`fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-white/5 bg-brand-surface/95 backdrop-blur-xl transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
          <h1 className="font-syne text-2xl font-bold gradient-text">Ustaad.ai</h1>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text md:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Tutor card */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-brand-card p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-2xl animate-avatar-pulse">
              {agent.avatar}
            </div>
            <div className="flex-1">
              <div className="font-syne font-semibold text-brand-text">{agent.name}</div>
              <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                <span className="h-2 w-2 rounded-full bg-brand-accent" />
                Online · Ready to teach
              </div>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="flex-1 overflow-y-auto px-3 chat-scroll">
          <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Subjects
          </div>
          <nav className="flex flex-col gap-1">
            {SUBJECTS.map((s) => {
              const active = s.id === currentSubject.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSubjectChange(s)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? 'bg-brand-primary/15 text-brand-text ring-1 ring-brand-primary/40'
                      : 'text-brand-muted hover:bg-white/5 hover:text-brand-text'
                  }`}
                >
                  {(() => {
                    const a = getAgent(s.id);
                    return (
                      <>
                        <span className="text-lg">{a.avatar}</span>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-medium">{s.label}</span>
                          <span className="truncate text-[10px] text-brand-muted">
                            {a.name} · {a.tagline}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-primary" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Streak */}
        <div className="border-t border-white/5 px-5 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-3">
            <div className="text-2xl">🔥</div>
            <div className="flex-1">
              <div className="font-syne text-lg font-bold text-brand-gold">{streak} din</div>
              <div className="text-xs text-brand-muted">ka streak chal raha hai!</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
