import { useEffect, useRef, useState } from "react";
import { PROFILE_CHANGED_EVENT, useLocalProfile } from "./useLocalProfile";
import { useAuth } from "../auth/AuthProvider";
import {
  loadFavoritesForUser,
  saveFavoritesForUser,
} from "../services/supabaseFavorites";

function readFavoritesFromStorage(storageKey: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === "string");
  } catch (error) {
    console.error("Failed to parse favorites from localStorage:", error);
    return [];
  }
}

export function useFavorites() {
  const { user } = useAuth();
  const { currentProfileId } = useLocalProfile();
  const storageKey = user?.id
    ? `crypto-pulse-favorites:user:${user.id}`
    : `crypto-pulse-favorites:profile:${currentProfileId}`;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const lastSyncedRef = useRef("");

  useEffect(() => {
    let active = true;
    setHydrated(false);

    if (user?.id) {
      loadFavoritesForUser(user.id)
        .then((remoteFavorites) => {
          if (!active) return;
          const deduped = [...new Set(remoteFavorites)];
          setFavorites(deduped);
          lastSyncedRef.current = JSON.stringify(deduped);
          setHydrated(true);
        })
        .catch((error) => {
          if (!active) return;
          console.error("Failed to load Supabase favorites:", error);
          const fallback = readFavoritesFromStorage(storageKey);
          setFavorites(fallback);
          lastSyncedRef.current = JSON.stringify(fallback);
          setHydrated(true);
        });

      return () => {
        active = false;
      };
    }

    const localFavorites = readFavoritesFromStorage(storageKey);
    setFavorites(localFavorites);
    lastSyncedRef.current = JSON.stringify(localFavorites);
    setHydrated(true);

    return () => {
      active = false;
    };
  }, [storageKey, user?.id]);

  useEffect(() => {
    if (user?.id) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      setFavorites(readFavoritesFromStorage(storageKey));
    };

    const handleProfileChange = () => {
      setFavorites(readFavoritesFromStorage(storageKey));
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(PROFILE_CHANGED_EVENT, handleProfileChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PROFILE_CHANGED_EVENT, handleProfileChange);
    };
  }, [storageKey, user?.id]);

  useEffect(() => {
    const deduped = [...new Set(favorites)];

    if (deduped.length !== favorites.length) {
      setFavorites(deduped);
    }
  }, [favorites]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const serialized = JSON.stringify(favorites);
    if (serialized === lastSyncedRef.current) {
      return;
    }

    lastSyncedRef.current = serialized;

    if (user?.id) {
      saveFavoritesForUser(user.id, favorites).catch((error) => {
        console.error("Failed to save Supabase favorites:", error);
      });
      return;
    }

    localStorage.setItem(storageKey, serialized);
  }, [favorites, storageKey, user?.id, hydrated]);

  function toggleFavorite(coinId: string) {
    setFavorites((current) =>
      current.includes(coinId)
        ? current.filter((id) => id !== coinId)
        : [...current, coinId]
    );
  }

  function isFavorite(coinId: string) {
    return favorites.includes(coinId);
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
