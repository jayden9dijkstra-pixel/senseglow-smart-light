# Intern dashboard: verder bouwen met de bestaande Shopify-koppeling

Het plan blijft hetzelfde, met één verandering: er komt geen nieuwe Shopify-sleutel. De
backend heeft al werkende Shopify-toegang (dezelfde die "bestelling opzoeken" gebruikt voor
echte bestellingen). Daar bouw ik op verder.

## Wat er al staat

- De tabellen voor herkomst en bestellingen zijn aangemaakt, met leesrechten alleen voor jou.
- De klik- en campagnegegevens gaan al mee naar de afrekenpagina.

## Wat ik nu ga doen

1. **Afscherming en lege pagina** op `/admin/dashboard`: alleen jouw beheerdersaccount, niet
   ingelogd betekent doorsturen naar inloggen. Geen link in menu, voettekst of sitemap, en
   uitgesloten van Google.
2. **Herkomst vastleggen**: op het moment dat de afrekenlink wordt gemaakt bewaar ik in de
   backend het winkelwagen-kenmerk, de klik-id's, de utm-velden, de landingspagina en het
   tijdstip. Binnenkomende bestellingen koppel ik daaraan op het winkelwagen-kenmerk.
3. **Shopify-panelen**: bestellingen, omzet, gemiddelde orderwaarde en de lijst met de laatste
   25 bestellingen, opgehaald met de bestaande toegang.
4. **Google Ads-panelen**: kosten, vertoningen, klikken, CTR en gemiddelde klikprijs.
5. **Berekende cijfers en marge** per product, met marge na advertentiekosten (rood bij negatief).
6. **Trechter** van productpagina tot bestelling, plus de bezoekcijfers van `/statistieken`
   erin; die losse pagina verdwijnt daarna.

Elke stap werkt voordat de volgende begint.

## Marge

Inkoopprijzen per variant, inclusief verzending: Ambient Motion Bar 20cm 8,05, 30cm 8,80,
40cm 9,78; Wave 30cm 7,65, 50cm 8,25; Wall Lamp per 4 9,50; Solar Lantern 10,40; Flex 18,00.
De drie volgende bedragen per regel gebruik ik als inkoop van 2, 3 en 4 stuks voor bundels.
Per verkoop: (verkoopprijs ÷ 1,21) × (1 − 0,025 − 0,07) − inkoopprijs. Geen andere bedragen.

## Eerlijke cijfers

- Ontbreekt een bron, dan staat er "niet beschikbaar" met de reden erbij. Nooit een schatting
  of voorbeeldgetal.
- Elk paneel vermeldt de bron en het tijdstip van de laatste geslaagde verversing.
- Bij Google Ads staat erbij dat die cijfers enkele uren achterlopen.
- Je eigen bezoeken worden gemarkeerd en uit de bezoekcijfers gefilterd.
- Bedragen met euroteken en twee decimalen, datums in Nederlandse notatie.

## Technische details

- Geen `SHOPIFY_ADMIN_ACCESS_TOKEN` meer. De `shopify-orders` edge function gebruikt
  `SHOPIFY_ADMIN_TOKEN` met fallback `SHOPIFY_ACCESS_TOKEN`, net als `order-lookup`, tegen de
  Admin GraphQL API 2025-07 op `senseglow-smart-light-5jjoq.myshopify.com`. Werkt de token
  niet meer (Shopify vraagt herauthenticatie), dan tonen de Shopify-panelen "niet beschikbaar"
  met die reden; geen data verzonnen.
- `attribution-capture` edge function (alleen insert, service role) wordt aangeroepen vanuit
  `src/lib/shopify.ts` zodra `cartCreate` een `checkoutUrl` teruggeeft; cart token uit
  `/cart/c/<token>`, herkomst uit `adsTracking.ts`. Faalt stil.
- Orders koppelen via polling in `shopify-orders` op `cart_token`; een `orders/create` webhook
  met HMAC-controle komt er pas bij als polling te traag blijkt.
- `google-ads-report`: de connector-gateway gaf op alle REST-paden 404, dus de cijfers worden
  periodiek weggeschreven naar een cachetabel `ads_daily_stats` (datum, campagne, product,
  kosten, vertoningen, klikken, conversies) en het dashboard leest daaruit met een zichtbaar
  "laatst bijgewerkt"-tijdstip. Lukt verversen niet, dan staat dat in het paneel.
- `dashboard-summary` edge function bundelt de bronnen, verifieert sessie en adminrol, en geeft
  per paneel `{ data, source, fetchedAt, error }`.
- Frontend `src/pages/admin/Dashboard.tsx` op `/admin/dashboard` met `noindex`, plus
  `Disallow: /admin/` in `public/robots.txt`. Marges in `src/lib/margins.ts`.
- Interne bezoeken via de kolom `internal` op `site_events` en een `sg_internal` cookie.
- `src/pages/Statistieken.tsx` en de route verdwijnen in stap 6.
