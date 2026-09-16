# SenseGlow makeover: mokka, oranje en open wit

Alle teksten, vertalingen, pagina's, prijzen, bundels en het afrekenen blijven precies zoals ze zijn. Alleen de look verandert.

## De nieuwe stijl

- Achtergrond: warm gebroken wit, veel lucht tussen de blokken.
- Hoofdkleur: mokkabruin voor tekst, knoppen en lijnen.
- Accent: oranje voor kleine details, vinkjes, pijlen en het bolletje.
- Koppen in een elegante serif, lopende tekst in een rustige schreefloze letter.
- Rustige lijnen in plaats van zware kaders, zachte rondingen, geen glans- of gloedeffecten meer.
- Knoppen worden strakke mokkabruine rechthoeken met een pijl, links krijgen een dunne onderstreping.

## Donkere modus verdwijnt

De site is voortaan altijd licht en open. Het lampknopje in de balk gaat weg. Het beeldwissel-effect dat aan dat knopje hing, vervangen we door het nieuwe voor-en-na beeld hieronder.

## Balk bovenaan

- Smalle mokkabruine aankondigingsbalk met "Gratis verzending in Nederland en België".
- Het brede SenseGlow-woordmerk blijft links staan, met het menu ernaast in de nieuwe letter.
- Het ronde SG-teken wordt het tabbladicoon.

## Voor en na per product

- Per product één schuifbeeld: links de ruimte in het donker, rechts dezelfde ruimte met de lamp aan. Je sleept de greep heen en weer.
- Ik maak de donkere versie van een bestaande productfoto, zodat beide beelden identiek zijn op het licht na.
- Datzelfde beeld komt ook als losse foto in de productgalerij te staan.
- Het bestaande voor-en-na blokje met opsommingen blijft bestaan en krijgt de nieuwe stijl.

## Pagina's die meegaan

Homepage, alle productpagina's, producten, waarom SenseGlow, bundels, quiz, contact, verzending, retour, voorwaarden, privacy, duurzaamheid, bestelling volgen, statistieken, winkelwagen, popups en de voettekst.

## Technische uitvoering

- `src/index.css`: nieuwe tokens in HSL (background cream, foreground mokka, primary mokka, accent oranje, border warm zand). `.dark`-blok en de glas- en gloedutilities vervallen; `--radius` omlaag.
- `tailwind.config.ts`: `darkMode` eruit, nieuwe `fontFamily` voor display en body, `glow`/`brand-amber` tokens hernoemd naar accent maar als alias behouden zodat bestaande klassen blijven werken.
- Fonts via Google Fonts in `index.html` (serif voor koppen, sans voor tekst).
- `ThemeToggle`, de `next-themes`-provider en de thema-scripts in `index.html` worden verwijderd; dit lost meteen de openstaande `useContext`-fout op.
- `DualImage` en de thema-gekoppelde beeldwissel worden vervangen door de nieuwe voor-en-na slider (`BeforeAfterSlider`, muis- en touch-drag, toetsenbordbediening via een range-input, `aria-label`).
- Donkere varianten genereren met `imagegen--edit_image` vanaf bestaande productfoto's, opslaan als CDN-asset-pointers en per product koppelen in `src/lib/productContent.ts`, plus toevoegen aan de galerijlijst.
- `dark:`-klassen in componenten opruimen; sweep met `rg "dark:"` en `rg "glass|glow"`.
- Afsluiten met typecheck, build met prerender en een browsercontrole van homepage, één productpagina, winkelwagen en afrekenen op mobiel en desktop.
