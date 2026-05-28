/**
 * Per-product page content for SenseGlow.
 * Keyed by Shopify product handle.
 */
import {
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
} from "./productConfig";

export interface Review {
  name: string;
  role: string;
  rating: number;
  text: string;
  image: string;
}

export interface ProductPageContent {
  hero: {
    h1: string;
    subtitle: string;
    bundleCta: string;
    bullets: string[];
  };
  reviews: Review[];
  techHeadline: string;
  techBenefits: Array<{ icon: string; tech: string; benefit: string }>;
  stepsHeadline: string;
  steps: Array<{ title: string; description: string }>;
  beforeAfterHeadline: string;
  beforeLabel: string;
  afterLabel: string;
  beforeAfter: Array<{ before: string; after: string }>;
  faqSubtitle: string;
  faqs: Array<{ question: string; answer: string }>;
  bundleHeadline: string;
  finalCta: { headline: string; subtext: string; cta: string };
}

const TRUST_SUBTEXT = "Gratis verzending • 30 dagen retour • 1 jaar garantie";

// ─── Ambient Motion Bar ────────────────────────────────
const AMBIENT: ProductPageContent = {
  hero: {
    h1: "SenseGlow™ Ambient Motion Bar",
    subtitle: "Nachtverlichting die aanspringt vóórdat jij struikelt.",
    bundleCta: "Voordeliger met bundels",
    bullets: [
      "Bewegingssensor — automatisch aan bij beweging",
      "Warm licht — slaapvriendelijk, niet verblindend",
      "Magnetisch + USB-C — installatie in 30 seconden",
    ],
  },
  reviews: [
    { name: "Sarah M.", role: "Moeder van 2", rating: 5, image: "👩",
      text: "Mijn dochter (5) durft nu eindelijk zelf naar de wc 's nachts. Het warme licht geeft haar vertrouwen. Beste aankoop dit jaar." },
    { name: "Jan P.", role: "Senior, 68 jaar", rating: 5, image: "👴",
      text: "Na een val op de trap vorig jaar wilde ik iets veranderen. Simpel, werkt perfect — mijn kinderen zijn ook gerustgesteld." },
    { name: "Lisa K.", role: "Student", rating: 5, image: "👩‍🎓",
      text: "Perfect voor mijn studentenkamer. Geen gedoe met schakelaars als ik naar de gedeelde keuken ga, en mijn huisgenoten blijven lekker slapen." },
    { name: "Mark V.", role: "Vader", rating: 5, image: "👨",
      text: "Geen discussies meer over het grote licht aan 's nachts. De baby blijft slapen, wij kunnen veilig bewegen. Win-win." },
    { name: "Emma R.", role: "Huiseigenaar", rating: 5, image: "👩‍💼",
      text: "Geïnstalleerd in gang, trap en badkamer. Voelt alsof ik in een high-end hotel woon. De warme gloed is écht prachtig." },
    { name: "Tom B.", role: "Senior, 72 jaar", rating: 5, image: "👨‍🦳",
      text: "Mijn kleinkinderen hebben ze voor mij geïnstalleerd. Wat een verschil — ik voel me veel veiliger op de trap 's avonds." },
  ],
  techHeadline: "Waarom de Motion Bar werkt",
  techBenefits: [
    { icon: "🌙", tech: "Slim genoeg om niet te storen",
      benefit: "Warm, zacht licht dat partners en kinderen niet wakker maakt. Drie modi: bij beweging, altijd aan, of altijd uit." },
    { icon: "⚡", tech: "Geen boren. Geen elektricien.",
      benefit: "Magnetische plakstrip + USB-C oplaadbaar. Geïnstalleerd in 30 seconden, opgeladen in een paar uur — voor weken licht." },
    { icon: "👁", tech: "Detecteert tot 5 meter",
      benefit: "120° bewegingssensor herkent jou direct als je de gang of slaapkamer binnenloopt." },
    { icon: "🔋", tech: "Wekenlang op één lading",
      benefit: "USB-C oplaadbaar. Eens per maand bijladen is meestal genoeg." },
  ],
  stepsHeadline: "In drie stappen geïnstalleerd",
  steps: [
    { title: "Plak 'm op", description: "Magneet en plakstrip zitten erin — geen schroef nodig." },
    { title: "Laad op via USB-C", description: "Kabel inbegrepen, één keer per paar weken." },
    { title: "Loop er voorbij", description: "Het licht doet de rest." },
  ],
  beforeAfterHeadline: "Voor / Na",
  beforeLabel: "Zonder SenseGlow",
  afterLabel: "Met SenseGlow",
  beforeAfter: [
    { before: "Lichtknopje zoeken in het donker", after: "Licht gaat automatisch aan" },
    { before: "Partner wordt wakker door fel plafondlicht", after: "Iedereen blijft slapen" },
    { before: "Tegen meubels stoten met je tenen", after: "Veilig en zacht verlicht pad" },
    { before: "Kind durft niet alleen naar de wc", after: "Kind voelt zich zelfverzekerd" },
    { before: "Boren, kabels trekken", after: "Magneet erop, klaar" },
  ],
  faqSubtitle: "Alles wat je moet weten over de Motion Bar",
  faqs: [
    { question: "Hoe lang gaat de batterij mee?",
      answer: "Bij normaal gebruik (5-10 keer per nacht) ongeveer 3-4 weken op één lading. Opladen via USB-C duurt 2-3 uur." },
    { question: "Kan ik 'm ook altijd aan zetten?",
      answer: "Ja. Drie standen: bewegingssensor, altijd aan, of altijd uit. Eenvoudig omschakelen." },
    { question: "Werkt de magneet ook op niet-metalen oppervlakken?",
      answer: "Ja — er zit een dubbelzijdige plakstrip bij die je op de muur plakt; de lamp klikt magnetisch aan die strip vast. Zo kun je 'm makkelijk afhalen om op te laden." },
    { question: "Is het licht fel?",
      answer: "Nee, het is bewust warm en zacht — niet verblindend, ook niet voor je ogen 's nachts." },
    { question: "Wat zit er in de doos?",
      answer: "De Motion Bar, een USB-C oplaadkabel, en een zelfklevende montagestrip." },
    { question: "Garantie?",
      answer: "1 jaar volledige garantie. Werkt iets niet zoals het hoort? Mail support@senseglow.shop en we sturen direct een vervanger." },
  ],
  bundleHeadline: "Verlicht je hele huis met een bundel",
  finalCta: { headline: "Klaar voor zacht, automatisch licht?", subtext: TRUST_SUBTEXT, cta: "In winkelwagen" },
};

// ─── Wave ──────────────────────────────────────────────
const WAVE: ProductPageContent = {
  hero: {
    h1: "SenseGlow Wave™",
    subtitle: "Sfeerverlichting die meebeweegt — voor de keuken die nét niet áf voelt.",
    bundleCta: "Bespaar meer met bundels",
    bullets: [
      "Uniek wave-lichteffect bij beweging",
      "3 lichtkleuren in één lamp",
      "Magnetisch + USB-C — geen gedoe",
    ],
  },
  reviews: [
    { name: "Lieke V.", role: "Interieurliefhebber", rating: 5, image: "👩",
      text: "Mijn keuken voelt eindelijk áf. Dat ene puzzelstukje dat ik niet wist dat het miste." },
    { name: "Daan B.", role: "Werkt vanuit huis", rating: 5, image: "👨‍💻",
      text: "Achter mijn bureau geïnstalleerd voor de Zoom-calls. Niemand gelooft dat ik geen elektricien heb gebeld." },
    { name: "Femke K.", role: "Huurder", rating: 5, image: "👩‍🦰",
      text: "In een huurhuis mocht ik niet boren. Magnetisch, USB-C, klaar. Verhuis ik straks, gaat 'ie gewoon mee." },
    { name: "Bram T.", role: "Hobbykok", rating: 5, image: "🧑‍🍳",
      text: "Eerst kookte ik onder dat felle plafondlicht. Nu schenk ik wijn in en dan begint het koken pas echt." },
    { name: "Saskia M.", role: "Designer", rating: 5, image: "👩‍🎨",
      text: "Het golf-effect als je langsloopt is echt magisch. Mijn vriendinnen vragen elke keer waar ik 'm vandaan heb." },
    { name: "Tom van der V.", role: "Gamer", rating: 5, image: "🎮",
      text: "Achter mijn setup. De kleurmodi maken streams meteen beter. Top quality voor de prijs." },
  ],
  techHeadline: "Waarom de Wave anders is",
  techBenefits: [
    { icon: "🌊", tech: "Golfeffect dat meebeweegt",
      benefit: "Drie lichtclusters die vloeiend oplichten als jij langsloopt. Niet zomaar een LED-strip — een ervaring." },
    { icon: "🎨", tech: "3 lichtmodi in één lamp",
      benefit: "Warm wit voor 's avonds, koel wit voor het werk, kleurwisseling voor de sfeer. Pas aan met één knop." },
    { icon: "⚡", tech: "30 seconden installatie",
      benefit: "Magnetisch + USB-C — geen boren, geen elektricien, geen gedoe. Verhuizen? Hij gaat gewoon mee." },
    { icon: "🍷", tech: "Niet alleen voor de keuken",
      benefit: "Voor onder kastjes, achter bureaus of langs werkbladen. Werkt overal waar je sfeer wilt zonder gedoe." },
  ],
  stepsHeadline: "In drie stappen geïnstalleerd",
  steps: [
    { title: "Plak de magneetstrip", description: "Onder een kastje, langs een werkblad, achter een bureau." },
    { title: "Klik de Wave erin", description: "Geen schroef, geen gedoe." },
    { title: "Loop voorbij", description: "Het golf-effect doet de rest." },
  ],
  beforeAfterHeadline: "Voor / Na",
  beforeLabel: "Zonder Wave",
  afterLabel: "Met Wave",
  beforeAfter: [
    { before: 'Keuken voelt "wel oké" maar mist iets', after: "Keuken voelt warm, compleet, premium" },
    { before: "Plafondlicht is óf té fel óf té zwak", after: "Drie lichtmodi voor elk moment" },
    { before: "Onder-kast-licht = elektricien bellen", after: "Magnetisch, USB-C, klaar in 30 sec" },
    { before: "Saaie, statische LED-strip", after: "Reageert op beweging — golfeffect" },
  ],
  faqSubtitle: "Alles wat je moet weten over de Wave",
  faqs: [
    { question: "Werkt het ook overdag?",
      answer: "Ja. Drie modi: bewegingssensor, altijd aan (drie kleurtemperaturen), of altijd uit. Je kiest wat past." },
    { question: "Hoe lang gaat de batterij mee?",
      answer: "3-6 weken bij normaal gebruik. Opladen via USB-C duurt 2-3 uur." },
    { question: "Wat is dat golfeffect precies?",
      answer: "Drie lichtclusters die na elkaar oplichten als je beweegt — alsof het licht je volgt. Subtieler dan een aan-uit, mooier dan een gewone strip." },
    { question: "Past 'ie onder mijn IKEA-kastjes?",
      answer: "Past onder vrijwel alle standaard keukenkasten (min. 5 cm hoogte). 30 cm en 50 cm zijn de twee opties." },
    { question: "Wat zit er in de doos?",
      answer: "De Wave, USB-C kabel, magneetstrip met plakband." },
    { question: "Garantie?",
      answer: "1 jaar volledige garantie. Probleem? Mail support@senseglow.shop en we lossen het op." },
  ],
  bundleHeadline: "Creëer een doorlopende wave van licht",
  finalCta: { headline: "Upgrade je verlichting.", subtext: TRUST_SUBTEXT, cta: "In winkelwagen" },
};

// ─── Wall Lamp (sconce) ────────────────────────────────
const SCONCE: ProductPageContent = {
  hero: {
    h1: "SenseGlow Wall Lamp™",
    subtitle: "Veilig de trap op en af — ook 's nachts. Geen boren, geen elektricien.",
    bundleCta: "Voordeliger met bundels",
    bullets: [
      "Bewegingssensor — automatisch aan bij elke stap",
      "Zelfklevend — geen boren, geen kabels",
      "USB-C oplaadbaar per lamp",
    ],
  },
  reviews: [
    { name: "Marieke H.", role: "Volwassen dochter", rating: 5, image: "👩",
      text: "Voor mijn moeder van 76. Ze gebruikt ze elke nacht. Mijn beste cadeau dit jaar — geen twijfel." },
    { name: "Pieter J.", role: "Senior, 71 jaar", rating: 5, image: "👴",
      text: "Mijn vrouw was bang dat ik nog eens zou vallen. Eén keer plakken, klaar. Geen gedoe." },
    { name: "Lisa de B.", role: "Moeder van 3", rating: 5, image: "👩‍🦰",
      text: "Mijn dochter van 4 durft eindelijk zelf naar boven. Geen 'mama loop mee'-spelletje meer 's avonds." },
    { name: "Thijs K.", role: "Huiseigenaar", rating: 5, image: "👨",
      text: "Verbouwing klaar, deze waren de laatste touch. Het hotel-trap-gevoel — voor een schijntje." },
    { name: "Anouk V.", role: "Mantelzorger", rating: 5, image: "👩‍⚕️",
      text: "Voor mijn schoonvader. Hij vond elektronica altijd 'gedoe'. Deze begreep hij meteen. Werkt al maanden zonder klacht." },
    { name: "Joost M.", role: "Huurder", rating: 5, image: "🧑",
      text: "Huur dit appartement, mag niet boren. Plakken, klaar — verhuizen ze gewoon mee." },
  ],
  techHeadline: "Waarom de Wall Lamp werkt",
  techBenefits: [
    { icon: "🛡️", tech: "Fall prevention die écht werkt",
      benefit: "1 op de 3 65-plussers valt jaarlijks. Meestal op de trap, meestal 's nachts. De Wall Lamp pakt dat aan." },
    { icon: "🔧", tech: "Geen boren. Geen elektricien.",
      benefit: "Zelfklevende montage. Plak, druk, klaar. Hele trap geregeld in 10 minuten." },
    { icon: "👶", tech: "Voor kleine voetjes én voor oude voetjes",
      benefit: "Zacht, warm licht — niet verblindend, ook niet voor kinderen of na een lange dag." },
    { icon: "🔋", tech: "USB-C oplaadbaar per lamp",
      benefit: "Elke lamp afzonderlijk opladen, ongeveer eens per maand. Geen vaste bedrading." },
  ],
  stepsHeadline: "Hele trap geregeld in 10 minuten",
  steps: [
    { title: "Plak ze op de muur", description: "Om de 30-50 cm op trapleuning of trapgang." },
    { title: "Laad ze op", description: "USB-C, eens per maand per lamp." },
    { title: "Niemand valt meer in het donker", description: "Automatisch licht bij elke stap." },
  ],
  beforeAfterHeadline: "Voor / Na",
  beforeLabel: "Zonder Wall Lamp",
  afterLabel: "Met Wall Lamp",
  beforeAfter: [
    { before: "Trap is een angstplek 's nachts", after: "Zacht verlichte trap, automatisch aan" },
    { before: "Bang dat ouders vallen", after: "Concrete oplossing, rust voor jezelf" },
    { before: "Kind durft niet zelf", after: "Kind krijgt zelfvertrouwen" },
    { before: "Elektricien bellen voor traplichten", after: "Plak, plak, plak — klaar" },
    { before: "Hard plafondlicht stoort 's nachts", after: "Zacht en gericht — alleen waar nodig" },
  ],
  faqSubtitle: "Alles wat je moet weten over de Wall Lamp",
  faqs: [
    { question: "Hoe veilig is de lijm? Beschadigt 'ie de muur?",
      answer: "De montagestrip is residu-vrij — bij voorzichtig verwijderen blijft de muur intact. Voor huurwoningen werkt 't perfect." },
    { question: "Hoeveel lampen heb ik nodig voor mijn trap?",
      answer: "Voor 8-12 treden: 4-pack. Voor 13+ treden of een lange gang erbij: 8-pack. In twijfel? Kies de combiset (12 lampen) — overschot kan altijd ergens anders." },
    { question: "Hoe lang gaat de batterij mee?",
      answer: "3-5 weken bij normaal nachtelijk gebruik. Opladen via USB-C duurt 2-3 uur per lamp." },
    { question: "Werken ze ook overdag?",
      answer: "Standaard staan ze op bewegingssensor 's nachts. Je kunt ze ook op 'altijd aan' zetten als gangverlichting." },
    { question: "Wat als één lamp het niet doet?",
      answer: "1 jaar volledige garantie. Mail support@senseglow.shop en we sturen direct een vervanger." },
    { question: "Past het ook in een huurwoning?",
      answer: "Ja — geen boren, geen schroeven, geen kabels. De ideale renter-oplossing." },
    { question: "Werkt het echt voor mijn ouders die geen elektronica begrijpen?",
      answer: "Ja. Eén knop voor aan/uit/sensor. Onze gemiddelde 70+ klant heeft 'm zelfstandig geïnstalleerd." },
  ],
  bundleHeadline: "Verlicht de hele trap met een set",
  finalCta: { headline: "Veilig de trap op, elke nacht.", subtext: TRUST_SUBTEXT, cta: "In winkelwagen" },
};

// ─── Solar Lantern ─────────────────────────────────────
const LANTERN: ProductPageContent = {
  hero: {
    h1: "SenseGlow Solar Lantern™",
    subtitle: "Buitenverlichting zonder kabels, zonder elektriciteitsrekening.",
    bundleCta: "Voordeliger met bundels",
    bullets: [
      "100% op zonne-energie — geen stroomrekening",
      "IP65 waterdicht — bestand tegen Nederlands weer",
      "Bewegingssensor tot 6 meter (120°)",
    ],
  },
  reviews: [
    { name: "Robert J.", role: "Huiseigenaar", rating: 5, image: "👨",
      text: "Een aan de voordeur, een aan de achterdeur. Mijn vrouw voelt zich eindelijk veilig als ze 's avonds laat thuiskomt." },
    { name: "Karin S.", role: "Tuinier", rating: 5, image: "👩‍🌾",
      text: "Drie zomers buiten gehangen — nog steeds elke avond aan. Geen probleem met regen of vorst." },
    { name: "Henk P.", role: "Senior, 65 jaar", rating: 5, image: "👴",
      text: "Twee schroeven, klaar. Echt waar. Zelf gemonteerd zonder enige hulp." },
    { name: "Sofie B.", role: "Energie-bewust", rating: 5, image: "🌱",
      text: "Nul stroomkosten. Letterlijk nul. En 'ie is fel genoeg dat de bezorger m'n voordeur kan vinden in november." },
    { name: "Dirk V.", role: "Vakantiehuisbezitter", rating: 5, image: "🏡",
      text: "Voor mijn Airbnb in de Veluwe. Gasten komen vaak laat aan. Geen kabel trekken nodig — perfect." },
    { name: "Yvonne M.", role: "Buurthulp", rating: 5, image: "👩",
      text: "Heb 'm eerst voor mezelf gekocht, daarna nog vier voor de buren. Hele straat ziet er nu beter uit." },
  ],
  techHeadline: "Waarom de Solar Lantern werkt",
  techBenefits: [
    { icon: "☀️", tech: "100% op zonne-energie",
      benefit: "Geen kabel, geen contactdoos, geen stroomrekening. Overdag laden, 's avonds licht." },
    { icon: "🌧️", tech: "IP65 waterdicht",
      benefit: "Regen, sneeuw, hagel, hitte. Drie winters NL-weer aankunnen. Geen probleem." },
    { icon: "🔧", tech: "Twee schroeven. Klaar.",
      benefit: "Geen elektricien, geen kabels door de muur. Een schroevendraaier en je bent klaar in 5 minuten." },
    { icon: "👀", tech: "Bewegingssensor tot 6 meter",
      benefit: "120° hoek — herkent wie er aankomt vanaf de straat. Drie modi: bij beweging, altijd aan, of uit." },
  ],
  stepsHeadline: "In drie stappen geïnstalleerd",
  steps: [
    { title: "Schroef hem op de muur", description: "Voordeur, oprit, schuur of tuinpad." },
    { title: "Laat 'm overdag opladen", description: "Automatisch via het zonnepaneel." },
    { title: "Hij gaat aan als jij eraan komt", description: "Automatisch in de schemer, uit overdag." },
  ],
  beforeAfterHeadline: "Voor / Na",
  beforeLabel: "Zonder Solar Lantern",
  afterLabel: "Met Solar Lantern",
  beforeAfter: [
    { before: "Donkere voordeur 's avonds", after: "Automatisch verlicht bij elke stap" },
    { before: "Verlengsnoer trekken voor de schuur", after: "Geen kabel, geen contactdoos" },
    { before: "Elektricien factuur €€€", after: "Twee schroeven, jezelf gemonteerd" },
    { before: "Onveilig gevoel als bezoek 's avonds komt", after: "Verlichte oprit, gastvrij signaal" },
  ],
  faqSubtitle: "Alles wat je moet weten over de Solar Lantern",
  faqs: [
    { question: "Wat als er een paar dagen geen zon is?",
      answer: "De ingebouwde batterij houdt 2-3 dagen reserve. Op een normale Nederlandse week (met wat zon) blijft 'ie het hele jaar door werken." },
    { question: "Hoe veel uur licht op één lading?",
      answer: "8-12 uur op een volle accu — meer dan genoeg voor een hele nacht." },
    { question: "Wordt 'ie kapot in de winter?",
      answer: "Nee. IP65-waterdicht en getest tussen -20°C en +50°C. Drie Nederlandse winters geen probleem." },
    { question: "Hoe fel is het licht?",
      answer: "Fel genoeg om een complete oprit of voordeurpad te verlichten. Niet verblindend voor passanten — gericht naar beneden." },
    { question: "Wat als ik de lamp wil verplaatsen?",
      answer: "Twee schroeven los, ergens anders weer vast. De installatie is permanent maar omkeerbaar." },
    { question: "Werkt 'ie ook in de schaduw?",
      answer: "Voor optimale werking heb je 4-6 uur direct of indirect zonlicht per dag nodig. In volledige schaduw wordt de werking minder." },
    { question: "Garantie?",
      answer: "1 jaar volledige garantie, inclusief de accu. Probleem? Mail support@senseglow.shop." },
  ],
  bundleHeadline: "Verlicht je hele buitenruimte",
  finalCta: { headline: "Licht je huis, moeiteloos.", subtext: TRUST_SUBTEXT, cta: "In winkelwagen" },
};

// ─── Flex (Student Desk Lamp) ──────────────────────────
const FLEX: ProductPageContent = {
  hero: {
    h1: "SenseGlow Flex™",
    subtitle: "Touch-dimbare bureaulamp — voor late studie-sessies en het bureau dat eindelijk niet meer naar studentenkamer ruikt.",
    bundleCta: "Voordeliger met bundels",
    bullets: [
      "Touch-dimming — tik aan, vasthouden om te dimmen",
      "Magnetisch + USB-C — verhuist mee elk studiejaar",
      "Warm en koel licht — voor elk moment",
    ],
  },
  reviews: [
    { name: "Mila R.", role: "Student Psychologie (UU)", rating: 5, image: "👩‍🎓",
      text: "Mijn bureau ziet er eindelijk niet meer uit als een studentenkamer. En late-night essay schrijven is veel chiller met dim-licht." },
    { name: "Bas T.", role: "Tweedejaars Geneeskunde", rating: 5, image: "👨‍⚕️",
      text: "Magnetisch, USB-C, geen schroef. Verhuis volgend jaar — gaat gewoon mee. Geen sporen in de muur." },
    { name: "Yara K.", role: "HBO student & creator", rating: 5, image: "👩‍🎨",
      text: "Mijn videos zien er beter uit met de warme stand. Niemand gelooft dat 'ie geen kabel heeft. Aesthetic + functional." },
    { name: "Lars de V.", role: "Recent afgestudeerd", rating: 5, image: "🎓",
      text: "Cadeau van m'n ouders voor m'n diploma. Eerlijk gezegd het beste cadeau dat ik kreeg. Touch-dimmen voor late werkavonden." },
    { name: "Senna B.", role: "Student Rechten (EUR)", rating: 5, image: "⚖️",
      text: "Warm voor essays, koel voor tentamens — pas je aan met één knop. Ben er klaar mee om naar de bieb te moeten voor goed licht." },
    { name: "Tijn M.", role: "Student Bouwkunde (TU Delft)", rating: 5, image: "👨‍🎓",
      text: "Eindelijk geen rommelige IKEA-lamp meer op m'n bureau. Mijn huisgenoten hebben ondertussen alle drie eentje besteld." },
  ],
  techHeadline: "Waarom de Flex werkt",
  techBenefits: [
    { icon: "✋", tech: "Touch-dimming voor late sessies",
      benefit: "Tik om aan/uit, vasthouden om te dimmen. Van fel voor studeren naar zacht voor 2 uur 's nachts — in één beweging." },
    { icon: "🧲", tech: "Verhuist mee — elk studiejaar",
      benefit: "Magnetisch + USB-C. Geen boren, geen sporen. Klikt los om mee te nemen, klikt vast in elke nieuwe kamer." },
    { icon: "🎨", tech: "Warm voor essays. Koel voor tentamens.",
      benefit: "Pas de kleurtemperatuur aan: warme tint voor leeswerk, koele tint voor focus. Eén lamp, twee studie-modes." },
    { icon: "📸", tech: "Videocall-ready",
      benefit: "Warm licht maakt je videocall-achtergrond direct beter. Online colleges, gesprekken met begeleider — je ziet er gewoon beter uit." },
  ],
  stepsHeadline: "In drie stappen op je bureau",
  steps: [
    { title: "Bevestig de magneetbeugel", description: "Schroef of plak met de inbegrepen 3M-strip (huurder-vriendelijk)." },
    { title: "Klik de lamp magnetisch vast", description: "Geen kabels, geen rommel." },
    { title: "Tik aan, vasthouden om te dimmen", description: "Pas aan voor wat je doet." },
  ],
  beforeAfterHeadline: "Voor / Na",
  beforeLabel: "Zonder Flex",
  afterLabel: "Met Flex",
  beforeAfter: [
    { before: "Standaard IKEA-bureaulamp die iedereen heeft", after: "Een statement op je bureau" },
    { before: "Kabel achter je bureau, rommelig", after: "Magnetisch, draadloos, oplaadbaar via USB-C" },
    { before: "Té fel om om 23:00 nog te studeren", after: "Touch-dim van fel naar zacht in 1 sec" },
    { before: "Vaste lichttemperatuur", after: "Warm voor essays, koel voor focus" },
    { before: "Verhuizen? Lamp blijft achter", after: "Klik los, gaat mee naar volgende kamer" },
  ],
  faqSubtitle: "Alles wat je moet weten over de Flex",
  faqs: [
    { question: "Heeft 'ie een bewegingssensor?",
      answer: "Nee — bewust niet. Dit is een design-bureaulamp voor wie zélf wil bepalen wanneer het licht aan gaat. Voor sensor-lampen: kijk naar de Motion Bar of Wall Lamp." },
    { question: "Hoe lang gaat de batterij mee?",
      answer: "4-8 weken bij normaal studie-gebruik (1-3 uur per avond). Opladen via USB-C duurt 2-3 uur." },
    { question: "Past 'ie op mijn kleine studentenkamer-bureau?",
      answer: "Ja — Flex is compact en magnetisch, dus je verliest geen bureauruimte. Hij hangt boven het bureau, niet erop." },
    { question: "Mag dit in mijn huurkamer?",
      answer: "Ja — er zit een 3M-plakstrip bij (residu-vrij bij verwijderen) als alternatief voor de schroef-bevestiging." },
    { question: "Hoe werkt touch-dimming precies?",
      answer: "Eén tik = aan. Eén tik = uit. Vasthouden = dimt langzaam op of af tot je loslaat." },
    { question: "Garantie?",
      answer: "1 jaar volledige garantie. Iets stuk? Mail support@senseglow.shop en we lossen het op." },
  ],
  bundleHeadline: "Bundel met een tweede lamp",
  finalCta: { headline: "Een bureau dat eindelijk werkt.", subtext: TRUST_SUBTEXT, cta: "In winkelwagen" },
};

// ─── Lookup ────────────────────────────────────────────
const CONTENT_BY_HANDLE: Record<string, ProductPageContent> = {
  [PRODUCT_HANDLE]: AMBIENT,
  [WAVE_PRODUCT_HANDLE]: WAVE,
  [STEP_PRODUCT_HANDLE]: SCONCE,
  [LANTERN_PRODUCT_HANDLE]: LANTERN,
  [FLEX_PRODUCT_HANDLE]: FLEX,
};

export function getProductContent(handle: string | undefined): ProductPageContent | null {
  if (!handle) return null;
  return CONTENT_BY_HANDLE[handle] ?? null;
}
