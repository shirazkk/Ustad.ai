export type Role = 'user' | 'ai';

export interface Message {
  id: string;
  role: Role;
  text: string;
  imageBase64?: string;
  timestamp: Date;
}

export interface Subject {
  id: string;
  label: string;
  emoji: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation_correct: string;
  explanation_wrong: string;
}

export interface GeminiPart {
  text?: string;
  inline_data?: { mime_type: string; data: string };
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: GeminiPart[];
}
