import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  FileScan,
  ShieldCheck,
  ClipboardCheck,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarOrnament } from "@/components/ornaments";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  {
    icon: FileScan,
    title: "Smart PRD Analysis",
    body: "Instantly scan documents for technical gaps and incomplete requirements.",
    accent: "bg-lavender",
  },
  {
    icon: ShieldCheck,
    title: "Ambiguity Detection",
    body: "Resolve vague acceptance criteria before development starts.",
    accent: "bg-coral",
  },
  {
    icon: ClipboardCheck,
    title: "Engineering Review",
    body: "A structured workspace for technical validation and sign-off.",
    accent: "bg-teal-mint",
  },
  {
    icon: Download,
    title: "Exportable Findings",
    body: "Generate professional audit reports in PDF, Markdown, or JSON.",
    accent: "bg-surface-container-highest",
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-cream border-b-neo border-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-black uppercase tracking-tighter hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
          >
            SpecGuard AI
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="coral" size="md">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="md" className="hidden sm:inline-flex">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild variant="ink" size="md">
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col gap-16 overflow-hidden">
        {/* Floating ornaments */}
        <div
          aria-hidden
          className="absolute top-20 left-6 w-8 h-8 rounded-full bg-teal-mint border-neo border-ink animate-float hidden md:block"
        />
        <div
          aria-hidden
          className="absolute top-40 right-24 w-12 h-12 bg-coral border-neo border-ink rotate-12 animate-float-delayed hidden md:block"
        />
        <div
          aria-hidden
          className="absolute bottom-24 left-1/4 w-6 h-6 rounded-full bg-lavender border-neo border-ink animate-float hidden md:block"
        />

        {/* Hero */}
        <section className="flex flex-col lg:flex-row gap-10 items-center justify-between relative z-10">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-surface-container-high border-neo border-ink px-3 py-1 rounded w-max">
              <span className="w-3 h-3 rounded-full bg-coral border-2 border-ink" />
              <span className="text-label-bold font-bold">v2.0 Beta Live</span>
            </div>
            <h1 className="text-[44px] sm:text-6xl font-black leading-[1.02] tracking-tighter text-balance">
              Build Better Software by{" "}
              <span className="bg-lavender px-2 border-neo border-ink rotate-1 inline-block mt-2 shadow-neo-sm">
                Perfecting
              </span>{" "}
              Your Requirements
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg">
              SpecGuard AI scans your PRDs to catch ambiguities, missing
              requirements, and technical edge cases before a single line of code
              is written.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button asChild variant="coral" size="lg">
                <Link to={user ? "/dashboard" : "/auth"}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="teal" size="lg">
                <Link to={user ? "/dashboard" : "/auth"}>
                  Try Demo <Play className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero visual — faux dashboard preview */}
          <div className="w-full lg:w-1/2 relative">
            <div className="bg-paper rounded-card border-neo border-ink shadow-neo p-2 relative z-10 rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="border-b-neo border-ink pb-2 mb-2 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-coral border-2 border-ink" />
                <span className="w-3 h-3 rounded-full bg-surface-container-highest border-2 border-ink" />
                <span className="w-3 h-3 rounded-full bg-teal-mint border-2 border-ink" />
              </div>
              <div className="rounded-brutalist overflow-hidden border-neo border-ink bg-cream p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase">Smart Mirror Interface</span>
                  <span className="ml-auto bg-coral text-paper text-[10px] font-bold px-2 py-0.5 border-2 border-ink uppercase">
                    3 Issues
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Completeness", v: "85%", c: "bg-teal-mint" },
                    { l: "Ambiguity", v: "12%", c: "bg-coral" },
                    { l: "Consistency", v: "78%", c: "bg-rose-deep" },
                  ].map((s) => (
                    <div key={s.l} className="bg-paper border-2 border-ink p-2">
                      <div className="text-[9px] font-bold uppercase opacity-70">{s.l}</div>
                      <div className="text-lg font-black">{s.v}</div>
                      <div className={`h-1.5 mt-1 ${s.c} border border-ink`} />
                    </div>
                  ))}
                </div>
                <div className="bg-rose border-2 border-ink p-2 text-[11px]">
                  <span className="font-bold text-coral-deep">⚠ Ambiguity</span>
                  <span className="ml-1">"ambient information" needs a measurable definition.</span>
                </div>
                <div className="bg-paper border-2 border-ink p-2 text-[11px]">
                  <span className="font-bold">✓ Resolve</span>
                  <span className="ml-1 text-on-surface-variant">FR3 Wi-Fi spec reviewed & accepted.</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-full h-full bg-surface-container-highest rounded-card border-neo border-ink -z-10" />
            <StarOrnament className="absolute -bottom-4 -left-4 w-7 h-7 bg-coral z-20" />
          </div>
        </section>

        {/* Features */}
        <section className="flex flex-col gap-8 relative z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-headline-lg">Core Capabilities</h2>
            <div className="h-[3px] bg-ink flex-grow hidden sm:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-paper rounded-card border-neo border-ink shadow-neo p-5 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-neo-lg transition-all"
              >
                <div
                  className={`w-12 h-12 ${f.accent} rounded-brutalist border-neo border-ink flex items-center justify-center mb-2`}
                >
                  <f.icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-headline-md">{f.title}</h3>
                <p className="text-body-md text-on-surface-variant">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t-neo border-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-headline-md font-black">SpecGuard AI</div>
          <nav className="flex flex-wrap justify-center gap-4">
            {["About", "Support", "Privacy", "Terms"].map((l) => (
              <span
                key={l}
                className="text-on-surface-variant text-label-bold font-bold hover:text-coral-deep transition-colors cursor-default"
              >
                {l}
              </span>
            ))}
          </nav>
          <div className="text-on-surface-variant text-body-md">
            © 2026 SpecGuard AI. Built for engineers.
          </div>
        </div>
      </footer>
    </div>
  );
}
