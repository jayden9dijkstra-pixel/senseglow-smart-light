# Intern dashboard: uitgaven, omzet, herkomst en marge

Eén afgeschermde pagina op `/admin/dashboard` die drie bronnen samenbrengt: Shopify,
Google Ads en de eigen bezoekmeting. Zo zie je in één oogopslag wat je uitgeeft, wat je
verdient, welke bestelling uit een advertentie kwam en wat er onder de streep overblijft.

De bezoekcijfers van `/statistieken` verhuizen mee; die losse pagina verdwijnt daarna.

## Wat je nodig hebt van Shopify

Ik kan bestellingen alleen lezen met een sleutel die jij aanmaakt. In Shopify:
Instellingen > Apps en verkoopkanalen > Apps ontwikkelen > App maken, geef leesrechten op
bestellingen en klanten, installeer en kopieer de toegangssleutel. Daarna vraag ik je die
veilig op te slaan. Zonder die sleutel tonen de Shopify-panelen "niet beschikbaar" met de
reden erbij, precies zoals afgesproken.

## Toegang

Alleen jouw bestaande beheerdersaccount. Niet ingelogd betekent: doorsturen naar inloggen,
en ook de gegevens zelf worden geweigerd, niet alleen de pagina. Geen link in menu, voettekst
of sitemap, en de pagina wordt uitgesloten van Google.

## Herkomst vastleggen (het kernstuk)

Op het moment dat de afrekenlink wordt gemaakt, bewaar ik in de eigen backend: het
winkelwagen-kenmerk, gclid/gbraid/wbraid, alle utm-velden, de landingspagina en het tijdstip.
Komt er later een bestelling binnen, dan koppel ik die op het winkelwagen-kenmerk en bewaar
het paar bestelling ↔ klik ↔ campagne. Dat is de koppeling die Shopify in deze opzet zelf
niet kan maken.

## De panelen

1. **Vandaag en laatste 7 dagen naast elkaar**: advertentiekosten, vertoningen, klikken, CTR,
   gemiddelde klikprijs (Google Ads); bestellingen, omzet, gemiddelde orderwaarde (Shopify);
   sessies en productpaginaweergaves (eigen meting); plus berekend: bestellingen per klik,
   kosten per bestelling en omzet per euro advertentiekosten.
2. **Per product** (niet per variant): advertentiekosten, klikken, paginaweergaves,
   bestellingen, omzet, dekkingsbijdrage en marge na advertentiekosten. Rood bij negatief.
3. **Bestellingen**: laatste 25 met nummer, datum, bedrag, artikelen en de herkomstvelden.
4. **Trechter 7 dagen**: productpagina bekeken → in winkelwagen → afrekenen gestart →
   bestelling, met het uitvalpercentage per stap.

## Marge

Inkoopprijzen zoals opgegeven: Ambient Motion Bar 8,63, Wave 8,25, Wall Lamp 4-delig 9,76,
Solar Lantern 12,07, Flex 20,49. Berekening per verkoop:
(verkoopprijs ÷ 1,21) × (1 − 0,025 − 0,07) − inkoopprijs. Geen andere bedragen verzonnen.

## Eerlijke cijfers

- Ontbreekt een bron, dan staat er "niet beschikbaar" met de reden. Nooit een schatting.
- Elk paneel vermeldt de bron en het tijdstip van de laatste geslaagde verversing.
- Bij de Google Ads-panelen staat dat die cijfers enkele uren achterlopen.
- Eigen bezoeken tellen niet mee: bij inloggen op het dashboard wordt je apparaat gemarkeerd
  als intern en die sessies worden uit de bezoekcijfers gefilterd.
- Bedragen met euroteken en twee decimalen, datums in Nederlandse notatie.

## Volgorde van bouwen

1. Afscherming en de lege pagina.
2. Herkomst vastleggen en bestellingen koppelen.
3. Shopify-panelen.
4. Google Ads-panelen.
5. Berekende cijfers en marge.
6. Trechter, plus bezoekcijfers van `/statistieken` erin en die pagina weghalen.

Elke stap werkt voordat de volgende begint.

## Wat het niet doet

Dit rapporteert wat er gebeurd is; het maakt geen conversies aan in Google Ads. De tabel
bestelling ↔ klik is wel precies het materiaal voor een latere handmatige conversie-import.

## Technische details

- Nieuwe tabellen: `checkout_attribution` (cart_token uniek, klik-ids, utm-velden, landing_path,
  created_at) en `shop_orders` (order_number, shopify_order_id, created_at, total, currency,
  line_items jsonb, cart_token, gekoppelde attributie). Beide met GRANTs, RLS aan en leesbeleid
  uitsluitend via `has_role(auth.uid(), 'admin')`; inserts alleen door edge functions met de
  service role.
- `attribution-capture` edge function (publiek, alleen insert): aangeroepen vanuit
  `src/lib/shopify.ts` / `src/stores/cartStore.ts` zodra `cartCreate` een `checkoutUrl` teruggeeft;
  cart token uit `/cart/c/<token>`, herkomst uit `adsTracking.ts`. Faalt stil.
- `shopify-orders` edge function: Shopify Admin API 2025-07 met `SHOPIFY_ADMIN_ACCESS_TOKEN`
  (via `add_secret`), leest orders met `cart_token`, schrijft naar `shop_orders` en koppelt op
  cart token. Daarnaast `shopify-order-webhook` voor `orders/create` met HMAC-controle, zodat
  nieuwe bestellingen direct binnenkomen.
- `google-ads-report` edge function: connector-gateway met `GOOGLE_ADS_API_KEY` + `LOVABLE_API_KEY`,
  GAQL op `customer` 1487660156 voor kosten, vertoningen, klikken, CTR, gemiddelde CPC per dag en
  per `shopping_performance_view`/campagne voor de producttoewijzing. Statusveld per paneel bij fouten.
- `dashboard-summary` edge function bundelt de drie bronnen, verifieert de sessie via de
  Authorization-header en de adminrol, en geeft per paneel `{ data, source, fetchedAt, error }`.
- Frontend: `src/pages/admin/Dashboard.tsx` op route `/admin/dashboard`, met `noindex`, plus
  `Disallow: /admin/` in `public/robots.txt`. Marges in `src/lib/margins.ts` met de vaste inkoopprijzen.
- Interne bezoeken: kolom `internal` op `site_events`, gezet via een `sg_internal` cookie die op het
  dashboard wordt geplaatst; alle dashboardquery's filteren daarop.
- `src/pages/Statistieken.tsx` en de route verdwijnen in stap 6; de inhoud gaat op in het dashboard.
