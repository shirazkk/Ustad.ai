'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, GraduationCap, School, Check } from 'lucide-react';
import { BOARDS, GRADES, UserEducation, saveEducation, getEducation } from '@/lib/boards';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (edu: UserEducation) => void;
}

export default function SettingsModal({ open, onClose, onSave }: Props) {
  const [education, setEducation] = useState<UserEducation>({ board: 'Federal', grade: '10th', lowData: false });

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setEducation(getEducation());
      });
    }
  }, [open]);

  const handleSave = () => {
    saveEducation(education);
    onSave(education);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-brand-surface shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-secondary/20 text-brand-secondary">
                  <Settings size={24} />
                </div>
                <div>
                  <h2 className="font-syne text-2xl font-bold text-brand-text">Settings</h2>
                  <p className="text-sm text-brand-muted">Apna Board aur Grade select karein</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brand-muted hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Board Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-muted">
                  <School size={14} />
                  <span>Educational Board</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {BOARDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setEducation({ ...education, board: b })}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all ${
                        education.board === b
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                          : 'border-white/5 bg-white/5 text-brand-muted hover:border-white/10'
                      }`}
                    >
                      <span>{b}</span>
                      {education.board === b && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grade Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-muted">
                  <GraduationCap size={14} />
                  <span>Grade / Class</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setEducation({ ...education, grade: g })}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${
                        education.grade === g
                          ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                          : 'border-white/5 bg-white/5 text-brand-muted hover:border-white/10'
                      }`}
                    >
                      <span>{g}</span>
                      {education.grade === g && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Low-Data Mode */}
              <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-syne font-bold text-brand-text">Low-Data Mode</h3>
                    <p className="text-xs text-brand-muted mt-1">Slow internet? Use this for shorter answers and less data usage.</p>
                  </div>
                  <button
                    onClick={() => setEducation({ ...education, lowData: !education.lowData })}
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      education.lowData ? 'bg-brand-primary' : 'bg-white/10'
                    }`}
                  >
                    <motion.div
                      animate={{ x: education.lowData ? 22 : 4 }}
                      className="h-5 w-5 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 p-6">
              <button
                onClick={handleSave}
                className="w-full rounded-2xl gradient-bg py-4 font-syne text-lg font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
