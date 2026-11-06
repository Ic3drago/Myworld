import { useState } from 'react';
import { Bell, Mail, Eye, Save, LogOut, Palette, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/helpers';

interface ToggleOption {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const TOGGLES: ToggleOption[] = [
  {
    key: 'push',
    label: 'Notificaciones push',
    description: 'Recibe avisos de conexiones, eventos y mensajes.',
    icon: Bell,
  },
  {
    key: 'email',
    label: 'Resumen por email',
    description: 'Un resumen semanal con tu actividad y sugerencias.',
    icon: Mail,
  },
  {
    key: 'online',
    label: 'Mostrar estado en línea',
    description: 'Permite que otras personas vean cuándo estás conectado.',
    icon: Eye,
  },
];

function Switch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'ring-focus relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-brand-gradient' : 'bg-white/10',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}
export function Settings() {
  const { user, pushToast } = useApp();
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    push: true,
    email: false,
    online: true,
  });

  return (
    <div>
      <PageHeader
        eyebrow="Cuenta"
        title="Configuración"
        subtitle="Administra tu perfil y tus preferencias dentro de NEXORA."
        actions={
          <Button
            leftIcon={<Save className="h-4 w-4" />}
            onClick={() => pushToast('Ajustes guardados (demo) ✅')}
          >
            Guardar cambios
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="card-surface p-5">
            <h2 className="font-display text-base font-semibold text-white">Perfil</h2>
            <p className="mt-1 text-sm text-slate-400">Así te verán otras personas en NEXORA.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Nombre</span>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-400">Usuario</span>
                <Input value={handle} onChange={(event) => setHandle(event.target.value)} />
              </label>
            </div>
          </section>

          <section className="card-surface p-5">
            <h2 className="font-display text-base font-semibold text-white">Preferencias</h2>
            <div className="mt-4 divide-y divide-white/[0.06]">
              {TOGGLES.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.key}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-brand-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{option.label}</p>
                      <p className="text-xs text-slate-400">{option.description}</p>
                    </div>
                    <Switch
                      checked={Boolean(prefs[option.key])}
                      onChange={(value) =>
                        setPrefs((prev) => ({ ...prev, [option.key]: value }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
              <Palette className="h-4 w-4 text-brand-300" /> Apariencia
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              NEXORA usa el tema oscuro de forma predeterminada por ahora.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 p-2.5">
              <div className="h-8 w-8 rounded-lg bg-night-950 ring-1 ring-white/10" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Oscuro</p>
                <p className="text-[11px] text-slate-400">Activo</p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
            </div>
          </div>

          <div className="card-surface p-5">
            <h2 className="font-display text-sm font-semibold text-white">Sesión</h2>
            <p className="mt-2 text-sm text-slate-400">
              Esta es una demo, no se cerrará ninguna sesión real.
            </p>
            <Button
              variant="secondary"
              fullWidth
              className="mt-3"
              leftIcon={<LogOut className="h-4 w-4" />}
              onClick={() => pushToast('Sesión cerrada (demo)', 'info')}
            >
              Cerrar sesión
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
