
# Plan: Homepage + Utility Pages Overhaul

Scope strikt: **niet aanraken** = ProductDetail, alle `components/product/*`, productContent/Config/Registry, cart/checkout, shopify lib, design tokens. Routes blijven gelijk (huidige bestandsnamen: `Shipping.tsx`, `Returns.tsx`, `Tracking.tsx`, `Sustainability.tsx`, `Terms.tsx` — geen rename nodig, alleen inhoud).

## Volgorde (één stap = één commit)

### Stap 1 — Utility-pagina's (klein)
- `src/pages/Shipping.tsx` → herschrijven volgens Deel 4 (3 info-cards, 3 stappen, 4 toelichtingssecties)
- `src/pages/Returns.tsx` → herschrijven volgens Deel 5 (3 info-cards, 4 stappen, garantie-sectie + uitklapbaar modelformulier voor herroeping via shadcn Accordion)
- `src/pages/Tracking.tsx` → herschrijven volgens Deel 7 (sub-header + grote CTA naar 17TRACK in nieuw tabblad + 3 toelichtingsblokken)

### Stap 2 — Contact
- `src/pages/Contact.tsx` → Deel 6: 2 cards (mail + bestelling volgen) naast elkaar, FAQ-shortcuts, bedrijfsgegevens-block met `[KvK-nummer]`, `[BTW-nummer]`, `[Vestigingsadres]` placeholders in muted/dashed styling

### Stap 3 — Duurzaamheid
- `src/pages/Sustainability.tsx` → Deel 3: H1 + intro, 4 punten in 2×2 grid, outro-paragraaf

### Stap 4 — Privacy + Voorwaarden (templates met jurist-banner)
- `src/pages/Privacy.tsx` → Deel 8 volledige AVG-template + top-banner ("template — laat nakijken door NL-jurist")
- `src/pages/Terms.tsx` → Deel 9 volledige AV-template + zelfde top-banner
- Beide met `[KvK]`, `[BTW]`, `[Vestigingsadres]`, `[datum]` placeholders zichtbaar gestyled

### Stap 5 — Quiz uitbreiden naar 5 producten
- `src/pages/Quiz.tsx` → state machine herschrijven:
  - Q1 (locatie): binnen / buiten → Solar Lantern / bureau → Flex
  - Q2 (doel binnen): trap / sfeer / niet zoeken → vertakt naar Q3a/b/c
  - Q3a Wall Lamp size (4-pack vs 8-pack)
  - Q3b Wave size (30 vs 50)
  - Q3c Ambient ruimtes (single / 3-pack / 4-pack)
  - Progress-bar, fade-transitie, "Vorige"-knop vanaf Q2, tap-friendly cards
  - Resultaat-pagina: product-foto, naam, copy uit Deel 2.3, prijs (uit Shopify call zoals nu), CTA met juiste URL-params (`?size=`, `?bundle=`, `?set=`) + fallback link "Niet de juiste match? Bekijk alle producten"

### Stap 6 — Homepage overhaul
**Verwijderen** uit `src/pages/Index.tsx` (en bestanden zelf):
- `ProblemSolutionSection.tsx`
- `WarmGlowSection.tsx`
- `SafetySection.tsx`
- `FinalCTASection.tsx`

**Updaten:**
- `HeroSection.tsx`: H1 "Slimme verlichting. Geen gedoe.", nieuwe sub, primary CTA → `/producten`, secundair → `/quiz`, behoud trust-bullets
- `StorytellingSection.tsx`: tekst breder maken (verwijder Ambient-specifieke verwijzingen, gebruik voorgestelde copy)
- `QuizIntroSection.tsx`: nieuwe H2/sub/CTA-tekst
- `ReviewsTeaserSection.tsx` → hernoemen/herwerken naar carousel met 5 reviews (één per product, shadcn Carousel — 3 zichtbaar desktop, swipe mobile), elk met "Lees meer reviews →" naar bijbehorende productpagina

**Nieuw** in `src/components/homepage/`:
- `UseCaseGrid.tsx`: H2 "Voor elke kamer een ander licht", 5 tegels (3+2 desktop, 1-col mobile), glassmorphism, hele tegel klikbaar naar juiste `/product/<handle>`
- `WhatTheyShare.tsx`: H2 "Wat ze met elkaar gemeen hebben", 4 voordeel-blokken 2×2
- `VoetCTA.tsx`: kleine uitleider, H2 "Klaar om te beginnen?", CTA → `/producten`

**Nieuwe homepage-volgorde** in `Index.tsx`:
1. Hero → 2. UseCaseGrid → 3. WhatTheyShare → 4. Storytelling → 5. QuizIntro → 6. ReviewsCarousel → 7. bestaande Catalog/collectie-sectie → 8. HomepageFAQ → 9. VoetCTA

## Technische notes
- Alle nieuwe componenten gebruiken bestaande design tokens (`bg-background`, `text-foreground`, `text-glow`, glassmorphism classes), geen nieuwe kleuren.
- Voor de Homepage FAQ-update: gebruikt bestaande `FAQSection.tsx` of homepage-equivalent — vragen-array vervangen door 6 vragen uit Deel 1.9.
- Productafbeeldingen voor UseCaseGrid + ReviewsCarousel + Quiz-resultaten: gebruik bestaande Shopify product images (eerste image van handle via Storefront fetch zoals al gedaan in Catalog) — geen nieuwe assets nodig.
- Modelformulier herroeping: rendered binnen `<pre>` of stylized `<div>` in een shadcn `<Accordion>`.
- Geen wijzigingen aan routes (`App.tsx`), header, footer, of Catalog.
- KvK/BTW/adres-placeholders: rendered als `<span className="px-2 py-0.5 bg-muted/40 border border-dashed border-foreground/20 rounded text-foreground/50 text-sm">[KvK-nummer]</span>` zodat eigenaar ze visueel terugvindt.

## Out of scope (bevestiging)
ProductDetail, alle product-componenten, productContent/Config/Registry, cart, checkout, shopify.ts, header, footer, design tokens — allemaal **onaangeroerd**.
