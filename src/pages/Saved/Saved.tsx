import { Link } from 'react-router-dom';
import { Bookmark, Compass } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CommunityCard } from '@/components/communities/CommunityCard';
import { UserCard } from '@/components/users/UserCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFavorites } from '@/hooks/useFavorites';

export function Saved() {
  const { savedCommunities, savedPeople } = useFavorites();
  const shown = savedCommunities.length + savedPeople.length;

  return (
    <div>
      <PageHeader
        eyebrow="Colección"
        title="Guardados"
        subtitle="Comunidades y personas que has guardado para más tarde."
        actions={
          <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-300">
            {shown} elementos
          </span>
        }
      />

      {shown === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Todavía no guardaste nada"
          description="Usa el icono de guardar en comunidades y personas para tenerlas a mano."
          action={
            <Link to="/discover">
              <Button leftIcon={<Compass className="h-4 w-4" />}>Explorar comunidades</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {savedCommunities.length > 0 && (
            <section>
              <SectionHeader eyebrow="Comunidades" title="Comunidades guardadas" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {savedCommunities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            </section>
          )}

          {savedPeople.length > 0 && (
            <section>
              <SectionHeader eyebrow="Personas" title="Personas guardadas" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {savedPeople.map((person) => (
                  <UserCard key={person.id} user={person} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
