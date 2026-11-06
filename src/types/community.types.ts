import type { Gradient } from './user.types';

export type CommunityCategory =
  | 'Videojuegos'
  | 'Anime'
  | 'Tecnología'
  | 'Música'
  | 'Diseño'
  | 'Creatividad';

/** Filter value used by the category chips (includes an "all" option). */
export type CategoryFilter = CommunityCategory | 'Todos';

/** Keys mapped to real Lucide icons inside the CommunityIcon component. */
export type CommunityIconKey =
  | 'gamepad'
  | 'sparkles'
  | 'code'
  | 'music'
  | 'palette'
  | 'trophy'
  | 'ghost';

export interface Community {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  members: number;
  activeMembers: number;
  gradient: Gradient;
  icon: CommunityIconKey;
  tags: string[];
  trending?: boolean;
}
