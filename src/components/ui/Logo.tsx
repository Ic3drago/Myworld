import { BRAND } from '@/utils/constants';
import { cn } from '@/utils/helpers';

type LogoSize = 'sm' | 'md' | 'lg';

const boxMap: Record<LogoSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const textMap: Record<LogoSize, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
};

export interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  className?: string;
}

/** NEXORA brand mark + wordmark. */
export function Logo({ size = 'md', withText = true, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative grid place-items-center rounded-xl bg-brand-gradient shadow-glow-sm',
          boxMap[size],
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-1/2 w-1/2" aria-hidden>
          <path
            d="M6 18V6l12 12V6"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
      </div>
      {withText && (
        <span
          className={cn(
            'font-display font-bold uppercase tracking-[0.18em] text-white',
            textMap[size],
          )}
        >
          {BRAND.name}
        </span>
      )}
    </div>
  );
}
