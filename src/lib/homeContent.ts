/**
 * Homepage-teksten. Eén bron voor de React-componenten en scripts/prerender.ts,
 * zodat de server-HTML altijd dezelfde tekst bevat als de pagina.
 */

export const HOME_HERO = {
  eyebrow: "SenseGlow, draadloze sensorverlichting",
  h1: "Licht dat aangaat wanneer jij binnenkomt.",
  subtitle:
    "Draadloze sensor-verlichting voor kast, hal, tuin en werkplek. In een paar minuten geplaatst, zonder elektricien.",
};

/** Product dat de homepage-hero toont (foto en prijs uit Shopify). */
export const HOME_HERO_PRODUCT = "senseglow_ambient_motion_bar";

export const HOME_TILES_HEADING = "Voor elke kamer een ander licht";
export const HOME_TILES_SUBTITLE = "Vijf producten. Vijf concrete problemen opgelost.";
export const HOME_TILES = [
  {
    productName: "Ambient Motion Bar",
    title: "Nooit meer struikelen 's nachts",
    body: "Bewegingssensor-balk onder het bed, zacht licht dat partners niet wakker maakt.",
    href: "/product/senseglow_ambient_motion_bar",
    imageAlt: "SenseGlow Ambient Motion Bar zwart onder het bed als nachtlicht",
  },
  {
    productName: "SenseGlow Wave",
    title: "Een keuken die eindelijk áf voelt",
    body: "Sfeerverlichting met golfeffect, reageert als je langsloopt, geen elektricien nodig.",
    href: "/product/senseglow_wave",
    imageAlt: "SenseGlow Wave zwart onder keukenkastje met golvend licht",
  },
  {
    productName: "SenseGlow Wall Lamp",
    title: "Veilig de trap op, ook 's nachts",
    body: "Set van 4 wandlampjes met sensor, zelfklevend. Gaan aan als je de trap nadert, zonder boren of kabels.",
    href: "/product/senseglow_wall_lamp",
    imageAlt: "SenseGlow Wall Lamp zwart langs de trap",
  },
  {
    productName: "SenseGlow Solar Lantern",
    title: "Buitenmuur verlicht zonder kabel",
    body: "Solar buitenlamp met sensor, IP65, twee schroeven en klaar.",
    href: "/product/senseglow_solar_lantern",
    imageAlt: "SenseGlow Solar Lantern zwart brandt bij schemering",
  },
  {
    productName: "SenseGlow Flex",
    title: "Rustig, gericht licht op je bureau",
    body: "Touch-dimbare lamp voor late studie-sessies, magnetisch, verhuist mee.",
    href: "/product/senseglow_flex",
    imageAlt: "SenseGlow Flex wit boven houten bureau",
  },
];

/** Shopify-handle achter een tegel: expliciet `handle`, anders uit een /product/-link. */
export const tileHandle = (tile: { href: string; handle?: string }) => tile.handle ?? tile.href.replace("/product/", "");

/** Kies de bestaande Shopify-foto die bij de kaart hoort; zonder treffer blijft de huidige foto staan. */
export function homeTileImage<T extends { altText: string | null }>(
  tile: { imageAlt?: string },
  images: T[],
  fallback?: T | null,
): T | undefined {
  const wanted = tile.imageAlt?.trim().toLowerCase();
  return images.find((image) => wanted && image.altText?.trim().toLowerCase() === wanted) ?? fallback ?? images[0];
}

export const HOME_PILLARS_HEADING = "Wat ze met elkaar gemeen hebben";
export const HOME_PILLARS = [
  {
    title: "Geen elektricien nodig",
    body: "Magnetisch, plakstrip of twee schroeven. In een paar minuten geplaatst.",
  },
  {
    title: "USB-C oplaadbaar of solar",
    body: "Geen AA-batterijen, geen wegwerp. Opladen via USB-C, of laat de zon het werk doen.",
  },
  {
    title: "Verhuist mee",
    body: "Magnetische bevestiging betekent: kamer uit, lamp in de tas. Geen gaten, geen sporen.",
  },
  {
    title: "Extra garantie + 30 dagen retour",
    body: "Naast je wettelijke garantie: 1 jaar extra functionele garantie van SenseGlow. Iets niet zoals het hoort? Mail support@senseglow.shop, wij sturen een vervanger of geven je geld terug.",
  },
];

export const HOME_STORY = {
  heading: "Een huis hoort veilig en warm te voelen",
  paragraphs: [
    "Niet pas nadat je een installateur hebt gebeld. Niet pas na een aannemer of een wand opengebroken voor bekabeling. SenseGlow is gestart vanuit één observatie: de slimste verlichting die online verkocht wordt, komt te zelden in Nederlandse huizen terecht. Te ingewikkeld, slecht vertaald, of gewoon niet gemaakt voor de markt hier.",
    "Onze rol is niet uitvinden. Onze rol is selecteren. We kiezen lampen die in een Nederlands huis werken: zonder elektricien, zonder app-instellingen, zonder gedoe. Vijf producten, elk voor een ander probleem of moment. Geen catalogus van tweehonderd verschillende modellen waar je in verdwaalt.",
    "Vanuit Friesland brengen we ze naar jou, met Nederlandse klantenservice en 30 dagen bedenktijd. Veiligheid en sfeer in één lamp. Dat is alles wat we doen.",
  ],
};

export const HOME_FAQS = [
  {
    question: "Hoe zit het met installatie?",
    answer:
      "Niet één van onze producten heeft een elektricien nodig. Vier producten zijn magnetisch of zelfklevend, alleen de Solar Lantern krijgt twee schroeven mee. Elk product is in een paar minuten geplaatst.",
  },
  {
    question: "Hoe vaak moet ik opladen?",
    answer:
      "Dat hangt af van hoe vaak de lamp aangaat. Alle lampen laad je op met een USB-C-kabel, dus je koopt nooit meer batterijen. De Solar Lantern laadt zichzelf op via het zonnepaneel.",
  },
  {
    question: "Krijg ik korting als ik meer lampen koop?",
    answer:
      "Ja. Meer lampen, lagere prijs per lamp: 2 lampen 10%, 4+ lampen 15%. Je mag verschillende SenseGlow-lampen combineren, behalve de Wall Lamp. De korting staat automatisch in je winkelwagen.",
  },
  {
    question: "Wat is de garantie?",
    answer:
      "Naast je wettelijke garantie: 1 jaar extra functionele garantie van SenseGlow. Werkt iets niet zoals beloofd? Mail support@senseglow.shop, we sturen een vervanger of geven je geld terug.",
  },
  {
    question: "Hoe snel wordt mijn bestelling geleverd?",
    answer:
      "Binnen 7–14 werkdagen, inclusief verwerking, gratis met DHL. Je krijgt een track-code per mail zodra het pakket onderweg is.",
  },
  {
    question: "Mag ik retourneren als het niet bevalt?",
    answer:
      "Ja, 30 dagen lang, zonder opgaaf van reden. Je stuurt het product in originele staat terug naar Tolheksleane 4A, 8821 MD Kimswerd (post- en retouradres); de verzendkosten voor het terugsturen zijn voor jou, behalve als het product defect of verkeerd geleverd is. Je krijgt binnen 14 dagen je geld terug.",
  },
];
