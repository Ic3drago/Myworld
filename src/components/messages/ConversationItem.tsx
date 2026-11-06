import type { Conversation } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/helpers';

export interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}

export function ConversationItem({ conversation, active, onSelect }: ConversationItemProps) {
  const last = conversation.messages[conversation.messages.length - 1];
  const preview = last ? `${last.mine ? 'Tú: ' : ''}${last.text}` : conversation.activity ?? '';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all duration-200',
        active
          ? 'bg-brand-500/15 ring-1 ring-inset ring-brand-500/30'
          : 'hover:bg-white/[0.04]',
      )}
    >
      <Avatar
        size="md"
        name={conversation.participantName}
        initials={conversation.participantInitials}
        gradient={conversation.gradient}
        online={conversation.online}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-white">
            {conversation.participantName}
          </span>
          <span className="shrink-0 text-[10px] text-slate-500">{last?.time}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'truncate text-xs',
              conversation.unread > 0 ? 'text-slate-300' : 'text-slate-500',
            )}
          >
            {preview}
          </span>
          {conversation.unread > 0 && (
            <span className="grid h-4 min-w-4 shrink-0 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
