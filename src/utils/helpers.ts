import type { Gradient } from '@/types';

/**
 * Tiny classnames helper — joins truthy class strings.
 * Example: cn('px-4', isActive && 'bg-brand-500', undefined) → 'px-4 bg-brand-500'
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** 1234 → "1.2k", 2_400_000 → "2.4M". Uses dot as thousands separator (es). */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`;
  }
  return String(value);
}

/** "Alex Rivera" → "AR". */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/** Builds a CSS linear-gradient string from a gradient pair. */
export function gradient(from: string, to: string, angle = 135): string {
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

/** Convenience overload that accepts a Gradient tuple. */
export function gradientFromPair(pair: Gradient, angle = 135): string {
  return gradient(pair[0], pair[1], angle);
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
