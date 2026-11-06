import type { Gradient } from '@/types';
import { cn, getInitials, gradientFromPair } from '@/utils/helpers';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<AvatarSize, string> = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-2xl',
};

const dotMap: Record<AvatarSize, string> = {
  xs: 'h-2 w-2 -bottom-0.5 -right-0.5',
  sm: 'h-2.5 w-2.5 -bottom-0.5 -right-0.5',
  md: 'h-3 w-3 -bottom-0 -right-0',
  lg: 'h-3.5 w-3.5 bottom-0 right-0',
  xl: 'h-5 w-5 bottom-0.5 right-0.5',
};

export interface AvatarProps {
  name: string;
  initials?: string;
  gradient: Gradient;
  size?: AvatarSize;
  online?: boolean;
  ring?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Decorative gradient avatar rendered from a gradient pair + initials.
 * No external images are used, keeping the prototype fully self-contained.
 */
export function Avatar({
  name,
  initials,
  gradient,
  size = 'md',
  online,
  ring,
  className,
  onClick,
}: AvatarProps) {
  return (
    <div className="relative inline-flex shrink-0 select-none">
      <div
        style={{ backgroundImage: gradientFromPair(gradient) }}
        className={cn(
          'flex items-center justify-center rounded-full font-semibold uppercase tracking-wide text-white',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ring-1 ring-white/10',
          sizeMap[size],
          ring && 'ring-2 ring-brand-500/60 ring-offset-2 ring-offset-night-950',
          onClick && 'cursor-pointer transition-transform duration-200 hover:scale-105',
          className,
        )}
        onClick={onClick}
        aria-label={name}
        title={name}
      >
        {initials ?? getInitials(name)}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            'absolute rounded-full ring-2 ring-night-900',
            dotMap[size],
            online ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-500',
          )}
        />
      )}
    </div>
  );
}
