import { useState } from "react";
import { Check, X, RotateCcw, ChevronDown } from "lucide-react";
import type { Finding, ReviewStatus } from "@/types";
import { CATEGORY_META, SEVERITY_META, STATUS_META } from "@/types";
import { cn } from "@/lib/utils";

/**
 * A single engineering-review item in the Review Queue.
 *
 * Supports the three review actions from the PRD (§11.4): accept, ignore,
 * resolve — plus a "revisit" reset. Each finding expands to reveal the AI
 * description + recommendation.
 */
export function ReviewItem({
  finding,
  index,
  onStatus,
  highlighted,
}: {
  finding: Finding;
  index: number;
  onStatus: (id: string, status: ReviewStatus) => void;
  highlighted?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const cat = CATEGORY_META[finding.category];
  const sev = SEVERITY_META[finding.severity];
  const status = STATUS_META[finding.status];
  const done = finding.status !== "open";

  const sevBadge =
    finding.severity === "critical"
      ? "bg-coral-deep text-paper"
      : finding.severity === "major"
        ? "bg-coral text-ink"
        : "bg-surface-container-highest text-ink";

  return (
    <div
      className={cn(
        "bg-paper border-neo border-ink shadow-neo-sm flex flex-col relative transition-all",
        highlighted && "ring-4 ring-yellow",
        done && "opacity-80",
      )}
    >
      {/* Number badge */}
      <div
        className={cn(
          "absolute -top-2 -left-2 rounded-full w-6 h-6 flex items-center justify-center border-neo border-ink text-xs font-black",
          sevBadge,
        )}
      >
        {index + 1}
      </div>

      <div className="p-3 pl-4">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={cn(
              "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 border border-ink",
              sevBadge,
            )}
          >
            {sev.label}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            {cat.short}
          </span>
          {finding.status !== "open" && (
            <span
              className={cn(
                "ml-auto text-[10px] font-bold uppercase px-1.5 py-0.5 border border-ink",
                status.badge,
              )}
            >
              {status.label}
            </span>
          )}
        </div>
        <p className="text-sm font-bold leading-snug">{finding.title}</p>
        {finding.location && (
          <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
            ↳ {finding.location}
          </p>
        )}

        {/* Expandable detail */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-ink"
        >
          {open ? "Hide detail" : "Show detail"}
          <ChevronDown
            className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
            strokeWidth={3}
          />
        </button>
        {open && (
          <div className="mt-2 flex flex-col gap-2 text-xs">
            <p className="text-on-surface-variant leading-relaxed">
              {finding.description}
            </p>
            {finding.recommendation && (
              <div className="bg-teal-mint border-neo border-ink p-2">
                <span className="font-black uppercase text-[10px] tracking-wider">
                  Fix
                </span>
                <p className="mt-0.5 leading-relaxed">{finding.recommendation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-3 pt-0 text-xs font-bold">
        {done ? (
          <button
            onClick={() => onStatus(finding.id, "open")}
            className="flex-1 bg-surface-container-low border-2 border-ink py-1.5 hover:-translate-y-0.5 hover:shadow-neo-sm transition-all inline-flex items-center justify-center gap-1"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={3} /> Revisit
          </button>
        ) : (
          <>
            <button
              onClick={() => onStatus(finding.id, "accepted")}
              className="flex-1 bg-teal-mint border-2 border-ink py-1.5 hover:-translate-y-0.5 hover:shadow-neo-sm transition-all inline-flex items-center justify-center gap-1"
            >
              <Check className="h-3 w-3" strokeWidth={3} /> Accept
            </button>
            <button
              onClick={() => onStatus(finding.id, "resolved")}
              className="flex-1 bg-teal-bright border-2 border-ink py-1.5 hover:-translate-y-0.5 hover:shadow-neo-sm transition-all inline-flex items-center justify-center gap-1"
            >
              <Check className="h-3 w-3" strokeWidth={3} /> Resolve
            </button>
            <button
              onClick={() => onStatus(finding.id, "ignored")}
              className="flex-1 bg-surface-container-high border-2 border-ink py-1.5 hover:-translate-y-0.5 hover:shadow-neo-sm transition-all inline-flex items-center justify-center gap-1"
            >
              <X className="h-3 w-3" strokeWidth={3} /> Ignore
            </button>
          </>
        )}
      </div>
    </div>
  );
}
