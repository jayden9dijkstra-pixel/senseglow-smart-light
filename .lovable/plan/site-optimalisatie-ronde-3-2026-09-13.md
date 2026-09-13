# Site-optimalisatie ronde 3

## Resultaat
De productpagina krijgt een compacter koopgedeelte, eerlijke reviewstatus, een vaste beschikbaarheidsmelding, video-voorbereiding, een mobiele winkelbalk en drie echte catalogusaanbevelingen. De homepage krijgt een videolaag met de bestaande foto als fallback.

## Uitvoering
1. **Centrale productpresentatie**
   - Voeg `videos.ts` toe met lege velden per product en voor de homepage.
   - Toon bij ieder product dezelfde groene vinkje-indicator: “Op voorraad, verzonden binnen 1-3 werkdagen”.
   - Toon geen aantallen, vlam-icoon of schaarstetaal.

2. **Productgedeelte bovenaan**
   - Herschik desktop naar foto/video links en compacte koopinformatie rechts.
   - Toon titel, klikbare vijfsterren-placeholder, amber prijs, vaste beschikbaarheidsmelding, drie korte voordelen, varianten, brede winkelwagenknop, Kast Starter-link en vier horizontale vertrouwenspunten.
   - Houd dit op 1440×900 binnen het eerste scherm door afstanden en beeldhoogte te begrenzen.

3. **Video-ervaring**
   - Plaats alleen bij een ingevulde productvideo een afspeelknop op de galerij.
   - Open de video schermvullend, automatisch, gedempt en herhalend, met sluiten en geluid aan/uit.
   - Gebruik zonder URL automatisch de bestaande productfoto, zodat lege configuratie geen lege ruimte of fout geeft.
   - De homepage gebruikt dezelfde aanpak: video op de achtergrond wanneer ingevuld, anders de huidige foto.

4. **Mobiele winkelbalk**
   - Toon onder 768px zodra het bovenste productgedeelte uit beeld is.
   - Neem actuele variantprijs, miniatuur, productnaam, reviewstatus en een amber winkelwagenknop van minimaal 44×44 op.
   - Gebruik exact dezelfde geselecteerde variant en winkelwagenactie als de hoofdknop.

5. **Reviews, aanbevelingen en FAQ**
   - Maak de reviewplaceholder klikbaar naar `#reviews` en geef de bestaande eerlijke reviewsectie dat anker.
   - Vervang de huidige vaste aanbevelingen door drie andere echte producten uit de actuele Shopify-catalogus.
   - Zet “Vaak samen gekocht” onderaan, gevolgd door één compacte FAQ-accordion met vijf vragen over sensor door glas, accu, montage, defect en retour.

6. **Controle en publicatie**
   - Controleer winkelwagenacties, varianten, modalbediening, ankers en foutvrije weergave.
   - Test 390px mobiel en 1440×900 desktop, inclusief zichtbaarheidsgrens van de mobiele balk en videofallback.
   - Bouw één keer en publiceer daarna naar productie.

## Technisch
- Er worden nergens voorraadaantallen of schaarsteclaims getoond. Elk product krijgt dezelfde vaste groene beschikbaarheidsmelding.
- De bestaande Shopify-producten en checkout blijven leidend voor namen, varianten, prijzen en winkelwagenregels.
- De videovelden blijven bewust leeg; invullen activeert de video zonder verdere pagina-aanpassing.
- Geen nieuwe reviewscore of klantclaim: de vijf sterren zijn alleen de gevraagde visuele placeholder naast “Nog geen reviews”.
