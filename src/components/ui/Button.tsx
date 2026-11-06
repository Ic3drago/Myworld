import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'subtle';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-glow-sm hover:shadow-glow bg-[length:150%_150%] hover:bg-right',
  secondary:
    'bg-white/[0.06] text-slate-100 border border-white/10 hover:bg-white/[0.1] hover:border-white/20',
  ghost: 'text-slate-300 hover:bg-white/[0.06] hover:text-white',
  outline:
    'border border-brand-500/50 text-brand-200 hover:bg-brand-500/10 hover:border-brand-400',
  subtle: 'bg-night-700 text-slate-200 hover:bg-night-600',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  icon: 'h-10 w-10 justify-center',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-xl font-medium',
        'transition-all duration-200 ease-out active:scale-[0.97]',
        'ring-focus disabled:cursor-not-allowed disabled:opacity-50',
        variantMap[variant],
        sizeMap[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});
