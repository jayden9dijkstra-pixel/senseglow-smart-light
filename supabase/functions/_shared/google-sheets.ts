/** Google Sheets via service-account (JWT RS256). */
// deno-lint-ignore-file no-explicit-any
const RANGE = "Blad1";

function b64url(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function creds(): { client_email: string; private_key: string } {
  const raw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!raw) throw new Error("Service-account ontbreekt.");
  let t = raw.trim();
  if (!t.startsWith("{")) t = `{${t.replace(/,\s*$/, "")}}`; // geplakt zonder buitenste accolades
  // Neem het eerste complete JSON-object (negeert extra geplakte tekst erachter).
  for (let i = t.indexOf("}"); i !== -1; i = t.indexOf("}", i + 1)) {
    try { return JSON.parse(t.slice(t.indexOf("{"), i + 1)); } catch { /* verder zoeken */ }
  }
  return JSON.parse(t);
}

export function serviceAccountEmail(): string {
  return creds().client_email;
}

export async function accessToken(): Promise<string> {
  const { client_email, private_key } = creds();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: client_email, scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  }));
  const pem = private_key.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claim}`)));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claim}.${b64url(sig)}` }),
  });
  if (!res.ok) throw new Error(`Google token [${res.status}]: ${await res.text()}`);
  return (await res.json()).access_token;
}

/** Accepteert een kaal ID of een volledige Sheet-URL. */
export const sheetId = () => {
  const raw = (Deno.env.get("ADS_IMPORT_SHEET_ID") ?? "").trim();
  return raw.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? raw.replace(/[^a-zA-Z0-9_-]/g, "");
};
const base = () => `https://sheets.googleapis.com/v4/spreadsheets/${sheetId()}`;

/** Order IDs die al in kolom F staan. */
export async function existingOrderIds(token?: string): Promise<{ ids: Set<string>; token: string }> {
  const t = token ?? await accessToken();
  const res = await fetch(`${base()}/values/${RANGE}!F2:F`, { headers: { Authorization: `Bearer ${t}` } });
  if (!res.ok) throw new Error(`Sheet lezen [${res.status}]: ${await res.text()}`);
  const body: any = await res.json();
  return { ids: new Set((body.values ?? []).map((r: string[]) => String(r[0] ?? "").trim()).filter(Boolean)), token: t };
}

export async function appendRows(rows: string[][], token: string): Promise<void> {
  if (!rows.length) return;
  const res = await fetch(`${base()}/values/${RANGE}!A:G:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: rows }),
  });
  if (!res.ok) throw new Error(`Sheet schrijven [${res.status}]: ${await res.text()}`);
}
