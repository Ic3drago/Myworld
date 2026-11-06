import type { Gradient } from './user.types';

export interface EventItem {
  id: string;
  title: string;
  community: string;
  communityId: string;
  /** Human friendly day label, e.g. "Hoy", "Mañana", "Vie 15". */
  dateLabel: string;
  /** 24h time, e.g. "20:00". */
  time: string;
  participants: number;
  category: string;
  gradient: Gradient;
  description: string;
  /** Whether the current user has already joined (simulated). */
  joined?: boolean;
}
