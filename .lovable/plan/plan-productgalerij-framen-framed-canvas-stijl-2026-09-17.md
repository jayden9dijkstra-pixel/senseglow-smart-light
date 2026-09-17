# Plan: Productgalerij framen — "Framed Canvas" stijl

## Doel
De productfoto-galerij op elke productpagina krijgt een bewust kader zodat hij niet meer "los ingevoegd" aanvoelt. Geen tekst-, layout- of functionaliteitswijzigingen — alleen visuele framing van de galerij.

## Gekozen richting: Framed Canvas
De hoofdafbeelding krijgt afgeronde hoeken, een zachte mokka-tint rand en een subtiele diepteschaduw. De "Bekijk alle beelden"-knop wordt een zwevende witte pil in de framing, onderaan gecentreerd. De puntindicatoren blijven eronder staan, ongewijzigd in functie.

## Wijzigingen

### 1. `src/components/product/ProductImageGallery.tsx`
- Hoofdcontainer `relative aspect-square overflow-hidden` → voeg toe:
  `rounded-[2rem] bg-background border border-foreground/8 shadow-[0_24px_48px_-12px_rgba(93,64,55,0.08)]`
- "Bekijk alle beelden"-knop: verplaats van losse rij onder de afbeelding naar een overlay binnen het kader — `absolute bottom-6 left-1/2 -translate-x-1/2`, wit/95 backdrop-blur pil met mokka-rand.
- Puntindicatoren blijven onder de afbeelding, ongewijzigd.
- Swipe-sleepgedrag, lightbox en video-onbewerkte functionaliteit onaangetast.

### 2. Geen andere bestanden
- `ProductHeroSection.tsx` al-container en `md:border-r` blijven staan; de framing zit in de galerij-component zelf.
- Geen tekst-, vertaal-, prijs- of checkout-wijzigingen.

## Acceptatie
- Galerij op alle 5 productpagina's (NL, /en/, /fr/) toont afgeronde hoeken met zachte rand/schaduw.
- "Bekijk alle beelden" is een zwevende pil in het kader.
- Swipe, lightbox en puntindicatoren werken nog.
- Typecheck + build slagen.

## Niet in scope
- Donkere modus, lettertypes, kleurtokens, layoutstructuur of copy.
