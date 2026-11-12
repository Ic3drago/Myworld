import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import type { Community, Post, User } from '@/types';

/**
 * Resolves the raw favorite ids stored in app state into typed
 * Community/User collections for the Saved page.
 */
export function useFavorites() {
  const { favorites, posts, toggleFavorite, isFavorite, getUser, getCommunity } = useApp();

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

  const savedPosts = useMemo(
    () => favorites.map((id) => posts.find((post) => post.id === id)).filter((post): post is Post => Boolean(post)),
    [favorites, posts],
  );

  return {
    favorites,
    savedCommunities,
    savedPeople,
    savedPosts,
    total: favorites.length,
    toggleFavorite,
    isFavorite,
  };
}
