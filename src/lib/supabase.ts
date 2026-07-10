import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "./config";

/**
 * Lazily-created Supabase client.
 *
 * We never throw at import time when credentials are missing — instead
 * `supabase` stays `null` and the app uses the local fallback backend. This
 * lets the project build and run anywhere, with real Supabase activating the
 * moment env vars are provided (see README → Environment variables).
 */
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!config.supabaseEnabled) return null;
  if (!_client) {
    _client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _client;
}

export const supabase = getSupabase();
