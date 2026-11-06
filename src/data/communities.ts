import type { Community } from '@/types';

export const communities: Community[] = [
  {
    id: 'c-fortnite',
    name: 'Fortnite Squad',
    description:
      'El punto de encuentro para armar escuadrones, compartir clips y dominar cada temporada de Fortnite.',
    category: 'Videojuegos',
    members: 12840,
    activeMembers: 1240,
    gradient: ['#3b82f6', '#8b5cf6'],
    icon: 'gamepad',
    tags: ['Fortnite', 'Squad', 'Battle Royale'],
    trending: true,
  },
  {
    id: 'c-anime',
    name: 'Anime Universe',
    description:
      'Debates de temporada, recomendaciones, fan-arts y watch-parties del anime que todos estamos viendo.',
    category: 'Anime',
    members: 24500,
    activeMembers: 3120,
    gradient: ['#ec4899', '#8b5cf6'],
    icon: 'sparkles',
    tags: ['Anime', 'Manga', 'Cosplay'],
    trending: true,
  },
  {
    id: 'c-devs',
    name: 'Developers Hub',
    description:
      'Comunidad de desarrolladores donde compartimos dudas, proyectos open-source y oportunidades reales.',
    category: 'Tecnología',
    members: 18200,
    activeMembers: 2100,
    gradient: ['#6366f1', '#06b6d4'],
    icon: 'code',
    tags: ['Código', 'Open Source', 'Carrera'],
  },
  {
    id: 'c-latam',
    name: 'Gamers LATAM',
    description:
      'La comunidad gaming más grande de Latinoamérica. Torneos, memes y gente con quien jugar siempre.',
    category: 'Videojuegos',
    members: 31200,
    activeMembers: 4260,
    gradient: ['#10b981', '#14b8a6'],
    icon: 'gamepad',
    tags: ['LATAM', 'Torneos', 'Comunidad'],
    trending: true,
  },
  {
    id: 'c-creative',
    name: 'Creative Minds',
    description:
      'Artistas, diseñadores y creadores que se inspiran mutuamente. Comparte tu proceso y recibe feedback.',
    category: 'Creatividad',
    members: 9800,
    activeMembers: 860,
    gradient: ['#f59e0b', '#f97316'],
    icon: 'palette',
    tags: ['Arte', 'Ilustración', 'Diseño'],
  },
  {
    id: 'c-lofi',
    name: 'Lo-Fi Lounge',
    description:
      'Música para trabajar, estudiar o simplemente desconectar. Playlists colaborativas y sesiones chill.',
    category: 'Música',
    members: 7600,
    activeMembers: 540,
    gradient: ['#a855f7', '#ec4899'],
    icon: 'music',
    tags: ['Música', 'Lo-Fi', 'Chill'],
  },
  {
    id: 'c-indie',
    name: 'Indie Game Devs',
    description:
      'Make games together. Compartimos prototipos, engines y feedback honesto para llevar tu idea al siguiente nivel.',
    category: 'Tecnología',
    members: 5400,
    activeMembers: 620,
    gradient: ['#06b6d4', '#3b82f6'],
    icon: 'code',
    tags: ['Indie', 'GameDev', 'Unity'],
  },
  {
    id: 'c-cosplay',
    name: 'Cosplay Central',
    description:
      'Comparte tus builds, tips de telas y organización de fotos. Pasión por dar vida a personajes.',
    category: 'Anime',
    members: 4300,
    activeMembers: 410,
    gradient: ['#f43f5e', '#ec4899'],
    icon: 'sparkles',
    tags: ['Cosplay', 'Eventos', 'Anime'],
  },
  {
    id: 'c-minecraft',
    name: 'Minecraft Builders',
    description:
      'Mega-builds, servidores survival y redstone. Un lugar para mostrar tus construcciones más locas.',
    category: 'Videojuegos',
    members: 15600,
    activeMembers: 1380,
    gradient: ['#84cc16', '#10b981'],
    icon: 'trophy',
    tags: ['Minecraft', 'Builds', 'Survival'],
  },
];

/** Daily recommended community featured in the right panel. */
export const dailyRecommendation = {
  communityId: 'c-devs',
  reason:
    'Porque compartes intereses en programación y tecnología, y aquí hay personas creando proyectos muy parecidos a los tuyos.',
};
