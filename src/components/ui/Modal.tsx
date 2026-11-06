import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-night-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden border border-white/10 bg-night-850 shadow-card',
          'animate-scale-in rounded-t-3xl sm:rounded-3xl',
          sizeMap[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] p-5">
          <div className="min-w-0">
            {title && <h2 className="font-display text-lg text-white">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ring-focus -mr-1 -mt-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="border-t border-white/[0.06] p-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
