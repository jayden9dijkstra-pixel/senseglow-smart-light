# Stap 3A: Prerender bij build

Doel: elke publieke route levert in de **ruwe HTML** al de juiste title, description, canonical, OG/Twitter tags en JSON-LD (Product + BreadcrumbList op productpagina's), zonder JS. React hydrateert daarna gewoon zoals nu.

## Keuze: head-prerender script, geen headless browser

Niet `react-snap` / `vite-plugin-prerender`: die draaien Puppeteer/Chromium in de build. In de Lovable-buildomgeving is dat traag, zwaar en breekt makkelijk (Chromium download, timeouts, `window`-afhankelijke code in de app, cart-store, Shopify fetches). Dat is precies het risico dat je deze week niet wilt.

In plaats daarvan een eigen postbuild-script dat per route een statische HTML-variant van `dist/index.html` schrijft met de correcte head. De `<div id="root">` blijft leeg, React rendert de body client-side exact zoals nu. Crawlers (Google, Facebook, LinkedIn, X, Ads Quality Score) lezen head-tags en JSON-LD, dus dit lost het gerapporteerde probleem volledig op, met een build die enkele seconden langer duurt in plaats van minuten.

## Wat er gebouwd wordt

1. **`scripts/prerender.ts`** (nieuw), draait als `postbuild`:
   - Leest `dist/index.html` als template.
   - Vaste routes uit `ROUTE_SEO` + de bestaande routelijst: `/`, `/producten`, `/verzending`, `/retourneren`, `/voorwaarden`, `/privacy`, `/over`, `/duurzaamheid`, `/contact`, `/bestelling-volgen`, `/quiz`.
   - Productroutes uit `ENABLED_PRODUCT_HANDLES` (5 stuks).
   - Per route: title, meta description, `<link rel=canonical>`, og:title/description/url/type, twitter:card, plus Organization JSON-LD op `/`.
   - Schrijft `dist/<route>/index.html` (en `dist/index.html` voor `/`).

2. **Shopify-data tijdens build**: het script hergebruikt de query en constants uit `src/lib/shopify.ts` en de builders uit `src/lib/structuredData.ts` (`productSchema`, `breadcrumbSchema`) en `src/lib/seoContent.ts` (`getProductSeo`). Zo bevat de productpagina-HTML meteen prijs, availability, image en breadcrumb.

3. **Faalveilig per route**: elke productfetch krijgt een timeout (10s) en zit in een try/catch. Faalt er één, dan wordt die route geschreven met alleen de statische SEO-head (zonder Product JSON-LD) en een warning in de buildlog. De build breekt nooit; exit code blijft 0.

4. **`vite.config.ts` / `package.json`**: geen prerender-plugin nodig; er komt een `"postbuild": "bunx tsx scripts/prerender.ts"` script bij, naast de bestaande `prebuild` sitemap-stap. `vite.config.ts` blijft ongewijzigd.

5. **Fallback canonical in `index.html`** blijft staan; het script overschrijft die per route. Client-side blijft `react-helmet-async` leidend na hydration (dubbele tags worden vermeden doordat Helmet dezelfde tags vervangt).

## Verwachte build-tijd

Huidige build + ongeveer 5 tot 10 seconden (5 Shopify-requests parallel + 16 bestanden schrijven).

## Aandachtspunt na deploy

Dit werkt alleen als de hosting `www.senseglow.shop/product/senseglow_wave` serveert vanuit `dist/product/senseglow_wave/index.html` in plaats van meteen naar de SPA-fallback te gaan. Statische hosts doen dat vrijwel altijd (exact-file-match gaat voor de fallback). Na de eerste publish controleer ik het met een `curl` op prod: title, canonical en JSON-LD moeten in de ruwe HTML staan. Zo niet, dan meld ik dat direct en is de enige echte optie alsnog SSR (stap 3B).

## Verificatie voor publish

- `curl` op de lokale preview-build voor `/`, `/product/senseglow_wave` en `/retourneren`: unieke title, juiste canonical, Product + BreadcrumbList JSON-LD aanwezig.
- Browsercheck dat hydration nog normaal werkt (geen dubbele titles, cart en variantpicker intact).
