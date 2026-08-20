# Prerender op prod: geverifieerd, geen fix nodig

## Wat ik zojuist gemeten heb (live, via curl op www.senseglow.shop)

| Route | Bytes | Title in ruwe HTML | Canonical | JSON-LD |
|---|---|---|---|---|
| `/` | 2912 | SenseGlow, slimme sensor verlichting... | `https://www.senseglow.shop/` | Organization + BreadcrumbList |
| `/product/senseglow_wave` | 4369 | SenseGlow Wave™, sensor lichtbalk 30/50cm | `.../product/senseglow_wave` | Product + Brand + AggregateOffer + BreadcrumbList |
| `/product/senseglow_flex` | 4228 | SenseGlow Flex™, bureaulamp met touch en USB-C | `.../product/senseglow_flex` | Product + Brand + AggregateOffer + BreadcrumbList |
| `/producten` | 2855 | Alle SenseGlow lampen... | `.../producten` | BreadcrumbList |

Alle drie de routes die jij noemde geven nu verschillende bytes, unieke titles, canonicals en de juiste schema's. De hosting-laag serveert dus wél de per-route bestanden; de SPA-fallback grijpt alleen in bij routes zonder prerender-output.

De build-output lokaal heeft ook de juiste structuur: `dist/product/senseglow_wave/index.html`, niet `product/senseglow_wave.html`. Geen van de drie vermoede oorzaken is dus actueel.

## Wat er waarschijnlijk gebeurde bij jouw check

De 2565-byte respons met homepage-title is precies de oude, niet-geprerenderde `index.html`. Dat past bij: gemeten vóórdat de publish klaar was (deploy duurt ~1 minuut na de publish-call), of een CDN/fetch-cache die de vorige versie teruggaf.

## Voorstel (geen code-wijziging)

1. Jij hercheckt zelf met een cache-buster, bijvoorbeeld `?v=1` achter de URL of een fetch met `cache: "no-store"`, en vergelijkt de bytes met de tabel hierboven.
2. Optioneel: ik voeg een klein verificatie-script toe (`scripts/verify-prerender.ts`) dat na elke publish alle 16 routes langsgaat en per route title, canonical en aanwezige `@type`s print, zodat je dit voortaan in één commando ziet in plaats van handmatig per URL.
3. Als een specifieke route bij jouw hercheck alsnog de homepage-HTML geeft, stuur je mij die URL en dan kijk ik gericht naar de fallback-regel voor dat pad.

## Technisch

- `package.json` draait `postbuild: bunx tsx scripts/prerender.ts`; die schrijft per route `dist/<pad>/index.html` op basis van `dist/index.html`, met head-tags uit `src/lib/seoContent.ts` en schema's uit `src/lib/structuredData.ts`.
- Productroutes halen live Shopify-data op met 10s timeout; bij falen komt er alleen een BreadcrumbList in en breekt de build niet.
- Alleen stap 2 (verificatie-script) is een daadwerkelijke wijziging, en die is optioneel. Zeg maar of je die erbij wilt.
