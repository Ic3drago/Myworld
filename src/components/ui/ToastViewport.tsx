import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/helpers';

const iconByVariant = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
};

const colorByVariant = {
  success: 'text-emerald-400',
  info: 'text-azure-400',
  error: 'text-rose-400',
};

/** Renders transient toasts triggered by user actions across the app. */
export function ToastViewport() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconByVariant[toast.variant];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-slide-in-right items-start gap-3 rounded-xl border border-white/10 bg-night-800/95 p-3 shadow-card backdrop-blur-xl"
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', colorByVariant[toast.variant])} />
            <p className="flex-1 text-sm text-slate-100">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-md p-1 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Descartar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
