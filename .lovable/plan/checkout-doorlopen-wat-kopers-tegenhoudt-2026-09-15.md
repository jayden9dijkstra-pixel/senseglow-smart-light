# Checkout doorlopen: wat kopers tegenhoudt

Ik heb de hele route nagelopen op een telefoonscherm: productpagina, winkelwagen, afrekenen bij Shopify. De route werkt technisch (klik-informatie van Google komt netjes mee tot in het afrekenen, prijzen kloppen met Shopify, iDEAL, PayPal en Klarna staan er). Er zitten wel een paar duidelijke afhakers in.

## Wat ik zag

1. **De afrekenpagina staat in het Engels.** Een Nederlandse bezoeker krijgt "Contact information", "Delivery", "Pay now". Dit is de grootste afhaker en het is een instelling in Shopify, geen code.
2. **Levertijd staat pas bij de prijs, maar nergens staat dat verzenden gratis is.** In de winkelwagen zie je alleen het totaal, geen regel "Verzending gratis". Mensen verwachten verborgen kosten en haken af.
3. **Vijf gevulde sterren met de tekst "Nog geen reviews".** Dat leest als nul vertrouwen en de gevulde sterren wekken bovendien een verkeerde indruk.
4. **"Bij je thuis binnen 7-14 werkdagen" staat er kaal.** Zonder uitleg voelt dat lang. Zonder "niet goed, geld terug" ernaast is dat een reden om te twijfelen.
5. **De winkelwagen toont geen enkel vertrouwenssignaal.** Retour, garantie en betaalmethoden staan wel op de productpagina, maar verdwijnen precies op het moment van beslissen.
6. **De knop heet "Afrekenen" met een pijl-naar-buiten icoon.** Dat icoon suggereert dat je de site verlaat, wat aarzeling geeft.
7. **De nieuwsbriefmelding zegt "10% korting bij launch".** De winkel is open, dus dit klopt niet meer en ondermijnt geloofwaardigheid.
8. **Geen enkele geruststelling over wie je bent op het beslismoment.** KvK en btw staan alleen in de voettekst.

## Wat ik aanpas op de site

- **Winkelwagen** krijgt onder het totaal een compacte regel met: gratis verzending NL en BE, 30 dagen retour, 1 jaar garantie, en de betaallogo's (iDEAL, PayPal, Klarna, Bancontact). Plus een regel "Verzending gratis" boven het totaal, zodat het totaal het eindbedrag is.
- **Afrekenknop** wordt "Veilig afrekenen" met een slotje in plaats van het pijl-naar-buiten icoon.
- **Sterren op de productpagina**: lege sterren in plaats van gevulde, met de tekst "Nog geen reviews, wees de eerste". Zelfde op de mobiele balk onderaan.
- **Levertijd** wordt overal aangevuld tot "Gratis bezorgd, bij je thuis binnen 7-14 werkdagen".
- **Nieuwsbriefblok**: "bij launch" eruit, tekst wordt "Krijg 10% korting op je eerste bestelling".
- **Mobiele koopbalk** krijgt dezelfde twee vertrouwensregels (gratis verzending, 30 dagen retour) in klein.

## Wat jij in Shopify doet

- **Afrekenen in het Nederlands.** Shopify-beheer → Instellingen → Talen → Nederlands toevoegen en als standaard zetten voor de markt Nederland. Ook Instellingen → Markten → Nederland controleren, zodat de taal automatisch Nederlands is. Zonder dit blijft de afrekenpagina Engels, en dat kan ik hier niet aanpassen.
- **Verzendtarieven controleren**: Instellingen → Verzending, zodat NL en BE echt op 0 euro staan. Anders klopt "gratis verzending" op de site niet.

## Technische details

- `src/components/CartDrawer.tsx`: verzendregel, vertrouwensrij met `PaymentIcons`, knoptekst en icoon.
- `src/components/product/ProductHeroSection.tsx`: sterren zonder vulling, levertijdtekst.
- `src/components/product/MobileAddToCartBar.tsx`: sterren zonder vulling, twee vertrouwensregels.
- `src/components/layout/SiteFooter.tsx`: nieuwsbrieftekst.
- Geen wijziging aan prijzen, kortingscodes, de checkout-link of de Google Ads tracking.
