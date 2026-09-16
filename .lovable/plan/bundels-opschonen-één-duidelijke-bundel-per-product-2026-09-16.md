# Bundels opschonen: één duidelijke bundel per product

## Wat er verandert

Onder elk product komt één bundelblok met alleen de staffels die bij dat product horen. Alle andere bundelvormen verdwijnen, zodat er geen afleiding meer is.

| Product | Bundelopties |
|---|---|
| Ambient Motion Bar | 2 stuks -10%, 3 stuks -15%, 4 stuks -20%, 5 stuks -25% |
| Wave | 2 stuks -10%, 3 stuks -15%, 4 stuks -20%, 5 stuks -25% |
| Solar Lantern | 2 stuks -10%, 3 stuks -15%, 4 stuks -20% |
| Flex | 2 stuks -10% |
| Wall Lamp | alleen 2x de 8-delige set, -25% |

De klant kiest zelf maat en kleur; de bundel gebruikt die keuze. Geen mix-en-match van verschillende producten meer in het bundelblok.

## Layout

De opzet blijft zoals nu (kaarten naast elkaar, prijs, oude prijs, besparing, knop "In winkelwagen"), maar met iets meer voordeel per kaart:

- Naam en korte omschrijving per staffel (Duopak, Familiepak, Voordeelpak, Maximaal voordeel).
- Prijs, doorgestreepte oude prijs, bespaarbedrag en kortingsbadge.
- Vinkjeslijst met wat je krijgt, gratis bezorging, 1 jaar garantie en 30 dagen retour.
- Meest gekozen-label op de middelste staffel; bij Wall Lamp en Flex één enkele kaart, gecentreerd.

## Menu en pagina's

- "Stel je bundel samen" verdwijnt uit het menu (header, mobiel menu en footer).
- De pagina zelf blijft bereikbaar via de directe link, zoals afgesproken.
- Het bundelblok op de homepage met de losse pakketkaarten gaat weg; de homepage verwijst naar de producten.

## Shopify

- De twee losse bundelvarianten van de Wall Lamp (12-set 4+8 en 16-set 2x8) worden verwijderd; alleen 4-delige en 8-delige set blijven over.
- Nieuwe kortingscodes: `SG-PACK-5` (25%, vanaf 5 stuks) en `SG-WALL-2X8` (25%, alleen Wall Lamp, vanaf 2 stuks).
- Bestaande codes SG-PACK-2/3/4 blijven ongewijzigd.

## Technische details

- `src/lib/productConfig.ts`: `PackSize` uitgebreid naar `2 | 3 | 4 | 5`, `PACK_RATE` krijgt `5: 0.25`, labels en subtitels aangevuld. `BUNDLE_CONFIG` wordt: ambient/wave `[2,3,4,5]`, lantern `[2,3,4]`, flex `[2]`, sconce speciaal (zie hieronder), arc leeg.
- Wall Lamp krijgt in de config een vaste bundelregel: pack 2 op de 8-delige variant met rate 0.25 en code `SG-WALL-2X8`; `getBundleDiscountCode` geeft die code terug voor de sconce-key en `SG-PACK-<n>` voor de rest.
- `src/components/product/BundlesSection.tsx`: rendert de per-product staffels, filtert bij Wall Lamp de variantkeuze naar de 8-delige set en toont één kaart. Gridbreedte past zich aan op 1, 2, 3 of 4 kaarten.
- `src/components/product/VariantPicker.tsx` en `src/lib/bundleVariants.ts`: bundelvarianten blijven uitgefilterd; na verwijdering in Shopify vervalt dat vanzelf.
- Menulinks verwijderd uit `SiteHeader.tsx`, `MobileMenu.tsx`/`DesktopMenu.tsx` en `SiteFooter.tsx`; routes `/bundels` en `/stel-je-bundel-samen` blijven bestaan.
- `HomeBundlesSection` wordt uit `src/pages/Index.tsx` gehaald.
- Vertaalsleutels in `en.json` en `fr.json` aanvullen voor de nieuwe staffelteksten.
- Afsluiten met typecheck, build en een browsercontrole van een productpagina per product.

## Daarna

De visuele makeover (logo's, kleuren, look) pakken we in een volgende ronde op; teksten en pagina's blijven daarbij ongewijzigd.
