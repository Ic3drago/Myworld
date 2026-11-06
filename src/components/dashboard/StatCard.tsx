import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/helpers';

type Accent = 'brand' | 'azure' | 'emerald' | 'amber';

const accentMap: Record<Accent, { chip: string; glow: string }> = {
  brand: { chip: 'from-brand-500 to-brand-700', glow: 'group-hover:shadow-glow-sm' },
  azure: { chip: 'from-azure-500 to-azure-700', glow: 'group-hover:shadow-glow-blue' },
  emerald: { chip: 'from-emerald-500 to-emerald-700', glow: 'group-hover:shadow-glow-sm' },
  amber: { chip: 'from-amber-500 to-orange-600', glow: 'group-hover:shadow-glow-sm' },
};

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: Accent;
}

export function StatCard({ icon: Icon, label, value, hint, accent = 'brand' }: StatCardProps) {
  const accents = accentMap[accent];
  return (
    <div className="group card-surface card-hover relative overflow-hidden p-4">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-500/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            'grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-shadow',
            accents.chip,
            accents.glow,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-display text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="relative mt-3 text-sm font-medium text-slate-200">{label}</p>
      {hint && <p className="relative mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
