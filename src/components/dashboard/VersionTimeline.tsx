import { Check, AlertTriangle, RefreshCw, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/** Maps a version's timeline status → icon + colour. */
function statusStyle(status: string) {
  const s = status.toLowerCase();
  if (s.includes("analyz")) return { bg: "bg-teal-mint", Icon: Check, color: "text-ink", badge: "bg-paper" };
  if (s.includes("issue")) return { bg: "bg-rose", Icon: AlertTriangle, color: "text-coral-deep", badge: "bg-rose" };
  if (s.includes("review")) return { bg: "bg-rose-deep", Icon: RefreshCw, color: "text-ink", badge: "bg-rose-deep text-paper" };
  return { bg: "bg-paper", Icon: Edit, color: "text-coral-deep", badge: "bg-paper" };
}

/** Build a deterministic 4-step timeline from a project's actual versions. */
function buildTimeline(project: Project) {
  const steps = [
    { label: "v1.0", status: "Analyzed", key: "v1.0" },
    { label: "v1.1", status: "Issues Found", key: "v1.1" },
    { label: "v1.2", status: "In Review", key: "v1.2" },
    { label: project.currentVersion, status: "Current", key: "current" },
  ];

  // How far along are we? At least 1 step if project exists.
  const versionCount = project.versions.length;
  const activeIndex = Math.min(Math.max(versionCount - 1, 0), steps.length - 1);

  return steps.map((step, i) => ({
    ...step,
    isCurrent: i === activeIndex,
  }));
}

export function VersionTimeline({ project }: { project: Project }) {
  const steps = buildTimeline(project);

  return (
    <div className="bg-paper border-neo border-ink shadow-neo rounded-card p-4 mb-8 overflow-hidden relative">
      <h3 className="text-label-bold font-bold uppercase tracking-wider border-b-neo border-ink pb-2 mb-4">
        Version Timeline
      </h3>
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute left-10 right-10 top-5 h-[3px] bg-ink -z-0" />
        <div className="flex items-center justify-between w-full relative z-10">
          {steps.map((step, i) => {
            const s = statusStyle(step.status);
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-2 bg-cream px-2"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-neothick border-ink flex items-center justify-center shadow-neo-sm",
                    s.bg,
                    step.isCurrent && "animate-pulse-slow",
                  )}
                >
                  <s.Icon className={cn("h-4 w-4", s.color)} strokeWidth={3} />
                </div>
                <span className="text-caption font-bold">{step.label}</span>
                <span
                  className={cn(
                    "text-[10px] uppercase px-1.5 py-0.5 border border-ink font-bold whitespace-nowrap",
                    s.badge,
                  )}
                >
                  {step.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
