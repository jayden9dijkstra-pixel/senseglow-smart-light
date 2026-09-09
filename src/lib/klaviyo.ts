import { z } from "zod";

export const KLAVIYO_COMPANY_ID = "SP7Nf3";
export const KLAVIYO_LIST_ID = "YsiDqz";
export const DISCOUNT_CODE = "WELKOM10";

export const emailSchema = z
  .string()
  .trim()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Vul een geldig e-mailadres in" })
  .max(255);

export const firstNameSchema = z
  .string()
  .trim()
  .max(30, { message: "Voornaam mag maximaal 30 tekens zijn" });

export type SubscribeResult =
  | { ok: true }
  | { ok: false; message: string };

interface SubscribeOptions {
  firstName?: string;
  source?: string;
  signupSource?: string;
  signupPage?: string;
}

export async function subscribeToNewsletter(
  email: string,
  source = "SenseGlow website",
  options: SubscribeOptions = {}
): Promise<SubscribeResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Ongeldig e-mailadres" };
  }

  let firstName: string | undefined;
  if (options.firstName !== undefined) {
    const nameParsed = firstNameSchema.safeParse(options.firstName);
    if (!nameParsed.success) {
      return { ok: false, message: nameParsed.error.issues[0]?.message ?? "Ongeldige voornaam" };
    }
    if (nameParsed.data.length > 0) firstName = nameParsed.data;
  }

  const profileAttributes: Record<string, unknown> = {
    email: parsed.data,
    properties: {
      signup_source: options.signupSource ?? "website",
      signup_page: options.signupPage ?? "",
    },
  };
  if (firstName) profileAttributes.first_name = firstName;

  try {
    const res = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
      {
        method: "POST",
        headers: {
          accept: "application/vnd.api+json",
          "content-type": "application/vnd.api+json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: profileAttributes,
                },
              },
              custom_source: source,
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

    if (!res.ok) {
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
