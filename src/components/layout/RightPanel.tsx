import { Users, CalendarDays } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { EventCard } from '@/components/events/EventCard';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { useApp } from '@/context/AppContext';

/** Right-hand column used on the dashboard. */
export function RightPanel() {
  const { people, events, openProfile } = useApp();
  const online = people.filter((person) => person.online).slice(0, 5);
  const upcoming = events.slice(0, 3);

  return (
    <div className="space-y-4">
      <section className="card-surface p-4">
        <header className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
            <Users className="h-4 w-4 text-brand-300" /> Personas conectadas
          </h3>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            {online.length} en línea
          </span>
        </header>
        <div className="mt-3 space-y-1">
          {online.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => openProfile(person.id)}
              className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-white/[0.05]"
            >
              <Avatar
                size="sm"
                name={person.name}
                initials={person.initials}
                gradient={person.gradient}
                online
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{person.name}</p>
                <p className="truncate text-xs text-slate-400">{person.activity}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="card-surface p-4">
        <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-white">
          <CalendarDays className="h-4 w-4 text-azure-300" /> Próximas actividades
        </h3>
        <div className="space-y-2">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} compact />
          ))}
        </div>
      </section>

      <RecommendationCard />
    </div>
  );
}
