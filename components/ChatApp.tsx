'use client';

import { useCallback, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';
import QuizModal from './QuizModal';
import { SUBJECTS } from '@/lib/subjects';
import { getAgent } from '@/lib/agents';
import { saveMessages, loadMessages, clearMessages } from '@/lib/storage';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [streak, setStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? 0 : n;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial load on mount
  useEffect(() => {
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
    }
  }, []);

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
            return m.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: fallback } : msg,
            );
          }
          return [...m, { id: aiMsgId, role: 'ai', text: fallback, timestamp: new Date() }];
        });
        return;
      }

      const aiGemini: GeminiMessage = { role: 'model', parts: [{ text: aiText }] };
      setGeminiHistory((h) => [...h, userGemini, aiGemini]);
    },
    [currentSubject.id, geminiHistory, isLoading, uploadedImage],
  );

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar
        currentSubject={currentSubject}
        streak={streak}
        onSubjectChange={handleSubjectChange}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <ChatHeader
          subject={currentSubject}
          onOpenQuiz={() => setShowQuiz(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
          onClearChat={handleClearChat}
        />
        <MessageList
          messages={messages}
          isLoading={isLoading}
          subject={currentSubject}
          onQuickSend={sendMessage}
        />
        <InputArea
          onSend={sendMessage}
          onImageUpload={setUploadedImage}
          uploadedImage={uploadedImage}
          disabled={isLoading}
          subject={currentSubject}
        />
      </main>

      <QuizModal
        open={showQuiz}
        subject={currentSubject}
        onClose={() => setShowQuiz(false)}
        onCorrect={() => persistStreak(streak + 1)}
      />
    </div>
  );
}
