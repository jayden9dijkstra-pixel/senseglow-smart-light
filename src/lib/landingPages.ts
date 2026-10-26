/**
 * Landingspagina's per zoekintentie (alleen Nederlands). Pure data, gedeeld
 * door de pagina en scripts/prerender.ts. Specificaties komen letterlijk uit
 * de Shopify-productomschrijvingen; prijzen komen live uit Shopify, behalve de
 * vaste kitprijzen in de kitteksten.
 */
import { KITS, OFFERS, ANGLES, type Kit } from "./angles";
import { purchaseFaqs, type ProductFaq } from "./productFaqs";
import { DELIVERY_TEXT } from "./delivery";
import {
  PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
} from "./productConfig";

export interface LandingOffer {
  handle: string;
  kit: Kit;
}

export interface SpecTable {
  product: string;
  rows: Array<[string, string]>;
}

export interface LandingPage {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  offers: LandingOffer[];
  benefits: string[];
  specs: SpecTable[];
  faqs: ProductFaq[];
}

const SPECS: Record<string, SpecTable> = {
  ambient: {
    product: "SenseGlow™ Ambient Motion Bar",
    rows: [
      ["Maten", "20 cm, 30 cm en 40 cm"],
      ["Kleuren", "Zilver en zwart"],
      ["Sensor", "Bewegingssensor, 120° sensorhoek, bereik tot 5 meter"],
      ["Lichtmodi", "Aan bij beweging, altijd aan, altijd uit"],
      ["Voeding", "USB-C oplaadbaar (kabel inbegrepen)"],
      ["Bevestiging", "Magneet + plakstrip (inbegrepen)"],
    ],
  },
  wall: {
    product: "SenseGlow Wall Lamp™",
    rows: [
      ["Set", "4-delige of 8-delige set"],
      ["Kleuren", "Wit en zwart"],
      ["Sensor", "Bewegingssensor: aan bij nadering, uit na inactiviteit"],
      ["Voeding", "USB-C oplaadbaar (per lamp)"],
      ["Montage", "Zelfklevend, geen boren"],
    ],
  },
  solar: {
    product: "SenseGlow Solar Lantern™",
    rows: [
      ["Kleuren", "Wit en zwart"],
      ["Sensor", "PIR-bewegingssensor tot 6 meter, 120° sensorhoek"],
      ["Lichtmodi", "Alleen bij beweging, altijd aan (dim), altijd uit"],
      ["Vermogen", "2W LED"],
      ["Batterij", "3.7V 1200mAh, ingebouwd, laadt op via de zon"],
      ["Laadtijd", "±6 uur in direct zonlicht"],
      ["Licht per lading", "Tot 8-12 uur"],
      ["Waterdicht", "IP65"],
      ["Materiaal", "PC + ABS"],
      ["Montage", "Twee schroeven"],
    ],
  },
  flex: {
    product: "SenseGlow Flex™",
    rows: [
      ["Kleuren", "Wit en zwart"],
      ["Sensor", "Geen, je bedient hem zelf"],
      ["Bediening", "Touch: tik om te schakelen, vasthouden om te dimmen"],
      ["Voeding", "USB-C oplaadbaar"],
      ["Bevestiging", "Magneet + wandbeugel (schroeven inbegrepen)"],
    ],
  },
};

const DELIVERY_FAQ: ProductFaq = {
  question: "Wanneer wordt mijn bestelling geleverd?",
  answer: `${DELIVERY_TEXT}. Verzending naar Nederland en België is gratis en je krijgt een track-code per mail.`,
};

const AMBIENT_CHARGE_FAQ: ProductFaq = {
  question: "Hoe vaak moet ik opladen?",
  answer: "Bij normaal gebruik (5-10 keer per nacht) ongeveer 3-4 weken op één lading. Opladen via USB-C duurt 2-3 uur.",
};

const AMBIENT_MOUNT_FAQ: ProductFaq = {
  question: "Hoe bevestig ik de Ambient Motion Bar?",
  answer: "Er zit een dubbelzijdige plakstrip bij die je op de muur plakt; de lamp klikt magnetisch aan die strip vast. Zo haal je hem makkelijk los om op te laden.",
};

const common = (...faqs: ProductFaq[]) => [...faqs, DELIVERY_FAQ, ...purchaseFaqs];

export const LANDING_PAGES: LandingPage[] = [
  {
    path: "/trapverlichting",
    title: "Trapverlichting met sensor, zonder boren | SenseGlow",
    description:
      "Trapverlichting met bewegingssensor die je zonder boren plaatst. Kies de Wall Lamp 4- of 8-delige set of de Trapkit met 4 Ambient Motion Bars. Gratis verzending NL/BE.",
    h1: "Trapverlichting met sensor, zonder boren",
    intro: "Licht dat vanzelf aangaat zodra je de trap nadert. Je plakt de lampen op hun plek en laadt ze op via USB-C.",
    offers: [
      { handle: STEP_PRODUCT_HANDLE, kit: OFFERS.wall4 },
      { handle: STEP_PRODUCT_HANDLE, kit: OFFERS.wall8 },
      { handle: PRODUCT_HANDLE, kit: KITS.trapkit },
    ],
    benefits: [
      "Gaat vanzelf aan zodra je beweegt, en weer uit als je weg bent",
      "Zelfklevend of magnetisch: geen boren, geen kabels",
      "Oplaadbaar via USB-C, in een paar minuten geplaatst",
    ],
    specs: [SPECS.wall, SPECS.ambient],
    faqs: common(
      {
        question: "Hoeveel lampen heb ik nodig voor mijn trap?",
        answer: "Voor 8-12 treden: de 4-delige set. Voor 13 of meer treden of een lange gang erbij: de 8-delige set.",
      },
      {
        question: "Beschadigt de plakstrip van de Wall Lamp de muur?",
        answer: "De montagestrip is residuvrij. Verwijder je hem voorzichtig, dan blijft de muur intact.",
      },
      AMBIENT_CHARGE_FAQ,
    ),
  },
  {
    path: "/gangverlichting",
    title: "Gangverlichting met sensor, zonder boren | SenseGlow",
    description:
      "Gangverlichting met bewegingssensor: de Gangset met 2x Ambient Motion Bar 30 cm. Magnetisch bevestigen, opladen via USB-C. Gratis verzending NL/BE, 30 dagen retour.",
    h1: "Gangverlichting met sensor, zonder boren",
    intro: "Zacht licht in de gang, precies wanneer je erlangs loopt. Geen schakelaar zoeken in het donker.",
    offers: [{ handle: PRODUCT_HANDLE, kit: KITS.gangset }],
    benefits: ANGLES[PRODUCT_HANDLE].gang.benefits,
    specs: [SPECS.ambient],
    faqs: common(
      AMBIENT_CHARGE_FAQ,
      {
        question: "Kan ik hem ook altijd aan zetten?",
        answer: "Ja. Er zijn drie standen: aan bij beweging, altijd aan of altijd uit.",
      },
      AMBIENT_MOUNT_FAQ,
    ),
  },
  {
    path: "/verlichting-vakantiewoning",
    title: "Verlichting voor je vakantiewoning, met sensor | SenseGlow",
    description:
      "Sensorverlichting voor je vakantie- of huurwoning: de Verhuurderskit met 4x Ambient Motion Bar 30 cm. Gasten vinden 's nachts zelf de weg. Plaatsen zonder boren.",
    h1: "Verlichting voor je vakantiewoning, met sensor",
    intro: "Gasten vinden 's nachts zelf de weg naar badkamer of keuken. Jij plaatst de lampen zonder te boren.",
    offers: [{ handle: PRODUCT_HANDLE, kit: KITS.verhuurderskit }],
    benefits: ANGLES[PRODUCT_HANDLE].verhuur.benefits,
    specs: [SPECS.ambient],
    faqs: common(
      AMBIENT_CHARGE_FAQ,
      {
        question: "Kan ik meerdere sets bestellen?",
        answer: "Ja, je kunt meerdere sets in je winkelwagen zetten. Heb je meerdere woningen of een groter aantal nodig? Mail support@senseglow.shop.",
      },
      {
        question: "Kan ik een factuur krijgen?",
        answer: "Ja. Mail support@senseglow.shop met je bestelnummer en de gegevens die op de factuur moeten staan.",
      },
      AMBIENT_MOUNT_FAQ,
    ),
  },
  {
    path: "/solar-buitenlamp",
    title: "Solar lantaarn: buitenlamp met sensor | SenseGlow",
    description:
      "De SenseGlow Solar Lantern is een solar lantaarn en buitenlamp met sensor. Laadt op met zonlicht, IP65 waterdicht, bewegingssensor tot 6 meter. Ook als Solar duo.",
    h1: "Solar lantaarn: buitenlamp met sensor",
    intro: "Een solar lantaarn voor voordeur, tuin of terras. Overdag laadt hij op via het zonnepaneel, 's avonds gaat hij aan als er iemand aankomt.",
    offers: [
      { handle: LANTERN_PRODUCT_HANDLE, kit: OFFERS.solar1 },
      { handle: LANTERN_PRODUCT_HANDLE, kit: KITS.solarduo },
    ],
    benefits: ANGLES[LANTERN_PRODUCT_HANDLE].buiten.benefits,
    specs: [SPECS.solar],
    faqs: common(
      {
        question: "Hoeveel uur licht geeft de buitenlamp op één lading?",
        answer: "Tot 8-12 uur op een volle accu. Opladen duurt ongeveer 6 uur in direct zonlicht.",
      },
      {
        question: "Hoe monteer ik de solar lantaarn?",
        answer: "Met twee schroeven aan de muur, bij de voordeur, oprit, schuur of tuinpad. Er is geen kabel of stopcontact nodig.",
      },
      {
        question: "Kan de buitenlamp met sensor tegen regen?",
        answer: "Ja, de lamp is IP65-waterdicht en bestand tegen regen, kou en hitte.",
      },
    ),
  },
  {
    path: "/lamp-studentenkamer",
    title: "Lamp voor je studentenkamer, touch-dimbaar | SenseGlow",
    description:
      "De SenseGlow Flex: een touch-dimbare lamp voor je studentenkamer. Magnetische wandbeugel, oplaadbaar via USB-C, warm en koel wit. Gratis verzending NL/BE.",
    h1: "Lamp voor je studentenkamer",
    intro: "Een design-lamp boven je bureau of bed. Tik om aan te zetten, houd vast om te dimmen.",
    offers: [{ handle: FLEX_PRODUCT_HANDLE, kit: OFFERS.flex1 }],
    benefits: [
      "Touch-dimbaar: jij kiest de sfeer",
      "Magnetische wandbeugel: klik de lamp los om mee te nemen",
      "Opladen via USB-C, warm en koel wit instelbaar",
    ],
    specs: [SPECS.flex],
    faqs: common(
      {
        question: "Heeft de Flex een bewegingssensor?",
        answer: "Nee, bewust niet. Je bepaalt zelf wanneer het licht aangaat en hoe fel het is.",
      },
      {
        question: "Hoe hang ik de Flex op?",
        answer: "Met de magnetische wandbeugel. De schroeven zitten erbij. De lamp klikt magnetisch op de beugel, zodat je hem makkelijk loshaalt om op te laden.",
      },
      {
        question: "Hoe werkt touch-dimmen?",
        answer: "Eén tik is aan, nog een tik is uit. Vasthouden dimt langzaam op of af tot je loslaat.",
      },
    ),
  },
];

export const LANDING_PATHS = LANDING_PAGES.map((p) => p.path);

export const getLandingPage = (path: string) => LANDING_PAGES.find((p) => p.path === path) ?? null;
