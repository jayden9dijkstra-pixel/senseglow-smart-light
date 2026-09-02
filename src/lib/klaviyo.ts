import { z } from "zod";

export const KLAVIYO_COMPANY_ID = "SP7Nf3";
export const KLAVIYO_LIST_ID = "YsiDqz";
export const DISCOUNT_CODE = "WELKOM10";

export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Vul een geldig e-mailadres in" })
  .max(255);

export type SubscribeResult =
  | { ok: true }
  | { ok: false; message: string };

export async function subscribeToNewsletter(
  email: string,
  source = "SenseGlow website"
): Promise<SubscribeResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Ongeldig e-mailadres" };
  }

  try {
    const res = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              custom_source: source,
              profile: {
                data: {
                  type: "profile",
                  attributes: { email: parsed.data },
                },
              },
            },
            relationships: {
              list: {
                data: { type: "list", id: KLAVIYO_LIST_ID },
              },
            },
          },
        }),
      }
    );

    if (!res.ok && res.status !== 202) {
      const text = await res.text().catch(() => "");
      console.error("Klaviyo subscribe failed:", res.status, text);
      return { ok: false, message: "Inschrijven mislukt. Probeer het later opnieuw." };
    }

    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, message: "Verbindingsfout. Probeer het later opnieuw." };
  }
}
