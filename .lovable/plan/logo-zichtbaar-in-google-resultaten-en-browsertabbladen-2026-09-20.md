# Logo zichtbaar in Google-resultaten en browsertabbladen

## Probleem
Bij de zoekresultaten van senseglow.shop staat een grijze wereldbol in plaats van het SG-logo. De huidige favicon is 512x512 pixels. Google accepteert alleen iconen waarvan het formaat een veelvoud van 48 is (48x48, 96x96, 144x144). 512 valt daar buiten, dus negeert Google het icoon en toont hij de standaard wereldbol. Het transparante logo is bovendien nauwelijks zichtbaar in donkere browsers, zoals op je eigen screenshot te zien is.

## Oplossing
1. **Nieuwe icoonset maken van het SG-logo**
   - `public/favicon.ico` (klassiek formaat dat Google altijd oppakt)
   - `public/favicon-48.png`, `public/favicon-96.png`, `public/favicon-144.png` (exacte Google-formaten)
   - `public/apple-touch-icon.png` (180x180, voor iPhone-bladwijzers)
   - Het logo krijgt op deze kleine formaten een gevulde mokka-achtergrond met witte SG-letters en het oranje stipje, zodat het op lichte én donkere schermen duidelijk zichtbaar is. Dit is alleen het icoon; het grote logo in de header blijft ongewijzigd.
2. **`index.html` bijwerken**: de nieuwe iconen aanmelden met de juiste `sizes`-vermeldingen zodat elke browser en Google het beste formaat kiest.
3. **Controle**: Playwright-check dat elke pagina (NL, EN, FR) de nieuwe iconen aanbiedt en dat de bestanden via de live URL bereikbaar zijn.

## Wat daarna nog nodig is (jouw stap)
Google slaat het icoon op in zijn eigen geheugen. Nadat de site gepubliceerd is, kan het enkele dagen tot twee weken duren voor het logo in de zoekresultaten verschijnt. Je kunt dit versnellen via Google Search Console: plak daar `https://www.senseglow.shop` in de zoekbalk bovenaan en kies "Indexering aanvragen".

## Technische details
- Bronbestand: bestaand `public/favicon.png` (SG-logo), verkleind met PIL naar de genoemde formaten op een mokka (#6B4F3A) achtergrond.
- Alleen `index.html` en nieuwe bestanden in `public/` worden aangepast; geen tekst, vertalingen of pagina's wijzigen.
