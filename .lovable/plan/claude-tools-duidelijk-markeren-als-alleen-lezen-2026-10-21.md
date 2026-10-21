# Claude-tools duidelijk markeren als alleen-lezen

## Controle (al gedaan)
- Alle acht tools lezen alleen. De bedrijfstools doen uitsluitend GET-verzoeken op de database met het token van de ingelogde gebruiker. De producttools sturen alleen leesvragen naar de Shopify-winkel (POST is daar de standaard manier van vragen, geen wijziging). Niets schrijft, verwijdert of start een externe actie.
- Alle tools hebben al `readOnlyHint` en `idempotentHint` en een titel. Wat ontbreekt: `destructiveHint: false` overal, en de drie producttools staan nu op `openWorldHint: true`.

## Wijzigingen
1. Alle acht tools krijgen exact: `readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false`, plus een korte titel (bestaande titels blijven, eventueel ingekort).
2. Elke beschrijving begint met "Read-only. Returns no personal data." en houdt de rest van de bestaande tekst.
3. Authenticatie, beheerderscontrole, data en responsstructuur blijven precies hetzelfde.
4. Manifest opnieuw genereren en controleren dat alle acht tools erin staan met de nieuwe aanduidingen.
5. Publiceren, zodat Claude de nieuwe versie ziet.

Aangepaste tools: get_sales_summary, get_orders, get_funnel, get_attribution, get_ads_daily, list_products, search_products, get_product.

## Technical
- `src/lib/mcp/tools/private-tools.ts`: constante `RO` uitbreiden met `destructiveHint: false`; beschrijvingen prefixen.
- `src/lib/mcp/tools/{list-products,search-products,get-product}.ts`: annotations vervangen door dezelfde set; beschrijvingen prefixen.
- Daarna `app_mcp_server--extract_mcp_manifest`, dan publiceren.
- Kanttekening: als Claude's organisatiebeleid alle externe tools blokkeert, lost dit het niet op; dan moet de beheerder in Claude de koppeling toestaan.
