# Branded pagina "Volg je bestelling"

Een eigen trackingpagina waar klanten met ordernummer en e-mailadres de status van hun bestelling zien. Vervangt de doorverwijzing naar 17TRACK.

## Pagina en routes

- Nieuwe pagina op `/volg-je-bestelling`, ook bereikbaar via `/track`.
- De bestaande pagina `/bestelling-volgen` (nu alleen een 17TRACK-knop) wordt vervangen door dezelfde nieuwe pagina, zodat oude links blijven werken.
- Footer onder "Klantenservice": link heet voortaan "Waar is mijn pakket?" en wijst naar de nieuwe pagina.
- Titel "Volg je bestelling · SenseGlow" met Nederlandse beschrijving; pagina wordt meegenomen in de vaste paginalijst voor Google.

## Wat de klant ziet

**Zoekformulier (start)** — smalle kaart, woordmerk bovenaan, velden Ordernummer en E-mailadres, knop "Bekijk status". Ordernummer mag als `#SG1042`, `SG1042` of `1042` worden ingevuld en wordt automatisch omgezet. Foutmeldingen staan in rood onder het veld. Onderaan: "Geen ordernummer? Kijk in je bevestigingsmail van SenseGlow."

**Laden** — skeleton in amber tint.

**Status gevonden** — bredere kaart met ordernummer, besteldatum (14 september 2026), statusbadge (Bestelling ontvangen grijs, In voorbereiding amber, Verzonden/Onderweg/Afgeleverd groen), horizontale stapindicator met vier stappen. Daaronder links de bestelde artikelen met thumbnail, variant, aantal en totaal; rechts verzendmethode, track & trace (link of "Wordt binnenkort toegevoegd"), geschatte levering als bereik van besteldatum plus 7 tot 14 werkdagen, en het bezorgadres. Zonder trackingcode: "Je bestelling is bevestigd en wordt door onze leverancier voorbereid. Je track & trace verschijnt hier binnen 48 uur." Onderaan een blok "Vragen?" met support@senseglow.shop. Bovenaan een knop om opnieuw op te halen.

**Niet gevonden** — "We kunnen deze bestelling niet vinden. Controleer of je ordernummer en e-mailadres kloppen. Nog steeds problemen? Mail support@senseglow.shop."

Mobiel eerst, amber focusringen, labels gekoppeld, statuswisseling wordt voorgelezen door schermlezers. Analytics: paginaweergave plus events voor gevonden en niet gevonden.

## Achterkant

Een beveiligde serverfunctie `order-lookup` haalt de bestelling bij Shopify op met het bestaande admin-token; dat token blijft op de server. De functie:

- accepteert ordernummer en e-mail, valideert de invoer;
- staat maximaal 10 aanvragen per IP per minuut toe;
- zoekt de order via de Shopify Admin GraphQL-query uit de opdracht;
- geeft alleen resultaat als het e-mailadres exact overeenkomt (hoofdletterongevoelig), anders altijd "niet gevonden" (geen 403, zodat niemand kan aftasten welke orders bestaan);
- stuurt alleen de velden terug die de pagina toont: geen klantgegevens buiten naam en adres, geen kortingscodes, geen interne notities;
- legt elke zoekopdracht vast (ordernummer, IP, tijdstip) in een nieuwe tabel `order_lookups` voor misbruikdetectie;
- accepteert aanvragen van senseglow.shop, www.senseglow.shop en de preview-omgeving.

## Technische details

- `src/pages/OrderTracking.tsx` vervangt `src/pages/Tracking.tsx`; routes in `App.tsx` voor `/volg-je-bestelling`, `/track` en `/bestelling-volgen`.
- `supabase/functions/order-lookup/index.ts`, Shopify Admin API 2025-07, token uit `SHOPIFY_ACCESS_TOKEN` (al aanwezig) en winkeldomein uit de projectinstelling; ontbreekt er een waarde, dan wordt die alsnog gevraagd.
- Migratie voor `order_lookups` (id, order_number, ip, created_at) met RLS aan, alleen schrijfbaar door de serverfunctie.
- Rate limit in het geheugen van de functie-instantie.
- Kleuren, hoeken en typografie via de bestaande tokens, geen harde kleurcodes in componenten.

## Buiten scope (v1)

Geen 17TRACK/AfterShip, geen sms, geen chat, geen automatische verversing, geen deelknop.

## Openstaand

De bestelbevestigingsmail wordt door Shopify verstuurd en kan hier niet aangepast worden. Na oplevering lever ik de linktekst aan die je zelf in de Shopify e-mailsjabloon kunt plakken.
