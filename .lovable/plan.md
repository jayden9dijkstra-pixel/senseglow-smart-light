# Sync frontend met nieuwe Shopify-varianten

De varianten in Shopify zijn al correct (Arc = Black/White 12W, Flex = White/Black, Ambient Bar = 6 varianten incl. Black 30cm). De frontend en wat copy in Shopify zelf lopen nog achter. Dit plan haalt alles in lijn.

## Wat nu mis gaat

- **Arc**: Shopify gebruikt nu drie aparte opties (`Colour of Lamp`, `Wattage`, `Kleur`). De `VariantPicker` zoekt nog naar de oude gecombineerde optie `Uitstraalkleur` (bv. "Black 6W"). Resultaat: geen kleur/wattage zichtbaar in de picker.
- **Flex**: beide varianten (White, Black) krijgen hetzelfde label "Standaard" omdat de parser nog naar `remote` zoekt i.p.v. naar de kleur. Picker toont geen kleurkeuze, bundels tonen identieke labels.
- **Ambient Bar**: de nieuwe Black 30cm wordt al door Shopify geleverd, maar moet visueel verschijnen in de pickers en bundels (verifiëren).
- **Productpagina-copy in Shopify** verwijst nog naar 4W/6W (Arc) en de afstandsbediening-versie (Flex).

## Wijzigingen frontend

1. **`src/components/product/VariantPicker.tsx`** — Arc-parsing herschrijven naar de nieuwe optie-structuur (`Colour of Lamp` → kleur, `Wattage` → wattage, `Kleur` → lichtkleur). Highlight "6W" verwijderen. Picker verbergt automatisch wattage/lichtkleur als er maar 1 waarde is.
2. **`src/lib/productRegistry.ts`**
   - `parseVariantLabel('arc')`: lezen uit nieuwe option-namen, label wordt simpelweg "Wit" of "Zwart".
   - `parseVariantLabel('flex')`: label op kleur baseren ("Wit"/"Zwart") i.p.v. "Standaard"/"Met afstandsbediening".
   - `buildVariantKey('flex')`: per kleur unieke key ("W"/"B") zodat bundel-discountcodes per kleur kunnen verschillen indien nodig (anders blijft het "STD" voor beide).
3. **`src/lib/arcProductConfig.ts`** — referenties naar 2W/4W/6W/8W/10W verwijderen; alleen 12W behouden in `ArcWattage` en specs/copy.
4. **`src/lib/flexProductConfig.ts`** — kop "White Remote Control" en "remote" parsing uit comments/parser halen; `FlexType` weghalen, parser geeft alleen `bodyColor` terug.

## Wijzigingen Shopify (via tools)

5. **Arc product** (`10045207281962`) — `body_html` updaten: "4W, 6W en 12W" → "12W"; spec-lijst "4W / 6W / 12W" → "12W". Andere copy ongemoeid.
6. **Flex product** (`10057915138346`) — `body_html` updaten: zin over "versie met afstandsbediening beschikbaar" en "(standaard en met afstandsbediening)" weghalen; spec "Bediening" terugbrengen tot enkel touch.

## Verificatie na implementatie

- Op `/product/<arc-handle>`: kleurswatch toont Wit/Zwart, geen wattage-picker, prijs €54,95.
- Op `/product/<flex-handle>`: kleurswatch toont Wit/Zwart, geen "Uitvoering" picker.
- Op de Ambient Bar pagina: lengte-picker toont 20/30/40, beide kleuren werken op alle drie de lengtes.
- Bundels op alle drie de pagina's tonen de juiste varianten en gebruiken de bestaande SG-... discountcodes ongewijzigd.

## Buiten scope

- Nieuwe foto's, NOVA-quotes, definitieve prijzen, bundle-strategie en hero/copy-herziening (deel 4 van het briefing — pas later).
