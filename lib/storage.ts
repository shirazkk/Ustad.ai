import { Message } from '@/types';

const STORAGE_PREFIX = 'ustaad_chat_';

export function saveMessages(subjectId: string, messages: Message[]) {
  if (typeof window === 'undefined') return;
  
  try {
    // Keep only the last 50 messages to avoid localStorage quota issues
    const trimmed = messages.slice(-50);
    localStorage.setItem(`${STORAGE_PREFIX}${subjectId}`, JSON.stringify(trimmed));
  } catch (e) {
    console.error('[storage] Failed to save messages:', e);
  }
}

export function loadMessages(subjectId: string): Message[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${subjectId}`);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw) as (Message & { timestamp: string })[];
    // Convert string timestamps back to Date objects
    return parsed.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }));
  } catch (e) {
    console.error('[storage] Failed to load messages:', e);
    return [];
  }
}

export function clearMessages(subjectId: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${STORAGE_PREFIX}${subjectId}`);
}
