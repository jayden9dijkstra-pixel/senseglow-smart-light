# Google Ads conversies laten werken

Doel: Google Ads ziet nu geen enkele conversie omdat de klik-informatie (gclid) verloren gaat tussen senseglow.shop en de Shopify-afrekenpagina. We zorgen dat die informatie meereist, en dat de site zelf de tussenstappen meldt.

## Wat er nu al goed staat

De Google-tag (AW-18351813640) staat al in de kop van elke pagina. Die hoeft niet opnieuw geplaatst te worden.

## Wat we toevoegen op de site

1. **Klik-informatie vasthouden.** Bij binnenkomst leest de site `gclid`, `gbraid` en `wbraid` uit het adres en bewaart die 90 dagen (opslag in de browser plus een cookie op `.senseglow.shop`, zodat de afrekenpagina hem ook ziet).
2. **Doorgeven aan het afrekenen.** De knoppen "Afrekenen" sturen naar `checkout.senseglow.shop`. Daar plakken we de bewaarde klik-informatie aan het adres vast, plus Google's eigen koppelparameter, zodat Google de klik en de bestelling aan elkaar knoopt.
3. **Paginaweergaves melden.** Omdat de site pagina's wisselt zonder te herladen, meldt hij nu bij elke paginawissel een weergave aan Google.
4. **Winkelwagen- en afreken-signalen.** Bij toevoegen aan winkelwagen en bij klikken op Afrekenen sturen we `add_to_cart` en `begin_checkout` mee met bedrag, valuta en artikelen.

## Wat jij in Shopify doet (kan ik hier niet)

De echte aankoop gebeurt op Shopify, dus die conversie moet daar gemeten worden. Twee opties, in volgorde:

- **Voorkeur:** in Shopify Beheer → Apps → Google & YouTube de koppeling met Google Ads afmaken en conversiemeting aanzetten. Dan meet Google de aankoop zelf en hoeft er geen script geplakt te worden.
- **Terugvaloptie:** in Google Ads een nieuwe conversieactie "Website Purchase" aanmaken en het bijbehorende label in Shopify → Instellingen → Checkout → Aanvullende scripts plakken. Ik lever de exacte code met jouw label zodra je die hebt.

## Testen na oplevering

- `www.senseglow.shop?gclid=TEST123` openen, doorklikken naar afrekenen en controleren dat `TEST123` in het afrekenadres staat.
- Met Google Tag Assistant controleren dat de tag laadt en de gebeurtenissen vertrekken.
- Na 6 tot 24 uur in Google Ads kijken of de status van de tag verandert.

## Technische details

- Nieuw bestand `src/lib/adsTracking.ts`: `captureClickIds()`, `getStoredClickId()`, `appendClickIdsToUrl(url)`, `trackAdsEvent(name, params)` met veilige no-op als `window.gtag` ontbreekt.
- `index.html`: `gtag('config', ...)` krijgt `linker: { domains: ['senseglow.shop','www.senseglow.shop','checkout.senseglow.shop'] }` en `send_page_view: true` blijft staan.
- `src/App.tsx`: klik-ids opvangen bij mount; een kleine route-listener stuurt `page_view` bij elke routewissel.
- `src/lib/shopify.ts` → `createStorefrontCheckout`: voegt bewaarde `gclid`/`gbraid`/`wbraid` toe aan de cart-permalink en, indien beschikbaar, Google's `_gl` linkerparameter via `gtag('get', ...)`; faalt stil terug op de huidige URL.
- `src/stores/cartStore.ts`: `add_to_cart` in `addItem`/`addBundleItems`, `begin_checkout` in `createCheckout` met `value`, `currency: 'EUR'` en `items`. Events vuren asynchroon en blokkeren de doorverwijzing nooit.
- Geen wijziging aan de bestaande checkout-logica, prijzen of kortingscodes.
