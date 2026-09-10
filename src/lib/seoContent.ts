/**
 * Centrale SEO copy per route en per producthandle.
 * Titles < ~70 tekens, descriptions 150-160 tekens.
 */

import {
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
} from "@/lib/productConfig";

export const SITE_URL = "https://www.senseglow.shop";
export const SITE_NAME = "SenseGlow";

export interface SeoEntry {
  title: string;
  description: string;
}

export const DEFAULT_SEO: SeoEntry = {
  title: "SenseGlow, slimme sensor verlichting zonder bedrading | Gratis verzending NL",
  description:
    "Sensor-gestuurde verlichting zonder elektricien of schakelaar. Oplaadbaar, eenvoudig te plaatsen. Gratis verzending NL/BE, 30 dagen retour, 1 jaar garantie.",
};

/** SEO per route pathname (zonder trailing slash, behalve "/"). */
export const ROUTE_SEO: Record<string, SeoEntry> = {
  "/": DEFAULT_SEO,
  "/producten": {
    title: "Alle SenseGlow lampen, sensor verlichting voor elk hoekje | SenseGlow",
    description:
      "Bekijk alle SenseGlow lampen: lichtbalken, wandlampjes, bureaulamp en solar buitenlamp met bewegingssensor. Vanaf €24,95. Gratis verzending NL/BE, 30 dagen retour.",
  },
  "/quiz": {
    title: "Welke SenseGlow past bij jou? Doe de lampenkeuzehulp | SenseGlow",
    description:
      "Beantwoord een paar korte vragen over je ruimtes en ontvang direct een passend SenseGlow advies, inclusief voordeelpakket. Gratis verzending NL/BE, 30 dagen retour.",
  },
  "/verzending": {
    title: "Verzending en levertijd, gratis bezorging in Nederland | SenseGlow",
    description:
      "Alles over onze verzending: gratis bezorging in Nederland, levertijd van 5 tot 10 werkdagen, track & trace en bezorging in België. Bekijk de voorwaarden.",
  },
  "/bestelling-volgen": {
    title: "Bestelling volgen, track & trace van je pakket | SenseGlow",
    description:
      "Volg je SenseGlow bestelling met je track & trace code. Bekijk direct de actuele status van je pakket en lees wat je kunt doen bij vertraging.",
  },
  "/retourneren": {
    title: "Retourneren, 30 dagen bedenktijd en gratis omruilen | SenseGlow",
    description:
      "Niet tevreden? Je hebt 30 dagen bedenktijd om je SenseGlow te retourneren. Lees hier hoe je retour aanmeldt, terugbetaling ontvangt en producten omruilt.",
  },
  "/over": {
    title: "Over SenseGlow, waarom wij sensorverlichting maken | SenseGlow",
    description:
      "Het verhaal achter SenseGlow: hoe een donkere gang leidde tot lampen die vanzelf aangaan. Lees waar wij voor staan en hoe we onze producten kiezen.",
  },
  "/duurzaamheid": {
    title: "Duurzaamheid, zuinige LED en oplaadbare accu's | SenseGlow",
    description:
      "Hoe SenseGlow omgaat met energie, verpakking en levensduur: zuinige LED, oplaadbare accu's en licht dat alleen brandt wanneer het nodig is.",
  },
  "/contact": {
    title: "Contact opnemen met SenseGlow klantenservice | SenseGlow",
    description:
      "Vragen over je bestelling, een product of retour? Mail naar support@senseglow.shop. We reageren doorgaans binnen één werkdag op je bericht.",
  },
  "/privacy": {
    title: "Privacyverklaring, hoe wij met je gegevens omgaan | SenseGlow",
    description:
      "Lees welke persoonsgegevens SenseGlow verwerkt, waarom we dat doen, hoe lang we ze bewaren en welke rechten je hebt volgens de AVG.",
  },
  "/voorwaarden": {
    title: "Algemene voorwaarden van SenseGlow webshop | SenseGlow",
    description:
      "De algemene voorwaarden van SenseGlow: bestellen, betalen, levering, herroepingsrecht, garantie en aansprakelijkheid. Helder op een rij gezet.",
  },
};

/** SEO per producthandle. */
export const PRODUCT_SEO: Record<string, SeoEntry> = {
  [WAVE_PRODUCT_HANDLE]: {
    title: "SenseGlow Wave™, sensor lichtbalk 30/50cm | Vanaf €24,95",
    description:
      "Wave sensor lichtbalk, springt aan bij beweging, USB-C oplaadbaar en magnetisch te plaatsen. Vanaf €24,95. Gratis verzending NL/BE, 30 dagen retour.",
  },
  [PRODUCT_HANDLE]: {
    title: "SenseGlow Ambient Motion Bar, sensor sfeerlicht 20/30/40cm",
    description:
      "Ambient Motion Bar geeft warm sfeerlicht zodra je beweegt. Draadloos, oplaadbaar en zo geplakt. Vanaf €24,95. Gratis verzending NL/BE, 30 dagen retour.",
  },
  [FLEX_PRODUCT_HANDLE]: {
    title: "SenseGlow Flex™, bureaulamp met touch en USB-C | Zwart of Wit",
    description:
      "Flex bureaulamp met touchbediening, traploos dimbaar en USB-C oplaadbaar. Verkrijgbaar in zwart of wit. Gratis verzending NL/BE, 30 dagen retour.",
  },
  [LANTERN_PRODUCT_HANDLE]: {
    title: "SenseGlow Solar Lantern™, solar buitenlamp met bewegingssensor",
    description:
      "Solar Lantern laadt overdag op zon en licht 's avonds op bij beweging. Weerbestendig, geen bedrading nodig. Gratis verzending NL/BE, 30 dagen retour.",
  },
  [STEP_PRODUCT_HANDLE]: {
    title: "SenseGlow Wall Lamp™, draadloze LED wandlampjes (4 of 8 pack)",
    description:
      "Draadloze LED wandlampjes met bewegingssensor voor trap, gang en kast. Verkrijgbaar als 4 of 8 pack. Gratis verzending NL/BE, 30 dagen retour.",
  },
};

export function getRouteSeo(pathname: string): SeoEntry {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return ROUTE_SEO[clean] ?? DEFAULT_SEO;
}

export function getProductSeo(handle?: string): SeoEntry | undefined {
  if (!handle) return undefined;
  return PRODUCT_SEO[handle];
}
