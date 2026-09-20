# Klikherkomst meenemen naar de afrekenpagina

Doel: elke bezoeker die via een advertentie of campagnelink binnenkomt, neemt die herkomst mee tot in de Shopify-afrekenpagina, zodat een bestelling aan de juiste bron gekoppeld wordt.

## Wat er nu al staat

- De klik-ids `gclid`, `gbraid` en `wbraid` worden bij binnenkomst opgeslagen (90 dagen, browseropslag plus cookie op `.senseglow.shop`).
- De afrekenlink die de site aanmaakt krijgt die klik-ids er al aan geplakt.
- Het signaal `begin_checkout` wordt al verstuurd bij het klikken op afrekenen, met bedrag, valuta en artikelen.

## Wat er misgaat

- UTM-parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) worden nergens bewaard of meegestuurd.
- De laatst gemaakte afrekenlink blijft in de browser bewaard. Een oude link uit een eerder bezoek, zonder herkomstgegevens, kan daardoor opnieuw gebruikt worden. Dat verklaart de waargenomen link zonder enige parameter.

## Wat we aanpassen

1. **Campagnegegevens bewaren.** Naast de klik-ids ook de vijf UTM-waarden opslaan, met dezelfde bewaartermijn. Een bestaande waarde wordt alleen overschreven door een nieuwe, niet-lege waarde.
2. **Alles meesturen naar afrekenen.** De afrekenlink krijgt alle bewaarde waarden mee die gevuld zijn. Lege waarden worden nooit toegevoegd.
3. **Geen oude link meer hergebruiken.** De afrekenlink wordt niet langer in de browser bewaard, en vlak voor het doorsturen worden de herkomstgegevens nog één keer aangevuld. Zo kan er nooit een kale link naar de afrekenpagina gaan.
4. **Meting controleren.** Nagaan dat het afreken-signaal met het juiste bedrag en de juiste artikelen vertrekt.

## Controle achteraf

- Productpagina openen met `?gclid=ABC123&utm_source=google&utm_medium=cpc&utm_campaign=sg`, toevoegen aan winkelwagen, afrekenen: alle waarden staan in het adres van de afrekenpagina.
- Hetzelfde vanuit een bundelblok.
- Bezoek zonder herkomst: afrekenen werkt gewoon, geen lege parameters, geen foutmeldingen.
- Het afreken-signaal staat met bedrag en artikelen in de meting.

## Daarna (jouw stap)

Plaats een testbestelling via een link met `?gclid=...` en kijk in Shopify bij die bestelling of de klantreis nu gevuld is. Pas als dat klopt heeft het zin om de conversieactie in Google Ads opnieuw te beoordelen. Bestelling #1005 is niet met terugwerkende kracht toe te wijzen.

## Technische details

- `src/lib/adsTracking.ts`: `CLICK_ID_KEYS` uitbreiden met de vijf UTM-sleutels (aparte lijst `ATTRIBUTION_KEYS`); `captureClickIds()` slaat lege waarden niet op en overschrijft bestaande niet met leeg; `appendClickIdsToUrl()` loopt over `ATTRIBUTION_KEYS` via `URLSearchParams.set`, met behoud van de bestaande `_gl` linkerparameter en de 300ms-timeout.
- `src/stores/cartStore.ts`: `checkoutUrl` uit `partialize` halen zodat er niets blijft hangen in `shopify-cart`.
- `src/components/CartDrawer.tsx`: vlak voor `checkoutWindow.location.href` / `window.location.assign` de URL nog door `appendClickIdsToUrl` halen (idempotent).
- `src/lib/shopify.ts` blijft ongewijzigd behalve dat het al `appendClickIdsToUrl` aanroept.
- Geen wijziging aan prijzen, bundels, kortingscodes of teksten.
