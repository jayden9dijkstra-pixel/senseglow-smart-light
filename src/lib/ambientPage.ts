/**
 * Inhoud van de Ambient Motion Bar-productpagina. Alleen feiten uit de Shopify-beschrijving,
 * /verzending en /retourneren. Engelse tekst loopt via src/i18n/en.json.
 */
import { BLUEPRINT, type Faq } from "./productBlueprint";
import { PRODUCT_HANDLE } from "./productConfig";
import { RETURN_DAYS } from "./purchaseTrust";

export const AMBIENT_EYEBROW = "Oplaadbaar via USB-C: nooit meer batterijen vervangen";
export const AMBIENT_PROMISE = "Aan als je eraan komt, uit als je weg bent. Voor trap, gang, kast en onder het bed.";
export const AMBIENT_CHECKS = ["Zonder boren of elektricien", "Oplaadbaar via USB-C", "Magnetisch, dus verplaatsbaar"];

export const AMBIENT_WHY_PRODUCT = [
  "Gaat vanzelf aan als je eraan komt en uit als je weg bent.",
  "Warm, zacht licht dat 's nachts niet verblindt.",
  "Geen lichtknopje zoeken in het donker en niemand wakker maken.",
  "Compact formaat: past overal zonder op te vallen.",
];

/** Specificaties zoals in Shopify. */
export const AMBIENT_SPECS: [string, string][] = [
  ["Lengte", "20 cm, 30 cm of 40 cm"],
  ["Kleuren", "Zilver en zwart"],
  ["Lichtstanden", "Aan bij beweging, altijd aan of uit"],
  ["Sensor", "Tot 5 meter, 120°"],
  ["Voeding", "USB-C oplaadbaar (kabel inbegrepen)"],
  ["Opladen", "Via USB-C"],
  ["Bevestiging", "Magneet + plakstrip (inbegrepen)"],
  ["Licht", "Warm, zacht licht"],
];

export const AMBIENT_STEPS = [
  { icon: "usb", title: "Laden via USB-C", text: "De kabel zit erbij." },
  { icon: "stick", title: "Plakken", text: "Plak de strip, zet de bar er magnetisch op." },
  { icon: "motion", title: "Klaar", text: "Hij gaat vanzelf aan en uit." },
] as const;

/** Beeldblokken: foto's gekozen op Shopify alt-tekst. */
export const AMBIENT_FEATURES = [
  {
    alt: "SenseGlow Ambient Motion Bar zilver in de kledingkast",
    title: "Overal te plaatsen, zonder boren",
    text: "Plak de strip in de kast, de gang of onder een keukenkastje en zet de bar er magnetisch op. Verplaatsen kan altijd.",
  },
  {
    alt: "SenseGlow Ambient Motion Bar zwart onder het bed als nachtlicht",
    title: "Nachtlicht dat niemand wakker maakt",
    text: "Warm, zacht licht dat niet verblindt. Zo vind je 's nachts de weg naar badkamer of keuken zonder het grote licht aan te doen.",
  },
  {
    alt: "SenseGlow Ambient Motion Bar zwart in de gang, licht op de vloer",
    title: "Slimme sensor",
    text: "De sensor ziet beweging tot 5 meter en in een hoek van 120°. Je kiest zelf: aan bij beweging, altijd aan of uit.",
  },
];

export const AMBIENT_WHY_SENSEGLOW = [
  "Oplaadbaar in plaats van batterijen",
  `${RETURN_DAYS} dagen retour`,
  "Veilig betalen met iDEAL, Klarna, Visa, Mastercard en PayPal",
  "Nederlandse klantenservice",
];

export type Cell = "ja" | "nee" | "soms";
export const AMBIENT_COMPARE = {
  columns: ["SenseGlow Ambient Bar", "Lamp met batterijen", "Lamp met snoer of elektricien"],
  rows: [
    { label: "Oplaadbaar", cells: ["ja", "nee", "nee"] as Cell[] },
    { label: "Zonder boren", cells: ["ja", "soms", "nee"] as Cell[] },
    { label: "Verplaatsbaar", cells: ["ja", "soms", "nee"] as Cell[] },
    { label: "Sensor", cells: ["ja", "soms", "soms"] as Cell[] },
  ],
};

export const AMBIENT_TILES = ["USB-C", "120° sensor", "3 standen", `${RETURN_DAYS} dagen retour`];

/** Bestaande Ambient-FAQ plus de batterijvraag. 'Blijft hij uit bij daglicht?' staat niet in Shopify, dus weggelaten. */
export const AMBIENT_FAQS: Faq[] = [
  { question: "Moet ik batterijen vervangen?", answer: "Nee. Je laadt hem op via USB-C, kabel inbegrepen." },
  ...BLUEPRINT[PRODUCT_HANDLE].faqs,
];
