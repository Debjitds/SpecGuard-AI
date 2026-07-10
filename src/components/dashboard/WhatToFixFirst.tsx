import { AlertTriangle, AlertOctagon, AlertCircle } from "lucide-react";
import type { AnalysisResult, Finding } from "@/types";
import { SEVERITY_META } from "@/types";
import { cn } from "@/lib/utils";

/** "What to Fix First" — top critical/major findings, sorted by severity. */
export function WhatToFixFirst({
  analysis,
  onSelect,
}: {
  analysis?: AnalysisResult;
  onSelect?: (f: Finding) => void;
}) {
  const findings = (analysis?.findings ?? [])
    .filter((f) => f.severity === "critical" || f.severity === "major")
    .slice(0, 4);

  return (
    <div className="bg-rose border-neo border-ink shadow-neo rounded-card p-6 flex-grow">
      <h3 className="text-headline-md border-b-neo border-ink pb-3 mb-6 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6" strokeWidth={2.5} />
        What to Fix First
      </h3>

      {findings.length === 0 ? (
        <div className="bg-paper border-neo border-ink p-4 text-center text-on-surface-variant">
          <p className="font-bold">Nothing critical flagged.</p>
          <p className="text-caption mt-1">Run an analysis to surface priorities.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {findings.map((f) => {
            const Icon =
              f.severity === "critical"
                ? AlertOctagon
                : f.severity === "major"
                  ? AlertTriangle
                  : AlertCircle;
            const badge =
              f.severity === "critical" ? "bg-coral-deep text-paper" : "bg-coral text-ink";
            return (
              <li
                key={f.id}
                onClick={() => onSelect?.(f)}
                className="bg-paper border-neo border-ink p-4 flex gap-4 items-start shadow-neo-sm hover:-translate-y-1 hover:shadow-neo transition-all cursor-pointer"
              >
                <span
                  className={cn(
                    "p-1 border-neo border-ink mt-0.5 shrink-0",
                    badge,
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={3} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-label-bold font-bold leading-tight">{f.title}</h4>
                  <p className="text-caption text-on-surface-variant mt-1 line-clamp-2">
                    {f.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {SEVERITY_META[f.severity].label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
