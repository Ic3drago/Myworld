import { Plus, Gamepad2, Lightbulb } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PostCard } from '@/components/dashboard/PostCard';
import { UserCard } from '@/components/users/UserCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';

const POPULAR_GAMES = ['Valorant', 'Fortnite', 'Minecraft', 'Apex Legends', 'Genshin Impact'];

export function FindTeam() {
  const { posts, people, pushToast } = useApp();
  const teamPosts = posts.filter((post) => post.type === 'team');
  const available = people.filter((person) => person.online && person.games.length > 0);

  return (
    <div>
      <PageHeader
        eyebrow="Juega en equipo"
        title="Encuentra equipo"
        subtitle="Súmate a una squad o publica tu propia búsqueda para jugar con gente compatible."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => pushToast('Búsqueda de equipo publicada (demo) 🎮')}
          >
            Publicar búsqueda
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section>
            <SectionHeader
              eyebrow="Activas"
              title="Equipos buscando jugadores"
              subtitle="Publicaciones de gente que quiere jugar ahora mismo."
            />
            {teamPosts.length > 0 ? (
              <div className="space-y-3">
                {teamPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Gamepad2}
                title="No hay búsquedas activas"
                description="Sé el primero en publicar una búsqueda de equipo."
              />
            )}
          </section>

          <section>
            <SectionHeader
              eyebrow="En línea"
              title="Jugadores disponibles ahora"
              subtitle="Personas conectadas con juegos en común contigo."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {available.map((person) => (
                <UserCard key={person.id} user={person} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card-surface p-4">
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
              <Gamepad2 className="h-4 w-4 text-brand-300" /> Juegos populares
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {POPULAR_GAMES.map((game) => (
                <span
                  key={game}
                  className="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-slate-300"
                >
                  {game}
                </span>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-brand-500/25 bg-brand-gradient-soft p-4">
            <Lightbulb className="h-5 w-5 text-brand-200" />
            <p className="mt-2 text-sm font-medium text-white">Cómo funciona</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Publica el juego, el horario y el nivel que buscas. NEXORA te mostrará a las personas
              más compatibles para armarlo.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
