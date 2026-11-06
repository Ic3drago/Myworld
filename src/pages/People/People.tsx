import { X, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { UserCard } from '@/components/users/UserCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useUsers } from '@/hooks/useUsers';
import { INTEREST_FILTERS } from '@/utils/constants';
import { cn } from '@/utils/helpers';

export function People() {
  const {
    filtered,
    query,
    setQuery,
    interest,
    setInterest,
    onlyOnline,
    setOnlyOnline,
    reset,
    connections,
  } = useUsers();

  return (
    <div>
      <PageHeader
        eyebrow="Conexiones"
        title="Encuentra personas"
        subtitle="Personas con intereses, juegos y horarios parecidos a los tuyos. Conecta y empieza a conversar."
        actions={
          <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
            {connections.length} conexiones
          </span>
        }
      />

      <div className="mb-5 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full max-w-md">
            <Input
              icon
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre, interés o juego…"
              rightSlot={
                query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded-md p-0.5 text-slate-400 hover:text-white"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : undefined
              }
            />
          </div>
          <button
            type="button"
            onClick={() => setOnlyOnline((value) => !value)}
            className={cn(
              'ring-focus inline-flex items-center gap-2 self-start rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors sm:self-auto',
              onlyOnline
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]',
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                onlyOnline ? 'bg-emerald-400' : 'bg-slate-500',
              )}
            />
            Solo en línea
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTEREST_FILTERS.map((filter) => (
            <Chip key={filter} active={interest === filter} onClick={() => setInterest(filter)}>
              {filter}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {filtered.length} {filtered.length === 1 ? 'persona' : 'personas'} compatibles
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((person) => (
            <UserCard key={person.id} user={person} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Sin coincidencias por ahora"
          description="Ajusta los filtros o la búsqueda para descubrir más personas."
          action={
            <Button variant="secondary" onClick={reset}>
              Limpiar filtros
            </Button>
          }
        />
      )}
    </div>
  );
}
