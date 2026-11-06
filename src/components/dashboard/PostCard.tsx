import { Heart, MessageCircle, Share2, Bookmark, Users2, Sparkles, Code2 } from 'lucide-react';
import type { Post } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import { cn, formatNumber } from '@/utils/helpers';

const typeMeta = {
  team: { label: 'Busca equipo', icon: Users2, color: 'text-azure-300 bg-azure-500/15' },
  community: { label: 'Comunidad', icon: Sparkles, color: 'text-brand-300 bg-brand-500/15' },
  share: { label: 'Comparte', icon: Code2, color: 'text-emerald-300 bg-emerald-500/15' },
};

export function PostCard({ post }: { post: Post }) {
  const { toggleLike, isPostLiked, toggleFavorite, isFavorite, openProfile, pushToast } = useApp();
  const liked = isPostLiked(post.id);
  const saved = isFavorite(post.id);
  const meta = typeMeta[post.type];
  const Icon = meta.icon;

  return (
    <article className="card-surface p-4">
      <div className="flex items-start gap-3">
        <Avatar
          size="md"
          name={post.authorName}
          initials={post.authorInitials}
          gradient={post.authorGradient}
          onClick={() => openProfile(post.authorId)}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-white">{post.authorName}</span>
            {post.community && (
              <span className="text-xs text-slate-500">en {post.community}</span>
            )}
            <span className="text-xs text-slate-600">· {post.timeAgo}</span>
          </div>
          <span
            className={cn(
              'mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium',
              meta.color,
            )}
          >
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-300">{post.content}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs text-brand-300/90">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-1 border-t border-white/[0.06] pt-2">
        <button
          type="button"
          onClick={() => toggleLike(post.id)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
            liked ? 'text-rose-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
          )}
        >
          <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
          {formatNumber(post.likes)}
        </button>
        <button
          type="button"
          onClick={() => pushToast('Comentarios simulados — próximamente 💬', 'info')}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          <MessageCircle className="h-4 w-4" />
          {formatNumber(post.comments)}
        </button>
        <button
          type="button"
          onClick={() => pushToast('Enlace copiado (simulado) 🔗', 'info')}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </button>
        <button
          type="button"
          onClick={() => toggleFavorite(post.id)}
          className={cn(
            'ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
            saved ? 'text-brand-300' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
          )}
          aria-label="Guardar publicación"
        >
          <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
        </button>
      </div>
    </article>
  );
}
