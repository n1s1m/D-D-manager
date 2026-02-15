import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

let _client: SupabaseClient | null = null;

/**
 * Returns a Supabase client singleton using NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY from the app that imports this package.
 * In the browser uses createBrowserClient (session in cookies) so the proxy can read it.
 */
function isBrowser(): boolean {
  return typeof (globalThis as { window?: unknown }).window !== 'undefined';
}

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    const client = isBrowser()
      ? createBrowserClient(url, key)
      : createSupabaseClient(url, key);
    _client = client;
  }
  return _client as SupabaseClient;
}

/** Supabase client instance (lazy singleton). Use this in app code. */
export const supabase = getSupabase();

/**
 * Escape special characters for PostgREST ilike patterns (% and _ are wildcards).
 */
export function escapeIlike(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

/**
 * Get current authenticated user. Throws if not authenticated.
 */
export async function getCurrentUser(client: SupabaseClient): Promise<User> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user;
}

/**
 * Create a Supabase client instance
 * Each application should pass its own environment variables
 *
 * @param url - Supabase project URL (NEXT_PUBLIC_SUPABASE_URL)
 * @param anonKey - Supabase anonymous key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
 * @returns Supabase client instance
 */
export function createSupabaseClient(
  url: string,
  anonKey: string
): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      'Supabase URL and anonymous key are required. Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * Resolve spell or item image_url to a full public URL.
 * If imageUrl is already a full URL (http/https), returns as-is.
 * If it is a path like "spell-images/slug.png" or "item-images/slug.png", returns Supabase public URL.
 */
export function getStoragePublicUrl(supabaseUrl: string, imageUrl: string | null | undefined): string | null {
  if (!imageUrl?.trim()) return null;
  const u = imageUrl.trim();
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  const base = supabaseUrl.replace(/\/$/, '') + '/storage/v1/object/public/';
  return base + u;
}

/**
 * Resolve image path to full public URL using NEXT_PUBLIC_SUPABASE_URL from the app.
 * Use for spell/item images. Re-export as getItemImageUrl / getSpellImageUrl in apps if desired.
 */
export function getPublicStorageUrl(imageUrl: string | null | undefined): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return getStoragePublicUrl(url, imageUrl);
}
