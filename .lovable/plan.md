# Diagnose: geen bug in de code, wel een SSR-limiet

Ik heb prod gemeten op twee manieren.

**1. Ruwe HTML (wat je in view-source / curl ziet)**
`curl https://www.senseglow.shop/product/senseglow_wave` geeft exact de inhoud van `index.html`: homepage-title, geen canonical, alleen Organization + WebSite JSON-LD. Precies jouw drie observaties.

**2. Gerenderde pagina (wat een browser en Googlebot zien)**
Headless Chromium op dezelfde URL:
- title: `SenseGlow Wave™, sensor lichtbalk 30/50cm | Vanaf €24,95`
- canonical: `https://www.senseglow.shop/product/senseglow_wave`
- JSON-LD: Organization, WebSite, **Product**, **BreadcrumbList**

Dus: `Seo.tsx` bevat de canonical, `ProductDetail.tsx` roept `<Seo>` correct aan via `PageLayout`, en er blijft geen fallback-title hangen. Niets kapot, niets verschillend tussen preview en prod.

De `data-rh="true"` die je zag is misleidend: die attributen staan **hardcoded in `index.html`** (regels 15, 30-33), overblijfsel van een eerdere edit. Ze suggereren "Helmet heeft dit gedaan", maar het is statische tekst.

Kern: dit is een client-side Vite SPA zonder SSR. Alles wat Helmet doet, gebeurt pas ná het uitvoeren van JavaScript. Google rendert JS en ziet dus de juiste tags; social-preview crawlers (LinkedIn, Slack, WhatsApp, Facebook) en simpele scrapers doen dat niet en zien de homepage-tags op elke URL.

# Plan

## Stap 1 — Opruimen `index.html` (klein, direct)
- Verwijder de misleidende `data-rh="true"` attributen.
- Voeg een sitewide `<link rel="canonical" href="https://www.senseglow.shop/">` toe zodat de ruwe HTML niet volledig zonder canonical is. Helmet overschrijft die niet automatisch (link-tags dedupliceren niet op `rel`), dus dan zouden er twee canonicals staan. Twee opties, ik neem A tenzij je anders zegt:
  - **A**: geen canonical in `index.html`, canonical blijft alleen via Helmet. Correct voor Google, leeg in view-source.
  - **B**: canonical in `index.html` én canonical uit `Seo.tsx` halen op alle routes waar dat niet klopt. Slechter.

## Stap 2 — Verwachtingen vastleggen
- Google Search Console URL-inspectie op een productpagina gebruiken om te bevestigen dat de gerenderde title/canonical wordt opgepikt (dat is de enige check die telt voor ranking).
- Social previews blijven fout tot stap 3.

## Stap 3 — Echte oplossing voor per-pagina previews en crawler-zichtbaarheid: SSR
Twee routes, jouw keuze:
- **Prerender bij build**: een build-stap die per route de HTML uitrendert naar statische bestanden. Blijft binnen de huidige Vite-setup. Productpagina's zijn Shopify-afhankelijk, dus de data wordt bij build-tijd bevroren (prijzen/voorraad kunnen verouderen tot de volgende publish).
- **Migreren naar Lovable's nieuwste template met SSR (TanStack Start)**: per-request server-rendering, altijd verse Shopify-data, correcte tags in de ruwe HTML voor élke crawler. Grootste ingreep, beste resultaat. Zie [wat de upgrade oplevert](https://lovable.dev/blog/building-apps-using-tanstack-start).

## Risico's
- Stap 1 is risicoloos.
- Prerender: build wordt langer; product-data in de HTML is een snapshot, de client hydrateert er live data overheen.
- SSR-migratie: raakt routing, data-fetching en de Shopify-client; grootste testoppervlak.

## Aanbevolen volgorde
1. Stap 1 nu uitvoeren.
2. Beslis of social previews per pagina zakelijk nodig zijn. Zo nee: klaar, Google ziet alles al goed. Zo ja: stap 3, en dan liefst de SSR-migratie boven prerender.
