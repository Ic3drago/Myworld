import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { CategoryFilter } from '@/types';

/**
 * Encapsulates community discovery: search, category filter and
 * join/leave/favorite actions.
 */
export function useCommunities() {
  const {
    communities,
    joinedCommunities,
    joinCommunity,
    leaveCommunity,
    isJoined,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Todos');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return communities.filter((community) => {
      const matchesQuery =
        !q ||
        community.name.toLowerCase().includes(q) ||
        community.description.toLowerCase().includes(q) ||
        community.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCategory = category === 'Todos' || community.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [communities, query, category]);

  const myCommunities = useMemo(
    () => communities.filter((c) => joinedCommunities.includes(c.id)),
    [communities, joinedCommunities],
  );

  const reset = () => {
    setQuery('');
    setCategory('Todos');
  };

  return {
    communities,
    filtered,
    myCommunities,
    query,
    setQuery,
    category,
    setCategory,
    reset,
    joinCommunity,
    leaveCommunity,
    isJoined,
    toggleFavorite,
    isFavorite,
  };
}
