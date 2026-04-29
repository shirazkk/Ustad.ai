'use client';

import { Menu, LayoutDashboard, Sparkles, Share2 } from 'lucide-react';
import { chatToMarkdown, shareChat } from '@/lib/share';

import { useCallback, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';
import QuizModal from './QuizModal';
import BookmarksModal from './BookmarksModal';
import { SUBJECTS } from '@/lib/subjects';
import { getAgent } from '@/lib/agents';
import { saveMessages, loadMessages, clearMessages } from '@/lib/storage';
import { recordActivity, getStreak } from '@/lib/streak';
import { toggleBookmark, getBookmarks } from '@/lib/bookmarks';
import { UserEducation, getEducation, saveEducation, hasOnboarded, markOnboarded } from '@/lib/boards';
import LearningHub from './LearningHub';
import SettingsModal from './SettingsModal';
import OnboardingModal from './OnboardingModal';
import type { GeminiMessage, Message, Subject } from '@/types';

function syncGeminiHistory(messages: Message[]): GeminiMessage[] {
  const history: GeminiMessage[] = [];
  messages.forEach((m) => {
    if (m.role === 'user') {
      history.push({
        role: 'user',
        parts: [{ text: m.text }],
      });
    } else {
      history.push({
        role: 'model',
        parts: [{ text: m.text }],
      });
    }
  });
  return history;
}

const STREAK_KEY = 'ustaad_streak';

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ChatApp() {
  const [currentSubject, setCurrentSubject] = useState<Subject>(SUBJECTS[0]);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    const history = loadMessages(SUBJECTS[0].id);
    if (history.length > 0) return history;
    const agent = getAgent(SUBJECTS[0].id);
    return [
      {
        id: makeId(),
        role: 'ai',
        text: `${agent.name} ne join kiya 👋`,
        timestamp: new Date(),
      },
    ];
  });

  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    const history = loadMessages(SUBJECTS[0].id);
    return syncGeminiHistory(history);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const [streak, setStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    return getStreak();
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [education, setEducation] = useState<UserEducation>(() => {
    if (typeof window === 'undefined') return { board: 'Federal', grade: '10th' };
    return getEducation();
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showHub, setShowHub] = useState(false);
  
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const saved = getBookmarks();
    return new Set(saved.map(b => b.id));
  });

  const [showBookmarks, setShowBookmarks] = useState(false);

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !hasOnboarded();
  });

  // Sync state when subject changes
  useEffect(() => {
    requestAnimationFrame(() => {
      const history = loadMessages(currentSubject.id);
      if (history.length > 0) {
        setMessages(history);
        setGeminiHistory(syncGeminiHistory(history));
      } else {
        const agent = getAgent(currentSubject.id);
        setMessages([
          {
            id: makeId(),
            role: 'ai',
            text: `${agent.name} ne join kiya 👋`,
            timestamp: new Date(),
          },
        ]);
        setGeminiHistory([]);
      }
    });
  }, [currentSubject.id]);

  const handleBookmark = (message: Message) => {
    toggleBookmark(message, currentSubject.id, currentSubject.label);
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(message.id)) next.delete(message.id);
      else next.add(message.id);
      return next;
    });
  };

  // Auto-save messages
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(currentSubject.id, messages);
    }
  }, [messages, currentSubject.id]);

  const persistStreak = (n: number) => {
    setStreak(n);
    try {
      localStorage.setItem(STREAK_KEY, String(n));
    } catch {
      // ignore quota errors
    }
  };

  const handleSubjectChange = (s: Subject) => {
    if (s.id === currentSubject.id) {
      setSidebarOpen(false);
      return;
    }
    
    const history = loadMessages(s.id);
    setCurrentSubject(s);
    setUploadedImage(null);
    setSidebarOpen(false);

    if (history.length > 0) {
      setMessages(history);
      setGeminiHistory(syncGeminiHistory(history));
    } else {
      const agent = getAgent(s.id);
      setMessages([
        {
          id: makeId(),
          role: 'ai',
          text: `${agent.name} ne join kiya 👋`,
          timestamp: new Date(),
        },
      ]);
      setGeminiHistory([]);
    }
  };

  const handleClearChat = () => {
    if (confirm('Kya aap waqai saari chat clear karna chahte hain?')) {
      clearMessages(currentSubject.id);
      const agent = getAgent(currentSubject.id);
      setMessages([
        {
          id: makeId(),
          role: 'ai',
          text: `${agent.name} ne join kiya 👋`,
          timestamp: new Date(),
        },
      ]);
      setGeminiHistory([]);
    }
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed && !uploadedImage) return;
      if (isLoading) return;

      const imageForTurn = uploadedImage;
      const userMsgId = makeId();
      const aiMsgId = makeId();

      const userMessage: Message = {
        id: userMsgId,
        role: 'user',
        text: trimmed,
        imageBase64: imageForTurn ?? undefined,
        timestamp: new Date(),
      };

      // Build the user turn for Gemini history
      const userGemini: GeminiMessage = {
        role: 'user',
        parts: [
          ...(trimmed ? [{ text: trimmed }] : []),
          ...(imageForTurn
            ? [
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageForTurn.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
                  },
                },
              ]
            : []),
        ],
      };

      setMessages((m) => [...m, userMessage]);
      setUploadedImage(null);
      setIsLoading(true);

      // Phase 5.2: Record activity and update streak
      recordActivity();
      setStreak(getStreak());

      const historyForApi: GeminiMessage[] = geminiHistory;

      let aiText = '';
      let succeeded = false;
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: historyForApi,
            message: trimmed,
            imageBase64: imageForTurn ?? undefined,
            subject: currentSubject.id,
            education,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`status ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let bubbleInserted = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          aiText += chunk;
          if (!bubbleInserted) {
            bubbleInserted = true;
            setIsLoading(false);
            setMessages((m) => [
              ...m,
              { id: aiMsgId, role: 'ai', text: aiText, timestamp: new Date() },
            ]);
          } else {
            setMessages((m) =>
              m.map((msg) => (msg.id === aiMsgId ? { ...msg, text: aiText } : msg)),
            );
          }
        }
        succeeded = aiText.length > 0;
      } catch (err) {
        console.error('[chat] fetch error:', err);
      } finally {
        setIsLoading(false);
      }

        if (!succeeded) {
          const fallback = 'Yaar internet ka masla lag raha hai! 😅 Dobara try karo.';
          setMessages((m) => {
            const exists = m.some((msg) => msg.id === aiMsgId);
            if (exists) {
              return m.map((msg) => (msg.id === aiMsgId ? { ...msg, text: fallback } : msg));
            }
            return [
              ...m,
              { id: aiMsgId, role: 'ai', text: fallback, timestamp: new Date() },
            ];
          });
        } else {
          // Sync back to storage and gemini history
          setGeminiHistory((prev) => [
            ...prev,
            userGemini,
            { role: 'model', parts: [{ text: aiText }] },
          ]);
          saveMessages(currentSubject.id, [
            ...messages,
            userMessage,
            { id: aiMsgId, role: 'ai', text: aiText, timestamp: new Date() },
          ]);
        }
      },
      [uploadedImage, isLoading, geminiHistory, currentSubject.id, education, messages],
    );

  return (
    <div className="flex h-dvh w-full bg-brand-bg text-brand-text overflow-hidden">
      <Sidebar
        currentSubject={currentSubject}
        onSubjectChange={handleSubjectChange}
        onOpenSettings={() => setShowSettings(true)}
        streak={streak}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <ChatHeader
          subject={currentSubject}
          messages={messages}
          onOpenQuiz={() => setShowQuiz(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenHub={() => setShowHub(true)}
          onClearChat={handleClearChat}
        />
        <MessageList
          messages={messages}
          isLoading={isLoading}
          subject={currentSubject}
          onQuickSend={sendMessage}
          onBookmark={handleBookmark}
          bookmarkedIds={bookmarkedIds}
        />
        <InputArea
          onSend={sendMessage}
          onImageUpload={setUploadedImage}
          uploadedImage={uploadedImage}
          disabled={isLoading}
          subject={currentSubject}
        />

        {/* Mobile Bottom Navigation - Reachability Optimized */}
        <nav className="flex h-16 w-full items-center justify-around border-t border-white/5 bg-brand-surface/80 px-4 pb-safe backdrop-blur-xl md:hidden">
           <button
             onClick={() => setSidebarOpen(true)}
             className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand-primary"
           >
             <Menu size={20} />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Subjects</span>
           </button>

           <button
             onClick={() => setShowHub(true)}
             className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand-primary"
           >
             <LayoutDashboard size={20} />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Hub</span>
           </button>

           <button
             onClick={() => setShowQuiz(true)}
             className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-white shadow-lg shadow-brand-primary/20 -translate-y-4 border-4 border-brand-bg"
             aria-label="Quiz"
           >
              <Sparkles size={20} fill="currentColor" />
           </button>

           <button
             onClick={async () => {
               if (messages.length < 2) return;
               const agent = getAgent(currentSubject.id);
               const md = chatToMarkdown(messages, currentSubject.label, agent.name);
               await shareChat(md, currentSubject.label);
             }}
             disabled={messages.length < 2}
             className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand-primary disabled:opacity-30"
           >
             <Share2 size={20} />
             <span className="text-[10px] font-bold uppercase tracking-tighter">Share</span>
           </button>

           <button
             onClick={() => setShowBookmarks(true)}
             className="flex flex-col items-center gap-1 text-brand-muted hover:text-brand-primary"
           >
             <div className="h-5 w-5 rounded-md border-2 border-current flex items-center justify-center text-[10px] font-black">★</div>
             <span className="text-[10px] font-bold uppercase tracking-tighter">Notes</span>
           </button>
        </nav>
      </main>

      <QuizModal
        open={showQuiz}
        subject={currentSubject}
        education={education}
        onClose={() => setShowQuiz(false)}
        onCorrect={() => persistStreak(streak + 1)}
      />
      
      <LearningHub
        open={showHub}
        onClose={() => setShowHub(false)}
        education={education}
        onSaveEducation={(edu) => {
          setEducation(edu);
          saveEducation(edu);
        }}
      />

      {/* Kept for legacy/direct access if needed, but primary access is via Hub */}
      <BookmarksModal
        open={showBookmarks}
        bookmarks={getBookmarks()}
        onClose={() => setShowBookmarks(false)}
        onRemove={handleBookmark}
      />
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={setEducation}
      />

      <OnboardingModal
        open={showOnboarding}
        onComplete={(edu) => {
          setEducation(edu);
          saveEducation(edu);
          markOnboarded();
          setShowOnboarding(false);
        }}
      />
    </div>
  );
}
