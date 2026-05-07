/**
 * SenseGlow Sconce™ — Draadloze wandlamp set (set van 2)
 */
import { computeBundlePricing } from "./productConfig";

export const SCONCE_HERO_CONTENT = {
  h1: "Wandlampen ophangen zonder boren.",
  subtitle:
    "Een set van 2 draadloze wandlampen op batterij. Geen bedrading, geen elektricien — gewoon ophangen en genieten.",
  bundleCta: "Voordeliger met sets ↓",
  bullets: [
    "Volledig draadloos op accu (12.000mAh)",
    "Tot ±30 dagen licht per lading",
    "Touch-bediening: aan, uit en dimmen",
  ],
};

export const SCONCE_OUTCOME_HEADLINE = "Sfeervolle wandverlichting, zonder gereedschap.";

export const SCONCE_OUTCOMES = [
  { icon: "🪛", title: "Geen boren, geen schade", description: "Ideaal voor huurders en perfectionisten — beugel zonder gaten in de muur." },
  { icon: "🔋", title: "Tot 30 dagen per lading", description: "12.000mAh accu houdt het wekenlang vol bij normaal gebruik." },
  { icon: "✋", title: "Touch-bediening", description: "Tik voor aan/uit, houd vast om te dimmen. Eindeloos veel mogelijkheden." },
];

export const SCONCE_PROBLEM_SOLUTION = {
  headline: "Wandverlichting hoeft geen project te zijn.",
  problems: [
    "Bedrading laten trekken is duur en omslachtig.",
    "Huurders mogen vaak niets permanent bevestigen.",
    "Standaard wandlampen zijn lelijk of overweldigend.",
  ],
  solutionTitle: "De oplossing:",
  solutionText:
    "Hang ze op met de meegeleverde beugel — zonder boren of elektricien. Verplaats wanneer je wilt.",
};

export const SCONCE_USE_CASES = [
  { icon: "🛏️", title: "Slaapkamer", description: "Boven het bed als sfeerlicht", badge: "Meest gekozen" },
  { icon: "🛋️", title: "Woonkamer", description: "Symmetrisch naast de bank" },
  { icon: "🚪", title: "Hal", description: "Warm onthaal bij de deur" },
  { icon: "🖼️", title: "Boven kunst", description: "Accentverlichting zonder kabels" },
];

export const SCONCE_TECH_BENEFITS = [
  { icon: "🔋", tech: "12.000mAh accu", benefit: "Tot ±30 dagen brandtijd op één volle lading" },
  { icon: "✋", tech: "Touch-bediening", benefit: "Tik voor aan/uit, houd vast om te dimmen" },
  { icon: "🪝", tech: "Magnetische beugel", benefit: "Ophangen zonder boren — of met schroeven, jij kiest" },
  { icon: "🏠", tech: "Indoor design", benefit: "Premium afwerking in zilver, zwart of goud" },
];

export const SCONCE_FAQS = [
  { question: "Moet ik boren?", answer: "Nee. De meegeleverde beugel hangt zonder boren — geen gaten in de muur. Schroeven zitten er wel bij voor wie dat wil." },
  { question: "Hoe lang gaan de lampen mee per lading?", answer: "Bij normaal gebruik ongeveer 30 dagen op één volle lading. Opladen via USB." },
  { question: "Wat zit er in de set?", answer: "Twee wandlampen — voor symmetrische plaatsing aan beide kanten van een bed of bank." },
  { question: "Mag dit buiten?", answer: "Nee, de Sconce is uitsluitend geschikt voor binnen — niet waterdicht." },
];

export const SCONCE_BUNDLE_HEADLINE = "Meerdere kamers in één set.";

export const SCONCE_FINAL_CTA = {
  headline: "Sfeer in elke kamer, zonder gereedschap.",
  subtext: "Gratis verzending • 30 dagen retourrecht",
  cta: "Bekijk SenseGlow Sconce™",
};

export function parseSconceVariant(
  selectedOptions: Array<{ name: string; value: string }>
): { color: "Zilver" | "Zwart" | "Goud" } {
  let color: "Zilver" | "Zwart" | "Goud" = "Zwart";
  for (const opt of selectedOptions) {
    const v = opt.value.toLowerCase();
    if (v.includes("gold") || v.includes("goud")) color = "Goud";
    else if (v.includes("silver") || v.includes("zilver")) color = "Zilver";
    else if (v.includes("black") || v.includes("zwart")) color = "Zwart";
  }
  return { color };
}

export const computeSconceBundlePricing = computeBundlePricing;
