/**
 * SenseGlow Step™ — Trapverlichting met sensor
 */
import { computeBundlePricing } from "./productConfig";

export const STEP_HERO_CONTENT = {
  h1: "Veilig de trap op en af — ook 's nachts.",
  subtitle:
    "Kleine traplampen met bewegingssensor. Geen boren, geen elektricien. Plakken, opladen, klaar.",
  bundleCta: "Voordeliger met sets ↓",
  bullets: [
    "Bewegingssensor — automatisch aan/uit",
    "Zelfklevend — geen boren",
    "USB-C oplaadbaar",
  ],
};

export const STEP_OUTCOME_HEADLINE = "Veiligheid zonder gedoe.";

export const STEP_OUTCOMES = [
  {
    icon: "🌙",
    title: "Zacht licht, niet verblindend",
    description: "Net genoeg om de trap te zien — zonder iemand wakker te maken.",
  },
  {
    icon: "🛡️",
    title: "Voorkom valpartijen",
    description: "Eén op de drie 65-plussers valt jaarlijks. De meeste valpartijen gebeuren op de trap, 's nachts.",
  },
  {
    icon: "⚡",
    title: "Plakken en klaar",
    description: "Geen boren, geen kabels, geen installateur. Binnen 5 minuten geïnstalleerd.",
  },
];

export const STEP_PROBLEM_SOLUTION = {
  headline: "De trap is 's nachts geen veilige plek.",
  problems: [
    "Lichtknopjes vinden in het donker is gevaarlijk.",
    "Vaste traplichten boren betekent een elektricien bellen.",
    "Losse zaklampen werken alleen als je eraan denkt.",
  ],
  solutionTitle: "De oplossing:",
  solutionText:
    "SenseGlow Step™ gaat automatisch aan zodra iemand de trap betreedt. Geen schakelaar, geen installatie.",
};

export const STEP_USE_CASES = [
  { icon: "🪜", title: "Trap", description: "De primaire plek waar Step het verschil maakt", badge: "Meest gekozen" },
  { icon: "🚪", title: "Gang / hal", description: "Veilige route naar de badkamer 's nachts" },
  { icon: "🛏️", title: "Kinderkamer", description: "Zacht nachtlampje zonder schakelaar" },
  { icon: "🚿", title: "Badkamer", description: "Wegwijs in het donker" },
];

export const STEP_TECH_BENEFITS = [
  { icon: "📡", tech: "PIR bewegingssensor", benefit: "Detecteert beweging tot enkele meters" },
  { icon: "🔋", tech: "USB-C oplaadbaar", benefit: "Eén keer per maand opladen — geen wegwerpbatterijen" },
  { icon: "🧲", tech: "Zelfklevende montage", benefit: "Geen boren, geen schade aan de muur" },
  { icon: "💡", tech: "Zacht warm licht", benefit: "Niet verblindend — ook geschikt voor kinderen" },
];

export const STEP_FAQS = [
  { question: "Moet ik boren?", answer: "Nee, de Step lampen plakken zelf op de muur of trap met een zelfklevende strip." },
  { question: "Hoe lang gaat de batterij mee?", answer: "Bij normaal nachtelijk gebruik gaat een lamp ongeveer een maand mee op één lading via USB-C." },
  { question: "Werkt het overdag ook?", answer: "De ingebouwde lichtsensor zorgt dat de lamp alleen aangaat in het donker — overdag blijft hij uit." },
  { question: "Welke set heb ik nodig?", answer: "Een 4-pack volstaat voor een korte trap of gang. Voor langere trappen of meerdere ruimtes raden we de 8-pack aan." },
];

export const STEP_BUNDLE_HEADLINE = "Verlicht je hele trap met één set.";

export const STEP_FINAL_CTA = {
  headline: "Veilig, automatisch, zonder gedoe.",
  subtext: "Gratis verzending • 30 dagen retourrecht",
  cta: "Bekijk SenseGlow Step™",
};

export type StepPack = "4-pack" | "8-pack";

export function parseStepVariant(
  selectedOptions: Array<{ name: string; value: string }>
): { pack: StepPack; color: "Wit" | "Zwart" } {
  let pack: StepPack = "4-pack";
  let color: "Wit" | "Zwart" = "Wit";
  for (const opt of selectedOptions) {
    const v = opt.value.toLowerCase();
    if (v.includes("8")) pack = "8-pack";
    else if (v.includes("4")) pack = "4-pack";
    if (v.includes("zwart") || v.includes("black")) color = "Zwart";
    else if (v.includes("wit") || v.includes("white")) color = "Wit";
  }
  return { pack, color };
}

export const computeStepBundlePricing = computeBundlePricing;
