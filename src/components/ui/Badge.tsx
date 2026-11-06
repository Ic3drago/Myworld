import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

type BadgeVariant = 'brand' | 'success' | 'info' | 'neutral' | 'warning';

const variantMap: Record<BadgeVariant, string> = {
  brand: 'bg-brand-500/15 text-brand-200 ring-brand-500/30',
  success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  info: 'bg-azure-500/15 text-azure-300 ring-azure-500/30',
  neutral: 'bg-white/[0.06] text-slate-300 ring-white/10',
  warning: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
};

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'neutral', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        variantMap[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
