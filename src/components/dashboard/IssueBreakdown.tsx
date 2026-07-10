import { SEVERITY_META } from "@/types";
import type { AnalysisResult } from "@/types";
import { cn } from "@/lib/utils";

/** Issue Breakdown — counts by severity (matches Stitch dashboard). */
export function IssueBreakdown({ analysis }: { analysis?: AnalysisResult }) {
  const counts = {
    critical: 0,
    major: 0,
    minor: 0,
  };
  (analysis?.findings ?? []).forEach((f) => {
    counts[f.severity]++;
  });

  const total = counts.critical + counts.major + counts.minor;

  return (
    <div className="bg-paper border-neo border-ink shadow-neo rounded-card p-6">
      <h3 className="text-headline-md border-b-neo border-ink pb-3 mb-6">
        Issue Breakdown
      </h3>
      <div className="flex gap-3">
        {(Object.keys(SEVERITY_META) as Array<keyof typeof SEVERITY_META>).map(
          (sev) => {
            const meta = SEVERITY_META[sev];
            return (
              <div
                key={sev}
                className="flex-1 text-center bg-cream border-neo border-ink p-3 flex flex-col items-center justify-center min-w-0"
              >
                <div className={cn("text-headline-lg font-black mb-1", meta.text)}>
                  {counts[sev]}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {meta.label}
                </div>
              </div>
            );
          },
        )}
      </div>
      <p className="mt-4 text-caption text-on-surface-variant text-center">
        {total === 0
          ? "No findings yet — run an analysis."
          : `${total} findings across the document`}
      </p>
    </div>
  );
}
