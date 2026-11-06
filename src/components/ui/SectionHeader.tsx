import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, eyebrow, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-xl text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
