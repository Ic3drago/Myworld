import type { ReactNode } from 'react';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Consistent page-level heading used across all sections. */
export function PageHeader({ eyebrow, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl text-white sm:text-3xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
