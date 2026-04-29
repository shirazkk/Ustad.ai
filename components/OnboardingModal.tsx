'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, GraduationCap, School, Sparkles } from 'lucide-react';
import { BOARDS, GRADES, UserEducation } from '@/lib/boards';

interface Props {
  open: boolean;
  onComplete: (edu: UserEducation) => void;
}

export default function OnboardingModal({ open, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState<UserEducation['board']>('Federal');
  const [grade, setGrade] = useState<UserEducation['grade']>('10th');

  const next = () => setStep((s) => s + 1);
  const finish = () => onComplete({ board, grade });

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-brand-surface shadow-2xl"
          >
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 px-8 pt-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? 'w-8 bg-brand-primary'
                      : i < step
                        ? 'w-1.5 bg-brand-primary/60'
                        : 'w-1.5 bg-white/10'
                  }`}
                />
              ))}
            </div>

            <div className="flex min-h-[420px] flex-col px-8 py-8">
              {step === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl gradient-bg shadow-2xl shadow-brand-primary/40">
                    <Sparkles size={36} className="text-white" />
                  </div>
                  <h2 className="font-syne text-3xl font-black text-brand-text">
                    Khush Aamdeed!
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                    Main <span className="font-bold text-brand-primary">Ustaad.ai</span> hoon — tumhara apna Pakistani AI tutor 🇵🇰
                  </p>
                  <p className="mt-2 text-xs text-brand-muted">
                    Pehle thoda tumhare baare mein bata do, taake mein theek se padha sakoon.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-1 flex-col">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/20 text-brand-primary">
                      <School size={20} />
                    </div>
                    <div>
                      <h3 className="font-syne text-xl font-bold text-brand-text">Tumhara Board?</h3>
                      <p className="text-xs text-brand-muted">Syllabus tumhare board ke hisaab se hoga.</p>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto">
                    {BOARDS.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBoard(b)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all ${
                          board === b
                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                            : 'border-white/5 bg-white/5 text-brand-muted hover:border-white/10'
                        }`}
                      >
                        <span>{b}</span>
                        {board === b && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-1 flex-col">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-accent/20 text-brand-accent">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h3 className="font-syne text-xl font-bold text-brand-text">Konsi Class?</h3>
                      <p className="text-xs text-brand-muted">Grade ke hisaab se questions tailor honge.</p>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-3 gap-2 content-start">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`flex items-center justify-between rounded-xl border px-3 py-3 text-sm transition-all ${
                          grade === g
                            ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                            : 'border-white/5 bg-white/5 text-brand-muted hover:border-white/10'
                        }`}
                      >
                        <span>{g}</span>
                        {grade === g && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="border-t border-white/5 p-6">
              {step < 2 ? (
                <button
                  onClick={next}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-bg py-4 font-syne text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  {step === 0 ? 'Shuru Karein' : 'Aage'}
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-bg py-4 font-syne text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  Chalo Padhna Shuru!
                  <Sparkles size={20} fill="currentColor" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
