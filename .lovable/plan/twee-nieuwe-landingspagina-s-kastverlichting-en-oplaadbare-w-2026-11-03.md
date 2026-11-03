# Twee nieuwe landingspagina's: /kastverlichting en /oplaadbare-wandlamp

Beide pagina's gebruiken dezelfde opbouw, stijl, aantal-kiezer, tracking (gclid/utm, consent, add_to_cart, checkout-link), "Waarom SenseGlow"-blok en leverdatum als /trapverlichting. Geen nieuwe kortingen, reviews, sterren of timers. Wel in de sitemap, niet in het hoofdmenu.

Alle claims uit de brief staan al in de bestaande productgegevens (sensor 5 m/120°, 3 lichtmodi, magneet + plakstrip, USB-C, "één keer per paar weken" laden; Flex touch-dimmen, warm/koel wit, beugel met schroeven). Er worden dus geen nieuwe specificaties toegevoegd.

## /kastverlichting
- Title, meta description, H1 en intro precies zoals in de brief.
- Productblok: alleen Ambient Motion Bar, standaard 30 cm, 2 lampen voorgeselecteerd, met de prijs per lamp.
- H2 "Waarom in je kast" met de 4 opgegeven bullets.
- H2 "Welke lengte?", als suggestie: 20 cm voor een kastplank of lade, 30 cm voor een standaard kledingkast, 40 cm voor een brede kast of inloopkast.
- Specificatietabel en FAQ van de Ambient (sensor, opladen, bevestigen, levering), net als op de andere pagina's.

## /oplaadbare-wandlamp
- Title, meta description, H1 en intro precies zoals in de brief.
- Productblok: alleen Flex, kleurkeuze wit/zwart, 1 lamp voorgeselecteerd. Daaronder de regel "Twee naast je bed? 2 lampen = 10% korting."
- H2 "Zo werkt hij" met de 4 opgegeven bullets.
- H2 "Waar hang je hem?" met één korte zin per plek: bed (leeslamp), bureau, boekenplank.
- Het woord "sensor" komt nergens voor op deze pagina: de specificatietabel laat de regel "Sensor: Geen" weg en de FAQ-vraag "Heeft de Flex een bewegingssensor?" staat hier niet in. Er komt een test die dit controleert.

## Technische details
- `src/lib/landingPages.ts`: twee nieuwe items. Het type krijgt optionele velden voor een bullet-sectie met eigen titel, een sectie "plekken/lengtes" en een regel onder de kiezer. `LandingPage.tsx` en `scripts/prerender.ts` tonen die, zodat de server-HTML gelijk blijft.
- Routes komen automatisch mee via `LANDING_PATHS`; daarnaast wordt `public/sitemap.xml` bijgewerkt.
- Tests: beide pagina's bestaan, de voorselectie klopt (Ambient 30 cm, 2 lampen; Flex, 1 lamp) en de wandlamppagina bevat geen "sensor" in de gerenderde data.
- Niet publiceren, tenzij je dat vraagt.
