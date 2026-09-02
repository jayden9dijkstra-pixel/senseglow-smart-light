# Ronde verbeteringen na walkthrough

Zeven punten, geordend op prioriteit. Kies welke in de batch gaan.

## P0

### 1. Reviews sectie (bug)
Bestand: `src/components/homepage/ReviewsTeaserSection.tsx`
- Regel toont `, {review.name}` → wordt `— {review.name}`.
- Optie B: de knop "Lees meer reviews →" verdwijnt volledig van elke kaart (er is geen reviews-pagina). `useNavigate` wordt daarmee overbodig en gaat eruit.

### 4. Footer payment badges
Bestand: `src/components/layout/SiteFooter.tsx`
- Nieuwe strook tussen de 4 kolommen en de copyright-regel.
- iDEAL, Bancontact, Mastercard, Visa, PayPal, Klarna, Apple Pay, Google Pay als inline SVG's in een klein eigen bestand (`src/components/layout/PaymentIcons.tsx`), zodat er geen externe requests of nieuwe dependency nodig zijn.
- Monochroom, ~24-28px hoog, `text-foreground/40`, wrappende flex-rij, gecentreerd. Elk icoon krijgt een `aria-label`/`title` met de merknaam.

## P1

### 2. Productfoto's op de homepage-kaarten
Bestand: `src/components/homepage/UseCaseGrid.tsx`
- De sectie is nu statisch (icon + tekst). Ik haal per handle de Shopify featured image op via de bestaande shopify-helper, met de handles die al in de tiles staan.
- Kaart-layout wordt: image (16:9, `object-cover`, `loading="lazy"`) → titel → tekst → "Bekijken →". Het icoon blijft als klein badge-overlay op de afbeelding, of vervalt — jouw keuze (standaard: klein badge linksboven).
- Fallback als Shopify niets teruggeeft of nog laadt: skeleton-vlak met het icoon, kaart blijft werken.
- Hover: `scale-[1.02]` op de afbeelding plus bestaande border-glow versterken.

### 3. "vanaf €X" op collectiekaarten
Bestanden: `src/components/ProductCard.tsx`, `src/pages/Catalog.tsx`
- Prijs komt uit `priceRange.minVariantPrice` in plaats van de geselecteerde variant, weergegeven als "vanaf €34,95".
- Alleen "vanaf" tonen wanneer het product meer dan één prijs kent; bij één variant blijft het een kale prijs.

### 6. Newsletter-form in de footer
Bestand: `src/components/layout/SiteFooter.tsx`
- De vierde kolom wordt een echt formulier: kop "Krijg 10% korting bij launch", email-input + submit.
- Zelfde Klaviyo-endpoint en list als `NewsletterPopup.tsx` (company `SP7Nf3`, list `YsiDqz`), zelfde zod-validatie. Om duplicatie te vermijden trek ik de subscribe-call naar `src/lib/klaviyo.ts` en gebruiken popup en footer die.
- Na succes: inline bevestiging met de code `WELKOM10`. Bij fout: toast, met mailto-link als vangnet.

## P2

### 5. Footer "Bestelling volgen"
Gecontroleerd: `/bestelling-volgen` bestaat en werkt (`src/pages/Tracking.tsx`, route in `App.tsx`). De link is dus correct; geen wijziging nodig. Enige tweak die ik voorstel: de footer-links zijn `<a href>`, wat een volledige pagina-reload geeft — die omzetten naar React Router `<Link>` maakt navigatie instant.

### 7. Secundaire CTA onder "Klaar om te beginnen?"
Bestand: `src/components/homepage/VoetCTA.tsx`
- Onder de primaire knop een tekstlink "Nog vragen? Neem contact op →" naar `/contact`, in gedempte kleur met amber hover.

## Technisch
- Punt 2 introduceert een Shopify-fetch op de homepage; die gebruikt de bestaande react-query setup zodat de sectie niet blokkeert bij trage/falende API.
- Punt 6 verplaatst logica naar `src/lib/klaviyo.ts`; `NewsletterPopup.tsx` blijft functioneel identiek.
- Geen nieuwe dependencies; payment-iconen worden handgeschreven SVG's.
