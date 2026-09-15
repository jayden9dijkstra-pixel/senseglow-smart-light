# SenseGlow in Nederlands, Engels en Frans

## Doel
De volledige webshop wordt beschikbaar in drie talen. Nederlands blijft de standaard op de bestaande adressen, Engels komt onder `/en` en Frans onder `/fr`. Nieuwe bezoekers kiezen één keer hun taal in een rustige merk-eigen pop-up; daarna onthoudt de site hun keuze. De lelijke Google Reviews-badge verdwijnt, terwijl Google Ads en alle conversiemeting actief blijven.

## Wat we bouwen

1. **Centrale taalvoorziening**
   - Eén vertaalstructuur voor Nederlands, Engels en Frans, inclusief navigatie, knoppen, formulieren, winkelwagen, meldingen, foutteksten, bundelbouwer en trackingpagina.
   - De bestaande Nederlandse teksten worden de bronteksten; Engelse en Franse vertalingen blijven natuurlijk, formeel en passend bij SenseGlow.
   - Productnamen, prijzen, varianten en voorraadstatus blijven uit Shopify komen. Klantgerichte labels en productbeschrijvingen krijgen per taal een vertaling zonder prijzen of eigenschappen te verzinnen.

2. **Taalroutes en navigatie**
   - Bestaande Nederlandse routes blijven ongewijzigd.
   - Elke openbare pagina krijgt een Engelse en Franse variant onder `/en/...` en `/fr/...`, inclusief productpagina’s, collectie, bundels, bestelling volgen, servicepagina’s en beleidsinformatie.
   - Alle interne links behouden de gekozen taal.
   - In de kop en mobiele navigatie komt een compacte taalwisselaar voor NL, EN en FR.

3. **Eenmalige taalkeuze**
   - Bij het eerste bezoek verschijnt een toegankelijke pop-up met Nederlands, English en Français.
   - De keuze wordt lokaal onthouden; daarna opent de bezoeker meteen in de gekozen taal.
   - De pop-up blokkeert Google-tracking niet en verschijnt niet opnieuw zolang de keuze bewaard is.
   - De bezoeker kan later altijd handmatig wisselen via het menu.

4. **Winkelwagen en afrekenen**
   - Winkelwagen, bundelteksten, validatie en meldingen volgen de gekozen taal.
   - De gekozen taal wordt waar mogelijk doorgegeven aan Shopify Checkout, terwijl Nederlands daar standaard blijft en Engels en Frans beschikbaar blijven.
   - Bestaande prijzen, kortingscodes, winkelwagenlogica, checkout-URL, `gclid`-doorgifte en conversiegebeurtenissen blijven intact.

5. **Vindbaarheid per taal**
   - Titels en metabeschrijvingen worden vertaald per pagina.
   - Canonieke adressen en `hreflang` voor `nl`, `en`, `fr` en `x-default` worden correct gezet.
   - De sitemap en statisch opgebouwde pagina’s krijgen alle taalvarianten, inclusief productpagina’s.
   - Het document krijgt per route de juiste taalcode, zodat zoekmachines en schermlezers de taal herkennen.

6. **Google Reviews-badge verwijderen, conversies behouden**
   - Alleen het zichtbare `merchantwidget`-script en de badge-initialisatie worden verwijderd.
   - De Google Ads-tag `AW-18351813640`, routeweergaves, winkelwagengebeurtenissen, checkout-gebeurtenissen, cross-domain koppeling en opgeslagen klik-ID’s blijven ongewijzigd.
   - De Shopify Google & YouTube-koppeling en aankoopmeting worden niet aangeraakt.

7. **Controle vóór oplevering**
   - Alle routes nalopen in NL, EN en FR op desktop en mobiel.
   - Controleren dat taalkeuze wordt onthouden, links in dezelfde taal blijven en handmatig wisselen werkt.
   - Een product toevoegen, winkelwagen openen en checkout starten in elke taal; prijzen, korting en Google-klikparameters controleren.
   - Bevestigen dat de Google Reviews-badge nergens meer zichtbaar is en dat de Google Ads-tag en conversiegebeurtenissen nog laden.
   - Controleren op ontbrekende vertalingen, horizontale verschuivingen, afgekapt Frans en fouten in de browser.

## Technische aanpak
- Een kleine locale-provider en vertaalcatalogi, zonder bestaande product- of betaalgegevens te dupliceren.
- Een locale-bewuste route- en linklaag die het huidige pad tussen NL, EN en FR omzet.
- Vertaalde SEO-data, meertalige prerender-routes en sitemap-items.
- De eerste-keuze-pop-up gebruikt lokale opslag; geen account of extra klantgegevens nodig.
