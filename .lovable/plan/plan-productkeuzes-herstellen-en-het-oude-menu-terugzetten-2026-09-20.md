# Plan: productkeuzes herstellen en het oude menu terugzetten

## Doel
Klanten moeten bij ieder product altijd de beschikbare maat, kleur of uitvoering kunnen kiezen voordat ze bestellen. Tegelijk gaat de desktopnavigatie terug naar de eerdere indeling zonder driepuntjesknop, terwijl mobiel overzichtelijk onder het menu-icoon blijft.

## Bevestigde oorzaak
De winkelkoppeling levert de varianten nog correct en alle huidige varianten zijn bestelbaar. De keuzeknoppen ontbreken nu bij drie producten omdat de site hun actuele optievelden niet goed uitleest:

- Ambient Motion Bar: `Kleur en maat`, met 20, 30 en 40 cm in zilver of zwart
- Wave: `Kleur en maat`, met 30 en 50 cm in wit of zwart
- Flex: `Kleur`, met wit of zwart
- Wall Lamp en Solar Lantern tonen hun huidige keuzes wel

Dit wordt in de gedeelde keuzelogica opgelost, zodat dezelfde fout niet per product opnieuw kan ontstaan.

## Aanpassingen
1. **Alle productkeuzes herstellen**
   - De keuzelogica herkent losse én gecombineerde Shopify-opties, inclusief `Kleur en maat`, Nederlandse kleurwaarden en schrijfwijzen met een spatie voor `cm`.
   - Ambient toont 20, 30 en 40 cm plus zilver en zwart.
   - Wave toont 30 en 50 cm plus wit en zwart.
   - Flex toont wit en zwart.
   - Wall Lamp en Solar Lantern behouden hun werkende keuzes.
   - De gekozen combinatie bepaalt aantoonbaar de juiste prijs, variant en regel in de winkelwagen.
   - Dezelfde werkende keuzes blijven beschikbaar in de bundelsectie, met alleen varianten die voor die bundel geldig zijn.

2. **Desktopmenu terug naar de eerdere indeling**
   - De driepuntjesknop verdwijnt volledig.
   - De eerdere groepen keren terug: **Voor thuis**, **Voor buiten** en **Voor werk**.
   - Producten worden weer onder de juiste groep getoond.
   - **Waarom SenseGlow** en **Service** blijven apart staan.

3. **Mobiel menu rustig en gesorteerd maken**
   - Alles blijft bereikbaar via de drie streepjes.
   - Links worden zichtbaar gegroepeerd in Producten, Over SenseGlow en Service, in plaats van één lange ongestructureerde lijst.
   - **Bekijk alle producten** staat boven de losse productlinks.
   - De indeling werkt hetzelfde in Nederlands, Engels en Frans.

4. **Herhaling voorkomen**
   - Voeg gerichte controles toe voor het uitlezen van de echte variantnamen van alle vijf producten.
   - Controleer dat iedere zichtbare keuze na aanklikken ook echt de bijbehorende Shopify-variant selecteert.
   - Verwijder geen keuzeknoppen op basis van producttype wanneer er meerdere bestelbare varianten bestaan.

## Controle vóór afronding
- Test alle vijf productpagina’s op desktop en mobiel.
- Kies bij Ambient, Wave, Wall Lamp, Solar Lantern en Flex iedere maat/kleurcombinatie en voeg deze toe.
- Controleer in de winkelwagen dat titel, maat, kleur, aantal en prijs overeenkomen met de gekozen variant.
- Herhaal de belangrijkste kooproute in Nederlands, Engels en Frans.
- Controleer de bundelkeuzes afzonderlijk zodat een gekozen variant niet stil wordt vervangen.
- Controleer desktopmenu, mobiel menu, horizontaal schuiven en browserfouten.
- Voer de bestaande type- en bouwcontroles uit.

## Afbakening
Prijzen, kortingscodes, checkout, advertentielinks en teksten buiten de navigatie en productkeuzes blijven ongewijzigd.
