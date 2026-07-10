import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  LifeBuoy,
  FolderKanban,
  Plus,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { aiMode } from "@/lib/config";

/**
 * Fixed left sidebar nav (matches the Stitch dashboard). Holds the brand, the
 * project switcher, the single "Dashboard" entry (there is intentionally NO
 * separate analysis page), support, and logout.
 */
export function Sidebar({ onNewProject }: { onNewProject: () => void }) {
  const { user, signOut, mode } = useAuth();
  const { projects, activeProject, selectProject } = useDashboard();
  const [open, setOpen] = useState(true);

  return (
    <nav className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col gap-0 bg-paper border-r-neo border-ink shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
      {/* Brand */}
      <div className="p-6 pb-4">
        <Link to="/" className="block">
          <h1 className="text-headline-md font-black tracking-tight">SpecGuard AI</h1>
          <p className="text-caption text-on-surface-variant mt-1 uppercase tracking-wider">
            Technical Audit Tool
          </p>
        </Link>
      </div>

      {/* Nav */}
      <div className="px-4">
        <span className="block px-2 mb-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
          Workspace
        </span>
        <div
          className={cn(
            "flex items-center gap-3 p-3 bg-coral-deep text-paper border-neo border-ink shadow-neo translate-x-[-2px] translate-y-[-2px] font-bold text-label-bold rounded",
          )}
        >
          <LayoutDashboard className="h-5 w-5" strokeWidth={2.5} />
          Dashboard
        </div>
        <div className="mt-1 flex items-center gap-3 p-3 text-on-surface-variant font-bold text-label-bold rounded opacity-60 cursor-not-allowed">
          <FileText className="h-5 w-5" strokeWidth={2.5} />
          Analysis Panel
          <span className="ml-auto text-[9px] uppercase">In-page</span>
        </div>
      </div>

      {/* Projects */}
      <div className="px-4 mt-4 flex-grow overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            Projects
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-[10px] font-bold uppercase text-on-surface-variant hover:text-ink"
            aria-label="Toggle projects"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex-grow overflow-y-auto neo-scroll pr-1">
          {open && (
            <>
              <button
                onClick={onNewProject}
                className="w-full flex items-center gap-2 p-2 mb-2 bg-paper border-neo border-ink shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo transition-all text-label-bold font-bold rounded"
              >
                <span className="w-6 h-6 bg-teal-mint border-2 border-ink flex items-center justify-center rounded">
                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                New PRD / Demo
              </button>

              {projects.length === 0 && (
                <p className="text-caption text-on-surface-variant px-2 py-3">
                  No projects yet. Upload a PRD or load a demo.
                </p>
              )}

              <ul className="flex flex-col gap-1">
                {projects.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => selectProject(p.id)}
                      className={cn(
                        "w-full text-left flex items-center gap-2 p-2 rounded border-2 transition-all text-label-bold font-bold",
                        activeProject?.id === p.id
                          ? "bg-yellow border-ink shadow-neo-sm"
                          : "border-transparent hover:bg-surface-container-high hover:border-ink",
                      )}
                    >
                      <FolderKanban className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                      <span className="truncate">{p.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50 shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Footer: status + sign out */}
      <div className="border-t-neo border-ink p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <Chip className="text-[10px] bg-surface-container-low">
            {mode === "supabase" ? "Supabase" : "Local DB"}
          </Chip>
          <Chip className="text-[10px] bg-surface-container-low">
            AI: {aiMode === "gemini" ? "Gemini" : "Built-in"}
          </Chip>
        </div>
        <div className="flex items-center gap-3 p-2 text-on-surface-variant">
          <LifeBuoy className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-label-bold font-bold">Support</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          {user ? `Sign out (${user.email.split("@")[0]})` : "Sign out"}
        </Button>
      </div>
    </nav>
  );
}
