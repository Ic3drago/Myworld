import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Users,
  CalendarDays,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { StatCard, type StatCardProps } from '@/components/dashboard/StatCard';
import { UserCard } from '@/components/users/UserCard';
import { CommunityCard } from '@/components/communities/CommunityCard';
import { PostCard } from '@/components/dashboard/PostCard';
import { RightPanel } from '@/components/layout/RightPanel';
import { SkeletonCard, SkeletonRow } from '@/components/ui/Skeleton';

export function Dashboard() {
  const {
    user,
    people,
    communities,
    events,
    posts,
    joinedCommunities,
    unreadMessageCount,
  } = useApp();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const firstName = user.name.split(' ')[0];
  const suggestedPeople = people.slice(0, 4);
  const suggestedCommunities = communities
    .filter((community) => !joinedCommunities.includes(community.id))
    .slice(0, 4);

  const stats: StatCardProps[] = [
    {
      icon: Layers,
      label: 'Comunidades',
      value: joinedCommunities.length,
      hint: 'A las que perteneces',
      accent: 'brand',
    },
    {
      icon: Users,
      label: 'Personas compatibles',
      value: people.length,
      hint: 'Afines a tus gustos',
      accent: 'azure',
    },
    {
      icon: CalendarDays,
      label: 'Actividades próximas',
      value: events.length,
      hint: 'Esta semana',
      accent: 'emerald',
    },
    {
      icon: MessageSquare,
      label: 'Mensajes pendientes',
      value: unreadMessageCount,
      hint: 'Sin leer',
      accent: 'amber',
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-8">
        {/* Welcome hero */}
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-night-800/50 p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-azure-600/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-200 ring-1 ring-inset ring-brand-500/25">
              <Sparkles className="h-3.5 w-3.5" /> Tu espacio en NEXORA
            </span>
            <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">
              ¡Hola, {firstName}! 👋
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-slate-400">
              Hoy es un buen día para encontrar tu comunidad. Descubre personas afines y únete a
              grupos donde encajes desde el primer mensaje.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link to="/people">
                <Button leftIcon={<Users className="h-4 w-4" />} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Encuentra personas
                </Button>
              </Link>
              <Link to="/discover">
                <Button
                  variant="secondary"
                  leftIcon={<Compass className="h-4 w-4" />}
                >
                  Descubrir comunidades
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>
        {/* People */}
        <section>
          <SectionHeader
            eyebrow="Afines a ti"
            title="Personas compatibles contigo"
            subtitle="Sugerencias basadas en tus intereses y tus juegos favoritos."
            action={
              <Link
                to="/people"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
              >
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestedPeople.map((person) => (
                <UserCard key={person.id} user={person} />
              ))}
            </div>
          )}
        </section>

        {/* Communities */}
        <section>
          <SectionHeader
            eyebrow="Para ti"
            title="Comunidades para ti"
            subtitle="Grupos donde ya están pasando cosas que te interesan."
            action={
              <Link
                to="/discover"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
              >
                Explorar <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestedCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          )}
        </section>

        {/* Community activity feed */}
        <section>
          <SectionHeader
            eyebrow="En vivo"
            title="Actividad de la comunidad"
            subtitle="Lo último que está pasando en tus comunidades."
          />
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 2 }).map((_, index) => <SkeletonRow key={index} />)
              : posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </section>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-20">
          <RightPanel />
        </div>
      </aside>
    </div>
  );
}
