# Controle op lekken in de klikroute

Ik heb de hele route nagelopen die iemand aflegt vanaf een advertentie. Hieronder wat ik zag en het enige punt dat nog dichtgezet moet worden.

## Wat goed werkt

Alle vijf producten komen op hun eigen productpagina uit, ook met de oude Shopify-adressen:

- senseglow.shop/products/... gaat naar de juiste productpagina, de klikcode (gclid) blijft bewaard
- checkout.senseglow.shop/products/... gaat naar de juiste productpagina, klikcode blijft bewaard
- de Engelse en Franse versies komen op de juiste vertaalde productpagina uit
- een onbekende productnaam gaat naar het productoverzicht, niet naar de homepage
- oude collectie-adressen gaan ook naar het overzicht
- geen foutmeldingen op de productpagina's

Ik zag dus geen enkel geval waarin een productlink alsnog op de homepage eindigde.

## Het echte lek

In beide Performance Max campagnes staat "uitbreiding van de uiteindelijke URL" aan. Daarmee mag Google zelf een andere pagina kiezen dan de productpagina die jij hebt ingesteld, en in de praktijk kiest Google dan vaak de homepage. Dat verklaart precies wat jij zag toen je op je eigen advertentie klikte.

De ingestelde productlinks zelf kloppen wel: elke assetgroep wijst naar www.senseglow.shop/product/<naam>.

## Wat ik wil aanpassen

Deze instelling uitzetten in beide campagnes:

- SG #1.0 (actief)
- SG #1.5 (gepauzeerd)

Daarna landt elke klik op de productpagina van de assetgroep waar de advertentie bij hoort. Verder verandert er niets aan de campagnes: budget, biedingen en advertenties blijven zoals ze zijn.

## Technisch

Beide campagnes krijgen een update op `asset_automation_settings`, waarbij `FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION` van `OPTED_IN` naar `OPTED_OUT` gaat. `GENERATE_IMAGE_EXTRACTION` blijft ongewijzigd. Je krijgt hiervoor eerst een goedkeuringskaart te zien. Er worden geen bestanden in de site gewijzigd.
