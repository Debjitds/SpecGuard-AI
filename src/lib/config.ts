/**
 * Runtime feature flags derived from environment variables.
 *
 * SpecGuard AI is built to be fully demoable out of the box: if Supabase /
 * Gemini credentials are not configured, the app falls back to a local,
 * in-browser backend + a deterministic heuristic analyzer. This keeps every
 * flow (login, upload, demo, analysis, review, export) working end-to-end for
 * a hackathon demo and for automated testing.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

export const config = {
  supabaseUrl: (supabaseUrl ?? "").trim(),
  supabaseAnonKey: (supabaseAnonKey ?? "").trim(),
  geminiApiKey: (geminiApiKey ?? "").trim(),
  /** True only when BOTH Supabase values are present. */
  get supabaseEnabled() {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },
  get geminiEnabled() {
    return Boolean(this.geminiApiKey);
  },
};

/** Which backend mode is active — surfaced in the UI so the user understands state. */
export const backendMode = config.supabaseEnabled ? "supabase" : "local";
export const aiMode = config.geminiEnabled ? "gemini" : "local";
