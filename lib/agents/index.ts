import { scienceAgent } from './science';
import { mathAgent } from './math';
import { englishAgent } from './english';
import { urduAgent } from './urdu';
import { historyAgent } from './history';
import { csAgent } from './cs';
import { Agent } from './types';

export const agents: Record<string, Agent> = {
  science: scienceAgent,
  math: mathAgent,
  english: englishAgent,
  urdu: urduAgent,
  history: historyAgent,
  cs: csAgent,
};

export function getAgent(id: string): Agent {
  return agents[id] || scienceAgent;
}
