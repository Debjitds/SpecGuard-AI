import { useMemo } from "react";
import { ClipboardCheck } from "lucide-react";
import type { AnalysisResult, IssueCategory } from "@/types";
import { CATEGORY_META } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Engineering Review section — a scannable overview of review progress + a
 * category breakdown. This is the "preview" panel; the per-item actions live in
 * the Analysis Workspace review queue.
 */
export function EngineeringReview({
  analysis,
}: {
  analysis?: AnalysisResult;
}) {
  const findings = analysis?.findings ?? [];

  const progress = useMemo(() => {
    if (findings.length === 0) return 0;
    const reviewed = findings.filter((f) => f.status !== "open").length;
    return Math.round((reviewed / findings.length) * 100);
  }, [findings]);

  const byCategory = useMemo(() => {
    const map = new Map<IssueCategory, number>();
    findings.forEach((f) => map.set(f.category, (map.get(f.category) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [findings]);

  const counts = {
    accepted: findings.filter((f) => f.status === "accepted").length,
    resolved: findings.filter((f) => f.status === "resolved").length,
    ignored: findings.filter((f) => f.status === "ignored").length,
    open: findings.filter((f) => f.status === "open").length,
  };

  return (
    <div className="bg-lavender border-neo border-ink shadow-neo rounded-card p-6">
      <div className="flex items-center justify-between border-b-neo border-ink pb-3 mb-4">
        <h3 className="text-headline-md flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6" strokeWidth={2.5} />
          Engineering Review
        </h3>
        <span className="bg-paper border-neo border-ink px-2 py-1 text-label-bold font-bold">
          {progress}% Reviewed
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-5 border-neo border-ink bg-paper mb-4 relative overflow-hidden">
        <div
          className="h-full bg-ink transition-all duration-500"
          style={{ width: `${Math.max(progress, 2)}%` }}
        />
      </div>

      {/* Status chips */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: "Open", value: counts.open, cls: "bg-rose text-coral-deep" },
          { label: "Accepted", value: counts.accepted, cls: "bg-teal-mint text-ink" },
          { label: "Resolved", value: counts.resolved, cls: "bg-teal-bright text-ink" },
          { label: "Ignored", value: counts.ignored, cls: "bg-surface-container-high text-on-surface-variant" },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "border-neo border-ink p-2 text-center",
              s.cls,
            )}
          >
            <div className="text-headline-md font-black leading-none">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-ink/70 mb-2">
          Findings by Category
        </p>
        {byCategory.length === 0 ? (
          <p className="text-caption text-on-surface-variant">
            No categories yet — run an analysis to populate this.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {byCategory.map(([cat, n]) => (
              <span
                key={cat}
                className="bg-paper border-neo border-ink px-2 py-1 text-xs font-bold inline-flex items-center gap-1.5"
              >
                {CATEGORY_META[cat].short}
                <span className="bg-ink text-paper px-1.5 text-[10px]">{n}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
