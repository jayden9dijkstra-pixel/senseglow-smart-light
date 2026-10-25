/**
 * Advertentie-invalshoeken (?a=) per product, kits en toepassingen.
 * Pure data + functies; prijzen komen uit Shopify. Alleen de 'los'-prijzen in
 * de kitteksten staan hier vast, op verzoek van de eigenaar.
 */
import {
  PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
} from "./productConfig";

export interface Kit {
  id: string;
  /** Volledige kittekst, zoals de eigenaar hem aanleverde. */
  label: string;
  /** Knoptekst. */
  name: string;
  quantity: number;
  /** Maat in cm die de variant moet hebben; leeg = maat van de gekozen variant. */
  sizeCm?: number;
}

export interface Angle {
  heading: string;
  benefits: string[];
  kit?: Kit;
}

const AMBIENT_BENEFITS = [
  "Gaat vanzelf aan zodra je beweegt (PIR-sensor)",
  "Geen boren of kabels: magnetisch bevestigen, opladen via USB-C",
  "3 kleurtemperaturen, van warm tot helder",
];

export const KITS: Record<string, Kit> = {
  trapkit: {
    id: "trapkit",
    name: "Trapkit",
    label: "Trapkit: 4x Ambient Motion Bar 20 cm voor €84,95 (los €99,80)",
    quantity: 4,
    sizeCm: 20,
  },
  gangset: {
    id: "gangset",
    name: "Gangset",
    label: "Gangset: 2x Ambient Motion Bar 30 cm voor €52,95 (los €59,90)",
    quantity: 2,
    sizeCm: 30,
  },
  verhuurderskit: {
    id: "verhuurderskit",
    name: "Verhuurderskit",
    label: "Verhuurderskit: 4x Ambient Motion Bar 30 cm voor €99,95 (los €119,80)",
    quantity: 4,
    sizeCm: 30,
  },
  solarduo: {
    id: "solarduo",
    name: "Solar duo",
    label: "Solar duo: 2x Solar Lantern voor €74,95 (los €89,90)",
    quantity: 2,
  },
};

export const ANGLES: Record<string, Record<string, Angle>> = {
  [PRODUCT_HANDLE]: {
    trap: { heading: "Nooit meer in het donker de trap op.", benefits: AMBIENT_BENEFITS, kit: KITS.trapkit },
    gang: { heading: "Licht in de gang, precies wanneer je het nodig hebt.", benefits: AMBIENT_BENEFITS, kit: KITS.gangset },
    verhuur: {
      heading: "Gasten vinden 's nachts zelf de weg.",
      benefits: [
        "Gaat automatisch aan bij beweging, geen knoppen zoeken",
        "In een paar minuten geplaatst, zonder boren: geschikt voor huur- en vakantiewoningen",
        "Opladen via USB-C, 3 kleurtemperaturen",
      ],
      kit: KITS.verhuurderskit,
    },
  },
  [LANTERN_PRODUCT_HANDLE]: {
    buiten: {
      heading: "Sfeerlicht buiten, zonder stopcontact.",
      benefits: [
        "Laadt overdag op met zonne-energie",
        "Bewegingssensor: licht wanneer je thuiskomt",
        "IP65: bestand tegen regen",
      ],
      kit: KITS.solarduo,
    },
  },
  [FLEX_PRODUCT_HANDLE]: {
    student: {
      heading: "Design-lamp voor je kamer, zonder boren.",
      benefits: [
        "Touch-dimbaar: jij kiest de sfeer",
        "Magnetisch ophangen en verplaatsen, ideaal voor een huurkamer",
        "Opladen via USB-C",
      ],
    },
  },
};

/** Kits die altijd als 'Voordeliger per set' op de productpagina staan. */
export const PRODUCT_KITS: Record<string, Kit[]> = {
  [PRODUCT_HANDLE]: [KITS.trapkit, KITS.gangset, KITS.verhuurderskit],
  [LANTERN_PRODUCT_HANDLE]: [KITS.solarduo],
};

export const USE_CASES: Record<string, string[]> = {
  [PRODUCT_HANDLE]: [
    "Trap: de bar gaat aan zodra je de eerste tree neemt, zodat je 's nachts veilig op en af loopt.",
    "Gang: zacht licht onderweg naar keuken of badkamer, zonder dat je een schakelaar zoekt.",
    "Kast en keuken: licht in de kast of onder het keukenkastje op het moment dat je hem opent of ervoor staat.",
    "Verhuur en vakantiewoning: gasten vinden 's nachts zelf de weg, en je plaatst hem zonder te boren.",
  ],
  [LANTERN_PRODUCT_HANDLE]: [
    "Tuin: sfeerlicht langs het pad of bij de border, opgeladen door de zon.",
    "Voordeur: licht zodra je thuiskomt, zodat je je sleutel meteen vindt.",
    "Terras: een warme gloed op tafel of in de hoek, zonder stopcontact in de buurt.",
  ],
  [FLEX_PRODUCT_HANDLE]: [
    "Studentenkamer: een design-lamp die je magnetisch ophangt, zonder gaten in de muur van je huurkamer.",
    "Slaapkamer: dim het licht met een aanraking tot een rustige sfeer voor het slapen.",
    "Leeshoek: verplaats de lamp naar je stoel en kies zelf hoe fel je wilt lezen.",
  ],
  [WAVE_PRODUCT_HANDLE]: [
    "Trap: de lichtbalk gaat aan bij beweging, zodat je veilig de trap op en af gaat.",
    "Gang: licht precies wanneer je erlangs loopt, en daarna weer uit.",
  ],
  [STEP_PRODUCT_HANDLE]: [
    "Trap: een lampje per tree of om de paar treden, zodat elke stap zichtbaar is.",
    "Gang: lampjes laag langs de muur die aangaan zodra je 's nachts opstaat.",
  ],
};

export const USE_CASE_HEADING = "Waar gebruik je hem?";
export const KITS_HEADING = "Voordeliger per set";

const ANGLE_KEY = "sg_angle";
const VALID_ANGLE = /^[a-z0-9_-]{1,40}$/i;

export function getAngle(handle: string | undefined, key: string | null | undefined): Angle | null {
  if (!handle || !key) return null;
  return ANGLES[handle]?.[key.toLowerCase()] ?? null;
}

/** Lees ?a= uit de URL en bewaar hem voor deze sessie. */
export function captureAngle(search: string): void {
  try {
    const value = new URLSearchParams(search).get("a");
    if (value && VALID_ANGLE.test(value)) sessionStorage.setItem(ANGLE_KEY, value.toLowerCase());
  } catch {
    // sessionStorage kan geblokkeerd zijn.
  }
}

export function getStoredAngle(): string | null {
  try {
    return sessionStorage.getItem(ANGLE_KEY);
  } catch {
    return null;
  }
}

interface VariantLike {
  id: string;
  selectedOptions: Array<{ name: string; value: string }>;
}

const sizeOf = (v: VariantLike) => {
  for (const o of v.selectedOptions) {
    const m = o.value.match(/(\d+)\s*cm/i);
    if (m) return Number(m[1]);
  }
  return null;
};

const colorOf = (v: VariantLike) => {
  for (const o of v.selectedOptions) {
    const n = o.name.toLowerCase();
    if (n.includes("kleur") || n.includes("color")) return o.value.replace(/\s*\d+\s*cm/i, "").trim().toLowerCase();
  }
  return null;
};

/** Variant van dezelfde kleur als de keuze, in de maat die de kit vraagt. */
export function kitVariant<V extends VariantLike>(kit: Kit, selected: V | null | undefined, variants: V[]): V | null {
  if (!kit.sizeCm) return selected ?? variants[0] ?? null;
  const color = selected ? colorOf(selected) : null;
  const inSize = variants.filter((v) => sizeOf(v) === kit.sizeCm);
  return inSize.find((v) => colorOf(v) === color) ?? inSize[0] ?? null;
}
