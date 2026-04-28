import { getAgent } from '@/lib/agents';
import type { Subject } from '@/types';

interface Props {
  subject: Subject;
}

export default function TypingIndicator({ subject }: Props) {
  const agent = getAgent(subject.id);

  return (
    <div className="flex items-end gap-2 animate-msg-slide">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-lg">
        {agent.avatar}
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-brand-card px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-muted animate-typing-dot-1" />
          <span className="h-2 w-2 rounded-full bg-brand-muted animate-typing-dot-2" />
          <span className="h-2 w-2 rounded-full bg-brand-muted animate-typing-dot-3" />
        </div>
      </div>
    </div>
  );
}
