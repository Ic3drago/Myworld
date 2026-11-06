import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

export interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  count?: number;
}

/** Interactive filter chip used by category / interest filters. */
export function Chip({ active, onClick, children, count }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'ring-focus inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-brand-gradient text-white shadow-glow-sm'
          : 'border border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
      )}
    >
      {children}
      {typeof count === 'number' && (
        <span
          className={cn(
            'rounded-full px-1.5 text-[10px] font-semibold',
            active ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/** Static, non-interactive tag (e.g. interests, post tags). */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-slate-300 ring-1 ring-inset ring-white/[0.06]',
        className,
      )}
    >
      {children}
    </span>
  );
}
