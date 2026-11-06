import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Render a leading search icon when true, or pass a custom icon node. */
  icon?: ReactNode | boolean;
  rightSlot?: ReactNode;
  containerClassName?: string;
}

/**
 * Text input with an optional leading icon and trailing slot.
 * Styled for the dark glass aesthetic of NEXORA.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, rightSlot, className, containerClassName, ...props },
  ref,
) {
  const leadingIcon = icon === true ? <Search className="h-4 w-4" /> : icon;
  return (
    <div
      className={cn(
        'group flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3',
        'transition-all duration-200 focus-within:border-brand-500/60 focus-within:bg-white/[0.06]',
        'focus-within:shadow-glow-sm',
        containerClassName,
      )}
    >
      {leadingIcon && (
        <span className="shrink-0 text-slate-400 transition-colors group-focus-within:text-brand-300">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'h-full w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500',
          'focus:outline-none',
          className,
        )}
        {...props}
      />
      {rightSlot && <span className="shrink-0">{rightSlot}</span>}
    </div>
  );
});
