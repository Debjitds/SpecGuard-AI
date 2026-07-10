import { useState } from "react";
import { Share2, FileText, FileCode, FileJson, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { exportReport } from "@/lib/export";
import { aiMode } from "@/lib/config";

/** Export Audit Report section (PRD §11.7). PDF / Markdown / JSON. */
export function ExportSection({ project }: { project: Project }) {
  const [done, setDone] = useState<string | null>(null);

  function handle(format: "pdf" | "markdown" | "json") {
    exportReport(project, format);
    setDone(format);
    setTimeout(() => setDone(null), 2000);
  }

  const hasAnalysis = Boolean(project.analysis);
  const options = [
    { id: "pdf" as const, label: "PDF", icon: FileText, hint: "Printable report" },
    { id: "markdown" as const, label: "Markdown", icon: FileCode, hint: ".md file" },
    { id: "json" as const, label: "JSON", icon: FileJson, hint: "Raw data" },
  ];

  return (
    <div className="bg-teal-bright border-neo border-ink shadow-neo rounded-card p-6">
      <div className="flex justify-between items-center mb-4 border-b-neo border-ink pb-2 flex-wrap gap-2">
        <h3 className="text-headline-md flex items-center gap-2">
          <Share2 className="h-6 w-6" strokeWidth={2.5} />
          Export Audit Report
        </h3>
        <span
          className={
            "text-label-bold text-sm px-2 py-1 border-neo border-ink font-bold " +
            (hasAnalysis ? "bg-paper" : "bg-rose")
          }
        >
          {hasAnalysis ? "Ready" : "No analysis yet"}
        </span>
      </div>

      {!hasAnalysis && (
        <p className="text-sm font-bold mb-4">
          Run an analysis first — exports include your findings & review state.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handle(opt.id)}
            disabled={!hasAnalysis}
            className="flex-1 bg-paper border-neo border-ink py-3 px-4 font-bold hover:-translate-y-1 hover:shadow-neo transition-all inline-flex items-center justify-center gap-2 shadow-neo-sm disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-neo-sm"
          >
            {done === opt.id ? (
              <Check className="h-5 w-5 text-teal" strokeWidth={3} />
            ) : (
              <opt.icon className="h-5 w-5" strokeWidth={2.5} />
            )}
            <span className="flex flex-col items-start leading-tight">
              <span>{opt.label}</span>
              <span className="text-[10px] font-normal uppercase opacity-70">
                {done === opt.id ? "Downloaded" : opt.hint}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-caption text-ink/70">
        Exports are generated client-side. AI findings from{" "}
        {aiMode === "gemini" ? "Gemini" : "the built-in analyzer"}.
      </p>
    </div>
  );
}
