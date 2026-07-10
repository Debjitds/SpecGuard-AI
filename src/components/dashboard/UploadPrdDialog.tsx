import { useRef, useState } from "react";
import { UploadCloud, FileText, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/context/DashboardContext";

const ACCEPTED = [".md", ".txt", ".markdown"];

export function UploadPrdDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { uploadPrd } = useDashboard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  function reset() {
    setName("");
    setContent("");
    setFileName(undefined);
    setError(null);
    setBusy(false);
    setDragging(false);
  }

  async function handleFile(file: File) {
    setError(null);
    const ok = ACCEPTED.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!ok) {
      setError("Unsupported format. Please upload a .md or .txt file.");
      return;
    }
    const text = await file.text();
    setContent(text);
    setFileName(file.name);
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
  }

  async function handleSubmit() {
    if (!content.trim()) {
      setError("Please provide some PRD content.");
      return;
    }
    if (!name.trim()) {
      setError("Please give your project a name.");
      return;
    }
    setBusy(true);
    try {
      await uploadPrd({ name: name.trim(), content, fileName });
      onOpenChange(false);
      reset();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="h-6 w-6" strokeWidth={2.5} />
            Upload PRD
          </DialogTitle>
          <DialogDescription>
            Drop a Markdown or text document. SpecGuard will analyze it for
            ambiguities, missing criteria, and edge cases.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-4">
          {/* Dropzone */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            className={
              "w-full border-neothick border-ink rounded-card p-6 flex flex-col items-center justify-center gap-2 transition-all " +
              (dragging
                ? "bg-teal-mint shadow-neo -translate-x-0.5 -translate-y-0.5"
                : "bg-cream hover:bg-surface-container-low shadow-neo-sm")
            }
          >
            <span className="w-12 h-12 bg-yellow border-neo border-ink rounded-brutalist flex items-center justify-center">
              <FileText className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <span className="font-bold uppercase tracking-wider text-sm">
              {fileName ?? "Choose file or drag & drop"}
            </span>
            <span className="text-caption text-on-surface-variant">
              Accepted: {ACCEPTED.join(", ")}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(",")}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </button>

          <div>
            <Label htmlFor="prd-name">Project name</Label>
            <Input
              id="prd-name"
              placeholder="e.g. Smart Mirror Interface"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {content && (
            <div className="bg-paper border-neo border-ink rounded-brutalist max-h-40 overflow-auto neo-scroll-dark">
              <pre className="p-3 text-xs whitespace-pre-wrap font-mono">{content.slice(0, 1200)}{content.length > 1200 ? "…" : ""}</pre>
            </div>
          )}

          {error && (
            <div className="bg-rose border-neo border-ink px-3 py-2 text-sm font-bold text-coral-deep">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-caption text-on-surface-variant flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Analysis runs after upload
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button variant="coral" size="md" disabled={busy} onClick={handleSubmit}>
                {busy ? "Uploading…" : "Upload & Open"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
