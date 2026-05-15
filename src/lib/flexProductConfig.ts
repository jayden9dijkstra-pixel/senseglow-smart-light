/**
 * SenseGlow Flex™ product configuration
 * Handle: night-light-led-usb-rechargeable-lamp-hanging-magnetic-desk-lamp-stepless-dimming-cabinet-closet-wardrobe-table-lamp2026-03-08-17-16-36
 *
 * Variant structure (Shopify):
 *   Option "Emitting Color": "Pink", "White", "Green", "White Remote Control", etc.
 *   → parsed into: bodyColor (Pink/White/Green) + type (Standard/Remote Control)
 */

export const FLEX_PRODUCT_HANDLE = "senseglow_flex";

// ─── Hero ──────────────────────────────────────────────

export const FLEX_HERO_CONTENT = {
  h1: "Light, exactly where you need it.",
  subtitle:
    "A flexible, magnetic light that adapts to your space — in seconds.",
  bundleCta: "Voordeliger met bundels ↓",
  bullets: [
    "88° verstelbaar — richt het licht precies waar je wil",
    "Magnetisch & 3M bevestiging — geen boren",
    "Draadloos & oplaadbaar (USB-C)",
  ],
};

// ─── Outcomes ──────────────────────────────────────────

export const FLEX_OUTCOME_HEADLINE = "Control your light.";

export const FLEX_OUTCOMES = [
  {
    icon: "🎯",
    title: "Volledige controle",
    description:
      "SenseGlow Flex™ geeft je volledige controle over richting en sfeer. Geen vaste verlichting — maar licht dat zich aanpast aan jou.",
  },
  {
    icon: "🔄",
    title: "88° verstelbaar",
    description:
      "Richt het licht precies op je werk, boek of ruimte — in één beweging.",
  },
  {
    icon: "🧲",
    title: "Overal plaatsbaar",
    description:
      "Magnetisch of met 3M tape — geen boren, geen kabels, geen gedoe.",
  },
];

// ─── Problem / Solution ────────────────────────────────

export const FLEX_PROBLEM_SOLUTION = {
  headline: "Vast licht werkt niet altijd.",
  problems: [
    "Vaste verlichting schijnt nooit precies waar je het nodig hebt.",
    "Bureaulampen nemen ruimte in en zijn niet flexibel.",
    "Kastverlichting is vaak te fel of te zwak.",
  ],
  solutionTitle: "De oplossing:",
  solutionText:
    "Met SenseGlow Flex™ richt je het licht exact naar je werk, boek of ruimte — in seconden. Draadloos, verstelbaar en overal te plaatsen.",
};

// ─── Use Cases ─────────────────────────────────────────

export const FLEX_USE_CASES = [
  {
    icon: "💻",
    title: "Bureau / study setup",
    description: "Perfect gericht licht op je werkplek",
    badge: "Populair",
  },
  {
    icon: "📖",
    title: "Bedside / lezen",
    description: "Lees comfortabel zonder je partner te storen",
  },
  {
    icon: "🍳",
    title: "Keukenkastjes",
    description: "Extra licht precies waar je kookt",
  },
  {
    icon: "👔",
    title: "Kledingkast",
    description: "Direct zicht op je kleding",
  },
  {
    icon: "💄",
    title: "Make-up / spiegel",
    description: "Oogvriendelijk licht voor precisiewerk",
  },
  {
    icon: "🔧",
    title: "Garage / werkplek",
    description: "Functioneel licht dat je kunt richten",
  },
  {
    icon: "🏕️",
    title: "Camper / portable",
    description: "Neem het overal mee naartoe",
  },
];

// ─── Tech Benefits ─────────────────────────────────────

export const FLEX_TECH_BENEFITS = [
  {
    icon: "📐",
    tech: "88° verstelbare hoek",
    benefit: "Richt het licht precies waar je het nodig hebt — omhoog of omlaag",
  },
  {
    icon: "🎨",
    tech: "3 lichtkleuren in één lamp",
    benefit: "Warm (3000K), Neutraal (4500K) en Wit (6000K) — schakel eenvoudig",
  },
  {
    icon: "💡",
    tech: "Traploos dimbaar (touch control)",
    benefit: "Lang indrukken voor traploos dimmen — van sfeerlicht tot vol vermogen",
  },
  {
    icon: "🔋",
    tech: "2000mAh batterij — 3 tot 20 uur",
    benefit: "USB-C oplaadbaar, geen batterijen nodig",
  },
  {
    icon: "👁️",
    tech: "Anti-glare / oogvriendelijk",
    benefit: "Geen flikkering, geen blauw licht — EU RGO gecertificeerd",
  },
  {
    icon: "🧲",
    tech: "Magnetische bevestiging + 3M",
    benefit: "Bevestig overal zonder boren — verplaats wanneer je wilt",
  },
];

// ─── FAQ ───────────────────────────────────────────────

export const FLEX_FAQS = [
  {
    question: "Moet ik boren?",
    answer:
      "Nee, je bevestigt de SenseGlow Flex™ met de ingebouwde magneet of de meegeleverde 3M strip. Geen gereedschap nodig.",
  },
  {
    question: "Hoe lang gaat de batterij mee?",
    answer:
      "3 tot 20 uur afhankelijk van het ingestelde helderheidsniveau. Volledig opladen duurt 4-5 uur via USB-C.",
  },
  {
    question: "Kan ik de richting aanpassen?",
    answer:
      "Ja, de lampkop is tot 88 graden verstelbaar zodat je het licht precies kunt richten waar je het nodig hebt.",
  },
  {
    question: "Is het licht fel?",
    answer:
      "Je kunt het volledig dimmen met de touch control. Van subtiel sfeerlicht tot heldere werkverlichting — jij bepaalt.",
  },
];

// ─── Bundle headline ───────────────────────────────────

export const FLEX_BUNDLE_HEADLINE =
  "Meer licht, meer controle in je ruimte.";

// ─── Final CTA ─────────────────────────────────────────

export const FLEX_FINAL_CTA = {
  headline: "Take control of your light.",
  subtext: "Gratis verzending • 30 dagen retourrecht",
  cta: "Bekijk SenseGlow Flex™",
};

// ─── Variant parsing helpers ───────────────────────────

export type FlexColor = "white" | "pink" | "green" | "black";

/**
 * Parse a Flex/Lantern variant's selectedOptions to extract body color.
 * Works for Flex ("White", "Black") and Lantern ("1PCS-White Wall Ligh", "1PCS-Black Wall Ligh").
 */
export function parseFlexVariant(
  selectedOptions: Array<{ name: string; value: string }>
): { bodyColor: FlexColor } {
  let bodyColor: FlexColor = "white";

  for (const opt of selectedOptions) {
    const val = opt.value.toLowerCase();
    if (val.includes("black")) bodyColor = "black";
    else if (val.includes("white")) bodyColor = "white";
    else if (val.includes("pink")) bodyColor = "pink";
    else if (val.includes("green")) bodyColor = "green";
  }

  return { bodyColor };
}

import { computeBundlePricing } from "./productConfig";

/** Bundle pricing — uses centralized 11/13/20% tiers. */
export const computeFlexBundlePricing = computeBundlePricing;
