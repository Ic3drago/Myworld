import type { Conversation } from '@/types';

export const conversations: Conversation[] = [
  {
    id: 'conv-daniel',
    participantId: 'u-daniel',
    participantName: 'Daniel Torres',
    participantInitials: 'DT',
    gradient: ['#3b82f6', '#06b6d4'],
    online: true,
    activity: 'Jugando Valorant',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'u-daniel', text: '¿Juegas hoy?', time: '19:40', mine: false },
      { id: 'm2', senderId: 'u-alex', text: '¡Claro! Tipo 9pm me conecto', time: '19:41', mine: true },
      { id: 'm3', senderId: 'u-daniel', text: 'Perfecto, te espero en la party 🙌', time: '19:42', mine: false },
    ],
  },
  {
    id: 'conv-sofia',
    participantId: 'u-sofia',
    participantName: 'Sofía Herrera',
    participantInitials: 'SH',
    gradient: ['#ec4899', '#8b5cf6'],
    online: true,
    activity: 'Escuchando lo-fi beats',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'u-sofia', text: 'Te pasé la playlist que te comenté 💜', time: '17:10', mine: false },
      { id: 'm2', senderId: 'u-alex', text: '¡Gracias! La escucho mientras trabajo', time: '17:12', mine: true },
    ],
  },
  {
    id: 'conv-valentina',
    participantId: 'u-valentina',
    participantName: 'Valentina Ríos',
    participantInitials: 'VR',
    gradient: ['#f43f5e', '#ec4899'],
    online: true,
    activity: 'Viendo anime',
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'u-valentina', text: 'El capítulo de ayer estuvo increíble 😭', time: '15:05', mine: false },
    ],
  },
  {
    id: 'conv-mateo',
    participantId: 'u-mateo',
    participantName: 'Mateo Gómez',
    participantInitials: 'MG',
    gradient: ['#6366f1', '#8b5cf6'],
    online: false,
    activity: 'Hace 2 h',
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'u-mateo', text: 'Subí el server de Minecraft esta noche', time: '12:30', mine: false },
      { id: 'm2', senderId: 'u-alex', text: 'Genial, me conecto luego a ver', time: '12:35', mine: true },
    ],
  },
];
