'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Bookmark, X, Flame, Check, School, GraduationCap, Search, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import StreakHeatmap from './StreakHeatmap';
import { getBookmarks } from '@/lib/bookmarks';
import { UserEducation, BOARDS, GRADES } from '@/lib/boards';
import { useEffect } from 'react';
import { SUBJECTS } from '@/lib/subjects';

interface Props {
  open: boolean;
  onClose: () => void;
  education: UserEducation;
  onSaveEducation: (edu: UserEducation) => void;
}

type Tab = 'overview' | 'bookmarks' | 'settings';

export default function LearningHub({ open, onClose, education, onSaveEducation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [localEdu, setLocalEdu] = useState<UserEducation>(education);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  
  const bookmarks = getBookmarks();
  
  const filteredBookmarks = bookmarks.filter(b => {
    const matchesSearch = b.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || b.subjectId === filterSubject;
    return matchesSearch && matchesSubject;
  });

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setLocalEdu(education);
      });
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
        className="relative h-full max-h-[750px] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-brand-surface shadow-2xl"
      >
        <div className="flex h-full flex-col md:flex-row">
          
          {/* Dashboard Rail (Tabs) */}
          <div className="w-full border-b border-white/5 bg-black/20 p-6 md:w-72 md:border-b-0 md:border-r">
            <div className="mb-10 flex flex-col px-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/20 text-brand-primary">
                <LayoutDashboard size={24} />
              </div>
              <h2 className="font-syne text-2xl font-black text-brand-text">Command Center</h2>
              <p className="text-xs text-brand-muted opacity-60">Manage your learning vibe.</p>
            </div>

            <nav className="space-y-2">
              <TabButton 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
                icon={<Flame size={18} />}
                label="Study Stats"
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
                icon={<School size={18} />}
                label="Syllabus Setup"
              />
            </nav>

            <div className="mt-auto pt-10 px-2 hidden md:block">
               <div className="rounded-2xl bg-gradient-to-br from-brand-primary/5 to-transparent p-4 border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted opacity-40">System Status</span>
                  <div className="mt-2 flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                     <span className="text-xs text-brand-text font-bold">All Agents Online</span>
                  </div>
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
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-syne text-lg font-bold text-brand-text">Study Materials</h3>
                    <button
                      onClick={() => {
                        setIsStudyMode(!isStudyMode);
                        setFlashcardIndex(0);
                        setRevealed(false);
                      }}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        isStudyMode 
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                          : 'bg-white/5 text-brand-muted hover:bg-white/10'
                      }`}
                    >
                      <Play size={14} fill={isStudyMode ? "currentColor" : "none"} />
                      {isStudyMode ? 'Stop Revision' : 'Start Revision (Flashcards)'}
                    </button>
                  </div>

                  {!isStudyMode ? (
                    <>
                      {/* Search & Filter Bar */}
                      <div className="flex flex-col gap-3">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                          <input
                            type="text"
                            placeholder="Search your notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-white/5 bg-white/5 py-3 pl-12 pr-4 text-sm text-brand-text placeholder:text-brand-muted/50 focus:border-brand-primary/30 focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <FilterButton 
                            active={filterSubject === 'all'} 
                            onClick={() => setFilterSubject('all')}
                            label="All"
                          />
                          {SUBJECTS.map(s => (
                            <FilterButton 
                              key={s.id}
                              active={filterSubject === s.id} 
                              onClick={() => setFilterSubject(s.id)}
                              label={s.label}
                            />
                          ))}
                        </div>
                      </div>

                      {filteredBookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-brand-muted">
                            <Bookmark size={32} />
                          </div>
                          <p className="text-brand-muted">
                            {searchQuery || filterSubject !== 'all' 
                              ? 'No notes match your filters.' 
                              : 'Abhi tak koi bookmarks nahi hain.'}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {filteredBookmarks.map((b) => (
                            <div key={b.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.05]">
                               <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                     <span className="flex h-6 items-center rounded-lg bg-brand-primary/10 px-2 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                                        {b.subjectId}
                                     </span>
                                     <span className={`flex h-6 items-center rounded-lg px-2 text-[10px] font-bold uppercase tracking-wider ${
                                       b.category === 'Formula' ? 'bg-blue-500/10 text-blue-400' :
                                       b.category === 'Definition' ? 'bg-emerald-500/10 text-emerald-400' :
                                       b.category === 'Concept' ? 'bg-amber-500/10 text-amber-400' :
                                       'bg-white/5 text-brand-muted'
                                     }`}>
                                        {b.category || 'General'}
                                     </span>
                                  </div>
                                  <span className="text-[10px] text-brand-muted opacity-40">{new Date(b.savedAt).toLocaleDateString()}</span>
                               </div>
                               <p className="text-sm leading-relaxed text-brand-text opacity-90">{b.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Flashcard Mode UI */
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="mb-8 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-brand-muted opacity-60">
                          Card {flashcardIndex + 1} of {filteredBookmarks.length}
                        </p>
                      </div>

                      {filteredBookmarks.length > 0 ? (
                        <div className="w-full max-w-lg">
                          <motion.div
                            key={flashcardIndex}
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            className="relative min-h-[300px] w-full cursor-pointer rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-xl transition-all hover:bg-white/[0.06]"
                            onClick={() => setRevealed(!revealed)}
                          >
                             <div className="flex flex-col h-full items-center justify-center text-center">
                               {!revealed ? (
                                  <div className="space-y-4">
                                     <div className="inline-block rounded-full bg-brand-primary/20 px-4 py-1 text-[10px] font-bold text-brand-primary uppercase tracking-tighter">
                                        {filteredBookmarks[flashcardIndex].subjectId} • {filteredBookmarks[flashcardIndex].category}
                                     </div>
                                     <h4 className="font-syne text-xl font-bold text-brand-text">Recall the content...</h4>
                                     <p className="text-sm text-brand-muted">Click to reveal the answer</p>
                                  </div>
                               ) : (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                     <p className="text-lg leading-relaxed text-brand-text">{filteredBookmarks[flashcardIndex].text}</p>
                                  </motion.div>
                               )}
                             </div>
                          </motion.div>

                          <div className="mt-10 flex items-center justify-between">
                            <button
                              disabled={flashcardIndex === 0}
                              onClick={() => { setFlashcardIndex(i => i - 1); setRevealed(false); }}
                              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-brand-muted hover:bg-white/10 disabled:opacity-20"
                            >
                              <ChevronLeft />
                            </button>
                            <button
                              onClick={() => setRevealed(!revealed)}
                              className="rounded-xl border border-white/10 px-8 py-3 font-syne text-sm font-bold text-brand-text hover:bg-white/5"
                            >
                              {revealed ? 'Hide Answer' : 'Show Answer'}
                            </button>
                            <button
                              disabled={flashcardIndex === filteredBookmarks.length - 1}
                              onClick={() => { setFlashcardIndex(i => i + 1); setRevealed(false); }}
                              className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30 disabled:opacity-20"
                            >
                              <ChevronRight />
                            </button>
                          </div>
                        </div>
                      ) : (
                         <p className="text-brand-muted">No cards to study. Try removing filters!</p>
                      )}
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

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
        active
          ? 'bg-brand-primary/20 text-brand-primary ring-1 ring-brand-primary/30'
          : 'bg-white/5 text-brand-muted hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}
