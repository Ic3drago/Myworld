import { X, Compass } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Chip } from '@/components/ui/Chip';
import { CommunityCard } from '@/components/communities/CommunityCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useCommunities } from '@/hooks/useCommunities';
import { CATEGORY_FILTERS } from '@/utils/constants';

export function Discover() {
  const { filtered, query, setQuery, category, setCategory, reset } = useCommunities();

  return (
    <div>
      <PageHeader
        eyebrow="Explora"
        title="Descubrir comunidades"
        subtitle="Encuentra grupos donde ya están pasando cosas que te interesan y únete en un clic."
      />

      <div className="mb-5 space-y-3">
        <div className="max-w-md">
          <Input
            icon
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar comunidades, temas o tags…"
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
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((filter) => (
            <Chip key={filter} active={category === filter} onClick={() => setCategory(filter)}>
              {filter}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {filtered.length} {filtered.length === 1 ? 'comunidad' : 'comunidades'} encontradas
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No encontramos comunidades"
          description="Prueba con otra búsqueda o cambia la categoría seleccionada."
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
