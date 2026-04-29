'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getAgent } from '@/lib/agents';
import { UserEducation } from '@/lib/boards';
import type { QuizQuestion, Subject } from '@/types';

interface Props {
  open: boolean;
  subject: Subject;
  education: UserEducation;
  onClose: () => void;
  onCorrect: () => void;
}

type Mode = 'setup' | 'playing' | 'result';
type Status = 'loading' | 'ready' | 'answered' | 'error';

const TOTAL_QUESTIONS = 10;

export default function QuizModal({ open, subject, education, onClose, onCorrect }: Props) {
  const [mode, setMode] = useState<Mode>('setup');
  const [status, setStatus] = useState<Status>('loading');
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<boolean[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const agent = getAgent(subject.id);

  const [streak, setStreak] = useState(0); // Tracking consecutive correct/incorrect answers

  // Reset states when modal opens
  useEffect(() => {
    if (open) {
      // Use requestAnimationFrame to avoid synchronous setState in effect warning
      requestAnimationFrame(() => {
        setMode('setup');
        setStatus('ready');
        setTopic('');
        setQuiz(null);
        setSelected(null);
        setCurrentIdx(0);
        setScore(0);
        setStreak(0);
        setSessionHistory([]);
      });
    }
  }, [open]);

  const fetchNextQuestion = useCallback(async (currentTopic: string) => {
    setStatus('loading');
    setSelected(null);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: subject.id,
          topic: currentTopic || undefined,
          streak: streak,
          education,
        }),
      });
      const data = (await res.json()) as { quiz: QuizQuestion | null };
      if (data.quiz) {
        setQuiz(data.quiz);
        setStatus('ready');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }, [subject.id, streak, education]);

  const startQuiz = () => {
    setMode('playing');
    setCurrentIdx(1);
    fetchNextQuestion(topic);
  };

  const handleSelect = (idx: number) => {
    if (status !== 'ready' || !quiz) return;
    setSelected(idx);
    setStatus('answered');
    
    const correct = idx === quiz.correct;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => Math.max(0, s) + 1);
      onCorrect();
    } else {
      setStreak(s => Math.min(0, s) - 1);
    }
    setSessionHistory(prev => [...prev, correct]);
  };

  const handleNext = () => {
    if (currentIdx < TOTAL_QUESTIONS) {
      setCurrentIdx(prev => prev + 1);
      fetchNextQuestion(topic);
    } else {
      setMode('result');
      saveResult();
    }
  };

  const saveResult = () => {
    const result = {
      date: new Date().toISOString(),
      subject: subject.label,
      topic: topic || 'General',
      score,
      total: TOTAL_QUESTIONS
    };
    try {
      const existing = JSON.parse(localStorage.getItem('ustaad_quiz_history') || '[]');
      localStorage.setItem('ustaad_quiz_history', JSON.stringify([result, ...existing].slice(0, 20)));
    } catch (e) {
      console.error('Failed to save quiz result', e);
    }
  };

  const shareResult = () => {
    const text = `Yaar! Maine Ustaad.ai par ${subject.label} (${topic || 'General'}) ka quiz diya aur mera score ${score}/${TOTAL_QUESTIONS} aya! 🔥🔥 #UstaadAI`;
    if (navigator.share) {
      navigator.share({ title: 'Ustaad.ai Quiz Result', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Result copy ho gaya! Ab kahin bhi share karo 🚀');
    }
  };

  if (!open) return null;

  const isCorrect = selected !== null && quiz !== null && selected === quiz.correct;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto chat-scroll rounded-3xl border border-white/10 bg-brand-surface shadow-[0_0_50px_-12px_rgba(108,99,255,0.3)] animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="absolute left-0 top-0 h-1 w-full gradient-bg opacity-50" />
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-brand-muted hover:bg-white/10 hover:text-brand-text transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-8">
          {/* TOPIC SELECTION MODE */}
          {mode === 'setup' && (
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-3xl shadow-lg">
                  ⚡
                </div>
                <div>
                  <h2 className="font-syne text-2xl font-bold text-brand-text">Quiz Time!</h2>
                  <p className="text-sm text-brand-muted">Subject: {subject.label}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-brand-muted">
                  Kis topic par quiz chahiye? (Optional)
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Gravity, Tenses, Loops..."
                  className="w-full rounded-2xl border border-white/10 bg-brand-card px-5 py-4 text-brand-text placeholder:text-brand-muted/50 focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/50"
                  onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {agent.starterPrompts.slice(0, 3).map(p => (
                    <button
                      key={p.text}
                      onClick={() => setTopic(p.text.split('?')[0])}
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-[11px] text-brand-muted hover:border-brand-primary/30 hover:bg-brand-primary/10 hover:text-brand-primary transition-all"
                    >
                      {p.text.split('?')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl gradient-bg py-4 font-syne text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Shuru Karo</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          )}

          {/* PLAYING MODE */}
          {mode === 'playing' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{subject.emoji}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">Question {currentIdx} of {TOTAL_QUESTIONS}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        i + 1 < currentIdx ? (sessionHistory[i] ? 'bg-brand-accent' : 'bg-brand-secondary') :
                        i + 1 === currentIdx ? 'bg-brand-primary animate-pulse' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {status === 'loading' && (
                <div className="space-y-4 py-10">
                  <div className="h-6 w-3/4 animate-pulse rounded-full bg-white/5" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/5" />)}
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="py-12 text-center">
                  <div className="mb-4 text-4xl">😅</div>
                  <p className="text-brand-text font-medium">Network ka issue lag raha hai!</p>
                  <button onClick={() => fetchNextQuestion(topic)} className="mt-6 rounded-full gradient-bg px-8 py-3 text-sm font-bold text-white">Retry</button>
                </div>
              )}

              {(status === 'ready' || status === 'answered') && quiz && (
                <div className="animate-msg-slide">
                  <h3 className="mb-6 font-syne text-xl font-bold leading-tight text-brand-text">
                    {quiz.question}
                  </h3>

                  <div className="flex flex-col gap-3">
                    {quiz.options.map((opt, idx) => {
                      let cls = 'border-white/5 bg-brand-card hover:border-brand-primary/30';
                      if (status === 'answered') {
                        if (idx === quiz.correct) cls = 'border-brand-accent/50 bg-brand-accent/10 text-brand-accent';
                        else if (idx === selected) cls = 'border-brand-secondary/50 bg-brand-secondary/10 text-brand-secondary';
                        else cls = 'border-white/5 bg-brand-card/30 text-brand-muted opacity-50';
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          disabled={status === 'answered'}
                          className={`relative flex items-center gap-4 rounded-2xl border px-5 py-4 text-left text-[15px] transition-all duration-200 ${cls}`}
                        >
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold ${status === 'answered' && idx === quiz.correct ? 'bg-brand-accent/20' : 'bg-white/5'}`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 font-medium">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {status === 'answered' && (
                    <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-brand-card/30 backdrop-blur-xl animate-msg-slide shadow-2xl">
                      <div className="flex gap-4 p-6">
                         {/* Ustaad Avatar with pulse if correct */}
                         <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-lg ${isCorrect ? 'gradient-bg shadow-brand-primary/40' : 'bg-white/5 opacity-80'}`}>
                            {agent.avatar}
                         </div>
                         
                         <div className="flex flex-1 flex-col pt-1">
                            <div className={`mb-2 font-syne text-[10px] font-black uppercase tracking-[0.2em] ${isCorrect ? 'text-brand-accent' : 'text-brand-secondary'}`}>
                              {agent.name} says:
                            </div>
                            <p className="text-[15px] leading-relaxed text-brand-text">
                              {isCorrect ? quiz.explanation_correct : quiz.explanation_wrong}
                            </p>
                         </div>
                      </div>

                      <div className="bg-white/5 p-4">
                        <button
                          onClick={handleNext}
                          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl gradient-bg py-4 font-syne text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-95"
                        >
                          <span>{currentIdx === TOTAL_QUESTIONS ? 'Result Dekho' : 'Agla Sawaal'}</span>
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RESULT MODE */}
          {mode === 'result' && (
            <div className="flex flex-col items-center py-6 text-center animate-modal-in">
              <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-brand-primary/20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-4xl shadow-2xl">
                  {score >= 8 ? '🏆' : score >= 5 ? '⭐' : '📚'}
                </div>
              </div>

              <h2 className="font-syne text-3xl font-bold gradient-text">Mubarak Ho!</h2>
              <p className="mt-2 text-brand-muted">Aapne {subject.label} ka quiz mukammal kar liya.</p>

              <div className="my-10 grid w-full grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/5 bg-brand-card p-6">
                  <div className="text-3xl font-bold text-brand-text">{score}</div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-muted">Correct</div>
                </div>
                <div className="rounded-3xl border border-white/5 bg-brand-card p-6">
                  <div className="text-3xl font-bold text-brand-text">{Math.round((score/TOTAL_QUESTIONS)*100)}%</div>
                  <div className="text-[10px] uppercase tracking-widest text-brand-muted">Accuracy</div>
                </div>
              </div>

              <p className="mb-10 max-w-xs text-sm italic text-brand-muted">
                &quot;{score >= 8 ? 'Ustaad Bilal proud hain tum par! Agay barhte raho.' : 
                  score >= 5 ? 'Acha khelay! Thori si mehnat aur chahiye bas.' : 
                  'Yaar koi baat nahi, agli baar behtar hoga. Practice makes perfect!'}&quot;
              </p>

              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={shareResult}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-accent/30 bg-brand-accent/10 py-4 font-syne text-sm font-bold text-brand-accent hover:bg-brand-accent/20 transition-all"
                >
                  📤 Doston se share karo
                </button>
                <button
                  onClick={onClose}
                  className="w-full rounded-2xl bg-white/5 py-4 font-syne text-sm font-bold text-brand-muted hover:bg-white/10 hover:text-brand-text transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
