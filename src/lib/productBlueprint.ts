/**
 * Productpagina-blauwdruk: voordelen, vragen en specificaties per product.
 * Alles komt letterlijk uit de Shopify-productbeschrijving of uit /verzending en /retourneren.
 * Staat een antwoord daar niet, dan staat de vraag hier ook niet.
 */
import {
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
} from "./productConfig";

export type BenefitIcon = "motion" | "usb" | "magnet" | "stick" | "touch" | "sun" | "water" | "light";
export interface Benefit { icon: BenefitIcon; text: string }
export interface Faq { question: string; answer: string }

/** Uit /verzending en /retourneren. */
const DELIVERY: Faq = { question: "Hoe lang duurt de levering?", answer: "Levering in 7-14 werkdagen. Verzending naar Nederland en België is gratis." };
const RETURNS: Faq = { question: "Kan ik retourneren?", answer: "Ja, 30 dagen retour, bovenop je wettelijke 14 dagen. Mail naar support@senseglow.shop met je bestelnummer." };

export const BLUEPRINT: Record<string, { benefits: Benefit[]; faqs: Faq[] }> = {
  [PRODUCT_HANDLE]: {
    benefits: [
      { icon: "motion", text: "Bewegingssensor tot 5 meter, 120° hoek" },
      { icon: "usb", text: "USB-C oplaadbaar" },
      { icon: "magnet", text: "Magnetische bevestiging: overal te plakken" },
    ],
    faqs: [
      { question: "Moet ik boren?", answer: "Nee. Bevestiging met magneet en plakstrip (inbegrepen)." },
      { question: "Hoe laad ik hem op?", answer: "Via USB-C, kabel inbegrepen. Eén keer per paar weken laden." },
      { question: "Wanneer gaat hij aan?", answer: "Hij gaat aan als jij eraan komt en uit als je weg bent. Er zijn 3 lichtmodi: aan bij beweging, altijd aan of altijd uit." },
      DELIVERY,
      RETURNS,
    ],
  },
  [WAVE_PRODUCT_HANDLE]: {
    benefits: [
      { icon: "motion", text: "Bewegingssensor tot 5 meter" },
      { icon: "usb", text: "USB-C oplaadbaar, geen losse batterijen" },
      { icon: "magnet", text: "Magnetische bevestiging: plakken, schuiven, klaar" },
    ],
    faqs: [
      { question: "Moet ik boren?", answer: "Nee. Bevestiging met magneet en plakstrip (inbegrepen)." },
      { question: "Hoe laad ik hem op?", answer: "Via USB-C, kabel inbegrepen." },
      { question: "Wanneer gaat hij aan?", answer: "De lichtclusters lichten na elkaar op als jij langsloopt. Er zijn 3 lichtmodi: aan bij beweging, altijd aan of altijd uit." },
      DELIVERY,
      RETURNS,
    ],
  },
  [FLEX_PRODUCT_HANDLE]: {
    benefits: [
      { icon: "touch", text: "Tik voor aan/uit, houd vast om te dimmen" },
      { icon: "usb", text: "Oplaadbaar via USB-C" },
      { icon: "magnet", text: "Magnetisch: makkelijk af te halen" },
    ],
    faqs: [
      { question: "Hoe laad ik hem op?", answer: "Via USB-C. Door de magnetische bevestiging haal je hem makkelijk af om op te laden." },
      { question: "Wanneer gaat hij aan?", answer: "Als je erop tikt. Geen sensor, geen automatiek: jij bepaalt wanneer en hoe fel hij brandt." },
      DELIVERY,
      RETURNS,
    ],
  },
  [LANTERN_PRODUCT_HANDLE]: {
    benefits: [
      { icon: "sun", text: "Laadt overdag op via zonnepaneel" },
      { icon: "motion", text: "Bewegingssensor tot 6 meter, 120°" },
      { icon: "water", text: "IP65 waterdicht" },
    ],
    faqs: [
      { question: "Hoe laad ik hem op?", answer: "Overdag laadt hij zichzelf op via het zonnepaneel. Laadtijd ±6 uur in direct zonlicht." },
      { question: "Wanneer gaat hij aan?", answer: "Automatisch bij schemering, als er iemand langsloopt. Bij daglicht gaat hij uit." },
      DELIVERY,
      RETURNS,
    ],
  },
  [STEP_PRODUCT_HANDLE]: {
    benefits: [
      { icon: "motion", text: "Gaat aan bij nadering, uit na inactiviteit" },
      { icon: "stick", text: "Zelfklevend: geen boren, geen gereedschap" },
      { icon: "usb", text: "Oplaadbaar via USB-C" },
    ],
    faqs: [
      { question: "Moet ik boren?", answer: "Nee. Zelfklevende montage: geen boren, geen gereedschap." },
      { question: "Hoe laad ik hem op?", answer: "Elke lamp is oplaadbaar via USB-C. Geen vaste bedrading nodig." },
      { question: "Wanneer gaat hij aan?", answer: "Bij nadering. Als er niemand meer is, gaat hij automatisch uit." },
      DELIVERY,
      RETURNS,
    ],
  },
};

export const blueprintFor = (handle: string | undefined) => (handle ? BLUEPRINT[handle] : undefined);

/** Alleen de regels onder 'Specificaties' in de Shopify-beschrijving, als [label, waarde]. */
export function specsFromDescription(description: string | undefined | null): [string, string][] {
  if (!description) return [];
  const i = description.lastIndexOf("Specificaties");
  if (i < 0) return [];
  const body = description.slice(i + "Specificaties".length).trim();
  return body
    .split(/\s(?=[A-Z][a-z]+(?: [a-z]+)?:\s)/)
    .map((part) => {
      const m = part.match(/^([^:]+):\s*(.+)$/);
      return m ? ([m[1].trim(), m[2].trim()] as [string, string]) : null;
    })
    .filter((r): r is [string, string] => !!r);
}

type V = { price: { amount: string }; selectedOptions: { name: string; value: string }[] };
const setSize = (v: V) => Number(v.selectedOptions.map((o) => o.value).join(" ").match(/(\d+)[- ]?(?:delige|pack|set)/i)?.[1] ?? 0);
const colorOf = (v: V) => v.selectedOptions.map((o) => o.value).join(" ").replace(/\d+[- ]?(?:delige|pack|set)\S*/gi, "").trim().toLowerCase();

/** Wall Lamp: hoeveel de 8-set goedkoper is dan 2 sets van 4 (zelfde kleur), uit de Shopify-prijzen. */
export function eightSetSaving(variant: V | null | undefined, variants: V[]): number | null {
  if (!variant || setSize(variant) !== 8) return null;
  const four = variants.find((v) => setSize(v) === 4 && colorOf(v) === colorOf(variant));
  if (!four) return null;
  const saving = Math.round((2 * parseFloat(four.price.amount) - parseFloat(variant.price.amount)) * 100) / 100;
  return saving > 0 ? saving : null;
}
