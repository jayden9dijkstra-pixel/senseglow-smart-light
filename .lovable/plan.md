# Volledige controle van de verkoopflow

Doel: één complete doorloop van advertentie tot betaling, met een lijst van wat goed staat en directe reparatie van wat lekt. Teksten, prijzen en vormgeving blijven zoals ze zijn, tenzij er een fout uit de controle komt.

## 1. Advertentie naar productpagina
- Voor elk van de vijf producten de echte klik nabootsen: advertentielink, oude Shopify-link en de Franse/Engelse variant.
- Controleren dat de bezoeker op de juiste productpagina landt, dat de kliksleutel (gclid) bewaard blijft en dat er geen tussenstap naar de homepage zit.
- In Google Ads nalopen: eindbestemmingen per assetgroep, de uitgeschakelde URL-uitbreiding, en of de productfeed in Merchant Center dezelfde adressen gebruikt.

## 2. Productpagina en bundels
- Per product: afbeeldingen, sterren, bundelkaarten, voor-en-na, veelgestelde vragen.
- Alle elf bundelcombinaties narekenen tegen de kortingscodes in Shopify.
- Controleren dat de gekozen maat/kleur meegaat naar de winkelwagen en na herladen blijft staan.

## 3. Winkelwagen en afrekenen
- Toevoegen, aanpassen en verwijderen testen, inclusief de teller in de header.
- Afrekenen openen en controleren: juiste producten, juiste korting, juist land, iDEAL zichtbaar voor Nederland en België.
- Controleren dat het afrekentabblad ook opent als de browser pop-ups blokkeert.

## 4. Meting
- Controleren dat productweergave, toevoegen aan winkelwagen en afrekenen starten écht bij Google aankomen.
- Nagaan of de aankoopmeting vanuit Shopify binnenkomt en niet dubbel telt.

## 5. Talen en techniek
- Nederlands, Engels en Frans op ontbrekende of verkeerde vertalingen in de koopflow.
- Foutmeldingen in de browser, laadsnelheid van de eerste pagina en de mobiele weergave.

## Uitkomst
Een korte rapportage per onderdeel met status, plus reparatie van alles wat in de site zelf mis is. Wat alleen in Shopify of Google Ads instelbaar is, krijg je als concrete stappenlijst.

## Technische aanpak
- Playwright-doorloop tegen de draaiende app voor route-, variant-, winkelwagen- en checkoutcontrole, met console- en netwerklog.
- Shopify Storefront `cartCreate` met echte varianten en kortingscodes per bundel om bedragen te verifiëren.
- Shopify Admin en Google Ads via de connectors alleen lezen, tenzij er een instelling aantoonbaar fout staat.
- Typecheck, build en prerender als sluitstuk.
