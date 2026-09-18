# Nieuwsbrief­tekst footer: alleen "Blijf op de hoogte"

## Doel
De koptekst boven het e-mailveld in de footer zegt nu "Krijg 10% korting op je eerste bestelling en blijf op de hoogte." Dat moet worden: "Blijf op de hoogte door middel van onze nieuwsbrief." — zonder de 10%-korting­vermelding, in alle drie de talen correct.

## Wijzigingen

1. **src/components/layout/SiteFooter.tsx** (regel 47)
   - Vervang de vaste tekst `"Krijg 10% korting op je eerste bestelling en blijf op de hoogte."` door `"Blijf op de hoogte door middel van onze nieuwsbrief."`
   - De tekst staat hardcoded (niet in `t()`); de DomTranslator vertaalt hem automatisch aan de hand van de i18n-sleutels hieronder.

2. **src/i18n/en.json**
   - Verwijder sleutel `"Krijg 10% korting op je eerste bestelling en blijf op de hoogte."`
   - Voeg toe: `"Blijf op de hoogte door middel van onze nieuwsbrief."` → `"Stay informed through our newsletter."`

3. **src/i18n/fr.json**
   - Verwijder sleutel `"Krijg 10% korting op je eerste bestelling en blijf op de hoogte."`
   - Voeg toe: `"Blijf op de hoogte door middel van onze nieuwsbrief."` → `"Restez informé grâce à notre newsletter."`

## Niet gewijzigd
- De succesmelding na aanmelding ("Gebruik SG-WELKOM10 bij het afrekenen voor 10% korting.") blijft staan — je vroeg alleen om de koptekst aan te passen.

## Controle
- `bunx tsgo --noEmit` typecheck
- Visuele controle op de footer (NL/EN/FR) dat de nieuwe tekst staat en de 10%-vermelding weg is.
