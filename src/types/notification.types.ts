export type NotificationKind = 'connect' | 'community' | 'event' | 'message';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
}
