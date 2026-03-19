import { useEffect, useState } from "react";

const STORAGE_KEY = "crypto-pulse-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setFavorites(parsed);
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }
  }, []);

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