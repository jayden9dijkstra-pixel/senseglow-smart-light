import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function safeNext(raw: string | null): string {
  if (!raw) return "/";
  try {
    // Only accept same-origin relative paths.
    if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
    return raw;
  } catch {
    return "/";
  }
}

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(params.get("next"));

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.replace(next);
      }
    })();
  }, [next]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.replace(next);
      } else {
        const emailRedirectTo = `${window.location.origin}/login?next=${encodeURIComponent(next)}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo },
        });
        if (error) throw error;
        if (data.session) {
          window.location.replace(next);
        } else {
          setInfo("Check je e-mail om je account te bevestigen, kom daarna terug op deze pagina.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">
          {mode === "signin" ? "Inloggen" : "Account aanmaken"}
        </h1>
        <p className="text-sm text-foreground/60 mb-6">
          {mode === "signin"
            ? "Log in om verder te gaan."
            : "Maak een account om verder te gaan."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-foreground/70">{info}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Bezig..." : mode === "signin" ? "Inloggen" : "Account aanmaken"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setInfo(null);
            setMode(mode === "signin" ? "signup" : "signin");
          }}
          className="mt-6 text-sm text-foreground/60 hover:text-foreground transition-colors w-full text-center"
        >
          {mode === "signin"
            ? "Nog geen account? Maak er een aan"
            : "Al een account? Inloggen"}
        </button>
      </div>
    </main>
  );
}
