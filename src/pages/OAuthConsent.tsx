import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Beta typed wrapper for supabase.auth.oauth.
type AuthorizationDetails = {
  client?: { name?: string; redirect_uri?: string; redirect_uris?: string[] };
  scope?: string;
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};

type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function getOAuth(): OAuthApi | null {
  const auth = supabase.auth as unknown as { oauth?: OAuthApi };
  return auth.oauth ?? null;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";

  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Geen authorization_id in de URL.");
        setLoading(false);
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.replace("/login?next=" + encodeURIComponent(next));
        return;
      }
      setUserEmail(sess.session.user?.email ?? null);

      const oauth = getOAuth();
      if (!oauth) {
        setError("OAuth-server is niet beschikbaar op deze client.");
        setLoading(false);
        return;
      }

      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.replace(immediate);
        return;
      }
      setDetails(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const oauth = getOAuth();
    if (!oauth) {
      setError("OAuth-server is niet beschikbaar.");
      setBusy(false);
      return;
    }
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setError("Geen redirect ontvangen van de autorisatieserver.");
      setBusy(false);
      return;
    }
    window.location.replace(target);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-background">
        <p className="text-foreground/60">Laden…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-sm text-center">
          <h1 className="text-xl font-semibold mb-2">Autorisatie mislukt</h1>
          <p className="text-sm text-foreground/70">{error}</p>
        </div>
      </main>
    );
  }

  const clientName = details?.client?.name ?? "een externe app";
  const scopes = details?.scopes ?? (details?.scope ? details.scope.split(/\s+/) : []);

  const scopeLabel = (s: string) => {
    if (s === "openid") return "Je identiteit bevestigen";
    if (s === "email") return "Je e-mailadres delen";
    if (s === "profile") return "Je basisprofiel delen";
    return `Extra toestemming: ${s}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">
          Verbind {clientName} met SenseGlow
        </h1>
        <p className="text-sm text-foreground/70 mb-6">
          Dit geeft {clientName} toegang tot de SenseGlow tools terwijl je bent ingelogd.
        </p>

        {userEmail && (
          <div className="text-xs text-foreground/60 mb-4">
            Ingelogd als <span className="text-foreground">{userEmail}</span>
          </div>
        )}

        {scopes.length > 0 && (
          <ul className="mb-6 space-y-1 text-sm text-foreground/80">
            {scopes.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{scopeLabel(s)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-foreground/50 mb-6">
          Dit omzeilt de rechten of backend-regels van deze app niet.
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={busy}
            onClick={() => decide(false)}
          >
            Annuleren
          </Button>
          <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
            {busy ? "Bezig…" : "Goedkeuren"}
          </Button>
        </div>
      </div>
    </main>
  );
}
