import { useState, type FormEvent } from 'react';
import { Plus, Gamepad2, Lightbulb } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PostCard } from '@/components/dashboard/PostCard';
import { UserCard } from '@/components/users/UserCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';

const POPULAR_GAMES = ['Valorant', 'Fortnite', 'Minecraft', 'Apex Legends', 'Genshin Impact'];

export function FindTeam() {
  const { posts, people, createPost } = useApp();
  const [composerOpen, setComposerOpen] = useState(false);
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
            onClick={() => setComposerOpen(true)}
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

      <Modal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="Publicar búsqueda de equipo"
        description="Cuéntale a la comunidad qué juego y grupo estás buscando."
      >
        <form
          className="space-y-4"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSubmitting(true);
            const tags = tagsText.split(',').map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean);
            const created = await createPost(content, tags, 'team');
            setSubmitting(false);
            if (created) {
              setContent('');
              setTagsText('');
              setComposerOpen(false);
            }
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Descripción</span>
            <textarea
              required
              maxLength={2000}
              rows={5}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Juego, horario, nivel y qué tipo de equipo buscas…"
              className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500/60 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-300">Etiquetas</span>
            <input
              value={tagsText}
              onChange={(event) => setTagsText(event.target.value)}
              placeholder="Valorant, ranked, noche"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500/60 focus:outline-none"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setComposerOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting || !content.trim()}>
              {submitting ? 'Publicando…' : 'Publicar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
