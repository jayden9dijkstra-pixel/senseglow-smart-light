/**
 * Generic placeholder content for product pages.
 * Used for all products until final copy is provided.
 * H1 falls back to the live Shopify product title (passed in by ProductDetail).
 */

const PH = "—"; // visual placeholder

export interface PlaceholderContent {
  hero: {
    h1: string;
    subtitle: string;
    bundleCta: string;
    bullets: string[];
  };
  outcomeHeadline: string;
  outcomes: Array<{ icon: string; title: string; description: string }>;
  problemSolution: {
    headline: string;
    problems: string[];
    solutionTitle: string;
    solutionText: string;
  };
  useCaseHeadline: string;
  useCaseSubtitle: string;
  useCases: Array<{ icon: string; title: string; description: string }>;
  techHeadline: string;
  techBenefits: Array<{ icon: string; tech: string; benefit: string }>;
  faqSubtitle: string;
  faqs: Array<{ question: string; answer: string }>;
  bundleHeadline: string;
  finalCta: { headline: string; subtext: string; cta: string };
}

export function buildPlaceholderContent(productTitle: string): PlaceholderContent {
  const placeholderItem = { icon: "▢", title: PH, description: PH };
  return {
    hero: {
      h1: productTitle || PH,
      subtitle: PH,
      bundleCta: "Voordeliger met bundels",
      bullets: [PH, PH, PH],
    },
    outcomeHeadline: PH,
    outcomes: [placeholderItem, placeholderItem, placeholderItem],
    problemSolution: {
      headline: PH,
      problems: [PH, PH, PH],
      solutionTitle: PH,
      solutionText: PH,
    },
    useCaseHeadline: PH,
    useCaseSubtitle: PH,
    useCases: [placeholderItem, placeholderItem, placeholderItem, placeholderItem],
    techHeadline: PH,
    techBenefits: [placeholderItem, placeholderItem, placeholderItem, placeholderItem],
    faqSubtitle: PH,
    faqs: [
      { question: PH, answer: PH },
      { question: PH, answer: PH },
      { question: PH, answer: PH },
    ],
    bundleHeadline: "Bundels",
    finalCta: { headline: PH, subtext: PH, cta: "In winkelwagen" },
  };
}
