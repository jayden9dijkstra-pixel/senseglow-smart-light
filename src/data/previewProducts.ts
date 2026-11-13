/**
 * Verborgen productpagina's voor leveranciersquotes (Nova).
 * Nova (China) kan Amazon/Temu/Alibaba niet openen en levert 1-op-1 wat op deze pagina staat.
 * Alleen bereikbaar via /voorbeeld/<slug>: niet in menu, catalogus, sitemap of zoekmachines (noindex + robots.txt).
 * Specs komen uitsluitend van de bronlisting; niets verzinnen.
 */
export interface PreviewProduct {
  slug: string;
  title: string;
  titleEn: string;
  intro: string;
  variant: string;
  images: { src: string; alt: string }[];
  specs: [string, string][];
  specsEn: [string, string][];
  quoteNote: string;
}

const T = "/voorbeeld/tafellamp-510502f6";

export const PREVIEW_PRODUCTS: PreviewProduct[] = [
  {
    slug: "tafellamp-510502f6",
    title: "Oplaadbare tafellamp — zwart aluminium",
    titleEn: "Cordless rechargeable LED table lamp — matte black aluminium",
    intro:
      "Draadloze tafellamp met ingebouwde accu. Aanraken bovenop zet hem aan en uit en wisselt de lichtkleur; lang aanraken dimt traploos.",
    variant: "Zwart (matte black)",
    images: [
      { src: `${T}/1-front-2pack-cable.jpg`, alt: "Twee zwarte tafellampen met USB-C-kabel" },
      { src: `${T}/2-dimensions-touch-usbc.jpg`, alt: "Maten: hoogte 35,7 cm, kap Ø 10,5 cm, voet Ø 9,5 cm" },
      { src: `${T}/3-detail-touch-and-underside.jpg`, alt: "Touchknop bovenop en onderkant van de kap" },
      { src: `${T}/4-size-in-hand.jpg`, alt: "Lamp in de hand voor de maat" },
      { src: `${T}/5-light-colours-dimming.jpg`, alt: "Drie lichtkleuren en dimmen" },
    ],
    specs: [
      ["Materiaal", "Aluminium"],
      ["Kleur", "Mat zwart"],
      ["Hoogte", "35,7 cm"],
      ["Kap", "Ø 10,5 cm, 9 cm hoog"],
      ["Voet", "Ø 9,5 cm"],
      ["Bediening", "Touch: aan/uit, kleur, traploos dimmen 5–100%"],
      ["Lichtkleuren", "3 (warm, neutraal, koel)"],
      ["Accu", "5600 mAh, 12–48 uur"],
      ["Opladen", "USB-C, 5–6 uur, kabel 1 m"],
      ["Spatwaterdicht", "IP44"],
    ],
    specsEn: [
      ["Material", "Aluminium (shade, pole, base)"],
      ["Colour", "Matte black"],
      ["Height", "35.7 cm"],
      ["Shade", "Ø 10.5 cm, 9 cm high"],
      ["Base", "Ø 9.5 cm"],
      ["Control", "Touch on top: on/off, colour, stepless dimming 5–100%"],
      ["Light", "LED, 3 colour temperatures"],
      ["Battery", "Built-in 5600 mAh, 12–48 h"],
      ["Charging", "USB-C, 5–6 h, 1 m cable included, red/green indicator"],
      ["Rating", "IP44"],
    ],
    quoteNote:
      "Please quote exactly this lamp (photos + specs on this page) for 1, 2, 3 and 4 pcs, shipping to NL + BE. The source listing mentions both 2700/4000/6500K and 3000/4500/6000K: please tell us which one you supply. Please also confirm CE marking and neutral packaging.",
  },
];

export const getPreviewProduct = (slug: string | undefined) =>
  PREVIEW_PRODUCTS.find((p) => p.slug === slug);
