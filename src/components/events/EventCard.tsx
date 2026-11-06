import { CalendarDays, Users, Check, Plus } from 'lucide-react';
import type { EventItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { cn, formatNumber, gradientFromPair } from '@/utils/helpers';

export interface EventCardProps {
  event: EventItem;
  /** Compact row variant used inside the right panel. */
  compact?: boolean;
  className?: string;
}

export function EventCard({ event, compact = false, className }: EventCardProps) {
  const { isEventJoined, joinEvent } = useApp();
  const joined = isEventJoined(event.id);

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 transition-colors hover:bg-white/[0.05]',
          className,
        )}
      >
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white"
          style={{ backgroundImage: gradientFromPair(event.gradient) }}
        >
          <div className="text-center leading-none">
            <CalendarDays className="mx-auto h-3.5 w-3.5" />
            <span className="mt-0.5 block text-[10px] font-bold">{event.time}</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{event.title}</p>
          <p className="truncate text-xs text-slate-400">
            {event.community} · {event.dateLabel}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-400">
          <Users className="h-3.5 w-3.5" />
          {formatNumber(event.participants)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('group card-surface card-hover flex gap-4 p-4', className)}>
      <div
        className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-white"
        style={{ backgroundImage: gradientFromPair(event.gradient) }}
      >
        <CalendarDays className="h-5 w-5" />
        <span className="mt-0.5 text-xs font-bold">{event.time}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-sm font-semibold text-white">{event.title}</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              {event.community} · {event.dateLabel}
            </p>
          </div>
          <Badge variant="brand" className="shrink-0">
            {event.category}
          </Badge>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
          {event.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            {formatNumber(event.participants)} participantes
          </span>
          {joined ? (
            <Button size="sm" variant="outline" leftIcon={<Check className="h-4 w-4" />} disabled>
              Inscrito
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => joinEvent(event.id)}
            >
              Asistir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
