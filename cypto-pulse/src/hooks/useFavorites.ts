import { useEffect, useState } from "react";

const STORAGE_KEY = "crypto-pulse-favorites";

function readFavoritesFromStorage(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

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
  const [favorites, setFavorites] = useState<string[]>(readFavoritesFromStorage);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      setFavorites(readFavoritesFromStorage());
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const deduped = [...new Set(favorites)];

    if (deduped.length !== favorites.length) {
      setFavorites(deduped);
    }
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

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
