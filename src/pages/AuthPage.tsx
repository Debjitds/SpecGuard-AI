import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Rocket, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { signIn, signUp, mode } = useAuth();
  const navigate = useNavigate();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await signIn({ email: loginEmail, password: loginPassword });
    setBusy(false);
    if (res.error) setError(res.error);
    else navigate("/dashboard");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await signUp({
      email: signupEmail,
      password: signupPassword,
      fullName: signupName,
    });
    setBusy(false);
    if (res.error) setError(res.error);
    else navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream overflow-x-hidden">
      {/* Floating ornaments */}
      <div
        aria-hidden
        className="fixed top-20 left-10 w-8 h-8 bg-lavender ornament-star border-2 border-ink rotate-12 hidden md:block z-0"
      />
      <div
        aria-hidden
        className="fixed bottom-32 right-20 w-12 h-12 bg-coral rounded-full border-neo border-ink hidden md:block z-0"
      />

      <main className="flex-grow flex flex-col md:flex-row w-full max-w-[1440px] mx-auto z-10 relative">
        {/* Left brand column */}
        <section className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center items-start border-b-neo md:border-b-0 md:border-r-neo border-ink">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-on-surface-variant hover:text-ink text-sm font-bold"
          >
            ← Back to home
          </Link>
          <div className="mb-8">
            <h1 className="text-display-lg font-black tracking-tighter mb-2">
              SpecGuard AI
            </h1>
            <p className="text-headline-md font-bold text-on-surface-variant max-w-md">
              Catch ambiguities and edge cases before development starts.
            </p>
          </div>

          {/* Abstract graphic */}
          <div className="relative w-full max-w-sm mx-auto my-8 hidden md:block">
            <div className="absolute inset-0 bg-yellow rounded-brutalist border-neo border-ink shadow-neo-lg translate-x-4 translate-y-4" />
            <div className="relative z-10 bg-paper p-4 border-neo border-ink rounded-brutalist shadow-neo-lg">
              <div className="border-neo border-ink bg-cream rounded-sm p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase text-sm">Audit Report</span>
                  <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: "Completeness", v: "92%", c: "bg-teal-mint" },
                    { l: "Ambiguity", v: "8%", c: "bg-coral" },
                    { l: "Testability", v: "95%", c: "bg-teal-bright" },
                    { l: "Consistency", v: "88%", c: "bg-rose-deep" },
                  ].map((s) => (
                    <div key={s.l} className="bg-paper border-2 border-ink p-2">
                      <div className="text-[9px] font-bold uppercase opacity-70">{s.l}</div>
                      <div className="text-base font-black">{s.v}</div>
                      <div className={`h-1.5 mt-1 ${s.c} border border-ink`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-coral border-neo border-ink rounded-full shadow-neo-sm z-20" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-teal-mint border-neo border-ink shadow-neo-sm rotate-12 z-20" />
            </div>
          </div>
        </section>

        {/* Right auth card */}
        <section className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center bg-surface-container-low">
          <div className="w-full max-w-md bg-paper border-neothick border-ink rounded-card shadow-neo-lg relative z-20">
            <Tabs defaultValue="login" className="w-full">
              <TabsList>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {error && (
                <div className="mx-5 mt-4 bg-rose border-neo border-ink px-3 py-2 text-sm font-bold text-coral-deep">
                  {error}
                </div>
              )}

              <TabsContent value="login" className="p-6">
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                  <div>
                    <Label htmlFor="login-email">Email Address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="engineer@specguard.ai"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="coral" size="lg" disabled={busy} className="mt-2">
                    {busy ? "Signing in…" : "Login"}
                    {!busy && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="p-6">
                <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@specguard.ai"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="teal" size="lg" disabled={busy} className="mt-2">
                    {busy ? "Creating account…" : "Create Account"}
                    {!busy && <Rocket className="h-4 w-4" />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <footer className="bg-cream border-t-neo border-ink">
        <div className="mx-auto max-w-[1440px] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-headline-md font-black">SpecGuard AI</div>
          <div className="text-on-surface-variant text-caption">
            Running in {mode} mode · © 2026 SpecGuard AI
          </div>
        </div>
      </footer>
    </div>
  );
}
