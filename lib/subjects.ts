import type { Subject } from '@/types';

export const SUBJECTS: Subject[] = [
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'math', label: 'Mathematics', emoji: '📐' },
  { id: 'english', label: 'English', emoji: '📚' },
  { id: 'urdu', label: 'Urdu', emoji: '✍️' },
  { id: 'history', label: 'History / Pakistan Studies', emoji: '🗺️' },
  { id: 'cs', label: 'Computer Science', emoji: '💻' },
];

export const STARTER_PROMPTS = [
  { emoji: '🌱', text: 'Photosynthesis kya hoti hai?' },
  { emoji: '📐', text: 'Pythagorean theorem samjhao' },
  { emoji: '🇵🇰', text: 'Pakistan ki azaadi ki kahani batao' },
  { emoji: '💻', text: 'Programming mein loop kya hota hai?' },
];

export const QUICK_PILLS = [
  '💡 Example do',
  '🎯 Simplify karo',
  '⚡ Quiz lo',
  '🇵🇰 Urdu mein samjhao',
];
