import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '@/utils/constants';
import { Logo } from '@/components/ui/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/helpers';

export interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const { user, unreadMessageCount } = useApp();

  return (
    <aside
      className={cn(
        'flex h-full w-[280px] flex-col border-r border-white/[0.06] bg-night-900/70 backdrop-blur-xl',
        className,
      )}
    >
      <div className="px-5 py-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const badge = item.badgeKey === 'messages' ? unreadMessageCount : 0;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-500/15 text-white ring-1 ring-inset ring-brand-500/25'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-colors',
                      isActive ? 'text-brand-300' : 'text-slate-500 group-hover:text-slate-300',
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {badge > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.04]"
        >
          <Avatar
            size="md"
            name={user.name}
            initials={user.initials}
            gradient={user.gradient}
            online={user.online}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="flex items-center gap-1 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              En línea
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
        </NavLink>
      </div>
    </aside>
  );
}
