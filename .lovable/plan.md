# SEO + Quality Score upgrade senseglow.shop

## 1. Wat de codebase nu doet met meta tags

- Er is **geen** meta-oplossing per pagina. Alles staat statisch in `index.html`: `<title>SenseGlow</title>`, één description over nachtverlichting, og/twitter tags, favicon (1024px PNG via externe URL), en de Google Ads gtag.
- Er is geen `react-helmet-async` (of vergelijkbaar) geïnstalleerd; routes in `src/App.tsx` renderen puur componenten zonder head-logica.
- Geen canonical, geen JSON-LD, geen `public/sitemap.xml` (alleen `public/robots.txt` met allow-all, zonder Sitemap-regel).
- Productdata komt live uit Shopify (`src/lib/shopify.ts`), handles staan in `src/lib/productConfig.ts` (`senseglow_ambient_motion_bar`, `senseglow_wave`, `senseglow_flex`, `senseglow_solar_lantern`, `senseglow_wall_lamp`). Copy per product staat in `src/lib/productContent.ts`.
- Afbeeldingen zijn ongeoptimaliseerde PNG's in `src/assets` (hero-lifestyle, quiz-smartphone, logo-new), geïmporteerd als gewone `<img src>`.

Belangrijke nuance: dit is een client-side Vite SPA. Helmet-tags worden na hydration in de `<head>` gezet. Googlebot voert JS uit en ziet ze; social-crawlers (LinkedIn, Slack, Facebook) zien alleen de statische `index.html`. Daarom blijft de sitewide og:*-set in `index.html` staan als fallback. Wil je écht per-pagina social previews, dan is server-side rendering nodig, dat kan via een upgrade naar Lovable's nieuwste template ([wat de upgrade oplevert](https://lovable.dev/blog/building-apps-using-tanstack-start)).

## 2. Aanpak per issue

### Issue 1+2+3 — Unieke titles, descriptions, canonicals
- **Library**: `react-helmet-async` (past het beste; geen SSR-aannames, dedupe op name/property).
- **Nieuw**: `src/components/seo/Seo.tsx` — één component met props `title`, `description`, `path`, optioneel `jsonLd`, `noindex`. Rendert `<title>`, `<meta name="description">`, `<link rel="canonical" href={"https://www.senseglow.shop"+path}>`, en per-route `og:title`/`og:description`/`og:url`.
- **Nieuw**: `src/lib/seoContent.ts` — centrale map van titles/descriptions per route én per producthandle (jouw aangeleverde teksten, descriptions 150-160 tekens met USP + prijs + gratis verzending NL).
- **Wijzigen**: `src/main.tsx` (`HelmetProvider` om de app), `index.html` (statische canonical niet toevoegen; title/description worden de sitewide fallback), en elke pagina in `src/pages/` (`Index`, `Catalog`, `ProductDetail`, `Contact`, `Shipping`, `Tracking`, `Returns`, `About`, `Sustainability`, `Privacy`, `Terms`, `Quiz`, `NotFound` met `noindex`).
- **ProductDetail**: kiest titel/description op `handle` uit `seoContent.ts`, met nette fallback op de Shopify-producttitel voor handles zonder eigen copy.
- `/producten` en `/catalogus` renderen dezelfde pagina: canonical van beide wijst naar `/producten` zodat dat geen duplicate content is.

### Issue 4 — JSON-LD structured data
- **Nieuw**: `src/lib/structuredData.ts` met builders: `organizationSchema()`, `productSchema(product, variant)`, `breadcrumbSchema(items)`.
- **Sitewide Organization**: in `index.html` (statisch, altijd zichtbaar voor crawlers).
- **Product schema**: in `ProductDetail.tsx` via `Seo`-component, gevuld uit de al opgehaalde Shopify-data: `name`, `image` (galerij-URLs), `description`, `sku` (variant-SKU/ID), `brand: SenseGlow`, `offers` met `price` (laagste variantprijs), `priceCurrency: EUR`, `availability` op basis van `availableForSale`, `priceValidUntil` (vandaag + 1 jaar), `url` = canonical. Schema pas renderen als de productdata geladen is, zodat er nooit lege velden in staan.
- **BreadcrumbList** op productpagina's: Home → Producten → productnaam.

### Issue 5 — Sitemap + robots
- **Nieuw**: `scripts/generate-sitemap.ts` dat `public/sitemap.xml` schrijft, plus `predev`/`prebuild` scripts in `package.json` (`bunx tsx scripts/generate-sitemap.ts`).
- Entries: `/`, `/producten`, de 5 productpaden uit `ENABLED_PRODUCT_HANDLES`, `/verzending`, `/retourneren`, `/voorwaarden`, `/privacy`, `/over`, `/duurzaamheid`, `/contact`, `/bestelling-volgen`. Niet: `/catalogus` (duplicate), `/quiz` (optioneel, standaard wel opnemen), `/login`, `/.lovable/*`, 404.
- Geen `<lastmod>` verzinnen op basis van build-tijd; die laten we weg tenzij er een echte inhoudelijke datum is.
- **Wijzigen**: `public/robots.txt` — regel `Sitemap: https://www.senseglow.shop/sitemap.xml` toevoegen, bestaande user-agent blokken ongemoeid.

### Issue 6 — Images / LCP
- **Library**: `vite-imagetools` (query-based, geeft echte WebP + srcset per import; werkt netjes met de bestaande `@/assets` imports). `vite-plugin-imagemin` valt af: geen srcset, trage builds.
- **Wijzigen**: `vite.config.ts` (plugin toevoegen), `src/vite-env.d.ts` (types voor imagetools-queries).
- **Nieuw**: `src/components/ui/ResponsiveImage.tsx` — wrapper die `srcSet`/`sizes` doorgeeft en `loading`/`fetchPriority` als props accepteert.
- **Hero** (`src/components/homepage/HeroSection.tsx`): WebP + srcset 600/1024/1600w, `loading="eager"`, `fetchpriority="high"`, plus `<link rel="preload" as="image">` via Helmet op de homepage.
- **Quiz-afbeelding** (`QuizIntroSection.tsx`): WebP + srcset, blijft lazy.
- **Logo** (`SiteHeader.tsx`): import als lokale asset op max 256px WebP in plaats van de 1024px externe PNG; favicon in `index.html` naar een klein bestand laten wijzen.
- Overige `src/assets` PNG's (lifestyle, product-detail, storytelling) in dezelfde slag naar WebP+srcset waar ze in beeld komen.

## 3. Volgorde van uitvoeren

1. `react-helmet-async` installeren + `HelmetProvider` + `Seo`-component + `seoContent.ts` (titles/descriptions/canonicals) → grootste Quality Score-winst, laagste risico.
2. Alle pagina's aansluiten op `Seo` (inclusief noindex op 404 en login).
3. JSON-LD: Organization in `index.html`, Product + BreadcrumbList op productpagina's.
4. Sitemap-generator + robots.txt-regel.
5. Image-pipeline: imagetools, hero eager/priority, logo, daarna de rest.
6. Verificatie: build draaien, `/sitemap.xml` opvragen, per route de gerenderde `<head>` in de browser controleren, en Rich Results/Lighthouse-check.

## 4. Risico's

- **SPA-limiet**: Helmet-tags zijn client-side. Google ziet ze; niet-JS social crawlers niet. Google Ads en Merchant Center crawlen met JS-rendering, dus voor jouw doel is dit voldoende, maar het is geen SSR.
- **Product schema uit live Shopify-data**: als de Shopify-fetch faalt, mag er geen half schema in de pagina staan. Schema wordt daarom alleen gerenderd bij geladen data.
- **Prijs in de title** ("Vanaf €24,95") veroudert bij prijswijzigingen; die staat hardcoded in `seoContent.ts` en moet handmatig mee.
- **vite-imagetools** kan de buildtijd verhogen en vraagt type-declaraties; als een import misgaat, breekt de build. Daarom pas in stap 5, na de SEO-winst.
- **Logo/favicon wijzigen** verandert het visuele merk-detail in de nav; scherpte op retina checken na de resize.
- **Sitemap moet in sync blijven** met routes en de producthandle-whitelist; de generator leest daarom `ENABLED_PRODUCT_HANDLES` in plaats van een losse lijst.
- **Social preview caching**: gewijzigde og-tags/afbeeldingen verschijnen pas in gedeelde links nadat platforms opnieuw scrapen; forceren kan via hun link preview debugger.
