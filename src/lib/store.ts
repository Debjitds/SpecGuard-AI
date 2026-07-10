import type { Project, AuthUser } from "@/types";
import { supabase } from "@/lib/supabase";
import { config } from "@/lib/config";

/**
 * Storage layer.
 *
 * Two interchangeable implementations behind one async interface:
 *  - `SupabaseStore` — real persistence (enabled when env vars are present)
 *  - `LocalStore`    — localStorage-backed (default; lets the app run anywhere)
 *
 * The DashboardContext only ever calls these methods, so swapping backends is
 * invisible to the UI.
 */

export interface DataStore {
  listProjects(userId: string): Promise<Project[]>;
  getProject(userId: string, projectId: string): Promise<Project | null>;
  saveProject(project: Project): Promise<Project>;
  deleteProject(userId: string, projectId: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Supabase implementation
// ---------------------------------------------------------------------------

/** Map a Postgres row into our Project domain object (denormalised JSON columns). */
function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    name: String(row.name ?? "Untitled project"),
    description: (row.description as string) ?? undefined,
    ownerId: String(row.owner_id ?? row.ownerId ?? ""),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    demoKey: (row.demo_key as string) ?? undefined,
    prdContent: String(row.prd_content ?? ""),
    prdFileName: (row.prd_file_name as string) ?? undefined,
    currentVersion: String(row.current_version ?? "v1.0"),
    versions: Array.isArray(row.versions) ? (row.versions as Project["versions"]) : [],
    analysis: (row.analysis as Project["analysis"]) ?? undefined,
  };
}

const TABLE = "projects";

export const SupabaseStore: DataStore = {
  async listProjects(userId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false });
    if (error) {
      console.warn("[SupabaseStore] listProjects error", error.message);
      return [];
    }
    return (data ?? []).map(rowToProject);
  },

  async getProject(_userId, projectId) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", projectId)
      .maybeSingle();
    if (error) {
      console.warn("[SupabaseStore] getProject error", error.message);
      return null;
    }
    return data ? rowToProject(data) : null;
  },

  async saveProject(project) {
    if (!supabase) return project;
    const payload = {
      id: project.id,
      name: project.name,
      description: project.description ?? null,
      owner_id: project.ownerId,
      demo_key: project.demoKey ?? null,
      prd_content: project.prdContent,
      prd_file_name: project.prdFileName ?? null,
      current_version: project.currentVersion,
      versions: project.versions,
      analysis: project.analysis ?? null,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload)
      .select("*")
      .maybeSingle();
    if (error) {
      console.warn("[SupabaseStore] saveProject error", error.message);
      return project;
    }
    return data ? rowToProject(data) : project;
  },

  async deleteProject(userId, projectId) {
    if (!supabase) return;
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", projectId)
      .eq("owner_id", userId);
    if (error) console.warn("[SupabaseStore] deleteProject error", error.message);
  },
};

// ---------------------------------------------------------------------------
// Local (localStorage) implementation
// ---------------------------------------------------------------------------

const LOCAL_KEY = "specguard.projects.v1";

type LocalRow = Project;

function readAll(): LocalRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as LocalRow[]) : [];
  } catch {
    return [];
  }
}

function writeAll(rows: LocalRow[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rows));
  } catch (e) {
    console.warn("[LocalStore] persist failed", e);
  }
}

export const LocalStore: DataStore = {
  async listProjects(userId) {
    return readAll()
      .filter((p) => p.ownerId === userId)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  },

  async getProject(userId, projectId) {
    return readAll().find((p) => p.id === projectId && p.ownerId === userId) ?? null;
  },

  async saveProject(project) {
    const rows = readAll();
    const idx = rows.findIndex((p) => p.id === project.id);
    const next: Project = { ...project, updatedAt: new Date().toISOString() };
    if (idx >= 0) rows[idx] = next;
    else rows.push(next);
    writeAll(rows);
    return next;
  },

  async deleteProject(userId, projectId) {
    writeAll(readAll().filter((p) => !(p.id === projectId && p.ownerId === userId)));
  },
};

/** The active store — Supabase when configured, local otherwise. */
export const store: DataStore = config.supabaseEnabled ? SupabaseStore : LocalStore;

/** Helper: is the current user allowed to read/write this project? */
export function canAccessProject(user: AuthUser | null, project: Project | null) {
  return Boolean(user && project && project.ownerId === user.id);
}
