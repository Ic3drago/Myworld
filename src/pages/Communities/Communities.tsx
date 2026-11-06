import { Link } from 'react-router-dom';
import { Layers, Compass } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { CommunityCard } from '@/components/communities/CommunityCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCommunities } from '@/hooks/useCommunities';

export function Communities() {
  const { myCommunities } = useCommunities();

  return (
    <div>
      <PageHeader
        eyebrow="Tu espacio"
        title="Mis comunidades"
        subtitle="Las comunidades a las que perteneces y donde estás conversando."
        actions={
          <Link to="/discover">
            <Button variant="secondary" leftIcon={<Compass className="h-4 w-4" />}>
              Descubrir más
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <span className="rounded-full bg-white/[0.06] px-3 py-1 font-medium text-slate-300">
          {myCommunities.length} {myCommunities.length === 1 ? 'comunidad' : 'comunidades'}
        </span>
        <span>Estás participando activamente en todas ellas.</span>
      </div>

      {myCommunities.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="Aún no te has unido a ninguna comunidad"
          description="Explora comunidades afines a tus intereses y únete en un clic."
          action={
            <Link to="/discover">
              <Button leftIcon={<Compass className="h-4 w-4" />}>Descubrir comunidades</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
