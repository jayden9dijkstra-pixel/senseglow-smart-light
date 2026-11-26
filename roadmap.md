# SenseGlow herstel — status

## Ambient Motion Bar-productpagina herbouwd (22 november 2026)
- [x] Alleen de Ambient-pagina: koopblok met USB-C-regel, belofte, vinkjes, lengte/kleur, 'Bundel en bespaar' (bestaande staffel), knop, levertijd en retour.
- [x] Inklapblokken, Hoe werkt het, 3 beeldblokken, Waarom SenseGlow, vergelijkingstabel, 4 tegels, FAQ (daglichtvraag weggelaten: staat niet in Shopify).
- [x] Knop boven de vouw met open cookiebalk op 360x800 en 390x844; plakbalk, winkelwagen en add_to_cart gecontroleerd; EN-vertaling; 104 tests geslaagd.

## Mobiele optimalisatie cookiebalk (22 november 2026)
- [x] Cookiebalk mobiel 109 px (13-14% van scherm), één regel en knoppen naast elkaar; paginaruimte onderaan zolang open; plakbalk schuift erboven. Consent-logica ongemoeid.
- [x] /trapverlichting koopknop vrij op 360x800 en 390x844 met open balk; foto vult volle breedte.
- [x] Tikdoelen (kleur, set, footerlinks) min. 44 px, kleine teksten in koopblok naar 14 px; 100 tests en build geslaagd.

## Nieuwe landingspagina /tuinhuis-verlichting (20 november 2026)
- [x] Nieuwe indexeerbare NL-pagina via LANDING_PAGES, met Solar Lantern buiten en Ambient Motion Bar 30 cm binnen; Wall Lamp 4-set als alternatief.
- [x] Bestaande prijzen, kortingen, tracking, attributie en vertrouwenselementen hergebruikt; sitemap en prerender met alle aanbiedingen en drie stappen gecontroleerd.
- [x] Gerichte test toegevoegd; 100 tests en build geslaagd, 67 routes vooraf gerenderd.
- [x] Op 375 px en desktop beide hoofdaanbiedingen en het alternatief in de winkelwagen gecontroleerd; knoppen 48–51 px, geen horizontale scroll of taalbalk-overlap; bestaande pagina's ongemoeid.

## Direct kopen op /trapverlichting (20 november 2026)
- [x] Alleen /trapverlichting: compact koopblok met variantfoto, 4-set standaard, 8-set en kleurkeuze.
- [x] Bestaande Shopify-prijzen, cart, view_item/add_to_cart en attributie behouden en in de browser geverifieerd.
- [x] Knop op 375 px op y=667 en 51 px hoog; 4-set echt toegevoegd aan CartDrawer; desktop zonder horizontale scroll.
- [x] 99 tests en build geslaagd; andere landingspagina's en productpagina's ongemoeid; niet gepubliceerd.

## Plaatsingsgids Wall Lamp (19 november 2026)
- [x] Nieuwe indexeerbare gids /plaatsingsgids-trap met vier stappen, SVG, FAQ, sitemap en prerender.
- [x] Printweergave en knop voor afdrukken of bewaren als PDF; geverifieerd op één A4.
- [x] Identieke bonusregel alleen bij de vier Wall Lamp-aanbiedingen.
- [x] 96 tests, build en mobiele/printcontrole geslaagd; niet gepubliceerd.

## Black Friday-weergave (13 november 2026)
- [x] Tijdgebonden bovenbalk, staffelweergave en winkelwagentekst; Wall Lamp en Shopify ongemoeid.
- [x] Herhaalde landingskoopknop dezelfde voorraadcontrole als hoofdknop.
- [x] 27 periode-, prijs- en voorraadtests plus mobiele controle vóór/tijdens/na en uitverkocht; niet gepubliceerd.

## Fixronde Jay (5 november 2026)
- [x] Productpagina's behouden de Shopify-volgorde, ook met scene; homepage-kaarten gebruiken featuredImage.
- [ ] Gangfoto: opgegeven alt ontbreekt in de zeven actuele Shopify-foto's; wacht op toevoegen/publiceren van die foto in Shopify. De scènekeuze is al ingesteld en gebruikt de foto zodra die beschikbaar is.
- [x] Wall Lamp-setnaam in plakbalk, standaard één lamp in gang en afrekenen in hetzelfde tabblad.
- [x] Retourboodschap onder koopknoppen en eigenaarstekst boven product-FAQ en op /over.
- [x] 22 gerichte tests en mobiele koop-/checkoutcontrole geslaagd; niet gepubliceerd.

## Klaar
- Testreviews (vrienden/familie) verwijderd van alle openbare pagina's; Geen sterren, scores of aantallen meer; geen Review/AggregateRating in structured data.
- Productenpagina en homepage: laden, technische fout (met "opnieuw proberen") en werkelijk lege catalogus zijn nu drie aparte toestanden. `fetchProducts` slikt fouten niet meer.
- Catalogus wordt bij de build vooraf gerenderd (echte namen, prijzen, afbeeldingen, links + ItemList-schema) op `/` en `/producten`, zodat crawlers dezelfde inhoud zien als bezoekers.
- Verzending: overal 7-14 dagen totaal inclusief verwerking; gratis naar Nederland en België.
- Retour: retourkosten voor rekening van SenseGlow; retouradres Tolheksleane 4A, 8821 MD Kimswerd, expliciet als post-/retouradres benoemd (voorwaarden, retourpagina, FAQ, contact).
- Vertrouwensclaims gecontroleerd: geen keurmerken, aftellers, bezoekersaantallen of voorraadurgentie op de site.
- Getest op mobiel en desktop: 5 producten, 5 werkende productpagina's, 0 consolefouten.

## Openstaand (heeft input of externe toegang nodig)
- [ ] Intern dashboard gepauzeerd: eerst vaststellen of de bestaande Lovable-Shopify-koppeling bestellingen veilig kan lezen zonder nieuwe handmatige sleutel.
- Contactformulier met echte aflevering: nu opent de knop de mailapp (geen valse succesmelding). Voor verzending vanaf de site is een e-maildienst-sleutel nodig.
- Merchant Center: 32 artikelen = 32 varianten van 5 producten (5+5+6+7+9). Feedinstellingen, domeinclaim en afkeuringsdetails niet gecontroleerd — geen toegang.
- Publiceren: wijzigingen staan nog niet op het openbare domein.

## Navigatie en winkelwagen (2026-09-18)
- [x] Winkelwagen alleen eenmalig openen na toevoegen
- [x] Desktopmenu teruggezet naar Voor thuis, Voor buiten en Voor werk
- [x] Mobiel menu gegroepeerd onder het menu-icoon
- [x] Ambient Bar even groot tonen in het productoverzicht
- [x] Desktop en mobiel controleren

## Productkeuzes (2026-09-20)
- [x] Gecombineerde Shopify-optie Kleur en maat correct uitlezen
- [x] Nederlandse Flex-kleuren correct uitlezen
- [x] Alle varianten en winkelwagenregels op desktop en mobiel controleren

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

## Favicon / Google-icoon (2026-09-20)
- [x] SG-icoon op mokka achtergrond in 48/96/144/180 + favicon.ico (512 werd genegeerd door Google)
- [x] index.html: sizes-vermeldingen + apple-touch-icon; bereikbaar op NL/EN/FR (HTTP 200)
- [ ] Na publicatie in Google Search Console indexering aanvragen voor senseglow.shop (gebruiker)

## Klikherkomst naar checkout (2026-09-20)
- gclid/gbraid/wbraid en utm_source/medium/campaign/term/content 90 dagen bewaard en meegestuurd naar checkout.senseglow.shop
- checkoutUrl niet langer bewaard in localStorage (stale link zonder herkomst)
- begin_checkout met bedrag en artikelen bevestigd in dataLayer

## Intern dashboard (2026-09-20)
- /admin/dashboard alleen voor de eigenaar, noindex, niet in menu of sitemap.
- Herkomst wordt bij het bouwen van de afrekenlink server-side bewaard op cartnummer.
- Bestellingen komen live uit Shopify, advertentiecijfers uit Google Ads, bezoeken uit eigen meting.
- Oude pagina /statistieken verwijderd; alles staat nu in het dashboard.

## Dashboard v2 (2026-10-10)
- [x] Periodekiezer, vergelijken, filters, eigen verkeer
- [x] Tabbladen Overzicht, Ads, Orders, Producten, Tracking, Trechter, Instellingen
- [x] Bestellingen elke 5 min uit Shopify, ingest-ads met ADS_INGEST_TOKEN
- [ ] Google Ads Script plakken en inplannen (gebruiker)

## Advertentie-invalshoeken en kits (2026-10-25)
- [x] Hoekblok onder de titel per ?a= (trap, gang, verhuur, buiten, student), ?a= mee als utm_content
- [x] Kitknoppen en 'Voordeliger per set' op Ambient Motion Bar en Solar Lantern
- [x] Shopify-kortingsregels in de winkelwagen
- [x] 'Waar gebruik je hem?' op elke productpagina
- [x] Productinhoud, FAQ en verzend-/retourinfo in de server-HTML, NL/EN/FR met eigen titel

## Rechtsvorm en landingspagina's (2026-10-26)
- [x] Rechtsvorm eenmanszaak door Jay bevestigd: in footerregel (businessLine), /contact-kaart en artikel 1 van /voorwaarden
- [x] Vijf NL-landingspagina's in sitemap: /trapverlichting, /gangverlichting, /verlichting-vakantiewoning, /solar-buitenlamp, /lamp-studentenkamer
- [ ] Publiceren (rechtsvorm en landingspagina's staan nog niet op het openbare domein)

- [x] 26 nov: SG-monogram, favicons, cookiebalk onderaan, homepage opgeschoond, menu Binnen/Buiten/Alle producten/Service

## Mobiele conversieverbetering (26 november 2026)
- [x] Routecode en 3D uit eerste download; fonts lokaal; landingsfoto preload.
- [x] Compacte winkelwagen zonder extra kortings-/cadeauregels, berekening ongewijzigd.
- [x] Gekozen Wall Lamp-setprijs per lamp, getest voor 4/8 lampen.
- [x] 107 tests en automatische controle geslaagd; 360/390/1440 prijsregel zichtbaar, winkelwagen en uitgesteld 3D gecontroleerd.
- [ ] Bundelmeting na publicatie; openbare hoofd-JS vóór wijziging 1.100.318 bytes (332.385 gzip).
- [ ] Publicatie aanvragen.
