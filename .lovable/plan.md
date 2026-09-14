# Bestelling opzoeken werkend maken

Het toegangstoken werkt nu: de verbinding met je winkel is gelukt en bestellingen mogen worden gelezen. Bij het testen kwamen twee echte problemen boven.

## Wat er mis is

**1. Het bestelnummer klopt niet met je winkel.** De zoekfunctie zoekt naar nummers in de vorm `#SG1042`. Je winkel geeft bestellingen echter nummers als `#1003`. Zoeken op `#SG1003` levert dus nooit iets op, ook niet voor je eigen testbestelling.

**2. Je testbestelling heeft geen e-mailadres.** Bestelling `#1003` staat in de winkel zonder e-mailadres en zonder klant. Omdat het e-mailadres de enige beveiliging van de pagina is, kan zo'n bestelling per definitie niet worden opgezocht. Dat is bedoeld gedrag, geen fout.

## Wat ik ga aanpassen

- Het bestelnummer wordt niet meer vastgeklonken aan `SG`. De klant mag `#1003`, `1003`, `SG1003` of `#SG1003` invullen; er wordt gezocht op de cijfers, en zowel op `#<cijfers>` als op de variant met voorvoegsel. Zo blijft het werken als je later een voorvoegsel in Shopify instelt.
- Het voorbeeld in het invulveld en de hulptekst worden aangepast naar de nummers die jouw winkel echt uitgeeft (`#1003`).
- Als een gevonden bestelling geen e-mailadres heeft, blijft het antwoord "niet gevonden" (zonder verschil in reactie, zodat niemand kan uitvissen welke bestellingen bestaan).
- De foutmelding bij "niet gevonden" krijgt een extra zin: controleer of je het e-mailadres gebruikt waarmee je hebt besteld.

## Wat jij nog moet doen om te testen

Maak een testbestelling mét e-mailadres. In Shopify-beheer: Bestellingen, dan Concept aanmaken, artikel toevoegen, bij Klant een e-mailadres invullen, en daarna Markeren als betaald. Geef me het nummer en het e-mailadres, dan controleer ik de hele pagina van zoeken tot statusweergave.

## Technische details

- `supabase/functions/order-lookup/index.ts`: `normalizeOrderNumber` levert voortaan de losse cijfers; de Shopify-query wordt `name:#<cijfers> OR name:#SG<cijfers>` gecombineerd met de e-mailfilter, en het resultaat wordt nog steeds gecontroleerd op exacte (hoofdletterongevoelige) e-mailmatch. Bestellingen zonder e-mailadres leveren `404 {found:false}`.
- `src/pages/OrderTracking.tsx`: dezelfde soepele normalisatie aan de invoerkant, aangepaste placeholder en hulptekst, aangevulde tekst bij niet gevonden.
- Rate limit, logging in `order_lookups` en CORS blijven ongewijzigd.
