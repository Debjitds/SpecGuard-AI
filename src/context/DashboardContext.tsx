import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AnalysisResult,
  Finding,
  Project,
  ReviewStatus,
} from "@/types";
import { useAuth } from "./AuthContext";
import { store } from "@/lib/store";
import { analyzePrd } from "@/lib/analyzer";
import { getDemoByKey, DEMO_PROJECTS } from "@/data/demoProjects";

/**
 * Dashboard / project workspace state.
 *
 * Owns the active project, the projects list, the analysis status, and every
 * review mutation. The dashboard UI is purely a render of this context, so the
 * full analysis workflow (PRD §8 / §10) lives inside the dashboard surface with
 * no separate analysis page.
 */

interface DashboardContextValue {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  /** true while a Gemini/local analysis is running for the active project. */
  analyzing: boolean;
  /** loaded into the viewer before being saved as a project version. */
  pendingPrd: { name: string; content: string; fileName?: string } | null;

  refreshProjects: () => Promise<void>;
  selectProject: (id: string | null) => Promise<void>;
  loadDemo: (demoKey: string) => Promise<void>;
  setPendingPrd: (prd: { name: string; content: string; fileName?: string } | null) => void;
  uploadPrd: (params: { name: string; content: string; fileName?: string }) => Promise<Project>;
  runAnalysis: () => Promise<void>;
  setFindingStatus: (findingId: string, status: ReviewStatus) => Promise<void>;
  resetFinding: (findingId: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

function newId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeProject(params: {
  ownerId: string;
  name: string;
  content: string;
  fileName?: string;
  demoKey?: string;
  analysis?: AnalysisResult;
}): Project {
  const now = new Date().toISOString();
  const label = "v1.0";
  return {
    id: newId("proj"),
    name: params.name,
    description: undefined,
    ownerId: params.ownerId,
    createdAt: now,
    updatedAt: now,
    demoKey: params.demoKey,
    prdContent: params.content,
    prdFileName: params.fileName,
    currentVersion: label,
    versions: params.analysis
      ? [
          {
            id: newId("ver"),
            label,
            status: "Analyzed",
            createdAt: now,
            analysis: params.analysis,
          },
        ]
      : [],
    analysis: params.analysis,
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [pendingPrd, setPendingPrd] = useState<DashboardContextValue["pendingPrd"]>(null);

  // Persist the active project id per-user so a refresh keeps you in context.
  const activeIdRef = useRef<string | null>(null);

  const refreshProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      return;
    }
    setLoading(true);
    try {
      const list = await store.listProjects(user.id);
      setProjects(list);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load projects whenever the signed-in user changes.
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setActiveProject(null);
      activeIdRef.current = null;
      return;
    }
    (async () => {
      await refreshProjects();
      // Restore last active project for this user.
      try {
        const savedId = localStorage.getItem(`specguard.active.${user.id}`);
        if (savedId) {
          const p = await store.getProject(user.id, savedId);
          if (p) {
            setActiveProject(p);
            activeIdRef.current = p.id;
            return;
          }
        }
      } catch {
        /* ignore */
      }
      setActiveProject(null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const persistActive = useCallback(
    async (project: Project) => {
      const saved = await store.saveProject(project);
      setActiveProject(saved);
      activeIdRef.current = saved.id;
      if (user) localStorage.setItem(`specguard.active.${user.id}`, saved.id);
      setProjects((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id);
        const next = idx >= 0
          ? [...prev.slice(0, idx), saved, ...prev.slice(idx + 1)]
          : [saved, ...prev];
        return next.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      });
      return saved;
    },
    [user],
  );

  const selectProject = useCallback(
    async (id: string | null) => {
      if (!user || !id) {
        setActiveProject(null);
        activeIdRef.current = null;
        setPendingPrd(null);
        return;
      }
      const p = await store.getProject(user.id, id);
      setActiveProject(p);
      activeIdRef.current = p?.id ?? null;
      if (p) localStorage.setItem(`specguard.active.${user.id}`, p.id);
      setPendingPrd(null);
    },
    [user],
  );

  const uploadPrd = useCallback<DashboardContextValue["uploadPrd"]>(
    async ({ name, content, fileName }) => {
      if (!user) throw new Error("Not authenticated");
      const project = makeProject({
        ownerId: user.id,
        name,
        content,
        fileName,
      });
      const saved = await persistActive(project);
      setPendingPrd(null);
      return saved;
    },
    [user, persistActive],
  );

  const loadDemo = useCallback(
    async (demoKey: string) => {
      if (!user) return;
      const demo = getDemoByKey(demoKey) ?? DEMO_PROJECTS[0];
      // Load demo straight into the viewer as pending PRD; the user triggers
      // analysis from the workspace (mirrors the demo story in PRD §19).
      setPendingPrd({
        name: demo.name,
        content: demo.prd,
        fileName: `${demo.key}.md`,
      });
      // Also create the project so it persists + shows in versions timeline.
      const project = makeProject({
        ownerId: user.id,
        name: demo.name,
        content: demo.prd,
        fileName: `${demo.key}.md`,
        demoKey: demo.key,
      });
      await persistActive(project);
    },
    [user, persistActive],
  );

  const runAnalysis = useCallback(async () => {
    const base =
      pendingPrd ??
      (activeProject
        ? {
            name: activeProject.name,
            content: activeProject.prdContent,
            fileName: activeProject.prdFileName,
          }
        : null);
    if (!base || !activeProject || !user) return;

    setAnalyzing(true);
    try {
      const result = await analyzePrd(base.content, activeProject.name);
      // Bump the version (v1.0 → v1.1 …) and append to the timeline.
      const nextLabel = bumpVersion(activeProject.currentVersion);
      const newVersion = {
        id: newId("ver"),
        label: nextLabel,
        status: "Issues Found",
        createdAt: new Date().toISOString(),
        analysis: result,
      };
      const updated: Project = {
        ...activeProject,
        prdContent: base.content,
        prdFileName: base.fileName ?? activeProject.prdFileName,
        currentVersion: nextLabel,
        analysis: result,
        versions: [...activeProject.versions, newVersion],
        updatedAt: new Date().toISOString(),
      };
      await persistActive(updated);
      setPendingPrd(null);
    } finally {
      setAnalyzing(false);
    }
  }, [pendingPrd, activeProject, user, persistActive]);

  const patchFindings = useCallback(
    async (mutator: (findings: Finding[]) => Finding[]) => {
      if (!activeProject || !activeProject.analysis) return;
      const findings = mutator([...activeProject.analysis.findings]);
      const analysis: AnalysisResult = { ...activeProject.analysis, findings };
      // Sync the current version snapshot too.
      const versions = activeProject.versions.map((v) =>
        v.label === activeProject.currentVersion ? { ...v, analysis } : v,
      );
      const updated: Project = {
        ...activeProject,
        analysis,
        versions,
        updatedAt: new Date().toISOString(),
      };
      await persistActive(updated);
    },
    [activeProject, persistActive],
  );

  const setFindingStatus = useCallback(
    (findingId: string, status: ReviewStatus) =>
      patchFindings((fs) =>
        fs.map((f) => (f.id === findingId ? { ...f, status } : f)),
      ),
    [patchFindings],
  );

  const resetFinding = useCallback(
    (findingId: string) =>
      patchFindings((fs) =>
        fs.map((f) => (f.id === findingId ? { ...f, status: "open" as const } : f)),
      ),
    [patchFindings],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      if (!user) return;
      await store.deleteProject(user.id, id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (activeProject?.id === id) {
        setActiveProject(null);
        activeIdRef.current = null;
        localStorage.removeItem(`specguard.active.${user.id}`);
      }
    },
    [user, activeProject],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      projects,
      activeProject,
      loading,
      analyzing,
      pendingPrd,
      refreshProjects,
      selectProject,
      loadDemo,
      setPendingPrd,
      uploadPrd,
      runAnalysis,
      setFindingStatus,
      resetFinding,
      deleteProject,
    }),
    [
      projects,
      activeProject,
      loading,
      analyzing,
      pendingPrd,
      refreshProjects,
      selectProject,
      loadDemo,
      uploadPrd,
      runAnalysis,
      setFindingStatus,
      resetFinding,
      deleteProject,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within <DashboardProvider>");
  return ctx;
}

/** v1.0 → v1.1 → v1.2 … and v1.3_draft-aware. */
function bumpVersion(current: string): string {
  const match = current.match(/^v(\d+)\.(\d+)(.*)$/);
  if (!match) return "v1.1";
  const major = Number(match[1]);
  const minor = Number(match[2]) + 1;
  return `v${major}.${minor}`;
}
