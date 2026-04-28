export interface Agent {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  systemPrompt: string;
  starterPrompts: { emoji: string; text: string }[];
  quickPills: string[];
  temperature: number;
  quizStyle: string;
}
