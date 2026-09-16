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

## Laatste fixes voor publicatie
- [x] Bezorgtekst overal gelijkgezet op 7-14 werkdagen
- [x] Video alleen tonen bij een ingevulde URL
- [x] Productsecties gelijkmatig laten aansluiten
- [x] Eindcontrole afgerond
- [ ] Publiceren

## Ronde 3 optimalisatie
- [x] Mobiele sticky winkelwagenbalk na het bovenste productgedeelte
- [x] Reviewplaceholder en reviews-anker
- [x] Eén groene beschikbaarheidsmelding voor alle producten, zonder aantallen of schaarstetaal
- [x] Productvideo-modal en homepage-videofallback via centrale configuratie
- [x] Compact koopgedeelte op desktop
- [x] Drie echte catalogusaanbevelingen en compacte FAQ onderaan
- [x] Mobiel en desktop getest
- [ ] Publiceren

## Bundels upgrade
- [x] Prominente bundelsectie op homepage met drie grote kaarten
- [x] Bundlepagina met grote beeldkaarten, productpreview en besparingsberekening
- [x] Teaser voor eigen combinatie en drie bundelvoordelen
- [x] Amber hoverglow, collage-effect en staggered animatie
- [x] Uniforme aansluiting van top-level secties op homepage en productpagina's
- [x] Mobiel en desktop controleren
- [ ] Publiceren

## Bundels upgrade log
- Nieuw: `src/lib/bundles.ts`, `src/components/bundles/BundleShowcase.tsx`, `src/components/homepage/HomeBundlesSection.tsx`.
- Bijgewerkt: homepage, bundelpagina, hoofdnavigatie, winkelwagenknop, animatiestijlen en 17 homepage-/productsecties.
- Controle: typecheck, productiebuild, 16 prerender-routes, desktop 1280 px en mobiel 390 px; geen horizontale scroll of consolefouten.

## Correcties vóór definitieve publicatie
- [x] Geen voorraad-aantallen of schaarstetaal; overal groene melding 7-14 werkdagen
- [x] Lege videoconfiguratie toont uitsluitend statische foto
- [x] Productsecties sluiten zonder overlap of harde kieren aan
- [ ] Opnieuw controleren en publiceren

- [x] KVK-nummer 94904929 vervangen door 99634929 (WhySenseGlow.tsx)

## Beeldcorrecties homepage
- [x] Ambient Motion Bar volledig passend in de productkaart
- [x] Aangeleverde brede Wave-foto als achtergrond van de homepagekop

## Volg je bestelling (trackingpagina)
- [x] Pagina /volg-je-bestelling met alias /track en /bestelling-volgen
- [x] Zoekformulier, laadstaat, statusoverzicht met stepper, niet-gevonden staat
- [x] Serverfunctie order-lookup met rate limit, e-mailcheck en logging in order_lookups
- [x] Footerlink "Waar is mijn pakket?"
- [x] Shopify Admin API token werkt (shpat_, leesrechten op bestellingen)
- [x] Ordernummer flexibel: #1003, 1003, SG1003 werken allemaal
- [x] Getest met echte bestelling #1003 (desktop en mobiel, status en items correct)
- [ ] Link naar trackingpagina in Shopify bevestigingsmail (handmatig in Shopify)

## Bundelbouwer (2026-09-14)
- /stel-je-bundel-samen + alias /bundels; oude vaste bundels verwijderd
- Kortingen naar 10/15/20% (SG-PACK-2/3/4)
- Live Shopify-varianten, 5 min cache, concept in localStorage 24u
- Shopify Admin-token voor bestelling volgen werkt sinds 14-09

## Trechterfixes (ads)
- [x] /products/<handle>, /collections/..., /pages/... en /nl/... omleiden naar de juiste pagina (met gclid)
- [x] Winkelwagen schuift open bij toevoegen; meldingen in EN en FR
- [x] Taalvoorkeur overschrijft advertentielandingen niet meer
- [x] Winkelwagenteller valt op 0 na verwijderen (getest)
- [x] Advertentielinks gecontroleerd: alle 10 advertentiegroepen wijzen naar /product/<handle>
- [ ] Levertijd gelijktrekken met Shopify (wacht op juiste levertijd van gebruiker)
- [ ] Publiceren
