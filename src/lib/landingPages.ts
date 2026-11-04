/**
 * Landingspagina's per zoekintentie (alleen Nederlands). Pure data, gedeeld
 * door de pagina en scripts/prerender.ts. Specificaties komen letterlijk uit
 * de Shopify-productomschrijvingen; prijzen komen live uit Shopify.
 */
import { ANGLES } from "./angles";
import { isOfferProduct, quoteQty } from "./quantityOffer";
import { purchaseFaqs, type ProductFaq } from "./productFaqs";
import { DELIVERY_TEXT } from "./delivery";
import { sceneAlt, type Scene } from "./scenes";
import {
  PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
} from "./productConfig";

export interface LandingOffer {
  id: string;
  handle: string;
  /** Kaarttitel, zonder prijs. */
  label: string;
  /** Korte toelichting onder de titel. */
  note?: string;
  /** Voorgeselecteerd aantal in de aantal-kiezer (alleen producten die meedoen). */
  qty?: 1 | 2 | 4;
  /** Maat in cm die de variant moet hebben. */
  sizeCm?: number;
  /** Optiewaarde die de variant moet hebben, bv. "8-delige set". */
  optionValue?: string;
  /** Scène waarvan de Shopify-foto (op alt-tekst) als eerste foto dient. */
  scene?: Scene;
  /** Optiewaarden waaruit de bezoeker kiest, bv. ["4-delige set", "8-delige set"]. */
  choices?: string[];
  /** Korte hulpregel bij die keuze. */
  choiceNote?: string;
}

type OfferImage = { url: string; altText: string | null; width?: number | null; height?: number | null };

/** Hoofdfoto van een aanbod: de scènefoto (op Shopify alt-tekst), anders de eerste productfoto. */
export function offerImage(offer: LandingOffer, images: OfferImage[]): OfferImage | undefined {
  const alt = sceneAlt(offer.scene, offer.handle);
  const norm = (x: string | null | undefined) => (x ?? "").trim().toLowerCase();
  return (alt && images.find((i) => norm(i.altText) === norm(alt))) || images[0];
}

/** Link naar de productpagina die dezelfde scènefoto vooraan houdt. */
export const offerProductHref = (offer: LandingOffer) =>
  `/product/${offer.handle}${offer.scene ? `?scene=${offer.scene}` : ""}`;

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
  /** Extra H2-sectie met de keuzes en prijzen van deze pagina. */
  extra?: { heading: string; text: string };
  /** Toon het blok 'Waarom SenseGlow' onder de koopknoppen. */
  why?: boolean;
  /** Eigen titel voor de voordelenlijst (standaard 'Waarom deze keuze'). */
  benefitsHeading?: string;
  /** Korte regel onder de aantal-kiezer. */
  pickerNote?: string;
  /** Extra H2-secties met een korte lijst. */
  sections?: Array<{ heading: string; items: string[] }>;
  /** Klein blok onderaan met een ander product als alternatief. */
  alternative?: { heading: string; text: string; href: string; label: string };
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
  answer: "Ongeveer één keer per paar weken, afhankelijk van hoe vaak de lamp aangaat. Je laadt hem op via USB-C; de kabel zit erbij.",
};

const AMBIENT_MOUNT_FAQ: ProductFaq = {
  question: "Hoe bevestig ik de Ambient Motion Bar?",
  answer: "Er zit een dubbelzijdige plakstrip bij die je op de muur plakt; de lamp klikt magnetisch aan die strip vast. Zo haal je hem makkelijk los om op te laden.",
};

const AMBIENT_SENSOR_FAQ: ProductFaq = {
  question: "Hoe werkt de bewegingssensor?",
  answer: "De bewegingssensor, ook wel bewegingsmelder genoemd, ziet beweging binnen 120° en tot 5 meter. Loop je erlangs, dan gaat het licht vanzelf aan.",
};

const common = (...faqs: ProductFaq[]) => [...faqs, DELIVERY_FAQ, ...purchaseFaqs];

export const LANDING_PAGES: LandingPage[] = [
  {
    path: "/trapverlichting",
    title: "Trapverlichting met sensor, zonder boren | SenseGlow",
    description:
      "Trapverlichting met bewegingssensor die je zonder boren plakt: de SenseGlow Wall Lamp als 4- of 8-delige set. Opladen via USB-C. Gratis verzending NL/BE.",
    h1: "Trapverlichting met sensor, zonder boren",
    intro: "Licht dat vanzelf aangaat zodra je de trap nadert. Je plakt de lampen op hun plek en laadt ze op via USB-C.",
    offers: [
      {
        id: "wall-trap",
        handle: STEP_PRODUCT_HANDLE,
        label: "SenseGlow Wall Lamp™",
        optionValue: "4-delige set",
        choices: ["4-delige set", "8-delige set"],
        choiceNote: "Korte trap of overloop: 4-set. Langere trap: 8-set.",
        scene: "trap",
      },
    ],
    benefits: [
      "Gaat vanzelf aan zodra je beweegt, en weer uit als je weg bent",
      "Zelfklevend: geen boren, geen kabels",
      "Oplaadbaar via USB-C, in een paar minuten geplaatst",
    ],
    specs: [SPECS.wall],
    extra: {
      heading: "Looplicht voor je trap",
      text: "Zet de lampen langs je trap en ze gaan vanzelf aan als je loopt. Zo heb je looplicht zonder schakelaar. Dit zijn de keuzes:",
    },
    why: true,
    alternative: {
      heading: "Liever één lichtstrip boven de trap?",
      text: "De Ambient Motion Bar is één lichtbalk met bewegingssensor die je boven de trap hangt.",
      href: "/product/senseglow_ambient_motion_bar?scene=trap",
      label: "Bekijk de Ambient Motion Bar",
    },
    faqs: common(
      {
        question: "Werkt de trapverlichting met een bewegingsmelder?",
        answer: "Ja. De Wall Lamp heeft een bewegingssensor, ook wel bewegingsmelder genoemd. Hij gaat aan als je nadert en uit na inactiviteit.",
      },
      {
        question: "Hoeveel lampen heb ik nodig voor mijn trap?",
        answer: "Voor 8-12 treden: de 4-delige set. Voor 13 of meer treden of een lange gang erbij: de 8-delige set.",
      },
      {
        question: "Beschadigt de plakstrip van de Wall Lamp de muur?",
        answer: "De montagestrip is residuvrij. Verwijder je hem voorzichtig, dan blijft de muur intact.",
      },
    ),
  },
  {
    path: "/gangverlichting",
    title: "Gangverlichting met sensor, zonder boren | SenseGlow",
    description:
      "Gangverlichting met bewegingssensor: 2 Ambient Motion Bars van 30 cm met 10% korting. Magnetisch bevestigen, opladen via USB-C. Gratis verzending NL/BE, 30 dagen retour.",
    h1: "Gangverlichting met sensor, zonder boren",
    intro: "Zacht licht in de gang, precies wanneer je erlangs loopt. Geen schakelaar zoeken in het donker.",
    offers: [{ id: "ambient-gang", handle: PRODUCT_HANDLE, label: "SenseGlow™ Ambient Motion Bar 30 cm", note: "2 lampen voor een gang", qty: 2, sizeCm: 30, scene: "gang" }],
    benefits: ANGLES[PRODUCT_HANDLE].gang.benefits,
    specs: [SPECS.ambient],
    why: true,
    faqs: common(
      AMBIENT_SENSOR_FAQ,
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
      "Sensorverlichting voor je vakantie- of huurwoning: 4 Ambient Motion Bars van 30 cm met 15% korting. Gasten vinden 's nachts zelf de weg. Plaatsen zonder boren.",
    h1: "Verlichting voor je vakantiewoning, met sensor",
    intro: "Gasten vinden 's nachts zelf de weg naar badkamer of keuken. Jij plaatst de lampen zonder te boren.",
    offers: [{ id: "ambient-verhuur", handle: PRODUCT_HANDLE, label: "SenseGlow™ Ambient Motion Bar 30 cm", note: "4 lampen voor gang, slaapkamer en badkamer", qty: 4, sizeCm: 30, scene: "gang" }],
    benefits: ANGLES[PRODUCT_HANDLE].verhuur.benefits,
    specs: [SPECS.ambient],
    why: true,
    faqs: common(
      AMBIENT_SENSOR_FAQ,
      AMBIENT_CHARGE_FAQ,
      {
        question: "Kan ik meer lampen bestellen?",
        answer: "Ja. Vanaf 4 lampen krijg je 15% korting, ook als je verschillende SenseGlow-lampen combineert (behalve Wall Lamp). Heb je meerdere woningen of een groter aantal nodig? Mail support@senseglow.shop.",
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
      "De SenseGlow Solar Lantern is een solar lantaarn en buitenlamp met sensor. Laadt op met zonlicht, IP65 waterdicht, bewegingssensor tot 6 meter. 2 lampen: 10% korting.",
    h1: "Solar lantaarn: buitenlamp met sensor",
    intro: "Een solar lantaarn voor voordeur, tuin of terras. Overdag laadt hij op via het zonnepaneel, 's avonds gaat hij aan als er iemand aankomt.",
    offers: [
      { id: "solar", handle: LANTERN_PRODUCT_HANDLE, label: "SenseGlow Solar Lantern™", note: "2 lampen, bijvoorbeeld links en rechts van de deur", qty: 2, scene: "buiten" },
    ],
    benefits: ANGLES[LANTERN_PRODUCT_HANDLE].buiten.benefits,
    specs: [SPECS.solar],
    why: true,
    faqs: common(
      {
        question: "Heeft de solar lantaarn een bewegingsmelder?",
        answer: "Ja. De PIR-bewegingssensor, ook wel bewegingsmelder genoemd, ziet beweging tot 6 meter binnen 120°. Je kiest uit alleen bij beweging, altijd aan (dim) of altijd uit.",
      },
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
    offers: [{ id: "flex", handle: FLEX_PRODUCT_HANDLE, label: "SenseGlow Flex™", qty: 1 }],
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
  {
    path: "/kastverlichting",
    title: "Kastverlichting met sensor, zonder boren | SenseGlow",
    description:
      "LED-kastverlichting met bewegingssensor. Magnetisch of met plakstrip, oplaadbaar via USB-C. Gratis verzending NL & BE, 30 dagen retour.",
    h1: "Kastverlichting met sensor, zonder boren",
    intro: "Licht dat vanzelf aangaat als je bij je kast komt, en uit als je weggaat. Plakken of met de magneet vastzetten, opladen via USB-C.",
    offers: [{ id: "ambient-kast", handle: PRODUCT_HANDLE, label: "SenseGlow™ Ambient Motion Bar", qty: 2, sizeCm: 30, scene: "kast" }],
    benefitsHeading: "Waarom in je kast",
    benefits: [
      "Bewegingssensor tot 5 meter, 120°",
      "3 lichtmodi: aan bij beweging / altijd aan / altijd uit",
      "Magneet + plakstrip inbegrepen, geen boren of kabels",
      "USB-C oplaadbaar, één keer per paar weken laden",
    ],
    sections: [
      {
        heading: "Welke lengte?",
        items: [
          "20 cm past goed bij een kastplank of lade.",
          "30 cm is een fijne keuze voor een standaard kledingkast.",
          "40 cm raden we aan voor een brede kast of inloopkast.",
        ],
      },
    ],
    specs: [SPECS.ambient],
    why: true,
    faqs: common(AMBIENT_SENSOR_FAQ, AMBIENT_CHARGE_FAQ, AMBIENT_MOUNT_FAQ),
  },
  {
    path: "/keukenverlichting",
    title: "Keukenverlichting met sensor, zonder boren | SenseGlow",
    description:
      "LED-verlichting onder je keukenkastje met bewegingssensor. Magnetisch of met plakstrip, oplaadbaar via USB-C. Gratis verzending NL & BE, 30 dagen retour.",
    h1: "Keukenverlichting met sensor, zonder boren",
    intro: "Licht op je werkblad dat vanzelf aangaat als je de keuken in loopt. Plakken of met de magneet vastzetten, opladen via USB-C.",
    offers: [{ id: "ambient-keuken", handle: PRODUCT_HANDLE, label: "SenseGlow™ Ambient Motion Bar", qty: 2, sizeCm: 30, scene: "keuken" }],
    benefitsHeading: "Waarom onder je keukenkastje",
    benefits: [
      "Bewegingssensor tot 5 meter, 120°",
      "3 lichtmodi: aan bij beweging / altijd aan / altijd uit",
      "Magneet + plakstrip inbegrepen, geen boren of kabels",
      "USB-C oplaadbaar, één keer per paar weken laden",
    ],
    sections: [
      {
        heading: "Welke lengte?",
        items: [
          "Meet de onderkant van je kastje en kies 20, 30 of 40 cm.",
          "Langer werkblad? Zet er een paar naast elkaar.",
        ],
      },
    ],
    specs: [SPECS.ambient],
    why: true,
    faqs: common(AMBIENT_SENSOR_FAQ, AMBIENT_CHARGE_FAQ, AMBIENT_MOUNT_FAQ),
  },
  {
    path: "/oplaadbare-wandlamp",
    title: "Oplaadbare wandlamp zonder bekabeling | SenseGlow Flex",
    description:
      "Oplaadbare wandlamp met magnetische beugel en touch-dimmer. Geen kabel in de muur. Gratis verzending NL & BE, 30 dagen retour.",
    h1: "Oplaadbare wandlamp, zonder kabel in de muur",
    intro: "Hang hem aan de magnetische beugel boven je bed, bureau of boekenplank. Leeg? Even van de beugel, opladen via USB-C en terughangen.",
    offers: [{ id: "flex-wand", handle: FLEX_PRODUCT_HANDLE, label: "SenseGlow Flex™", qty: 1 }],
    pickerNote: "Twee naast je bed? 2 lampen = 10% korting.",
    benefitsHeading: "Zo werkt hij",
    benefits: [
      "Touch-bediening: tik voor aan/uit, houd vast om te dimmen",
      "Warm wit om te ontspannen, koel wit om te focussen",
      "USB-C oplaadbaar, geen vaste aansluiting nodig",
      "Magnetische wandbeugel, schroeven inbegrepen",
    ],
    sections: [
      {
        heading: "Waar hang je hem?",
        items: [
          "Bed: een leeslamp die je met één tik aanzet.",
          "Bureau: fel licht als je werkt, zacht als je klaar bent.",
          "Boekenplank: warm licht op je boeken en spullen.",
        ],
      },
    ],
    specs: [{ ...SPECS.flex, rows: SPECS.flex.rows.filter(([k]) => k !== "Sensor") }],
    why: true,
    faqs: common(
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

type PricedVariant = { price: { amount: string }; selectedOptions: Array<{ value: string }> };

/** Variant die bij de aanbieding past (maat of setgrootte). */
export function landingOfferVariant<V extends PricedVariant>(offer: LandingOffer, variants: V[]): V | null {
  return (
    variants.find((v) =>
      offer.optionValue ? v.selectedOptions.some((s) => s.value === offer.optionValue)
      : offer.sizeCm ? v.selectedOptions.some((s) => new RegExp(`\\b${offer.sizeCm}\\s*cm`, "i").test(s.value))
      : true,
    ) ?? null
  );
}

/** Totaal en prijs per lamp van de voorgeselecteerde keuze, uit de Shopify-prijs. */
export function landingOfferPrice(offer: LandingOffer, variants: PricedVariant[]) {
  const match = landingOfferVariant(offer, variants);
  if (!match) return null;
  const unit = parseFloat(match.price.amount);
  const qty = isOfferProduct(offer.handle) ? offer.qty ?? 1 : 1;
  return quoteQty(unit, isOfferProduct(offer.handle) ? qty : 1);
}
