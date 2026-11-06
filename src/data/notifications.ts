import type { AppNotification } from '@/types';

export const notifications: AppNotification[] = [
  {
    id: 'n-1',
    kind: 'connect',
    title: 'Daniel Torres quiere conectar',
    description: 'Tienen 94% de compatibilidad en gaming y anime.',
    timeAgo: 'Hace 5 min',
    read: false,
  },
  {
    id: 'n-2',
    kind: 'event',
    title: 'Torneo Fortnite Squad #12',
    description: 'Empieza hoy a las 20:00. Ya estás inscrito.',
    timeAgo: 'Hace 32 min',
    read: false,
  },
  {
    id: 'n-3',
    kind: 'community',
    title: 'Developers Hub publicó algo nuevo',
    description: 'Andrés Pardo compartió un proyecto en el que puedes ayudar.',
    timeAgo: 'Hace 2 h',
    read: false,
  },
  {
    id: 'n-4',
    kind: 'message',
    title: 'Nuevo mensaje de Valentina',
    description: '“El capítulo de ayer estuvo increíble 😭”',
    timeAgo: 'Hace 3 h',
    read: true,
  },
];
