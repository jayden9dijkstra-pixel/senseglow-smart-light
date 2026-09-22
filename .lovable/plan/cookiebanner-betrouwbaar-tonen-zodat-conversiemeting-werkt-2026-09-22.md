# Cookiebanner betrouwbaar tonen zodat conversiemeting werkt

## Probleem

De banner verschijnt alleen als Shopify's `shouldShowBanner()` `true` teruggeeft. Op deze headless storefront geeft die functie vaak `false`, dus zie je in een incognitovenster geen popup. Gevolg: er wordt nooit een toestemmingskeuze naar Shopify gestuurd, de conversiepixel op checkout.senseglow.shop blijft geblokkeerd, en Google Ads meet geen aankopen.

## Aanpak

De banner stopt met wachten op Shopify's "moet ik tonen"-antwoord en houdt zelf bij of de bezoeker al een keuze heeft gemaakt.

1. **Eigen geheugen voor de keuze.** Bij laden kijkt de banner naar een eigen opgeslagen keuze (localStorage plus een cookie op `.senseglow.shop`, 12 maanden geldig, zodat de afrekenpagina op het subdomein hem ook ziet). Geen keuze gevonden = banner tonen. Wel een keuze = banner overslaan en de keuze alsnog aan Shopify doorgeven, zodat terugkerende bezoekers niet opnieuw hoeven te klikken.
2. **Keuze altijd naar Shopify.** Bij "Alles accepteren" of "Alleen noodzakelijke" wordt de keuze via de bestaande Customer Privacy API (`setTrackingConsent`) naar Shopify gestuurd. Dat deel werkt al; het blijft precies zo.
3. **Google Consent Mode erbij.** De banner stuurt de keuze ook naar de Google-tag (`gtag('consent', 'update', ...)`): bij accepteren gaan `analytics_storage` en `ad_storage` aan, bij weigeren blijven ze uit. Standaard (`default`) staan ze op `denied` zodra de tag laadt, zodat er vóór de keuze niets zonder toestemming meet. Dit is wat Google nodig heeft om conversies te koppelen zodra iemand akkoord is.
4. **Fallback als Shopify's script niet laadt.** De keuze wordt dan alsnog lokaal bewaard en naar Google gestuurd, zodat de banner nooit vastloopt; de Shopify-doorgifte gebeurt bij een volgend bezoek als het script wel laadt.

## Testen

- Incognito openen → banner verschijnt onderaan.
- "Alles accepteren" → banner weg; cookie/localStorage gezet; herladen toont de banner niet opnieuw.
- "Alleen noodzakelijke" → zelfde gedrag, maar `ad_storage`/`analytics_storage` blijven uit.
- Op de afrekenpagina van een testwinkelwagen controleren dat de toestemming meekomt (geen nieuwe balk, consent gedeeld).
- Werkt in NL, EN en FR; teksten van de banner worden meevertaald waar nodig.

## Technische details

- Alleen `src/components/CookieConsentBanner.tsx` en `index.html` (gtag consent default) worden aangepast; eventueel kleine vertaalregels in `src/i18n/en.json` en `src/i18n/fr.json` als de bannertekst meevertaald moet worden.
- Nieuw: `sg_consent` key in localStorage + cookie `sg_consent` op domein `.senseglow.shop`, max-age 12 maanden.
- `index.html`: `gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' })` vóór de bestaande config-regel.
- Bestaande stukken blijven ongewijzigd: de klik-id opslag (gclid), het doorgeven aan de checkout, de banner-styling en de Shopify `setTrackingConsent`-aanroep.
