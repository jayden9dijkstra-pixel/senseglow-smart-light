# SenseGlow herstel: catalogus, reviews, transparantie

## Wat het onderzoek nu al aantoont

- **/producten is niet leeg voor bezoekers.** Live test met een echte browser: de pagina toont alle 5 producten, 5 werkende productlinks, geen fouten. De winkel levert ook precies 5 producten: Ambient Motion Bar, Wave, Wall Lamp, Solar Lantern, Flex.
- **Maar in de kant-en-klare paginabron staat de lijst niet.** `/producten` wordt vooraf gebouwd zonder producten, terwijl productpagina's dat wél hebben. Wie de pagina beoordeelt zonder scripts (zoals een controle-robot) ziet dus een lege collectie. Dat is de waarschijnlijke bron van de melding.
- **Alle reviews op de site zijn testreviews van vrienden/familie**, verspreid over vijf plekken: de homepage-carrousel, de sfeersectie, de reviewsectie op productpagina's, de losse teksten in het productbestand, en de "4.7/5" met sterren op de productkaart.
- **Bedrijfsgegevens staan er al** (Jayden Ecom, KvK 99634929, BTW NL005399692B39, Kimswerd). Wel spreken de pagina's elkaar tegen over verzending: "magazijn buiten Nederland", "logistiek partner in Europa", "1-3 werkdagen verzenden, 7-14 dagen bezorgen", en elders 5-10 dagen.
- **Toegang tot je Shopify-beheer is verlopen** en Merchant Center kan ik niet inzien. De 32 artikelen kan ik daardoor niet zelf nakijken.

## Wat ik ga doen

### 1. Catalogus ook zichtbaar in de kale paginabron
De vooraf gebouwde versie van `/producten` en de homepage krijgt de echte productlijst mee (naam, foto, vanaf-prijs, link), opgehaald bij het bouwen uit de winkel. Bezoeker en robot zien dan hetzelfde.

### 2. Eerlijk onderscheid laden / fout / leeg
Nu wordt elke mislukte aanvraag getoond als "Geen producten gevonden". Dat wordt: laden, of een duidelijke foutmelding met opnieuw-proberen, of pas bij een echt lege winkel de melding "geen producten".

### 3. Alle niet-echte reviews weg
Volledig verwijderd uit de pagina's, niet verborgen:
- homepage-carrousel met testimonials
- sfeersectie met sterren en citaten
- reviewsectie op alle vijf productpagina's
- alle reviewteksten in het productbestand
- de "4.7/5" en sterrenrij op productkaarten
De oorspronkelijke teksten bewaar ik in één intern bestand dat niet op de site komt. Er komt geen enkel cijfer of ster voor in de plaats, en ook geen review-gegevens in de gestructureerde data (die staan er nu al niet in — ik controleer dat opnieuw na de wijziging). Op productpagina's komt een neutrale plek: "Nog geen klantreviews."

### 4. Verzendinformatie gelijktrekken
Eén set feiten op verzendpagina, voorwaarden, over-ons, footer en productpagina's. Ik gebruik alleen wat jij bevestigt (zie vragen hieronder) en verwijder tegenstrijdige zinnen. "Gratis verzending" blijft alleen staan als dat echt zo is.

### 5. Vertrouwensclaims controleren
Ik loop alle badges, urgentieteksten, kortingsclaims en tellers na en verwijder wat niet aantoonbaar is. Betaalmethoden blijven alleen als ze in de kassa echt worden aangeboden.

### 6. Contactformulier echt laten bezorgen
De knop opent nu de mailapp van de bezoeker; er wordt niets verstuurd als dat mislukt. Ik maak er een echt formulier van dat het bericht per e-mail naar support@senseglow.shop stuurt via de backend, met een eerlijke fout- en succesmelding.

### 7. Technische controle en bewijs
Ik test op mobiel en desktop: /producten en de vijf productpagina's direct openen en verversen, variant kiezen, in winkelwagen, doorgaan naar de kassa (zonder te betalen), links, afbeeldingen, doorverwijzing van senseglow.shop naar www, en of titels/prijzen in de gestructureerde data overeenkomen met het zichtbare. Ik lever schermafbeeldingen en een tabel: probleem, oorzaak, oplossing, geteste link, resultaat.

## Wat ik niet doe

- Geen verzonnen reviews, keurmerken, voorraad, levertijden of artikelcodes.
- Geen 32 losse producten aanmaken.
- Geen wijzigingen in Merchant Center of Shopify-instellingen (geen toegang).

## Technisch

- `scripts/prerender.ts`: producten ophalen bij build en de kaartenlijst in de HTML van `/` en `/producten` schrijven.
- `src/lib/shopify.ts`: `fetchProducts` geeft fouten door in plaats van een lege lijst; `Catalog.tsx` en `Index.tsx` krijgen drie toestanden.
- Reviews verwijderen uit `ReviewsTeaserSection.tsx`, `LifestyleSection.tsx`, `ProductReviewsSection.tsx`, `ProductCard.tsx`, `productContent.ts`; archief in `src/lib/_internal/legacy-testreviews.ts` (niet geïmporteerd).
- Contact: backend-functie `send-contact` met Resend, aangeroepen vanaf `Contact.tsx`.

## Vragen die ik van jou nodig heb

1. Wat is de echte levertijd (verwerken + bezorgen) en vanaf waar wordt verzonden?
2. Is verzending werkelijk gratis, en alleen naar Nederland?
3. Retouren: termijn, wie betaalt de retourkosten, en naar welk adres?
4. Wil je dat ik je Shopify-beheer opnieuw koppel, zodat ik de 32 artikelen kan nakijken? Zo niet, stuur dan een export of schermafbeelding van de afkeuringsmeldingen.
5. Voor het contactformulier heb ik een verzendsleutel van een e-maildienst nodig (bijvoorbeeld Resend) — akkoord?
