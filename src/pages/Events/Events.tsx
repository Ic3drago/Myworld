import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Chip } from '@/components/ui/Chip';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';

export function Events() {
  const { events, isEventJoined, joinedEvents } = useApp();
  const [onlyMine, setOnlyMine] = useState(false);

  const list = onlyMine ? events.filter((event) => isEventJoined(event.id)) : events;

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Eventos"
        subtitle="Torneos, watch-parties, game jams y quedadas organizadas por tus comunidades."
        actions={
          <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
            {joinedEvents.length} inscripciones
          </span>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <Chip active={!onlyMine} onClick={() => setOnlyMine(false)} count={events.length}>
          Todos los eventos
        </Chip>
        <Chip active={onlyMine} onClick={() => setOnlyMine(true)} count={joinedEvents.length}>
          A los que asistiré
        </Chip>
      </div>

      {list.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No hay eventos aquí todavía"
          description="Cuando te inscribas a un evento aparecerá en esta lista."
        />
      )}
    </div>
  );
}
