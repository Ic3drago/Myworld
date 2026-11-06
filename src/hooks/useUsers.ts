import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';

/**
 * Encapsulates people listing: search, interest filter, online filter and
 * connection actions. Keeps UI components thin and focused on rendering.
 */
export function useUsers() {
  const { user, people, connections, connectUser, isConnected, openProfile } = useApp();
  const [query, setQuery] = useState('');
  const [interest, setInterest] = useState('Todos');
  const [onlyOnline, setOnlyOnline] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((person) => {
      const matchesQuery =
        !q ||
        person.name.toLowerCase().includes(q) ||
        person.handle.toLowerCase().includes(q) ||
        person.interests.some((i) => i.toLowerCase().includes(q)) ||
        person.games.some((g) => g.toLowerCase().includes(q));

      const matchesInterest =
        interest === 'Todos' || person.interests.includes(interest);

      const matchesOnline = !onlyOnline || person.online;

      return matchesQuery && matchesInterest && matchesOnline;
    });
  }, [people, query, interest, onlyOnline]);

  const reset = () => {
    setQuery('');
    setInterest('Todos');
    setOnlyOnline(false);
  };

  return {
    user,
    people,
    filtered,
    connections,
    query,
    setQuery,
    interest,
    setInterest,
    onlyOnline,
    setOnlyOnline,
    reset,
    connectUser,
    isConnected,
    openProfile,
  };
}
