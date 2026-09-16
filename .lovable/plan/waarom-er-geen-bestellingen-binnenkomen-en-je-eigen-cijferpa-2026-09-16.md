# Waarom er geen bestellingen binnenkomen, en je eigen cijferpagina

## Eerst het misverstand over "28 in de checkout"

In de cijfers staat `checkout.senseglow.shop` bij **bronnen**. Dat telt bezoekers die
vanaf de afrekenpagina **terugkwamen** naar de site. Het zijn dus geen 28 mensen die
stonden af te rekenen, en zeker geen 28 mislukte betalingen. Het kan zelfs goed dat
het steeds dezelfde paar mensen zijn die heen en weer klikken.

Shopify zelf laat over 30 dagen 3 sessies en 1 bestelling zien. Dat is logisch: het
afrekenen gebeurt bij Shopify, de rest van de winkel niet.

## Deel 1: het afrekenen echt doorlopen

Ik loop de hele route zelf na met jouw code `26NAVEQQT7V9`, op telefoonformaat en op
desktop:

1. Product kiezen, maat en kleur, in de winkelwagen.
2. Op "Veilig afrekenen" en kijken of de nieuwe tab echt opent (pop-upblokkering is
   een bekende stille killer, zeker op iPhone).
3. Op de afrekenpagina: staan de juiste artikelen, de juiste prijs en werkt de code?
4. Adres invullen, verzendmethode kiezen, betaalmethodes bekijken (iDEAL, PayPal,
   Klarna).
5. Bestelling afronden met de gratis code en controleren of de bestelling in Shopify
   verschijnt, inclusief de bedankpagina.

Daarna maak ik een kort overzicht: wat werkt, waar het stokt, en wat ik meteen
repareer. Bekende verdachten die ik gericht nakijk:

- de nieuwe tab die geblokkeerd wordt op mobiel;
- afrekenpagina die in het Engels opent terwijl de winkel Nederlands is;
- verzendkosten of een regio die pas laat zichtbaar wordt;
- een betaalmethode die niet aanstaat voor kleine bedragen.

Wat ik in de winkel zelf kan oplossen, los ik op. Wat alleen in Shopify kan (zoals
betaalmethodes of taalinstellingen), krijg je als korte lijst met exacte stappen.

## Deel 2: jouw cijfers zichtbaar in Shopify

Shopify laat in het beheer alleen Shopify-cijfers zien. Externe cijfers kunnen daar
niet zomaar in een tegel. Wat wel werkt en snel klaar is:

Een eigen, afgeschermde cijferpagina op je eigen site: `senseglow.shop/statistieken`.
Die zet je in Shopify als snelkoppeling in je zijbalk (Shopify staat externe links
toe), zodat je hem vanuit je beheer met één klik opent.

Op die pagina komt te staan:

- **Nu online**: hoeveel mensen op dit moment op de site zijn, welke pagina ze bekijken.
- **Laatste 7 en 30 dagen**: bezoekers per dag, paginaweergaves, gemiddelde bezoekduur.
- **Meest bekeken pagina's** en **waar bezoekers vandaan komen**.
- **Winkelwagen-trechter**: bekeken product, in winkelwagen, op afrekenen geklikt.
  Precies het stuk dat je nu mist.
- Apparaat en land.

Toegang met een eenvoudige inlog, zodat niemand anders je cijfers ziet.

## Technische details

- Nieuwe tabel `site_events` in de backend (tijdstip, sessie-id, type, pad, land,
  apparaat, bedrag). Alleen inserts vanaf de site; lezen alleen voor ingelogde
  beheerders via een rollen-tabel en een RLS-policy op `has_role`.
- `src/lib/siteAnalytics.ts`: lichte meting naast de bestaande Google-tag. Registreert
  `page_view`, `view_item`, `add_to_cart`, `begin_checkout` met sessie-id in
  `sessionStorage`. Faalt stil, blokkeert nooit de winkel.
- Aanhaken op bestaande punten: routewissel in `src/App.tsx`, `addItem` en
  `createCheckout` in `src/stores/cartStore.ts`.
- Nieuwe pagina `src/pages/Statistieken.tsx` op route `/statistieken`, achter login,
  met dagoverzicht, trechter en lijsten. Query's via de bestaande backendclient,
  automatisch verversen voor "nu online" (laatste 5 minuten).
- Checkout-onderzoek met Playwright op 390px en 1280px, met korting `26NAVEQQT7V9`,
  inclusief console- en netwerkcontrole; bevindingen in het eindrapport.
- Geen wijziging aan prijzen, kortingslogica of de Google Ads-meting.
