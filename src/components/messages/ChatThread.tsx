import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import type { Conversation } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/helpers';

export interface ChatThreadProps {
  conversation: Conversation;
  onBack?: () => void;
}

/** Full-height demo chat. Messages are appended to local state (no backend). */
export function ChatThread({ conversation, onBack }: ChatThreadProps) {
  const { sendMessage } = useApp();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [conversation.messages.length, conversation.id]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    sendMessage(conversation.id, text);
    setText('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/[0.06] p-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <Avatar
          size="md"
          name={conversation.participantName}
          initials={conversation.participantInitials}
          gradient={conversation.gradient}
          online={conversation.online}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {conversation.participantName}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            {conversation.online ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> En línea
              </>
            ) : (
              conversation.activity ?? 'Desconectado'
            )}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex', message.mine ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-sm',
                message.mine
                  ? 'rounded-br-md bg-brand-gradient text-white'
                  : 'rounded-bl-md bg-white/[0.06] text-slate-200',
              )}
            >
              <p className="leading-relaxed">{message.text}</p>
              <span
                className={cn(
                  'mt-1 block text-right text-[10px]',
                  message.mine ? 'text-white/70' : 'text-slate-500',
                )}
              >
                {message.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t border-white/[0.06] p-3"
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe un mensaje…"
          className="h-10 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-brand-500/60 focus:outline-none"
        />
        <button
          type="submit"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow-sm transition-transform active:scale-95 disabled:opacity-50"
          aria-label="Enviar mensaje"
          disabled={!text.trim()}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
