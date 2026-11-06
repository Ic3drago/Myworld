import { Gamepad2, MapPin, Eye, UserPlus, Check } from 'lucide-react';
import type { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Chip';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/helpers';

export interface UserCardProps {
  user: User;
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  const { isConnected, connectUser, openProfile } = useApp();
  const connected = isConnected(user.id);

  return (
    <div className={cn('group card-surface card-hover flex flex-col p-4', className)}>
      <div className="flex items-start gap-3">
        <Avatar
          size="lg"
          name={user.name}
          initials={user.initials}
          gradient={user.gradient}
          online={user.online}
          onClick={() => openProfile(user.id)}
        />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => openProfile(user.id)}
            className="block max-w-full truncate text-left text-sm font-semibold text-white transition-colors hover:text-brand-300"
          >
            {user.name}
          </button>
          <p className="truncate text-xs text-slate-500">{user.handle}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{user.location}</span>
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-lg bg-brand-500/15 px-2 py-1 text-center font-display text-sm font-bold text-brand-200 ring-1 ring-inset ring-brand-500/25',
          )}
          title="Compatibilidad contigo"
        >
          {user.compatibility}%
        </span>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-500">
          <span>Compatibilidad</span>
          <span className="font-semibold text-brand-300">{user.compatibility}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-brand-gradient transition-all duration-500"
            style={{ width: `${user.compatibility}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {user.interests.slice(0, 3).map((interest) => (
          <Tag key={interest}>{interest}</Tag>
        ))}
      </div>

      {user.games.length > 0 && (
        <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-slate-400">
          <Gamepad2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span className="truncate">{user.games.slice(0, 2).join(' · ')}</span>
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          fullWidth
          size="sm"
          variant={connected ? 'secondary' : 'primary'}
          leftIcon={connected ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          onClick={() => connectUser(user.id)}
        >
          {connected ? 'Conectado' : 'Conectar'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openProfile(user.id)}
          aria-label={`Ver perfil de ${user.name}`}
          className="shrink-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
