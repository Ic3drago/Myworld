import {
  Home,
  Compass,
  Users,
  Gamepad2,
  Layers,
  MessageSquare,
  CalendarDays,
  Bookmark,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryFilter } from '@/types';

/**
 * Centralized brand identity. Change the name here once and it updates
 * everywhere it is referenced (sidebar, header, meta, etc.).
 */
export const BRAND = {
  name: 'NEXORA',
  tagline: 'Encuentra tu gente. Encuentra tu lugar.',
} as const;

export type SectionId =
  | 'dashboard'
  | 'discover'
  | 'people'
  | 'team'
  | 'communities'
  | 'messages'
  | 'events'
  | 'saved'
  | 'settings';

export interface NavItem {
  id: SectionId;
  label: string;
  path: string;
  icon: LucideIcon;
  /** When set, the item shows an unread badge driven by app state. */
  badgeKey?: 'messages' | 'notifications';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Inicio', path: '/', icon: Home },
  { id: 'discover', label: 'Descubrir comunidades', path: '/discover', icon: Compass },
  { id: 'people', label: 'Encuentra personas', path: '/people', icon: Users },
  { id: 'team', label: 'Encuentra equipo', path: '/team', icon: Gamepad2 },
  { id: 'communities', label: 'Mis comunidades', path: '/communities', icon: Layers },
  {
    id: 'messages',
    label: 'Mensajes',
    path: '/messages',
    icon: MessageSquare,
    badgeKey: 'messages',
  },
  { id: 'events', label: 'Eventos', path: '/events', icon: CalendarDays },
  { id: 'saved', label: 'Guardados', path: '/saved', icon: Bookmark },
  { id: 'settings', label: 'Configuración', path: '/settings', icon: Settings },
];

/** Primary categories used by the community filter chips. */
export const CATEGORY_FILTERS: CategoryFilter[] = [
  'Todos',
  'Videojuegos',
  'Anime',
  'Tecnología',
  'Música',
  'Diseño',
  'Creatividad',
];

/** Interest chips used in the People filters. */
export const INTEREST_FILTERS = [
  'Todos',
  'Gaming',
  'Anime',
  'Programación',
  'Música',
  'Diseño',
];
