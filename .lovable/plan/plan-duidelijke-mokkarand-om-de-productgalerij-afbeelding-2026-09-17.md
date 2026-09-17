# Plan: Duidelijke mokkarand om de productgalerij-afbeelding

## Doel
De afbeelding in de productgalerij krijgt een dunne, zichtbaar mokkabruine rand direct om de foto — geen vage bijna-onzichtbare lijn, maar een herkenbare warme omranding die past bij de mokka/oranje stijl.

## Wijziging
### `src/components/product/ProductImageGallery.tsx`
- Vervang de huidige rand op de hoofdcontainer:
  - Van: `border border-foreground/8`
  - Naar: `border border-primary/20` (mokka-tint, ~20% opacity — zichtbaar maar subtiel)
- Alle andere framing (afgeronde hoeken, schaduw, zwevende pil-knop, puntindicatoren) blijft ongewijzigd.

## Acceptatie
- Galerij op productpagina's toont een dunne warme mokkarand om de foto.
- Typecheck + build slagen.

## Niet in scope
- Alleen deze randwijziging; geen andere visuele of functionele aanpassingen.
