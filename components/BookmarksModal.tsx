'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Search, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Bookmark as BookmarkType } from '@/lib/bookmarks';

interface Props {
  open: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onRemove: (m: BookmarkType) => void;
}

export default function BookmarksModal({ open, onClose, bookmarks, onRemove }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-brand-surface shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/20 text-brand-primary">
                  <Bookmark size={24} fill="currentColor" />
                </div>
                <div>
                  <h2 className="font-syne text-2xl font-bold text-brand-text">Saved Notes</h2>
                  <p className="text-sm text-brand-muted">{bookmarks.length} saved snippets</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brand-muted hover:bg-white/10 hover:text-brand-text transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {bookmarks.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
                  <Bookmark size={64} className="mb-4" />
                  <h3 className="text-xl font-bold">Abhi koi notes nahi hain!</h3>
                  <p className="mt-2 text-sm max-w-xs">AI ki kisi bhi baat par bookmark icon click karein usey yahan save karne ke liye.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {bookmarks.map((b) => (
                    <motion.div
                      key={b.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative flex flex-col gap-3 rounded-3xl border border-white/5 bg-brand-card/50 p-5 transition hover:border-brand-primary/30 hover:bg-brand-card"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                          {b.subjectLabel}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-brand-muted">
                            {new Date(b.savedAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => onRemove(b)}
                            className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full text-brand-secondary/40 hover:bg-brand-secondary/10 hover:text-brand-secondary transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="prose prose-invert prose-sm max-w-none line-clamp-6 text-brand-text/90">
                        <ReactMarkdown>{b.text}</ReactMarkdown>
                      </div>

                      <div className="mt-auto pt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-brand-muted italic">Ustaad Bilal ki wisdom</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
