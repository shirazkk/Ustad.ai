'use client';

import { useRef, useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import { getAgent } from '@/lib/agents';
import { useSpeechInput } from '@/hooks/useSpeechInput';
import imageCompression from 'browser-image-compression';
import type { Subject } from '@/types';

interface Props {
  onSend: (text: string) => void;
  onImageUpload: (base64: string | null) => void;
  uploadedImage: string | null;
  disabled: boolean;
  subject: Subject;
}

export default function InputArea({ onSend, onImageUpload, uploadedImage, disabled, subject }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const agent = getAgent(subject.id);
  const { transcript, isListening, startListening, stopListening, supported } = useSpeechInput();

  useEffect(() => {
    if (transcript) {
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      requestAnimationFrame(resize);
    }
  }, [transcript]);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    resize();
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed && !uploadedImage) return;
    if (disabled) return;
    onSend(trimmed);
    setValue('');
    requestAnimationFrame(resize);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5, // 500KB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          onImageUpload(result);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression error:', error);
      // Fallback to original file if compression fails
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          onImageUpload(result);
        }
      };
      reader.readAsDataURL(file);
    }
    
    e.target.value = '';
  };

  const handlePill = (text: string) => {
    if (disabled) return;
    onSend(text);
  };

  return (
    <div className="border-t border-white/5 bg-brand-surface/80 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {agent.quickPills.map((p) => (
            <button
              key={p}
              onClick={() => handlePill(p.replace(/^[^\s]+\s/, ''))}
              disabled={disabled}
              className="shrink-0 rounded-full border border-white/5 bg-brand-card px-3 py-1.5 text-xs text-brand-text transition hover:border-brand-primary/40 hover:text-brand-primary disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {uploadedImage && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img src={uploadedImage} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
              <button
                onClick={() => onImageUpload(null)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-secondary text-xs text-white shadow-md hover:scale-110"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
            <span className="text-xs text-brand-muted">Image attached</span>
          </div>
        )}

        <div className="flex items-end gap-2 rounded-2xl border border-white/5 bg-brand-card px-3 py-2 focus-within:border-brand-primary/50">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-muted transition hover:bg-white/5 hover:text-brand-primary disabled:opacity-50"
            aria-label="Upload image"
          >
            📎
          </button>
          {supported && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={disabled}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition disabled:opacity-50 ${
                isListening
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'text-brand-muted hover:bg-white/5 hover:text-brand-primary'
              }`}
              title="Voice Input"
            >
              🎤
            </button>
          )}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Apna sawaal yahan likho..."
            disabled={disabled}
            className="max-h-[120px] flex-1 resize-none bg-transparent py-2 text-[15px] text-brand-text placeholder:text-brand-muted focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={disabled || (!value.trim() && !uploadedImage)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-bg text-white shadow-lg shadow-brand-primary/30 transition hover:scale-105 disabled:scale-100 disabled:opacity-40"
            aria-label="Send"
          >
            ➤
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-brand-muted">
          Enter dabao bhejne ke liye · Shift+Enter naye line ke liye
        </p>
      </div>
    </div>
  );
}
