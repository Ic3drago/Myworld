import { cn } from '@/utils/helpers';

/** Base shimmer block used to build loading placeholders. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer rounded-lg bg-white/[0.05]', className)} />;
}

/** Placeholder that mimics a user or community card. */
export function SkeletonCard() {
  return (
    <div className="card-surface space-y-3 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-4/5" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}

/** Placeholder line group for feeds. */
export function SkeletonRow() {
  return (
    <div className="card-surface space-y-3 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-5/6" />
    </div>
  );
}
