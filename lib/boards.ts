/**
 * Ustad.ai Board & Grade Configuration
 * Defines the Pakistani educational boards and grade levels.
 */

export type Board = 'Federal' | 'Sindh' | 'Punjab' | 'KPK' | 'Balochistan' | 'O-Level' | 'A-Level';
export type Grade = '9th' | '10th' | '11th' | '12th' | 'O1' | 'O2' | 'O3' | 'A1' | 'A2';

export const BOARDS: Board[] = [
  'Federal',
  'Sindh',
  'Punjab',
  'KPK',
  'Balochistan',
  'O-Level',
  'A-Level'
];

export const GRADES: Grade[] = [
  '9th',
  '10th',
  '11th',
  '12th',
  'O1',
  'O2',
  'O3',
  'A1',
  'A2'
];

export interface UserEducation {
  board: Board;
  grade: Grade;
  lowData: boolean;
}

const STORAGE_KEY = 'ustaad_education';
const ONBOARDED_KEY = 'ustaad_onboarded';

export function saveEducation(edu: UserEducation) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edu));
}

export function getEducation(): UserEducation {
  const defaultEdu: UserEducation = { board: 'Federal', grade: '10th', lowData: false };
  if (typeof window === 'undefined') return defaultEdu;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultEdu;
    const parsed = JSON.parse(stored);
    return { ...defaultEdu, ...parsed };
  } catch {
    return defaultEdu;
  }
}

export function hasOnboarded(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDED_KEY) === '1';
}

export function markOnboarded() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDED_KEY, '1');
}
