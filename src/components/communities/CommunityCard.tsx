import { Users, Activity, Check, Plus, Bookmark, TrendingUp } from 'lucide-react';
import type { Community } from '@/types';
import { CommunityIcon } from './CommunityIcon';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';
import { cn, formatNumber, gradientFromPair } from '@/utils/helpers';

export interface CommunityCardProps {
  community: Community;
  className?: string;
}

export function CommunityCard({ community, className }: CommunityCardProps) {
  const { isJoined, joinCommunity, leaveCommunity, isFavorite, toggleFavorite } = useApp();
  const joined = isJoined(community.id);
  const favorite = isFavorite(community.id);

  return (
    <div className={cn('group card-surface card-hover flex flex-col overflow-hidden', className)}>
      <div
        className="relative h-24 overflow-hidden"
        style={{ backgroundImage: gradientFromPair(community.gradient) }}
      >
        <div className="absolute inset-0 bg-night-950/25" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_18%_20%,white,transparent_45%)]" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-night-900/70 to-transparent" />

        <div className="absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur">
          <CommunityIcon icon={community.icon} className="h-5 w-5 text-white" />
        </div>

        {community.trending && (
          <span className="absolute left-4 top-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur">
            <TrendingUp className="h-3 w-3" /> Trending
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(community.id)}
          className={cn(
            'absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur transition-all',
            favorite
              ? 'bg-brand-500 text-white shadow-glow-sm'
              : 'bg-night-950/40 text-white/80 hover:bg-night-950/60 hover:text-white',
          )}
          aria-label={favorite ? 'Quitar de guardados' : 'Guardar comunidad'}
        >
          <Bookmark className={cn('h-4 w-4', favorite && 'fill-current')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-white">{community.name}</h3>
          <Badge variant="brand" className="shrink-0">
            {community.category}
          </Badge>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {community.description}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {formatNumber(community.members)} miembros
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300/90">
            <Activity className="h-3.5 w-3.5" />
            {formatNumber(community.activeMembers)} activos
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {community.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          {joined ? (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<Check className="h-4 w-4" />}
              onClick={() => leaveCommunity(community.id)}
            >
              Miembro
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => joinCommunity(community.id)}
            >
              Unirme
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
