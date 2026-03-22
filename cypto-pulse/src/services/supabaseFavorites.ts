import { supabase } from "./supabase";

type FavoriteRow = {
  coin_id: string;
};

export async function loadFavoritesForUser(userId: string): Promise<string[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_favorites")
    .select("coin_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as FavoriteRow[];
  return rows
    .map((row) => row.coin_id)
    .filter((coinId): coinId is string => typeof coinId === "string");
}

export async function saveFavoritesForUser(
  userId: string,
  favorites: string[]
): Promise<void> {
  if (!supabase) {
    return;
  }

  const deduped = [...new Set(favorites)];

  const { error: deleteError } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (deduped.length === 0) {
    return;
  }

  const rows = deduped.map((coinId) => ({ user_id: userId, coin_id: coinId }));
  const { error: insertError } = await supabase.from("user_favorites").insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }
}
