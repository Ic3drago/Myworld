import type { Post } from '@/types';

export const posts: Post[] = [
  {
    id: 'p-1',
    authorId: 'u-daniel',
    authorName: 'Daniel Torres',
    authorInitials: 'DT',
    authorGradient: ['#3b82f6', '#06b6d4'],
    community: 'Fortnite Squad',
    timeAgo: 'Hace 12 min',
    content:
      'Busco 2 jugadores para completar la squad de Fortnite esta noche 🔥 Nivel intermedio, buen ambiente obligatorio. Ideal un support y alguien que domine las builds. ¿Quién se apunta?',
    tags: ['Fortnite', 'Squad', 'Noche'],
    likes: 42,
    comments: 12,
    type: 'team',
  },
  {
    id: 'p-2',
    authorId: 'u-valentina',
    authorName: 'Valentina Ríos',
    authorInitials: 'VR',
    authorGradient: ['#f43f5e', '#ec4899'],
    community: 'Anime Universe',
    timeAgo: 'Hace 1 h',
    content:
      'Esta noche arranca la watch-party de la nueva temporada 🍿 Nos vemos en la sala a las 18:30. Trae tus snacks y tus teorías más locas.',
    tags: ['Anime', 'Watchparty'],
    likes: 128,
    comments: 34,
    type: 'community',
  },
  {
    id: 'p-3',
    authorId: 'u-andres',
    authorName: 'Andrés Pardo',
    authorInitials: 'AP',
    authorGradient: ['#06b6d4', '#3b82f6'],
    community: 'Developers Hub',
    timeAgo: 'Hace 2 h',
    content:
      'Terminé el primer prototipo de mi app de hábitos hecha con React + TypeScript 🚀 Ya funciona el flujo completo. Acepto feedback honesto antes de pulir detalles.',
    tags: ['React', 'TypeScript', 'SideProject'],
    likes: 87,
    comments: 19,
    type: 'share',
  },
  {
    id: 'p-4',
    authorId: 'u-camila',
    authorName: 'Camila Suárez',
    authorInitials: 'CS',
    authorGradient: ['#f59e0b', '#f97316'],
    community: 'Creative Minds',
    timeAgo: 'Hace 3 h',
    content:
      'Nuevo fan-art de Genshin terminado ✨ Me tomó casi una semana de trabajo. ¿Qué personaje debería dibujar después? Los leo 👀',
    tags: ['Fanart', 'Genshin', 'Ilustración'],
    likes: 203,
    comments: 41,
    type: 'share',
  },
];
