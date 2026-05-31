/**
 * SenseGlow Lantern™ product configuration
 * Handle: solar-led-wall-lamp-with-motion-sensor-waterproof-tungsten-wire-bulb-for-outdoor-garden-decoration2026-03-08-17-16-37
 *
 * Variant structure: "Emitting Color" → "1PCS-White Wall Ligh" / "1PCS-Black Wall Ligh"
 */

export const LANTERN_PRODUCT_HANDLE = "senseglow_solar_lantern";

// ─── Hero ──────────────────────────────────────────────

export const LANTERN_HERO_CONTENT = {
  h1: "Warm light. No wires.",
  subtitle:
    "A solar-powered lantern that automatically lights up your home, no cables, no effort.",
  bundleCta: "Voordeliger met bundels ↓",
  bullets: [
    "Solar powered, geen stroom nodig",
    "Automatische sensor (dag/nacht + beweging)",
    "IP65 waterproof, perfect voor buiten",
  ],
};

// ─── Outcomes ──────────────────────────────────────────

export const LANTERN_OUTCOME_HEADLINE = "Instant sfeer, elke avond.";

export const LANTERN_OUTCOMES = [
  {
    icon: "🌅",
    title: "Automatisch aan bij schemering",
    description:
      "SenseGlow Lantern™ creëert een warme en uitnodigende uitstraling rondom je huis, volledig automatisch.",
  },
  {
    icon: "☀️",
    title: "Opladen overdag, schijnen 's nachts",
    description:
      "Het zonnepaneel laadt de batterij op tijdens de dag, zodat je 's avonds automatisch licht hebt.",
  },
  {
    icon: "🏡",
    title: "Sfeer zonder gedoe",
    description:
      "Geen kabels, geen stekkers, geen installateur, gewoon bevestigen en genieten.",
  },
];

// ─── Problem / Solution ────────────────────────────────

export const LANTERN_PROBLEM_SOLUTION = {
  headline: "Buitenverlichting hoeft niet moeilijk te zijn.",
  problems: [
    "Buitenverlichting installeren is vaak duur, lastig en afhankelijk van stroom.",
    "Kabels trekken door de tuin is een klus die niemand wil doen.",
    "Batterijen vervangen is onhandig en milieubelastend.",
  ],
  solutionTitle: "De oplossing:",
  solutionText:
    "SenseGlow Lantern™ werkt volledig op zonne-energie en schakelt automatisch in, zonder kabels of gedoe.",
};

// ─── Use Cases ─────────────────────────────────────────

export const LANTERN_USE_CASES = [
  {
    icon: "🌿",
    title: "Tuin / tuinpad",
    description: "Sfeervolle verlichting langs het pad",
    badge: "Meest gekozen",
  },
  {
    icon: "🏗️",
    title: "Balkon",
    description: "Warm licht zonder stekker",
  },
  {
    icon: "🪵",
    title: "Schutting",
    description: "Monteer direct op hout of steen",
  },
  {
    icon: "🚗",
    title: "Garage",
    description: "Bewegingssensor voor veiligheid",
  },
  {
    icon: "🚪",
    title: "Voordeur",
    description: "Verwelkom gasten met warm licht",
  },
  {
    icon: "🍷",
    title: "Terras",
    description: "Gezellige sfeer op zomeravonden",
  },
];

// ─── Tech Benefits ─────────────────────────────────────

export const LANTERN_TECH_BENEFITS = [
  {
    icon: "☀️",
    tech: "Solar powered",
    benefit: "Geen elektriciteit nodig, laadt automatisch op met zonlicht",
  },
  {
    icon: "🔋",
    tech: "1200mAh batterij",
    benefit: "6-12 uur opladen in de zon = 8-12 uur licht 's nachts",
  },
  {
    icon: "📡",
    tech: "Bewegingssensor (120° / ±6 meter)",
    benefit: "Detecteert beweging en schakelt automatisch in",
  },
  {
    icon: "🎛️",
    tech: "3 verlichtingsstanden",
    benefit: "Sensor only • Dim + sensor • Constant dim light",
  },
  {
    icon: "💧",
    tech: "IP65 waterproof",
    benefit: "Bestand tegen regen, sneeuw en stof, het hele jaar door",
  },
  {
    icon: "🌙",
    tech: "Automatisch aan bij donker",
    benefit: "Lichtsensor detecteert schemering en schakelt vanzelf in",
  },
];

// ─── FAQ ───────────────────────────────────────────────

export const LANTERN_FAQS = [
  {
    question: "Werkt dit zonder stroom?",
    answer:
      "Ja, de SenseGlow Lantern™ werkt volledig op zonne-energie. Het zonnepaneel laadt de ingebouwde batterij op tijdens de dag.",
  },
  {
    question: "Moet ik iets installeren?",
    answer:
      "Nee, je monteert hem eenvoudig met de meegeleverde schroeven. Geen kabels, geen adapter nodig.",
  },
  {
    question: "Werkt het ook bij slecht weer?",
    answer:
      "Ja, de lamp is volledig waterdicht (IP65) en bestand tegen regen, sneeuw en vorst.",
  },
  {
    question: "Gaat hij automatisch aan?",
    answer:
      "Ja, de ingebouwde lichtsensor detecteert schemering en schakelt de lamp automatisch in. Bij beweging wordt het licht extra helder.",
  },
];

// ─── Bundle headline ───────────────────────────────────

export const LANTERN_BUNDLE_HEADLINE =
  "Verlicht je hele buitenruimte zonder kabels.";

// ─── Final CTA ─────────────────────────────────────────

export const LANTERN_FINAL_CTA = {
  headline: "Light your home, effortlessly.",
  subtext: "Gratis verzending • 30 dagen retourrecht",
  cta: "Bekijk SenseGlow Lantern™",
};

import { computeBundlePricing } from "./productConfig";

/** Bundle pricing, uses centralized 11/13/20% tiers. */
export const computeLanternBundlePricing = computeBundlePricing;
