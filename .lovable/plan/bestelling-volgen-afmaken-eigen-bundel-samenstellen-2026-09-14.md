# Bestelling volgen afmaken + eigen bundel samenstellen

Twee onderdelen: het opzoeken van bestellingen werkend krijgen, en een nieuwe pagina waar klanten zelf een 2-, 3- of 4-pack samenstellen.

## 1. Bestelling volgen werkend maken

De pagina staat er al (zoekformulier, laadstaat, statusoverzicht met stappenbalk, artikelen, verzending, niet-gevonden). Alleen de koppeling met Shopify wordt geweigerd.

- Het Shopify-token dat je stuurde veilig opslaan, samen met het winkeladres.
- Opnieuw testen met order #SG1042 en een verkeerd e-mailadres, zodat zowel de gevonden als de niet-gevonden weergave klopt.
- Na de test krijg je van mij de linktekst en het adres om in de Shopify-bevestigingsmail te zetten (die mail zit in Shopify zelf, niet in de site).

Let op: je gebruikte hier de chat om een geheime sleutel te delen. Ik sla hem veilig op, maar draai hem later gerust een keer om in Shopify.

## 2. Kortingen naar 10 / 15 / 20 procent

- De Shopify-codes SG-PACK-2, SG-PACK-3 en SG-PACK-4 aanpassen naar 10, 15 en 20 procent.
- Dezelfde percentages doorvoeren in alle teksten en berekeningen op de site (productpagina's, bundelblok op de homepage, winkelwagen).

## 3. Pagina "Stel je eigen bundel samen"

Nieuwe pagina op /stel-je-bundel-samen, en /bundels gaat dezelfde pagina tonen. De drie kant-en-klare bundels (Kast, Hal, Whole Home) verdwijnen; het bundelblok op de homepage wordt een uitnodiging om zelf te combineren.

Flow:

1. **Pakketgrootte kiezen** — drie kaarten: 2-pack (-10%), 3-pack (-15%), 4-pack (-20%), met korte omschrijving en amberen badge.
2. **Bundel vullen** — per plek kies je eerst een product uit een raster van alle vijf lampen, daarna maat en kleur. Prijs en beschikbaarheid komen live uit Shopify; een combinatie die niet leverbaar is kun je niet bevestigen en toont "Niet op voorraad". Boven in beeld staat de voortgang ("2 van 3 gekozen") en het lopende totaal: oude prijs doorgestreept, nieuwe prijs in amber, besparing eronder.
3. **Toevoegen** — als alles gevuld is verschijnt een overzicht met subtotaal, kortingsregel en eindtotaal, plus de knop "Voeg toe aan winkelmandje". De gekozen lampen belanden in de bestaande winkelwagen en bij het afrekenen wordt de juiste kortingscode automatisch meegegeven.

Verder:
- Wissel je halverwege van pakketgrootte, dan vraag ik eerst om bevestiging.
- Je keuze blijft 24 uur bewaard als je de pagina verlaat.
- Mobiel: kaarten onder elkaar, keuzelijsten als vertrouwde telefoonkeuzes, vaste balk onderaan met totaal en knop.
- "Bundels" komt in de hoofdnavigatie en in de footer; de homepage krijgt een verwijzing naar de bouwer.
- Meetgegevens voor Google Ads: keuze pakketgrootte, gevulde plek, toevoegen aan winkelmandje.

## Techniek

- Secrets `SHOPIFY_ADMIN_TOKEN` en `SHOPIFY_STORE_DOMAIN` zetten; functie `order-lookup` opnieuw uitrollen en testen.
- `PACK_RATE` in `src/lib/productConfig.ts` naar 0.10 / 0.15 / 0.20; Shopify-prijsregels bijwerken via de discount-tools.
- Nieuwe pagina `src/pages/BundleBuilder.tsx` plus componenten onder `src/components/bundle-builder/`; producten via de bestaande Storefront-query met React Query (5 minuten cache), nooit vaste prijzen.
- Toevoegen loopt via de bestaande `cartStore` (losse regels per variant, `bundleDiscountCode = SG-PACK-N`), zodat het afrekenen via de bestaande checkout-link blijft werken. De Storefront cart-mutaties uit je prompt gebruiken we niet; die passen niet bij de huidige opzet en zouden het afrekenen breken.
- `src/lib/bundles.ts`, `BundleShowcase.tsx` en `HomeBundlesSection.tsx` worden vervangen of omgebouwd; routes, sitemap, prerender en SEO-teksten bijwerken.
- Concept bewaren in `localStorage` onder `sg_bundle_draft` met vervaldatum.
- Controle vooraf publiceren: typecheck, build en browsertest op desktop en 390px, inclusief een 2-pack en een gemengd 3-pack.
