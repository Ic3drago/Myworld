import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { apiRequest, ApiError } from '@/api/client';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, handle: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiRequest<{ user: User }>('/auth/me')
      .then(({ user: sessionUser }) => {
        if (active) setUser(sessionUser);
      })
      .catch((cause: unknown) => {
        if (active && !(cause instanceof ApiError && cause.status === 401)) {
          setError(cause instanceof Error ? cause.message : 'No se pudo conectar con el servidor.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const result = await apiRequest<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, handle: string, password: string) => {
      setError(null);
      const result = await apiRequest<{ user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, handle, password }),
      });
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest<void>('/auth/logout', { method: 'POST' });
    } catch {
      // The local session must still be cleared when the API is unavailable.
    } finally {
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((nextUser: User) => setUser(nextUser), []);
  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, updateUser, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}