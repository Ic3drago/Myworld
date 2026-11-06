import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { ConversationItem } from '@/components/messages/ConversationItem';
import { ChatThread } from '@/components/messages/ChatThread';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/helpers';

export function Messages() {
  const { conversations, activeConversationId, openConversation } = useApp();
  const [query, setQuery] = useState('');
  const [mobileChat, setMobileChat] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = conversations.filter((conversation) =>
    conversation.participantName.toLowerCase().includes(q),
  );
  const active =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    conversations[0];

  const select = (id: string) => {
    openConversation(id);
    setMobileChat(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Conversaciones"
        title="Mensajes"
        subtitle="Habla con las personas que has conocido en NEXORA."
      />

      <div className="grid h-[calc(100vh-12rem)] min-h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-night-850/50 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div
          className={cn(
            'flex min-h-0 flex-col border-r border-white/[0.06]',
            mobileChat && 'hidden lg:flex',
          )}
        >
          <div className="border-b border-white/[0.06] p-3">
            <Input
              icon
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar conversaciones…"
            />
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {filtered.length > 0 ? (
              filtered.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id === activeConversationId}
                  onSelect={() => select(conversation.id)}
                />
              ))
            ) : (
              <p className="p-4 text-center text-sm text-slate-500">Sin conversaciones.</p>
            )}
          </div>
        </div>

        <div className={cn('h-full min-h-0', mobileChat ? 'block' : 'hidden lg:block')}>
          {active ? (
            <ChatThread conversation={active} onBack={() => setMobileChat(false)} />
          ) : (
            <div className="grid h-full place-items-center p-6">
              <EmptyState
                icon={MessageSquare}
                title="Selecciona una conversación"
                description="Elige un chat de la lista para empezar a conversar."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
