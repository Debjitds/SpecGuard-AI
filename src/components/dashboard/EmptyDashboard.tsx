import { FileQuestion, UploadCloud, FolderOpen } from "lucide-react";
import type { ReactNode } from "react";

/** Dashboard empty state — no project selected yet. */
export function EmptyDashboard({
  onUpload,
  onDemo,
}: {
  onUpload: () => void;
  onDemo: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-yellow border-neo border-ink rounded-card translate-x-2 translate-y-2" />
        <div className="relative bg-paper border-neo border-ink rounded-card p-8 shadow-neo-lg">
          <FileQuestion className="h-16 w-16" strokeWidth={2.5} />
        </div>
      </div>
      <h2 className="text-headline-lg mb-2">No project open</h2>
      <p className="text-body-lg text-on-surface-variant max-w-md mb-8">
        Upload a PRD or load a demo project to start your engineering review.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onUpload}
          className="bg-coral-deep text-paper border-neo border-ink shadow-neo px-6 py-3 font-bold uppercase text-sm inline-flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg transition-all"
        >
          <UploadCloud className="h-5 w-5" strokeWidth={2.5} /> Upload PRD
        </button>
        <button
          onClick={onDemo}
          className="bg-teal-bright text-ink border-neo border-ink shadow-neo px-6 py-3 font-bold uppercase text-sm inline-flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg transition-all"
        >
          <FolderOpen className="h-5 w-5" strokeWidth={2.5} /> Load Demo Project
        </button>
      </div>
    </div>
  );
}

/** Loading skeleton block. */
export function Skeleton({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="inline-block w-10 h-10 border-4 border-ink border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-label-bold font-bold uppercase tracking-wider text-on-surface-variant">
        {children ?? "Loading workspace…"}
      </p>
    </div>
  );
}
