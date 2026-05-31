/**
 * SenseGlow Arc™ product configuration
 * Handle: aluminium-led-wall-lamp-ip65-waterproof-8w-12w-outdoor-garden-lighting2026-02-20-02-48-52
 *
 * Variant structure (Shopify):
 *   Option "Uitstraalkleur": "Black 2W", "White 6W", etc. (body color + wattage combined)
 *   Option "Wattage": "Waterproof IP65" (constant, ignore)
 *   Option "Kleur": "Warm light 3000K" | "White Light 6000K" (light color)
 */

export const ARC_PRODUCT_HANDLE =
  "aluminium-led-wall-lamp-ip65-waterproof-8w-12w-outdoor-garden-lighting2026-02-20-02-48-52";

// ─── Hero ──────────────────────────────────────────────

export const ARC_HERO_CONTENT = {
  h1: "Shape your space with light.",
  subtitle:
    "Precision lighting that creates depth, symmetry and presence, inside and outside.",
  bundleCta: "Voordeliger met bundels ↓",
  bullets: [
    "IP65 waterproof, geschikt voor binnen & buiten",
    "Up & down light design voor een architectural effect",
    "Energiezuinig & lange levensduur",
  ],
};

// ─── Outcomes ──────────────────────────────────────────

export const ARC_OUTCOME_HEADLINE = "From lighting to architecture.";

export const ARC_OUTCOMES = [
  {
    icon: "🏛️",
    title: "Van verlichting naar architectuur",
    description:
      "SenseGlow Arc™ verandert muren in design. Het licht creëert lijnen, diepte en een uitstraling die normaal alleen in high-end woningen te zien is.",
  },
  {
    icon: "✨",
    title: "Premium uitstraling, direct zichtbaar",
    description:
      "Eén Arc light verandert de hele look van een muur, gevel of entree.",
  },
  {
    icon: "📐",
    title: "Symmetrie en balans",
    description:
      "Combineer meerdere Arc lights voor een strak, professioneel lichtplan.",
  },
];

// ─── Problem / Solution ────────────────────────────────

export const ARC_PROBLEM_SOLUTION = {
  headline: "Buitenverlichting verdient beter.",
  problems: [
    "Standaard buitenverlichting is fel, vlak en puur functioneel.",
    "Het voegt niets toe aan de uitstraling van je woning.",
    "Verlichting wordt gezien als noodzaak, niet als design-element.",
  ],
  solutionTitle: "De oplossing:",
  solutionText:
    "SenseGlow Arc™ brengt structuur en balans in je ruimte. Het creëert een strak lichtpatroon dat direct een premium uitstraling geeft.",
};

// ─── Use Cases ─────────────────────────────────────────

export const ARC_USE_CASES = [
  {
    icon: "🚪",
    title: "Voorgevel / voordeur",
    description: "Symmetrisch licht naast je entree",
    badge: "Meest gekozen",
  },
  {
    icon: "🌿",
    title: "Tuin / terras",
    description: "Sfeer en veiligheid na zonsondergang",
  },
  {
    icon: "🏗️",
    title: "Balkon",
    description: "Compact design, groot effect",
  },
  {
    icon: "🚶",
    title: "Gang / hal",
    description: "Strakke lijnen in je interieur",
  },
  {
    icon: "🚗",
    title: "Garage / oprit",
    description: "Functioneel én visueel sterk",
  },
  {
    icon: "🖼️",
    title: "Binnen als design wall light",
    description: "Architectural accent in elke kamer",
  },
];

// ─── Tech Benefits ─────────────────────────────────────

export const ARC_TECH_BENEFITS = [
  {
    icon: "💧",
    tech: "IP65 waterdicht",
    benefit: "Bestand tegen regen, sneeuw en stof, volledig geschikt voor buiten",
  },
  {
    icon: "🏗️",
    tech: "Aluminium behuizing",
    benefit: "Duurzaam, premium materiaal met een strakke afwerking",
  },
  {
    icon: "⬆️",
    tech: "Up & down light effect",
    benefit: "Creëert een architectural lichtpatroon op je muur",
  },
  {
    icon: "⚡",
    tech: "Energiezuinig LED systeem",
    benefit: "Laag verbruik met hoge lichtopbrengst (100-130 lm/W)",
  },
  {
    icon: "⏳",
    tech: "30.000 uur levensduur",
    benefit: "Jarenlang genieten zonder vervanging",
  },
  {
    icon: "🔌",
    tech: "Netstroom (AC85-260V)",
    benefit: "Stabiele, betrouwbare voeding, geen batterijen nodig",
  },
  {
    icon: "🎨",
    tech: "CRI >80 kleurweergave",
    benefit: "Natuurgetrouwe kleuren voor een premium lichtbeleving",
  },
];

// ─── FAQ ───────────────────────────────────────────────

export const ARC_FAQS = [
  {
    question: "Is deze lamp geschikt voor buiten?",
    answer:
      "Ja, de SenseGlow Arc™ is volledig IP65 waterdicht en bestand tegen regen, sneeuw en stof.",
  },
  {
    question: "Moet ik hem aansluiten op stroom?",
    answer:
      "Ja, deze lamp werkt op netstroom (AC85-260V). Ideaal voor vaste installatie bij je voordeur, tuin of binnen.",
  },
  {
    question: "Kan ik meerdere combineren?",
    answer:
      "Absoluut, dit product komt het beste tot zijn recht in symmetrische setups, bijvoorbeeld links en rechts van je voordeur.",
  },
  {
    question: "Welke lichtkleur moet ik kiezen?",
    answer:
      "Warm licht (3000K) geeft een sfeervolle, uitnodigende uitstraling. Koud licht (6000K) is strak en modern. Kies wat past bij je stijl.",
  },
];

// ─── Bundle headline ───────────────────────────────────

export const ARC_BUNDLE_HEADLINE =
  "Creëer symmetrie en diepte met meerdere Arc lights.";

// ─── Final CTA ─────────────────────────────────────────

export const ARC_FINAL_CTA = {
  headline: "Upgrade your exterior.",
  subtext: "Gratis verzending • 30 dagen retourrecht",
  cta: "Bekijk SenseGlow Arc™",
};

// ─── Helpers ───────────────────────────────────────────

/** Available wattages for the Arc product */
export type ArcWattage = "12W";
export type ArcLightColor = "warm" | "cold";

import { computeBundlePricing } from "./productConfig";

/** Bundle pricing, uses centralized 11/13/20% tiers. */
export const computeArcBundlePricing = computeBundlePricing;

/**
 * Parse an Arc variant's selectedOptions to extract wattage, body color and light color.
 */
export function parseArcVariant(
  selectedOptions: Array<{ name: string; value: string }>
): { wattage: string; bodyColor: string; lightColor: ArcLightColor } {
  let wattage = "";
  let bodyColor = "";
  let lightColor: ArcLightColor = "warm";

  for (const opt of selectedOptions) {
    const name = opt.name.toLowerCase();
    const value = opt.value;
    const lower = value.toLowerCase();

    if (name === "colour of lamp" || name === "color of lamp" || name === "kleur lamp") {
      if (lower.includes("white")) bodyColor = "White";
      else if (lower.includes("black")) bodyColor = "Black";
    } else if (name === "wattage" || name === "vermogen") {
      const m = value.match(/(\d+W)/i);
      if (m) wattage = m[1];
    } else if (name === "kleur" || name === "color") {
      lightColor = lower.includes("warm") ? "warm" : "cold";
    } else if (name === "uitstraalkleur") {
      // Legacy combined option support
      const match = value.match(/^(Black|White)\s+(\d+W)/i);
      if (match) { bodyColor = match[1]; wattage = match[2]; }
    }
  }

  return { wattage, bodyColor, lightColor };
}
