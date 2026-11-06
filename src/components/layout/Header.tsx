import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Layers, CheckCheck } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/helpers';

export interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const {
    user,
    people,
    communities,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    openProfile,
  } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const userResults = q
    ? people
        .filter(
          (person) =>
            person.name.toLowerCase().includes(q) ||
            person.handle.toLowerCase().includes(q) ||
            person.interests.some((i) => i.toLowerCase().includes(q)),
        )
        .slice(0, 4)
    : [];
  const communityResults = q
    ? communities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3)
    : [];
  const showResults = searchFocus && q.length > 0;

  const gotoUser = (id: string) => {
    openProfile(id);
    setQuery('');
    setSearchFocus(false);
  };

  const gotoCommunity = () => {
    setQuery('');
    setSearchFocus(false);
    navigate('/discover');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-night-900/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="ring-focus grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="shrink-0 lg:hidden">
          <Logo withText={false} size="sm" />
        </div>

        <div className="relative w-full max-w-xl">
          <Input
            icon
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => window.setTimeout(() => setSearchFocus(false), 120)}
            placeholder="Buscar personas, comunidades, intereses…"
            aria-label="Búsqueda global"
          />

          {showResults && (
            <div
              className="absolute inset-x-0 top-12 z-40 animate-fade-in overflow-hidden rounded-xl border border-white/10 bg-night-850/95 p-1.5 shadow-card backdrop-blur-xl"
              onMouseDown={(event) => event.preventDefault()}
            >
              {userResults.length === 0 && communityResults.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-slate-400">
                  Sin resultados para “{query}”.
                </p>
              )}

              {userResults.length > 0 && (
                <div className="mb-1">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Personas
                  </p>
                  {userResults.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => gotoUser(person.id)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <Avatar
                        size="xs"
                        name={person.name}
                        initials={person.initials}
                        gradient={person.gradient}
                      />
                      <span className="truncate text-sm text-slate-200">{person.name}</span>
                      <span className="ml-auto shrink-0 text-[10px] font-semibold text-brand-300">
                        {person.compatibility}%
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {communityResults.length > 0 && (
                <div>
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Comunidades
                  </p>
                  {communityResults.map((community) => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={gotoCommunity}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-brand-300">
                        <Layers className="h-3.5 w-3.5" />
                      </span>
                      <span className="truncate text-sm text-slate-200">{community.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setNotifOpen((value) => !value)}
            className="ring-focus relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white shadow-glow-sm">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setNotifOpen(false)}
                aria-hidden
              />
              <div className="absolute right-0 z-40 mt-2 w-80 max-w-[85vw] animate-fade-in overflow-hidden rounded-xl border border-white/10 bg-night-850/95 shadow-card backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2.5">
                  <span className="text-sm font-semibold text-white">Notificaciones</span>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-brand-300 transition-colors hover:bg-brand-500/10"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Marcar todas
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-1.5">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => markNotificationRead(notification.id)}
                      className="flex w-full gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          notification.read ? 'bg-slate-600' : 'bg-brand-400',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'truncate text-sm',
                            notification.read ? 'text-slate-400' : 'font-medium text-white',
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {notification.description}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-600">{notification.timeAgo}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="ring-focus hidden shrink-0 rounded-full sm:block"
          aria-label="Ir a mi perfil"
        >
          <Avatar
            size="md"
            name={user.name}
            initials={user.initials}
            gradient={user.gradient}
          />
        </button>
      </div>
    </header>
  );
}
