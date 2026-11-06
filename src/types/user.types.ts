/** A "from → to" gradient pair used to render decorative avatars/covers. */
export type Gradient = [string, string];

export interface User {
  id: string;
  name: string;
  handle: string;
  initials: string;
  gradient: Gradient;
  bio: string;
  interests: string[];
  games: string[];
  online: boolean;
  /** Current activity shown in the sidebar/right panel, e.g. "Jugando Valorant". */
  activity?: string;
  /** 0 - 100 compatibility score with the current user. */
  compatibility: number;
  location: string;
  role?: string;
  /** Number of shared communities (simulated). */
  mutualCommunities?: number;
}
