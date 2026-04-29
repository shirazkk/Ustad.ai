/**
 * Ustad.ai Bookmarks Logic
 * Handles saving and retrieving important messages across subjects.
 */

import { Message } from '@/types';

const STORAGE_KEY = 'ustaad_bookmarks';

export interface Bookmark extends Message {
  subjectId: string;
  subjectLabel: string;
  savedAt: string;
  category: 'Formula' | 'Definition' | 'Concept' | 'General';
}

function detectCategory(text: string): Bookmark['category'] {
  const lower = text.toLowerCase();
  if (/[+\-*/=^√Σπθ]/.test(text) || /\d+/.test(text) && lower.includes('=')) return 'Formula';
  if (lower.includes(' is ') || lower.includes(' means ') || lower.includes(' refers to ') || lower.includes(' kehte hain ')) return 'Definition';
  if (lower.includes('important') || lower.includes('concept') || lower.includes('note') || lower.includes('khayal rahe')) return 'Concept';
  return 'General';
}

/**
 * Saves a message to bookmarks.
 */
export function toggleBookmark(message: Message, subjectId: string, subjectLabel: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const bookmarks = getBookmarks();
  const index = bookmarks.findIndex(b => b.id === message.id);
  
  if (index >= 0) {
    // Remove if already exists
    bookmarks.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return false;
  } else {
    // Add new bookmark
    const newBookmark: Bookmark = {
      ...message,
      subjectId,
      subjectLabel,
      savedAt: new Date().toISOString(),
      category: detectCategory(message.text)
    };
    bookmarks.unshift(newBookmark);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return true;
  }
}

/**
 * Returns all saved bookmarks.
 */
export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load bookmarks:', e);
    return [];
  }
}

/**
 * Checks if a message is already bookmarked.
 */
export function isBookmarked(messageId: string): boolean {
  if (typeof window === 'undefined') return false;
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.id === messageId);
}
