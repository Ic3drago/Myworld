import type { Gradient } from './user.types';

export type PostType = 'team' | 'community' | 'share';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorGradient: Gradient;
  /** Optional community name the post belongs to. */
  community?: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  /** Whether the current user liked it (simulated). */
  liked?: boolean;
  type: PostType;
}
