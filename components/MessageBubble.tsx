'use client';

import { useState } from 'react';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { getAgent } from '@/lib/agents';
import { useSpeechOutput } from '@/hooks/useSpeechOutput';
import { Bookmark as BookmarkIcon, Copy, Check } from 'lucide-react';
import type { Subject, Message } from '@/types';

interface Props {
  message: Message;
  subject: Subject;
  onBookmark?: (m: Message) => void;
  isBookmarked?: boolean;
  lowData?: boolean;
}

export default function MessageBubble({ message, subject, onBookmark, isBookmarked, lowData }: Props) {
  const agent = getAgent(subject.id);
  const { speak, stop, isSpeaking, supported } = useSpeechOutput();
  const isUser = message.role === 'user';
  const time = message.timestamp ? message.timestamp.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
  }) : '';

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex w-full mb-6 ${!lowData ? 'animate-msg-slide' : ''} ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[85%] items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar with Glow */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xl shadow-lg transition-transform hover:scale-110 ${
            isUser
              ? 'bg-brand-card border border-white/10 text-brand-text'
              : 'gradient-bg text-white shadow-brand-primary/20'
          }`}
        >
          {isUser ? '🧑‍🎓' : agent.avatar}
        </div>

        <div
          className={`group relative flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
        >
          {/* Sender Name & Copy Action */}
          <div className="flex w-full items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted opacity-40">
              {isUser ? 'You' : agent.name}
            </span>
            
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-brand-primary hover:text-brand-accent"
            >
              {copied ? (
                <>
                  <Check size={10} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={10} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div
            className={`relative rounded-3xl px-5 py-4 text-[15px] leading-relaxed shadow-xl ${
              isUser
                ? 'gradient-bg rounded-tr-sm text-white'
                : 'rounded-tl-sm border border-white/5 bg-brand-card/50 backdrop-blur-xl text-brand-text'
            }`}
          >
            {message.imageBase64 && (
              <div className="mb-3 overflow-hidden rounded-2xl border border-white/10 shadow-inner">
                <Image
                  src={
                    message.imageBase64.startsWith('data:')
                      ? message.imageBase64
                      : `data:image/jpeg;base64,${message.imageBase64}`
                  }
                  alt="uploaded"
                  width={400}
                  height={300}
                  unoptimized
                  className="max-h-64 w-auto object-contain"
                />
              </div>
            )}
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.text}</p>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_code]:rounded-lg [&_code]:bg-black/40 [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-xs">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeHighlight]}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-muted">{time}</span>
            {!isUser && supported && (
              <button
                onClick={() => (isSpeaking ? stop() : speak(message.text, agent.gender))}
                className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                  isSpeaking
                    ? 'bg-brand-accent/20 text-brand-accent animate-pulse'
                    : 'text-brand-muted hover:bg-white/5 hover:text-brand-primary'
                }`}
                title={isSpeaking ? "Stop" : "Listen"}
              >
                {isSpeaking ? '⏹️' : '🔊'}
              </button>
            )}

            {!isUser && onBookmark && (
              <button
                onClick={() => onBookmark(message)}
                className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                  isBookmarked
                    ? 'text-brand-primary'
                    : 'text-brand-muted hover:bg-white/5 hover:text-brand-primary'
                }`}
                title={isBookmarked ? "Remove from Notes" : "Save to Notes"}
              >
                <BookmarkIcon size={12} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
