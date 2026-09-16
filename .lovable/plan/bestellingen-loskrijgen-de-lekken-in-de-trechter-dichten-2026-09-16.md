# Bestellingen loskrijgen: de lekken in de trechter dichten

Wat ik heb nagekeken (live, vandaag):

- **Productlinks van Google landen op de homepage.** Bevestigd: de Shopify-winkelpagina `checkout.senseglow.shop/products/<handle>` stuurt bezoekers door met hetzelfde pad naar het Lovable-adres. Ons eigen adres is `/product/<handle>` (enkelvoud), dus `/products/<handle>` bestaat niet en de bezoeker eindigt op de homepage. De canonical van die Shopify-pagina wijst bovendien naar een `go.to.lovable.app`-adres in plaats van naar `www.senseglow.shop`.
- **"Add to cart" op /en/ werkt wél.** Getest op de live Engelse productpagina: het artikel komt in de winkelwagen en de teller springt naar 1. Wat er misgaat is de terugkoppeling: de winkelwagen schuift niet open en het melding-blokje rechtsonder blijft Nederlands ("Toegevoegd aan winkelwagen"). Dat voelt als "er gebeurt niets".
- **De Nederlandse productpagina is nu volledig Nederlands.** Getest met een Nederlandse en een Engelse browser: geen Engelse teksten meer op `/product/senseglow_wall_lamp`. Wat jij zag komt vermoedelijk doordat je browser eerder Engels onthouden had of zelf vertaalde. Onbevestigd, dus ik zet er een controle op.
- Punten 4, 5 en 6 (Shop Pay-omleiding, volgorde van betaalmethoden, naam en datums van de verzendmethode) zitten volledig in Shopify Beheer. Daar kan ik van hieruit niets aan wijzigen; ik zet de exacte stappen voor je op een rij.

## Wat ik ga bouwen

### 1. Productlinks vangen (grootste lek)

Nieuwe routes `/products/:handle`, `/en/products/:handle` en `/fr/products/:handle` die direct doorsturen naar de juiste productpagina, met behoud van alle vragen in het adres (gclid en dergelijke). Een onbekende handle gaat naar de productenpagina in plaats van de homepage.
Ook `/nl/...` (nu een 404) stuurt door naar dezelfde pagina zonder taalvoorvoegsel, en `/collections/...` en `/pages/...` gaan naar een zinnige pagina in plaats van 404.

Daarnaast controleer ik voor alle vijf producten dat de eindbestemming exact deze vorm heeft:
`https://www.senseglow.shop/product/<handle>`, bijvoorbeeld `be`.  
Ik lees de handles op bij Shopify, vergelijk ze met de adressen die de site gebruikt en met de eindbestemming in Google Ads, en meld je per product of het klopt. Waar ik de eindbestemming in Google Ads zelf kan zetten doe ik dat na jouw akkoord; de feedlink vanuit Merchant Center blijft een instelling in Shopify die jij bevestigt.

### 2. Zichtbare bevestiging bij "in winkelwagen"

De winkelwagen schuift voortaan open zodra er iets is toegevoegd, in alle drie de talen. De meldingsteksten en de knopteksten in de winkelwagen krijgen een Engelse en Franse vertaling, zodat er niets meer in het Nederlands blijft staan.

### 3. Taalkeuze eerlijk maken

Het onthouden van een eerdere taalkeuze stuurt niet meer stilletjes om bij bezoekers die via een advertentie of Google op een Nederlands adres binnenkomen; alleen wie zelf in de taalkiezer wisselt, blijft in die taal. Dat voorkomt half-vertaalde indrukken en verkeerde landingspagina's.

### 4. Winkelwagenteller

Nakijken en herstellen dat de teller op 0 valt zodra de laatste regel weg is.

### 5. Levertijd één verhaal

De site belooft 7-14 werkdagen, de checkout toont een bereik van ongeveer drie weken. Ik zet de site op dezelfde belofte als Shopify zodra jij mij de juiste levertijd doorgeeft, of ik pas de tekst aan naar de datums die Shopify toont.

## Wat jij in Shopify moet doen (ik kan daar niet bij)

1. **Betalingen → Shop Pay:** de automatische doorverwijzing naar Shop Pay uitzetten; die slaat iDEAL over en laat alleen creditcard zien.
2. **Betalingen → volgorde:** iDEAL bovenaan slepen, Klarna onderaan.
3. **Verzending:** de methode "Express International" hernoemen naar iets als "Gratis bezorging" en het bezorgbereik gelijktrekken met 7-14 werkdagen.
4. **Merchant Center / Google Ads:** na mijn fix de feedlinks controleren; ze mogen naar `www.senseglow.shop/product/<handle>` wijzen.
5. **Advies:** zet Performance Max op pauze of halveer het budget tot punt 1 live staat.

## Technische details

- Routes worden toegevoegd in `src/App.tsx` met een kleine `LegacyRedirect`-component die `useParams` + `location.search` combineert en `<Navigate replace>` teruggeeft.
- `useCartStore.addItem` en `addBundleItems` krijgen een `openCart`-vlag in de store; `CartDrawer` leest die en opent het paneel.
- Vertaalsleutels voor winkelwagen- en meldingsteksten komen in `src/i18n/en.json` en `src/i18n/fr.json`; toastteksten gaan door `t()` in plaats van via de DOM-vertaler.
- Het redirect-effect in `src/i18n/I18nProvider.tsx` wordt beperkt tot bezoeken zonder verwijzende advertentieparameters en zonder externe verwijzer.
- Na afloop: typecheck, build met prerendering, en een browsercontrole van `/products/<handle>` → `/product/<handle>`, van de openende winkelwagen in NL/EN/FR en van de teller op 0.

## Nog niet in deze ronde

Reviews verzamelen, Klaviyo-flows (verlaten winkelwagen), Shopify Inbox en de trackingapp. Die pak ik in een volgende ronde op zodra de trechter niet meer lekt.