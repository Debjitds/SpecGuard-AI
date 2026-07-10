import { FolderOpen, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEMO_PROJECTS } from "@/data/demoProjects";
import { useDashboard } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";

/** Modal demo selector (PRD §11.2). Lists the 5 demo projects as chunky cards. */
export function DemoProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { loadDemo } = useDashboard();

  async function handlePick(key: string) {
    await loadDemo(key);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6" strokeWidth={2.5} />
            Load Demo Project
          </DialogTitle>
          <DialogDescription>
            Pick a sample PRD to see how SpecGuard AI reviews it. Five domains,
            each with realistic requirement gaps.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEMO_PROJECTS.map((demo) => (
            <button
              key={demo.key}
              onClick={() => handlePick(demo.key)}
              className={cn(
                "group text-left p-4 bg-paper border-neo border-ink rounded-card shadow-neo-sm",
                "hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col gap-2",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "w-10 h-10 rounded-brutalist border-neo border-ink flex items-center justify-center",
                    demo.accent,
                  )}
                >
                  <FolderOpen className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <ArrowRight
                  className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  strokeWidth={2.5}
                />
              </div>
              <h4 className="font-extrabold text-base tracking-tight">{demo.name}</h4>
              <p className="text-caption text-on-surface-variant">{demo.blurb}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
