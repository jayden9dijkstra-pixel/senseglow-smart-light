
# Plan: 6 productpagina's met Shopify-namen + lege Ambient-Bar layout + correcte varianten/bundels/discount codes

## Aanpak
"Alles staat in Shopify" → ik vertrouw Shopify als bron van waarheid voor titel, varianten en prijzen. Geen tekst-content (copy) op de productpagina's; alleen de structuur van de huidige Ambient Bar productpagina met placeholders. Discount codes uit het vorige plan worden aangemaakt.

## A. Productnamen overnemen uit Shopify

| Productpagina toont | Komt uit Shopify titel |
|---|---|
| **SenseGlow™ Ambient Motion Bar** | id 10026038198570 |
| **SenseGlow Arc™** | id 10045207281962 |
| **SenseGlow Flex™** | id 10057915138346 |
| **SenseGlow Solar Lantern™** | id 10057915171114 |
| **SenseGlow Solar Wall Lamp™** | id 10057915236650 |
| **SenseGlow Wave™** | id 10057930080554 |

Alle hardcoded titels in product configs (`title`, `subtitle`, hero copy) → vervangen door `product.node.title` uit Shopify. Catalog grid + dropdown menu + footer-links gebruiken dezelfde Shopify titels.

## B. Productpagina-template (zonder tekst)

Eén shared template `<ProductPageTemplate>` gebaseerd op de huidige Ambient Bar layout. Per sectie:

| Sectie (uit huidige layout) | Inhoud nu |
|---|---|
| Hero (gallery + variant picker + price + CTA) | **Live** — gallery uit Shopify images, variant picker uit Shopify options, prijs live |
| Outcome | Placeholder card met grijze blokken |
| Problem/Solution | Placeholder met 2 grijze image-blokken |
| Use Cases | 3 placeholder cards (grijs vlak + 2 lege regels) |
| Tech Benefits | Icon-grid met grijze placeholders |
| Reviews | Lege reviews-state ("Nog geen reviews") |
| FAQ | Sectie verborgen (geen tekst) |
| Bundles | **Live** — gebruikt per-product `BUNDLE_TIERS` |
| Final CTA | Knop + trust badges blijven |

Placeholders gebruiken `bg-muted/40 rounded-xl animate-pulse-subtle` blokken in plaats van shimmer (want geen loading state) — dit toont duidelijk "te vullen content" zonder verwarring.

`ProductDetail.tsx` `CONTENT_MAP` → vereenvoudigen tot: voor elk handle dezelfde lege placeholder-content, behalve gallery/variants/prijs (uit Shopify) en bundle-tier (uit eigen config).

## C. Variant picker per product

Bestaande `VariantPicker.tsx` parser uitbreiden om alle 6 producten correct te ondersteunen op basis van Shopify `selectedOptions`:

| Product | Optie 1 (zichtbaar) | Optie 2 (zichtbaar) | Optie 3 |
|---|---|---|---|
| Ambient Bar | **Maat** (20/30/40cm) | **Kleur** (Silver/Black) | — |
| Arc | **Wattage** (6W/12W) | **Kleur** (Black/White) | — (3000K vast) |
| Flex | **Variant** (Standaard / Met afstandsbediening) | — | — |
| Solar Lantern | **Kleur** (Wit/Zwart) | — | — |
| Solar Wall Lamp | **Set** (4-set/8-set) | **Kleur** (Wit/Zwart) | — |
| Wave | **Maat** (30cm/50cm) | **Kleur** (Black/White) | — |

Parser leest Shopify `option1`/`option2`/`option3` en groepeert beschikbare combinaties. UI labels worden vertaald (bv "Black 6W" → kleur=Zwart + wattage=6W). Default-selectie = eerste beschikbare combinatie. Live prijs update bij elke keuze.

## D. Per-product bundel-tiers (uit pricing doc)

Centraal in elke config:

| Product | 2-pack | 3-pack | 4-pack | 8-set |
|---|---|---|---|---|
| Ambient Bar | 7% | 12% | 15% | — |
| Arc | 10% | 15% | — | — |
| Solar Lantern | 8% | — | 15% | — |
| Solar Wall Lamp | — | — | — | 10% (vast op variant) |
| Wave | 8% | 12% | 15% | — |
| Flex | (geen bundels — sectie verborgen) | | | |

`BundlesSection.tsx`: rendert alleen tiers die bestaan; verbergt zichzelf bij 0 tiers.
Voor Solar Wall Lamp: geen "kies aantal" — toont 1 bundle card "8-set: bespaar 10%" die direct de 8-set variant in cart legt.

## E. Cart & checkout

`CartItem` krijgt: `productKey` ("ambient" | "arc" | "lantern" | "sconce" | "wave") en `variantKey` (bv "30CM", "B6W", "8SET").

`createStorefrontCheckout` (in `src/lib/shopify.ts`) groepeert bundles per `(productKey, variantKey)`, berekent greedy de optimale tier, en injecteert de juiste `SG-...` discount code(s) in de cart. Greedy logic blijft maar gebruikt nu per-product tier-tabellen.

`CartDrawer.tsx`: totaal = som van `bundleIncVatTotal` (bundles) + `price × qty` (singles). Geen aparte rekenfunctie meer.

## F. Shopify discount codes (19 stuks aanmaken)

Per code: `create_price_rule` (entitled variants, prerequisite quantity, percentage) → `create_discount_code`.

**Ambient Bar** (9): `SG-AB-{20|30|40}-{2|3|4}` met 7/12/15%, entitled = beide kleuren van die maat.
**Arc** (6): `SG-ARC-{B6W|W6W|B12W}-{2|3}` met 10/15%, entitled = die specifieke variant.
**Solar Lantern** (2): `SG-SOL-2` (8%), `SG-SOL-4` (15%) — entitled = beide kleuren.
**Solar Wall Lamp** (1): `SG-SCONCE-8` (10% op 8-set varianten, ≥1).
**Wave** (6): `SG-WAVE-{30|50}-{2|3|4}` met 8/12/15%, entitled = beide kleuren van die maat.

**Wave-prijzen**: ik vertrouw Shopify exact zoals het er nu staat (Black 30cm €39,95, White 30cm €29,95, etc.) — discount-codes en cart-totaal rekenen op de werkelijke variant-prijs uit Shopify.

## G. Catalog page + dropdown menu

`src/pages/Catalog.tsx`, `DesktopMenu.tsx`, `MobileMenu.tsx`, `Index.tsx` "Onze collectie": vervang elke product-tile door Shopify-titel + Shopify-hoofdfoto + "Bekijk product" link. Geen verzonnen subkopjes.

## H. Bestanden te wijzigen

- `src/lib/productConfig.ts` — prijzen sync, generieke `computeBundlePricing(unitPrice, tiers)`, oude 50cm weg.
- `src/lib/{arc,wave,lantern,sconce,flex,step}ProductConfig.ts` — eigen `BUNDLE_TIERS`, alle hardcoded copy → optionele lege strings of `null`.
- `src/components/product/ProductImageGallery.tsx` — als geen images → grijze placeholder-grid.
- `src/components/product/VariantPicker.tsx` — multi-product parser uitbreiden.
- `src/components/product/BundlesSection.tsx` — dynamische tier-render, sectie-hide bij 0 tiers, special "8-set" mode voor Sconce.
- `src/components/product/{Outcome,ProblemSolutionProduct,UseCase,TechBenefits,ProductReviews,ProductFAQ,FinalProductCTA}Section.tsx` → text-velden vervangen door placeholder-blokken wanneer geen content.
- `src/pages/ProductDetail.tsx` — `CONTENT_MAP` ingekort, alle 6 handles laden via shared template.
- `src/lib/shopify.ts` — multi-product discount-code mapping.
- `src/stores/cartStore.ts` — extra velden in `CartItem`.
- `src/components/CartDrawer.tsx` — vereenvoudigd totaal.
- `src/pages/{Index,Catalog}.tsx`, `src/components/{Desktop,Mobile}Menu.tsx`, `SiteFooter.tsx` — Shopify-titels.
- **Shopify**: 19 nieuwe price rules + discount codes via Shopify tools.

## I. Aannames (geen vragen meer)

1. Wave-prijs-onregelmatigheden zijn **bewust** zo in Shopify → niet aanpassen, gewoon tonen.
2. Solar Wall Lamp 8-set €54,95 is correct (Shopify leidt boven document).
3. Flex heeft geen bundels.
4. Geen tekst op de productpagina's — alleen de visuele structuur en werkende interacties (variant, prijs, cart, bundels).
5. Oude `SG-{20|30|40}CM-...` codes blijven in Shopify staan, worden niet meer aangeroepen.
