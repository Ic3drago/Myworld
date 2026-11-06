import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import type { Community, User } from '@/types';

/**
 * Resolves the raw favorite ids stored in app state into typed
 * Community/User collections for the Saved page.
 */
export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite, getUser, getCommunity } = useApp();

  const savedCommunities = useMemo(
    () =>
      favorites
        .map((id) => getCommunity(id))
        .filter((c): c is Community => Boolean(c)),
    [favorites, getCommunity],
  );

  const savedPeople = useMemo(
    () =>
      favorites
        .map((id) => getUser(id))
        .filter((u): u is User => Boolean(u)),
    [favorites, getUser],
  );

  return {
    favorites,
    savedCommunities,
    savedPeople,
    total: favorites.length,
    toggleFavorite,
    isFavorite,
  };
}
