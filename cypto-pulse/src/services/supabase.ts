export type AppUser = {
  id: string;
  email?: string | null;
};

export const isSupabaseConfigured = false;

// Supabase is intentionally disabled for now.
// When re-enabling, wire the client creation here and set a proper type.
export const supabase: any = null;
