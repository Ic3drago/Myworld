import type {
  AppNotification,
  Community,
  Conversation,
  EventItem,
  Post,
  User,
} from '@/types';

export interface AppBootstrap {
  user: User;
  people: User[];
  communities: Community[];
  events: EventItem[];
  posts: Post[];
  notifications: AppNotification[];
  conversations: Conversation[];
  connections: string[];
  joinedCommunities: string[];
  favorites: string[];
  joinedEvents: string[];
  likedPosts: string[];
  activeConversationId: string | null;
  unreadMessageCount: number;
  unreadNotificationCount: number;
  preferences: { push: boolean; email: boolean; online: boolean };
}