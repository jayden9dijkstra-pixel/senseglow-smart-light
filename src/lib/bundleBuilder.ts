import { PACK_RATE, PackSize } from "@/lib/productConfig";

export type BundleSlotSelection = {
  handle: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  selectedOptions: Array<{ name: string; value: string }>;
  price: number;
  currencyCode: string;
  image?: string;
};

export type PackOption = {
  size: PackSize;
  rate: number;
  title: string;
  description: string;
};

export const PACK_OPTIONS: PackOption[] = [
  {
    size: 2,
    rate: PACK_RATE[2],
    title: "2-pack",
    description: "Mooi voor twee kamers of als cadeau.",
  },
  {
    size: 3,
    rate: PACK_RATE[3],
    title: "3-pack",
    description: "Voor gang, slaapkamer en werkplek.",
  },
  {
    size: 4,
    rate: PACK_RATE[4],
    title: "4-pack",
    description: "Complete verlichting voor je hele huis.",
  },
];

export const packDiscountCode = (size: PackSize) => `SG-PACK-${size}`;

export const formatEuro = (value: number) =>
  `€${value.toFixed(2).replace(".", ",")}`;

export type BundleTotals = {
  subtotal: number;
  discount: number;
  total: number;
  rate: number;
};

export function calcTotals(
  slots: Array<BundleSlotSelection | null>,
  rate: number
): BundleTotals {
  const subtotal = slots.reduce((sum, slot) => sum + (slot ? slot.price : 0), 0);
  const complete = slots.every(Boolean);
  const discount = complete ? +(subtotal * rate).toFixed(2) : 0;
  return {
    subtotal: +subtotal.toFixed(2),
    discount,
    total: +(subtotal - discount).toFixed(2),
    rate,
  };
}

// ─── Concept bewaren (24 uur) ─────────────────────────
const DRAFT_KEY = "sg_bundle_draft";
const DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

type BundleDraft = {
  packSize: PackSize;
  slots: Array<BundleSlotSelection | null>;
  savedAt: number;
};

export function saveDraft(packSize: PackSize, slots: Array<BundleSlotSelection | null>) {
  try {
    const draft: BundleDraft = { packSize, slots, savedAt: Date.now() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // localStorage niet beschikbaar, concept gaat dan gewoon verloren
  }
}

export function loadDraft(): { packSize: PackSize; slots: Array<BundleSlotSelection | null> } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as BundleDraft;
    if (!draft?.packSize || !Array.isArray(draft.slots)) return null;
    if (Date.now() - draft.savedAt > DRAFT_TTL_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return { packSize: draft.packSize, slots: draft.slots };
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // niets te doen
  }
}

export function trackBundleEvent(name: string, params: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
