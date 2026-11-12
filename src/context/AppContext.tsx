import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiRequest } from '@/api/client';
import type { AppBootstrap } from '@/api/types';
import type { Community, Post, PostType, User } from '@/types';
import { useAuth } from '@/context/AuthContext';

export interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'info' | 'error';
}

interface AppContextValue {
  user: User;
  people: User[];
  communities: Community[];
  events: AppBootstrap['events'];
  posts: Post[];
  notifications: AppBootstrap['notifications'];
  conversations: AppBootstrap['conversations'];
  connections: string[];
  joinedCommunities: string[];
  favorites: string[];
  joinedEvents: string[];
  likedPosts: string[];
  activeConversationId: string | null;
  profileUserId: string | null;
  toasts: Toast[];
  loading: boolean;
  loadError: string | null;
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
  createPost: (content: string, tags: string[], type: PostType) => Promise<boolean>;
  updateProfile: (name: string, handle: string) => Promise<void>;
  updatePreferences: (preferences: AppBootstrap['preferences']) => Promise<void>;
  retryLoad: () => void;
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
  preferences: AppBootstrap['preferences'];
}

const AppContext = createContext<AppContextValue | null>(null);

let toastCounter = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser, updateUser } = useAuth();
  const [data, setData] = useState<AppBootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string, variant: Toast['variant'] = 'success') => {
    toastCounter += 1;
    const id = `toast-${toastCounter}`;
    setToasts((previous) => [...previous, { id, message, variant }]);
    window.setTimeout(() => setToasts((previous) => previous.filter((toast) => toast.id !== id)), 3200);
  }, []);

  const dismissToast = useCallback((id: string) => setToasts((previous) => previous.filter((toast) => toast.id !== id)), []);
  const refresh = useCallback(async () => {
    const next = await apiRequest<AppBootstrap>('/bootstrap');
    setData(next);
    setActiveConversationId((current) => current ?? next.activeConversationId);
    return next;
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest<AppBootstrap>('/bootstrap')
      .then((next) => {
        if (!active) return;
        setData(next);
        setActiveConversationId(next.activeConversationId);
      })
      .catch((cause: unknown) => {
        if (active) setLoadError(cause instanceof Error ? cause.message : 'No se pudo cargar la aplicación.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const retryLoad = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    refresh()
      .catch((cause: unknown) => setLoadError(cause instanceof Error ? cause.message : 'No se pudo cargar la aplicación.'))
      .finally(() => setLoading(false));
  }, [refresh]);

  const runAction = useCallback(async (
    path: string,
    options: RequestInit,
    message?: string,
    variant: Toast['variant'] = 'success',
  ) => {
    try {
      await apiRequest<void>(path, options);
      await refresh();
      if (message) pushToast(message, variant);
    } catch (cause) {
      pushToast(cause instanceof Error ? cause.message : 'No se pudo completar la acción.', 'error');
    }
  }, [pushToast, refresh]);

  const connectUser = useCallback((id: string) => {
    const connected = data?.connections.includes(id) ?? false;
    const name = data?.people.find((person) => person.id === id)?.name ?? 'usuario';
    void runAction(`/connections/${encodeURIComponent(id)}/toggle`, { method: 'POST' },
      connected ? `Conexión retirada con ${name}` : `Conectaste con ${name}`, connected ? 'info' : 'success');
  }, [data, runAction]);
  const joinCommunity = useCallback((id: string) => {
    void runAction(`/communities/${encodeURIComponent(id)}/membership`, { method: 'POST' }, 'Te uniste a la comunidad.');
  }, [runAction]);
  const leaveCommunity = useCallback((id: string) => {
    void runAction(`/communities/${encodeURIComponent(id)}/membership`, { method: 'DELETE' }, 'Saliste de la comunidad.', 'info');
  }, [runAction]);
  const joinEvent = useCallback((id: string) => {
    void runAction(`/events/${encodeURIComponent(id)}/join`, { method: 'POST' }, 'Te inscribiste al evento.');
  }, [runAction]);
  const toggleFavorite = useCallback((id: string) => {
    const entityType = data?.posts.some((post) => post.id === id) ? 'post'
      : data?.communities.some((community) => community.id === id) ? 'community' : 'user';
    const saved = data?.favorites.includes(id) ?? false;
    void runAction('/favorites/toggle', { method: 'POST', body: JSON.stringify({ entityId: id, entityType }) },
      saved ? 'Eliminado de guardados.' : 'Guardado en tu colección.', saved ? 'info' : 'success');
  }, [data, runAction]);
  const toggleLike = useCallback((id: string) => {
    void runAction(`/posts/${encodeURIComponent(id)}/like/toggle`, { method: 'POST' });
  }, [runAction]);
  const markNotificationRead = useCallback((id: string) => {
    void runAction(`/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
  }, [runAction]);
  const markAllNotificationsRead = useCallback(() => {
    void runAction('/notifications/read-all', { method: 'POST' });
  }, [runAction]);
  const openConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    void runAction(`/conversations/${encodeURIComponent(id)}/read`, { method: 'POST' });
  }, [runAction]);
  const sendMessage = useCallback((conversationId: string, text: string) => {
    if (!text.trim()) return;
    void runAction(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST', body: JSON.stringify({ text }),
    });
  }, [runAction]);
  const createPost = useCallback(async (content: string, tags: string[], type: PostType) => {
    try {
      await apiRequest('/posts', { method: 'POST', body: JSON.stringify({ content, tags, type }) });
      await refresh();
      pushToast('Publicación creada.');
      return true;
    } catch (cause) {
      pushToast(cause instanceof Error ? cause.message : 'No se pudo crear la publicación.', 'error');
      return false;
    }
  }, [pushToast, refresh]);
  const updateProfile = useCallback(async (name: string, handle: string) => {
    try {
      const result = await apiRequest<{ user: User }>('/me', {
        method: 'PATCH', body: JSON.stringify({ name, handle }),
      });
      updateUser(result.user);
      setData((current) => current ? { ...current, user: result.user } : current);
      pushToast('Perfil actualizado.');
    } catch (cause) {
      pushToast(cause instanceof Error ? cause.message : 'No se pudo actualizar el perfil.', 'error');
    }
  }, [pushToast, updateUser]);
  const updatePreferences = useCallback(async (preferences: AppBootstrap['preferences']) => {
    try {
      await apiRequest('/preferences', { method: 'PATCH', body: JSON.stringify(preferences) });
      await refresh();
      pushToast('Preferencias guardadas.');
    } catch (cause) {
      pushToast(cause instanceof Error ? cause.message : 'No se pudieron guardar las preferencias.', 'error');
    }
  }, [pushToast, refresh]);

  const user = data?.user ?? authUser!;
  const people = data?.people ?? [];
  const communities = data?.communities ?? [];
  const events = data?.events ?? [];
  const posts = data?.posts ?? [];
  const notifications = data?.notifications ?? [];
  const conversations = data?.conversations ?? [];
  const connections = data?.connections ?? [];
  const joinedCommunities = data?.joinedCommunities ?? [];
  const favorites = data?.favorites ?? [];
  const joinedEvents = data?.joinedEvents ?? [];
  const likedPosts = data?.likedPosts ?? [];
  const isConnected = (id: string) => connections.includes(id);
  const isJoined = (id: string) => joinedCommunities.includes(id);
  const isFavorite = (id: string) => favorites.includes(id);
  const isEventJoined = (id: string) => joinedEvents.includes(id);
  const isPostLiked = (id: string) => likedPosts.includes(id);
  const getUser = (id: string) => id === user.id ? user : people.find((person) => person.id === id);
  const getCommunity = (id: string) => communities.find((community) => community.id === id);

  const value: AppContextValue = {
    user, people, communities, events, posts, notifications, conversations, connections,
    joinedCommunities, favorites, joinedEvents, likedPosts, activeConversationId,
    profileUserId, toasts, loading, loadError, connectUser, joinCommunity, leaveCommunity,
    joinEvent, toggleFavorite, toggleLike, markNotificationRead, markAllNotificationsRead,
    openConversation, sendMessage, createPost, updateProfile, updatePreferences, retryLoad,
    openProfile: setProfileUserId, closeProfile: () => setProfileUserId(null),
    pushToast, dismissToast, isConnected, isJoined, isFavorite, isEventJoined, isPostLiked,
    getUser, getCommunity, unreadMessageCount: data?.unreadMessageCount ?? 0,
    unreadNotificationCount: data?.unreadNotificationCount ?? 0,
    preferences: data?.preferences ?? { push: true, email: false, online: true },
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
