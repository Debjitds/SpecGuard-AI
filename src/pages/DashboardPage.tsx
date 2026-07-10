import { useState } from "react";
import {
  Upload,
  FolderOpen,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/context/DashboardContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { UploadPrdDialog } from "@/components/dashboard/UploadPrdDialog";
import { DemoProjectDialog } from "@/components/dashboard/DemoProjectDialog";
import { VersionTimeline } from "@/components/dashboard/VersionTimeline";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { IssueBreakdown } from "@/components/dashboard/IssueBreakdown";
import { WhatToFixFirst } from "@/components/dashboard/WhatToFixFirst";
import { EngineeringReview } from "@/components/dashboard/EngineeringReview";
import { AnalysisWorkspace } from "@/components/dashboard/AnalysisWorkspace";
import { ExportSection } from "@/components/dashboard/ExportSection";
import { EmptyDashboard, Skeleton } from "@/components/dashboard/EmptyDashboard";
import { Button } from "@/components/ui/button";
import type { Finding } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    activeProject,
    loading,
    analyzing,
    runAnalysis,
  } = useDashboard();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  function focusFinding(f: Finding) {
    setHighlightedId(f.id);
    // scroll the review queue into view on small screens
    setTimeout(() => setHighlightedId(null), 3000);
  }

  const firstName = user?.fullName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Analyst";

  return (
    <div className="min-h-screen bg-cream relative overflow-x-hidden">
      {/* Decorative ornaments */}
      <span
        aria-hidden
        className="ornament-star block w-4 h-4 bg-ink absolute top-12 left-[300px] z-0 hidden lg:block"
      />
      <span
        aria-hidden
        className="block w-3 h-3 rounded-full bg-teal-mint border-2 border-ink absolute top-32 right-6 z-0 hidden lg:block"
      />
      <span
        aria-hidden
        className="ornament-star block w-4 h-4 bg-coral absolute bottom-24 right-[420px] z-0 hidden lg:block"
      />

      <Sidebar onNewProject={() => setDemoOpen(true)} />

      <main className="ml-0 md:ml-64 min-h-screen pb-24 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pt-10 pr-6 md:pr-12 pl-6 md:pl-8 mb-10">
          <div>
            <h2 className="text-display-lg font-black tracking-tighter mb-2">
              Hello, {firstName}!
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              Ready to secure your specifications?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="coral" size="md" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Upload PRD
            </Button>
            <Button variant="teal" size="md" onClick={() => setDemoOpen(true)}>
              <FolderOpen className="h-4 w-4" /> Load Demo Project
            </Button>
          </div>
        </header>

        <div className="pr-6 md:pr-12 pl-6 md:pl-8">
          {loading ? (
            <Skeleton />
          ) : !activeProject ? (
            <EmptyDashboard
              onUpload={() => setUploadOpen(true)}
              onDemo={() => setDemoOpen(true)}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {/* Run-analysis banner (pending PRD or re-analyze) */}
              <div className="bg-yellow border-neo border-ink shadow-neo rounded-card p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-paper border-neo border-ink rounded-brutalist flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="font-black text-base leading-tight">
                      {activeProject.analysis
                        ? "Re-run analysis on the current PRD"
                        : "Analyze this PRD with AI"}
                    </h3>
                    <p className="text-caption text-on-surface-variant">
                      {activeProject.analysis
                        ? `Last reviewed: ${activeProject.analysis.analyzedAt.slice(0, 10)} · ${activeProject.analysis.findings.length} findings`
                        : "Gemini surfaces ambiguity, missing criteria, edge cases & more."}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ink"
                  size="md"
                  onClick={() => runAnalysis()}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                    </>
                  ) : activeProject.analysis ? (
                    <>
                      <Sparkles className="h-4 w-4" /> Re-analyze
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Run Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* Version Timeline */}
              <VersionTimeline project={activeProject} />

              {/* Summary cards */}
              {activeProject.analysis ? (
                <SummaryCards scores={activeProject.analysis.scores} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {["Completeness", "Ambiguity", "Testability", "Consistency"].map(
                    (label) => (
                      <div
                        key={label}
                        className="bg-paper border-neo border-ink shadow-neo rounded-card p-6 opacity-60"
                      >
                        <h3 className="text-label-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                          {label}
                        </h3>
                        <div className="text-headline-lg mb-4 font-black text-on-surface-variant">
                          —
                        </div>
                        <div className="w-full h-4 border-neo border-ink bg-paper mb-3" />
                        <span className="inline-block bg-surface-container-high text-on-surface-variant font-caption text-caption px-3 py-1 border-neo border-ink">
                          Pending
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Bento grid: left column + workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                {/* Left column */}
                <div className="flex flex-col gap-6 lg:col-span-4">
                  <IssueBreakdown analysis={activeProject.analysis} />
                  <WhatToFixFirst
                    analysis={activeProject.analysis}
                    onSelect={focusFinding}
                  />
                  <EngineeringReview analysis={activeProject.analysis} />
                </div>

                {/* Workspace */}
                <div className="flex flex-col gap-6 lg:col-span-8">
                  <AnalysisWorkspace
                    project={activeProject}
                    highlightedId={highlightedId}
                  />
                  <ExportSection project={activeProject} />
                </div>
              </div>

              {/* Review status footer */}
              <div className="bg-paper border-neo border-ink shadow-neo rounded-card p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal" strokeWidth={2.5} />
                  <span className="font-bold text-sm">
                    Project auto-saved · {activeProject.currentVersion}
                  </span>
                </div>
                <span className="text-caption text-on-surface-variant">
                  Updated {new Date(activeProject.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <UploadPrdDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <DemoProjectDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
