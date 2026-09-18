# Advertentieklikken naar het juiste product, en Google-reviews voorbereiden

Ik heb het lek live gevonden en na kunnen meten. Dit is geen fout in je site.

## Wat er precies gebeurt

Je Shopping-advertenties sturen mensen naar de Shopify-winkelpagina, bijvoorbeeld
`checkout.senseglow.shop/products/senseglow_wave`. Die pagina stuurt bezoekers automatisch door
naar je winkel, maar gebruikt daarvoor nog het tijdelijke adres `go.to.lovable.app`. Ik heb dat
adres met het product erin opgevraagd: het antwoordt letterlijk met een doorverwijzing naar
`https://www.senseglow.shop/` en gooit het product weg. Iedereen belandt dus op de voorpagina.

Dat verklaart ook de cijfers die je ziet: `checkout.senseglow.shop` staat met 88 bezoeken als
tweede verkeersbron in je statistieken. Dat zijn geen mensen die afrekenen, dat zijn
advertentieklikken die via die kapotte doorverwijzing op je voorpagina worden gedumpt.

Verder getest en in orde bevonden, zodat je weet dat daar geen tweede lek zit:

- Winkelwagen en afrekenen werken. Ik heb een echte winkelwagen aangemaakt met 2x Wave: totaal
  69,90 euro, met kortingscode SG-PACK-2 wordt dat 62,91 euro. De code wordt door Shopify als
  geldig geaccepteerd, dus het verwijderen van de oude bundelvarianten heeft niets stukgemaakt.
- `www.senseglow.shop/products/senseglow_wave` komt gewoon op de Wave-pagina uit.

## Stap 1: het doorstuuradres, opgelost en nagemeten

Je hebt het adres in het thema op `senseglow.shop` gezet. Ik heb het net voor alle vijf producten
nagemeten en het klopt nu: `checkout.senseglow.shop/products/senseglow_wave` komt uit op
`www.senseglow.shop/products/senseglow_wave`, met het product erin, en die pagina opent de
Wave-productpagina. Het pad verdwijnt niet meer. Dit hoeft dus niets meer.

## Stap 2: campagne weer aanzetten

SG #1.0 loopt al. SG #1.5 staat op pauze. Zeg je dat ik hem weer aan mag zetten, dan doe ik dat
met een bevestigingsscherm; anders laat ik hem staan.

## Stap 3: alle bundelkortingen nameten

Ik reken elke bundel na tegen Shopify zelf: per product en per staffel maak ik een echte
winkelwagen aan en kijk of de code geldig is en het juiste bedrag eraf gaat. Dat gaat om
SG-PACK-2, SG-PACK-3, SG-PACK-4 en SG-WALL-2X8. Wat niet klopt, meld ik je met het exacte bedrag,
en waar nodig zet ik de code in Shopify goed.

## Stap 4: Google-reviews voorbereiden

Google stelt twee eisen die nu nog niet gehaald worden, en allebei liggen ze in Shopify:

1. De winkelwagen en het afrekenen op hetzelfde domein. Dat klopt al, beide staan op
   `checkout.senseglow.shop`.
2. De bevestigingspagina op je eigen domein. Dat klopt nog niet. Op je eigen schermafbeelding
   meldt Shopify dat de bevestigingspagina nog op `shopify.com` draait. Klik daar op
   "Change your customer accounts domain" en zet hem op `senseglow.shop`.

Daarna lever ik je de opt-in-code met jouw winkelnummer 5829605850 erin, met de bestelling,
het e-mailadres, het land en de verwachte bezorgdatum automatisch ingevuld door Shopify. Die code
plak je bij Instellingen → Checkout → Aanvullende scripts op de bestelbevestiging. Ik zet de
volledige tekst klaar zodat je hem alleen hoeft te kopiëren. Heb je zelf al een code klaarstaan,
stuur hem dan, dan gebruik ik die.

## Technische details

- Het doorstuurscript in de Shopify-pagina leest `storefrontConfigHostname` en vervangt alleen de
  hostnaam; het pad blijft dus wel staan. Het verlies gebeurt daarna: `go.to.lovable.app` geeft
  `302 → https://www.senseglow.shop/` zonder pad, ongeacht het gevraagde pad. Alleen de
  hostnaam-instelling aanpassen lost het op.
- De bundelcontrole loopt via `cartCreate` op de Storefront API met `discountCodes` en
  `buyerIdentity.countryCode: NL`, en vergelijkt `cost.totalAmount` met de prijs die de site toont.
- De review-opt-in wordt `platform.js` met `gapi.surveyoptin.render`, waarin `order_id`,
  `email`, `delivery_country` en `estimated_delivery_date` uit Liquid komen.
- Geen wijzigingen aan de vormgeving, teksten of vertalingen.
