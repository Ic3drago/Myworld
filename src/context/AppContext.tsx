import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppNotification,
  Community,
  Conversation,
  EventItem,
  Post,
  User,
} from '@/types';
import { currentUser, people as seedPeople } from '@/data/users';
import { communities as seedCommunities } from '@/data/communities';
import { events as seedEvents } from '@/data/events';
import { posts as seedPosts } from '@/data/posts';
import { conversations as seedConversations } from '@/data/messages';
import { notifications as seedNotifications } from '@/data/notifications';

export interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'info' | 'error';
}

interface AppContextValue {
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
  profileUserId: string | null;
  toasts: Toast[];

  connectUser: (id: string) => void;
  joinCommunity: (id: string) => void;
  leaveCommunity: (id: string) => void;
  joinEvent: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleLike: (postId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  openConversation: (id: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  openProfile: (userId: string) => void;
  closeProfile: () => void;
  pushToast: (message: string, variant?: Toast['variant']) => void;
  dismissToast: (id: string) => void;

  isConnected: (id: string) => boolean;
  isJoined: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
  isEventJoined: (id: string) => boolean;
  isPostLiked: (id: string) => boolean;
  getUser: (id: string) => User | undefined;
  getCommunity: (id: string) => Community | undefined;
  unreadMessageCount: number;
  unreadNotificationCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

let toastCounter = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const user = currentUser;
  const [people] = useState<User[]>(seedPeople);
  const [communities] = useState<Community[]>(seedCommunities);
  const [events, setEvents] = useState<EventItem[]>(seedEvents);
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);

  const [connections, setConnections] = useState<string[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(['c-latam', 'c-minecraft']);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<string[]>(
    seedEvents.filter((e) => e.joined).map((e) => e.id),
  );
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    seedConversations[0]?.id ?? null,
  );
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pushToast = useCallback((message: string, variant: Toast['variant'] = 'success') => {
    toastCounter += 1;
    const id = `toast-${toastCounter}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const connectUser = useCallback(
    (id: string) => {
      const target = people.find((p) => p.id === id);
      if (connections.includes(id)) {
        setConnections((prev) => prev.filter((c) => c !== id));
        pushToast(`Conexión retirada con ${target?.name ?? 'usuario'}`, 'info');
      } else {
        setConnections((prev) => [...prev, id]);
        pushToast(`¡Conectaste con ${target?.name ?? 'usuario'}! 🎉`);
      }
    },
    [connections, people, pushToast],
  );

  const joinCommunity = useCallback(
    (id: string) => {
      if (joinedCommunities.includes(id)) return;
      setJoinedCommunities((prev) => [...prev, id]);
      const community = communities.find((c) => c.id === id);
      pushToast(`Te uniste a ${community?.name ?? 'la comunidad'} 🚀`);
    },
    [joinedCommunities, communities, pushToast],
  );

  const leaveCommunity = useCallback(
    (id: string) => {
      setJoinedCommunities((prev) => prev.filter((c) => c !== id));
      const community = communities.find((c) => c.id === id);
      pushToast(`Saliste de ${community?.name ?? 'la comunidad'}`, 'info');
    },
    [communities, pushToast],
  );

  const joinEvent = useCallback(
    (id: string) => {
      if (joinedEvents.includes(id)) return;
      setJoinedEvents((prev) => [...prev, id]);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, participants: e.participants + 1 } : e)),
      );
      const event = events.find((e) => e.id === id);
      pushToast(`¡Inscrito en ${event?.title ?? 'el evento'}! 📅`);
    },
    [joinedEvents, events, pushToast],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (favorites.includes(id)) {
        setFavorites((prev) => prev.filter((f) => f !== id));
        pushToast('Eliminado de guardados', 'info');
      } else {
        setFavorites((prev) => [...prev, id]);
        pushToast('Guardado en tu colección ⭐');
      }
    },
    [favorites, pushToast],
  );

  const toggleLike = useCallback(
    (postId: string) => {
      const already = likedPosts.includes(postId);
      setLikedPosts((prev) =>
        already ? prev.filter((id) => id !== postId) : [...prev, postId],
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + (already ? -1 : 1), liked: !already } : p,
        ),
      );
    },
    [likedPosts],
  );
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const openConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const time = new Date().toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: `m-${Date.now()}`,
                    senderId: user.id,
                    text: trimmed,
                    time,
                    mine: true,
                  },
                ],
              }
            : c,
        ),
      );
    },
    [user.id],
  );

  const openProfile = useCallback((userId: string) => setProfileUserId(userId), []);
  const closeProfile = useCallback(() => setProfileUserId(null), []);

  const isConnected = useCallback((id: string) => connections.includes(id), [connections]);
  const isJoined = useCallback((id: string) => joinedCommunities.includes(id), [joinedCommunities]);
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const isEventJoined = useCallback((id: string) => joinedEvents.includes(id), [joinedEvents]);
  const isPostLiked = useCallback((id: string) => likedPosts.includes(id), [likedPosts]);

  const getUser = useCallback(
    (id: string) => (id === user.id ? user : people.find((p) => p.id === id)),
    [people, user],
  );
  const getCommunity = useCallback(
    (id: string) => communities.find((c) => c.id === id),
    [communities],
  );

  const unreadMessageCount = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unread, 0),
    [conversations],
  );
  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value: AppContextValue = {
    user,
    people,
    communities,
    events,
    posts,
    notifications,
    conversations,
    connections,
    joinedCommunities,
    favorites,
    joinedEvents,
    likedPosts,
    activeConversationId,
    profileUserId,
    toasts,
    connectUser,
    joinCommunity,
    leaveCommunity,
    joinEvent,
    toggleFavorite,
    toggleLike,
    markNotificationRead,
    markAllNotificationsRead,
    openConversation,
    sendMessage,
    openProfile,
    closeProfile,
    pushToast,
    dismissToast,
    isConnected,
    isJoined,
    isFavorite,
    isEventJoined,
    isPostLiked,
    getUser,
    getCommunity,
    unreadMessageCount,
    unreadNotificationCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de <AppProvider>');
  }
  return ctx;
}
