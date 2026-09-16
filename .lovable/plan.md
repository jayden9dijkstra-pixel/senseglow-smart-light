# Trechter en meting: wat er echt stuk is

Ik heb de vijf punten live nagelopen in de browser (op senseglow.shop zelf en op de werkversie). Drie punten blijken al opgelost te zijn, twee zijn echt.

## Wat ik heb gemeten

- **In winkelwagen werkt.** Op de live site `www.senseglow.shop/product/senseglow_wall_lamp` klikte ik op "In winkelwagen": het artikel (4-delige set, wit) komt in de winkelwagen terecht en blijft daar na herladen staan. Geen fouten in de console. Hetzelfde op de werkversie. Het rapport is waarschijnlijk van vóór de laatste publicatie.
- **`/products/<handle>` komt goed aan.** `www.senseglow.shop/products/senseglow_wave` landt op de Wave-productpagina, niet op de homepage. Dit is een doorverwijzing in de browser, geen 301 van de server; voor bezoekers is dat gelijk, voor Google is een echte 301 netter.
- **De prijzen komen al live uit Shopify.** De €29,95 op de Ambient-pagina is de prijs van de 30cm-variant, die standaard geselecteerd staat. De Silver 20cm kost inderdaad €24,95 en die prijs verschijnt zodra je 20cm kiest. Het verschil ontstaat doordat de advertentielink een specifieke variant bedoelt en de pagina daar niets mee doet.
- **De teller van de winkelwagen** wordt uit de regels berekend en valt dus vanzelf terug naar nul als de laatste regel weggaat.
- **Meting:** `add_to_cart` en `begin_checkout` vertrekken al, en de gclid gaat al mee naar het afrekenen. Maar die gebeurtenissen gaan alleen naar Google Ads, niet naar Analytics, en `view_item`, `select_item` en `view_cart` ontbreken helemaal.

## Wat ik ga doen

1. **Variant uit de advertentielink overnemen.** De pagina leest `?variant=<id>` (zowel het nummer als de lange Shopify-vorm) en selecteert die variant meteen, inclusief de juiste maat en kleur in de keuzeknoppen. Daarmee klopt de getoonde prijs altijd met de prijs in de Google-feed.
2. **Onbekend product naar het overzicht.** Een `/products/...`-link met een handle die niet bestaat gaat naar `/producten` in plaats van de homepage. Voor de zoekmachine komt er een `noindex`-melding en een canonical naar het juiste adres bij de doorverwijzing.
3. **Meting compleet maken.** Erbij: `view_item` bij het laden van een productpagina, `select_item` bij het klikken op een productkaart, `view_cart` bij het openen van de winkelwagen. Alle gebeurtenissen (ook de bestaande) gaan voortaan naar Google Ads én Analytics, met valuta, bedrag en de artikelgegevens (variant-id, naam, variantnaam, prijs, aantal).
4. **Fouten nooit meer stilhouden.** Als Shopify een fout geeft bij toevoegen of afrekenen, ziet de bezoeker een melding en staat de variant plus het antwoord van Shopify in de console.
5. **Nalopen.** Alle vijf producten, alle drie de talen (Nederlands, `/en/`, `/fr/`): toevoegen werkt, blijft na herladen staan, prijs klopt met de gekozen variant, geen fouten in de console, en de gebeurtenissen staan in `dataLayer`.

## Technische details

- `src/pages/ProductDetail.tsx`: variantkeuze uit de zoekparameter `variant` (numeriek of `gid://shopify/ProductVariant/<id>`) vóór de huidige standaardkeuze; `view_item` afvuren zodra product en variant bekend zijn.
- `src/components/product/VariantPicker.tsx`: de picker synchroniseert nu ook ná initialisatie met een van buitenaf gewijzigde `selectedVariant` (de `isInitialized`-vlag blokkeert dat vandaag).
- `src/components/LegacyRedirect.tsx`: onbekende handle → `/producten`; handle valideren tegen `ENABLED_PRODUCT_HANDLES`; `?variant=` blijft in de zoekparameters staan.
- `src/lib/adsTracking.ts`: `trackAdsEvent` krijgt `send_to` met zowel `AW-18351813640` als de GA4-meting; nieuwe helpers `trackViewItem`, `trackSelectItem`, `trackViewCart` met een volledige `items`-payload (`item_id` = numeriek variant-id, `item_name`, `item_variant`, `price`, `quantity`).
- `src/stores/cartStore.ts`: `toAdsItems` vult `item_variant` uit `variantTitle` en gebruikt het numerieke variant-id; fouten uit `createStorefrontCheckout` en uit een mislukte toevoeging loggen met `console.error(variantId, response)`.
- `src/components/CartDrawer.tsx`: `view_cart` bij openen; `src/components/ProductCard.tsx` en de overzichtskaarten: `select_item` bij klikken.
- Server-301 voor `/products/*` kan Lovable-hosting niet instellen; de doorverwijzing blijft in de browser, met canonical en `noindex` zodat Google de juiste pagina indexeert.
- Afsluiten met `bunx tsgo --noEmit`, `bun run build` en een browsercontrole van de vijf producten in drie talen.
