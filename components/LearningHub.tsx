'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Bookmark, Settings, X, Flame, Check, School, GraduationCap } from 'lucide-react';
import StreakHeatmap from './StreakHeatmap';
import { getBookmarks } from '@/lib/bookmarks';
import { UserEducation, BOARDS, GRADES } from '@/lib/boards';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  streak: number;
  education: UserEducation;
  onSaveEducation: (edu: UserEducation) => void;
}

type Tab = 'overview' | 'bookmarks' | 'settings';

export default function LearningHub({ open, onClose, streak, education, onSaveEducation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [localEdu, setLocalEdu] = useState<UserEducation>(education);
  const bookmarks = getBookmarks();

  useEffect(() => {
    if (open) {
      setLocalEdu(education);
    }
  }, [open, education]);

  const handleUpdateSyllabus = () => {
    onSaveEducation(localEdu);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Hub Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative h-full max-h-[700px] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-brand-surface shadow-2xl"
      >
        <div className="flex h-full flex-col md:flex-row">
          
          {/* Internal Sidebar (Tabs) */}
          <div className="w-full border-b border-white/5 bg-white/[0.02] p-6 md:w-64 md:border-b-0 md:border-r">
            <div className="mb-8 flex items-center justify-between px-2">
              <h2 className="font-syne text-xl font-bold text-brand-text">Learning Hub</h2>
              <button onClick={onClose} className="text-brand-muted hover:text-brand-text md:hidden">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              <TabButton 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
                icon={<LayoutDashboard size={18} />}
                label="Overview"
              />
              <TabButton 
                active={activeTab === 'bookmarks'} 
                onClick={() => setActiveTab('bookmarks')}
                icon={<Bookmark size={18} />}
                label="Saved Notes"
                count={bookmarks.length}
              />
              <TabButton 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
                icon={<Settings size={18} />}
                label="Syllabus"
              />
            </nav>

            {/* Hub Stats Footer */}
            <div className="mt-auto hidden pt-8 md:block px-2">
              <div className="rounded-2xl bg-brand-primary/10 p-4 border border-brand-primary/20">
                <div className="flex items-center gap-2 text-brand-primary mb-1">
                  <Flame size={16} fill="currentColor" />
                  <span className="font-syne font-bold text-sm">{streak} Day Streak</span>
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">Shabaash! Aap bahut acha perform kar rahe hain.</p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 chat-scroll">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <section>
                    <h3 className="mb-6 font-syne text-lg font-bold text-brand-text">Study Progress</h3>
                    <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
                      <StreakHeatmap />
                    </div>
                  </section>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Board</span>
                      <p className="mt-1 font-syne text-xl font-bold text-brand-text">{education.board} Board</p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Grade</span>
                      <p className="mt-1 font-syne text-xl font-bold text-brand-text">{education.grade} Class</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bookmarks' && (
                <motion.div
                  key="bookmarks"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {/* Reuse or inline Bookmarks logic */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-syne text-lg font-bold text-brand-text">Your Saved Notes</h3>
                    <span className="text-xs text-brand-muted">{bookmarks.length} saved</span>
                  </div>
                  
                  {bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-brand-muted">
                        <Bookmark size={32} />
                      </div>
                      <p className="text-brand-muted">Abhi tak koi bookmarks nahi hain.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {bookmarks.map((b) => (
                        <div key={b.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
                           <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                              <span>{b.subjectId}</span>
                              <span className="opacity-30">•</span>
                              <span className="text-brand-muted">{new Date(b.timestamp).toLocaleDateString()}</span>
                           </div>
                           <p className="text-sm leading-relaxed text-brand-text opacity-80">{b.text.slice(0, 150)}...</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-10 pb-10"
                >
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/20 text-brand-primary">
                        <School size={20} />
                      </div>
                      <h3 className="font-syne text-lg font-bold text-brand-text">Educational Board</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BOARDS.map((b) => (
                        <button
                          key={b}
                          onClick={() => setLocalEdu({ ...localEdu, board: b })}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-sm transition-all ${
                            localEdu.board === b
                              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                              : 'border-white/5 bg-white/5 text-brand-muted hover:border-white/10'
                          }`}
                        >
                          <span className="font-bold">{b}</span>
                          {localEdu.board === b && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/20 text-brand-accent">
                        <GraduationCap size={20} />
                      </div>
                      <h3 className="font-syne text-lg font-bold text-brand-text">Grade / Class</h3>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {GRADES.map((g) => (
                        <button
                          key={g}
                          onClick={() => setLocalEdu({ ...localEdu, grade: g })}
                          className={`flex items-center justify-center rounded-xl border px-3 py-3 text-sm transition-all ${
                            localEdu.grade === g
                              ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                              : 'border-white/5 bg-white/5 text-brand-muted hover:border-white/10'
                          }`}
                        >
                          <span className="font-bold">{g}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-syne font-bold text-brand-text">Low-Data Mode</h3>
                          <p className="text-xs text-brand-muted mt-1">Slow internet? Use this for shorter answers.</p>
                        </div>
                        <button
                          onClick={() => setLocalEdu({ ...localEdu, lowData: !localEdu.lowData })}
                          className={`relative h-7 w-12 rounded-full transition-colors ${
                            localEdu.lowData ? 'bg-brand-primary' : 'bg-white/10'
                          }`}
                        >
                          <motion.div
                            animate={{ x: localEdu.lowData ? 22 : 4 }}
                            className="h-5 w-5 rounded-full bg-white shadow-sm"
                          />
                        </button>
                      </div>
                    </div>
                  </section>

                  <div className="pt-4">
                    <button 
                      onClick={handleUpdateSyllabus}
                      className="w-full py-4 gradient-bg rounded-2xl font-syne font-bold text-white shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.01] active:scale-95"
                    >
                      Update My Syllabus
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Close Button Desktop */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 hidden h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brand-muted transition hover:bg-white/10 hover:text-brand-text md:flex"
        >
          <X size={20} />
        </button>
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-brand-primary/15 text-brand-text shadow-sm' 
          : 'text-brand-muted hover:bg-white/5 hover:text-brand-text'
      }`}
    >
      <span className={active ? 'text-brand-primary' : 'text-brand-muted opacity-60'}>{icon}</span>
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/20 text-[10px] font-bold text-brand-primary">
          {count}
        </span>
      )}
    </button>
  );
}
