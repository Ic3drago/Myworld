import { MapPin, Briefcase, Pencil, Layers, Users, Bookmark } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard, type StatCardProps } from '@/components/dashboard/StatCard';
import { CommunityCard } from '@/components/communities/CommunityCard';
import { UserCard } from '@/components/users/UserCard';
import { useApp } from '@/context/AppContext';
import { gradientFromPair } from '@/utils/helpers';

export function Profile() {
  const { user, communities, people, joinedCommunities, connections, favorites, pushToast } =
    useApp();

  const myCommunities = communities.filter((community) => joinedCommunities.includes(community.id));
  const myConnections = people.filter((person) => connections.includes(person.id));

  const stats: StatCardProps[] = [
    { icon: Layers, label: 'Comunidades', value: joinedCommunities.length, accent: 'brand' },
    { icon: Users, label: 'Conexiones', value: connections.length, accent: 'azure' },
    { icon: Bookmark, label: 'Guardados', value: favorites.length, accent: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <div
          className="relative h-36 sm:h-44"
          style={{ backgroundImage: gradientFromPair(user.gradient) }}
        >
          <div className="absolute inset-0 bg-night-950/25" />
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_30%,white,transparent_45%)]" />
        </div>

        <div className="bg-night-800/50 px-5 pb-5">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar
                size="xl"
                name={user.name}
                initials={user.initials}
                gradient={user.gradient}
                online
                ring
                className="ring-4 ring-night-850"
              />
              <div className="pb-1">
                <h1 className="font-display text-2xl text-white">{user.name}</h1>
                <p className="text-sm text-slate-400">{user.handle}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              leftIcon={<Pencil className="h-4 w-4" />}
              onClick={() => pushToast('Edición de perfil (demo) ✨', 'info')}
            >
              Editar perfil
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {user.location}
            </span>
            {user.role && (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> {user.role}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> En línea
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{user.bio}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {user.interests.map((interest) => (
              <Tag key={interest}>{interest}</Tag>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.games.map((game) => (
              <Tag key={game} className="text-brand-200">
                {game}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      <section className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section>
        <SectionHeader eyebrow="Participación" title="Mis comunidades" />
        {myCommunities.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {myCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
            Aún no perteneces a ninguna comunidad.
          </p>
        )}
      </section>

      <section>
        <SectionHeader eyebrow="Red" title="Personas conectadas" />
        {myConnections.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {myConnections.map((person) => (
              <UserCard key={person.id} user={person} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
            Todavía no tienes conexiones. Ve a “Encuentra personas” para empezar.
          </p>
        )}
      </section>
    </div>
  );
}
