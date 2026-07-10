import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FileText, Maximize2, Minimize2, ListChecks } from "lucide-react";
import type { Finding, Project, ReviewStatus } from "@/types";
import { useDashboard } from "@/context/DashboardContext";
import { ReviewItem } from "./ReviewItem";
import { cn } from "@/lib/utils";

type Filter = "all" | "open" | "accepted" | "ignored" | "resolved";

/**
 * Analysis Workspace — the visual core of the dashboard (PRD §10).
 *
 * Two panes:
 *   1. A scrollable PRD viewer (markdown rendered, custom brutalist scrollbar)
 *   2. A Review Queue sidebar listing every finding with accept / ignore /
 *      resolve actions (PRD §11.4)
 *
 * This is the analysis surface; there is no separate analysis page.
 */
export function AnalysisWorkspace({
  project,
  highlightedId,
}: {
  project: Project;
  highlightedId?: string | null;
}) {
  const { setFindingStatus, analyzing, runAnalysis, pendingPrd } = useDashboard();
  const [fullscreen, setFullscreen] = useState(false);
  const [filter, setFilter] = useState<Filter>("open");

  const analysis = project.analysis;
  const findings = analysis?.findings ?? [];
  const content = pendingPrd?.content ?? project.prdContent;

  const visibleFindings = useMemo(() => {
    const list = filter === "all" ? findings : findings.filter((f) => f.status === filter);
    // keep stable order by severity then original index
    const order = { critical: 0, major: 1, minor: 2 };
    return [...list].sort((a, b) => order[a.severity] - order[b.severity]);
  }, [findings, filter]);

  const counts = useMemo(() => {
    return {
      open: findings.filter((f) => f.status === "open").length,
      accepted: findings.filter((f) => f.status === "accepted").length,
      ignored: findings.filter((f) => f.status === "ignored").length,
      resolved: findings.filter((f) => f.status === "resolved").length,
    };
  }, [findings]);

  function handleStatus(id: string, status: ReviewStatus) {
    setFindingStatus(id, status);
  }

  if (fullscreen) {
    return (
      <FullscreenPrd
        content={content}
        fileName={project.prdFileName ?? `${project.name}.md`}
        onExit={() => setFullscreen(false)}
      />
    );
  }

  return (
    <div className="bg-paper border-neo border-ink shadow-neo rounded-card flex flex-col h-[720px] relative">
      {/* Header */}
      <div className="bg-surface-container-high border-b-neo border-ink p-4 flex justify-between items-center">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="h-6 w-6 shrink-0" strokeWidth={2.5} />
          <h3 className="text-headline-md truncate">Analysis Workspace</h3>
        </div>
        <div className="flex gap-2 items-center">
          <span className="bg-paper border-neo border-ink px-3 py-1 text-label-bold text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-coral-deep" />
            {(project.prdFileName ?? `${project.name}.md`).slice(0, 24)}
          </span>
          <button
            onClick={() => setFullscreen(true)}
            className="bg-surface-container border-neo border-ink px-2 py-1 hover:bg-paper transition-colors"
            aria-label="Fullscreen PRD"
          >
            <Maximize2 className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* PRD Viewer */}
        <div className="w-full md:w-2/3 p-6 overflow-y-auto neo-scroll bg-paper border-r-neo border-ink">
          <article className="prd-prose max-w-none">
            <ReactMarkdown>{content || "No PRD loaded yet."}</ReactMarkdown>
          </article>

          {/* Inline AI summary callout */}
          {analysis?.summary && (
            <div className="mt-8 bg-yellow border-neo border-ink p-4 shadow-neo-sm">
              <h4 className="font-black uppercase text-sm tracking-wider mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" strokeWidth={2.5} /> AI Review Summary
              </h4>
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </div>
          )}
        </div>

        {/* Review Queue */}
        <div className="w-full md:w-1/3 bg-cream flex flex-col">
          <div className="p-4 border-b-neo border-ink bg-paper flex items-center justify-between gap-2">
            <h4 className="text-label-bold font-bold inline-flex items-center gap-2">
              <ListChecks className="h-4 w-4" strokeWidth={2.5} />
              Review Queue
            </h4>
            <span className="bg-ink text-paper text-[11px] px-2 py-1 border-neo border-ink font-bold">
              {counts.open} Pending
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex border-b-neo border-ink bg-surface-container-low text-[11px] font-bold uppercase">
            {(["open", "accepted", "resolved", "ignored", "all"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 py-2 border-r-neo border-ink last:border-r-0 transition-colors",
                  filter === f
                    ? "bg-yellow text-ink"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                {f} {f !== "all" && counts[f] > 0 ? `(${counts[f]})` : ""}
              </button>
            ))}
          </div>

          {/* Queue body */}
          <div className="p-4 flex flex-col gap-4 overflow-y-auto neo-scroll flex-grow">
            {analyzing && (
              <div className="bg-surface-container-high border-neo border-ink p-4 text-center">
                <div className="inline-block w-6 h-6 border-4 border-ink border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-sm font-bold">Analyzing PRD…</p>
                <p className="text-caption text-on-surface-variant">
                  Surfacing ambiguities & edge cases.
                </p>
              </div>
            )}

            {!analyzing && findings.length === 0 && (
              <div className="bg-paper border-neo border-ink p-4 text-center">
                <p className="font-bold">No findings yet.</p>
                <p className="text-caption text-on-surface-variant mt-1 mb-3">
                  Run an analysis to populate the review queue.
                </p>
                <button
                  onClick={() => runAnalysis()}
                  className="bg-coral-deep text-paper border-neo border-ink shadow-neo-sm px-4 py-2 font-bold uppercase text-xs hover:-translate-y-0.5 hover:shadow-neo transition-all"
                >
                  Analyze Now
                </button>
              </div>
            )}

            {!analyzing &&
              findings.length > 0 &&
              visibleFindings.length === 0 && (
                <div className="bg-paper border-neo border-ink p-4 text-center text-caption text-on-surface-variant">
                  No items in “{filter}”. Switch tab to see more.
                </div>
              )}

            {visibleFindings.map((f, i) => (
              <ReviewItem
                key={f.id}
                finding={f}
                index={findings.indexOf(f)}
                onStatus={handleStatus}
                highlighted={highlightedId === f.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Fullscreen PRD reader modal. */
function FullscreenPrd({
  content,
  fileName,
  onExit,
}: {
  content: string;
  fileName: string;
  onExit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-cream flex flex-col">
      <div className="bg-ink text-paper p-4 flex items-center justify-between border-b-neothick border-ink">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="h-6 w-6 shrink-0" strokeWidth={2.5} />
          <h3 className="text-headline-md truncate text-paper">{fileName}</h3>
        </div>
        <button
          onClick={onExit}
          className="bg-paper text-ink border-neo border-ink px-3 py-1.5 inline-flex items-center gap-1 font-bold uppercase text-xs hover:-translate-y-0.5 transition-transform"
        >
          <Minimize2 className="h-4 w-4" strokeWidth={2.5} /> Exit
        </button>
      </div>
      <div className="flex-grow overflow-y-auto neo-scroll p-8">
        <article className="prd-prose max-w-3xl mx-auto">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
