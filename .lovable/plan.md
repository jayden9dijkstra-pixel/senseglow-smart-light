

## Bundel Discount Codes + Checkout Logica

### Stap 1: 7 ontbrekende discount codes aanmaken in Shopify

De price rules bestaan al. Deze codes moeten nog aangemaakt worden:

| Code | Price Rule ID |
|------|--------------|
| SG-20CM-5PACK | 1582481146154 |
| SG-30CM-2PACK | 1582481178922 |
| SG-30CM-3PACK | 1582481277226 |
| SG-30CM-5PACK | 1582481801514 |
| SG-40CM-2PACK | 1582483013930 |
| SG-40CM-3PACK | 1582485012778 |
| SG-40CM-5PACK | 1582535377194 |

### Stap 2: Checkout-logica aanpassen

**`src/lib/shopify.ts`** - De `createStorefrontCheckout` functie uitbreiden zodat bij bundels automatisch de juiste discount code wordt meegegeven via de Storefront API Cart `discountCodes` veld.

De `CART_CREATE_MUTATION` wordt aangepast om `discountCodes` te accepteren, en de functie detecteert aan de hand van de cart items of er een bundel bij zit (via de `_originalVariantId` en bundle metadata) om de juiste `SG-[SIZE]-[TIER]` code mee te sturen.

### Stap 3: Cart store koppeling

**`src/stores/cartStore.ts`** - De `createCheckout` functie aanpassen zodat bundle-info (size + quantity) wordt doorgegeven aan de checkout-functie, zodat de juiste discount code kan worden bepaald.

### Technische details

- De `CartInput` in de Storefront API accepteert een `discountCodes` array
- Discount code wordt bepaald op basis van bundleSize + quantity: `SG-${size.toUpperCase()}-${qty}PACK`
- Bundels in de cart hebben al `bundleSize` en `quantity` properties beschikbaar
- De cart mutation wordt: `cartCreate(input: { lines: [...], discountCodes: ["SG-30CM-3PACK"] })`

