# SenseGlow herstel — status

## Klaar
- Testreviews (vrienden/familie) verwijderd van alle openbare pagina's; intern gearchiveerd in `src/lib/_internal/legacy-testreviews.ts`. Geen sterren, scores of aantallen meer; geen Review/AggregateRating in structured data.
- Productenpagina en homepage: laden, technische fout (met "opnieuw proberen") en werkelijk lege catalogus zijn nu drie aparte toestanden. `fetchProducts` slikt fouten niet meer.
- Catalogus wordt bij de build vooraf gerenderd (echte namen, prijzen, afbeeldingen, links + ItemList-schema) op `/` en `/producten`, zodat crawlers dezelfde inhoud zien als bezoekers.
- Verzending: overal 7-14 dagen totaal inclusief verwerking; gratis naar Nederland en België.
- Retour: retourkosten voor rekening van SenseGlow; retouradres Tolheksleane 4A, 8821 MD Kimswerd, expliciet als post-/retouradres benoemd (voorwaarden, retourpagina, FAQ, contact).
- Vertrouwensclaims gecontroleerd: geen keurmerken, aftellers, bezoekersaantallen of voorraadurgentie op de site.
- Getest op mobiel en desktop: 5 producten, 5 werkende productpagina's, 0 consolefouten.

## Openstaand (heeft input of externe toegang nodig)
- Contactformulier met echte aflevering: nu opent de knop de mailapp (geen valse succesmelding). Voor verzending vanaf de site is een e-maildienst-sleutel nodig.
- Merchant Center: 32 artikelen = 32 varianten van 5 producten (5+5+6+7+9). Feedinstellingen, domeinclaim en afkeuringsdetails niet gecontroleerd — geen toegang.
- Publiceren: wijzigingen staan nog niet op het openbare domein.
