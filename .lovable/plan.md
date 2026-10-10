# Volledig intern dashboard op /admin/dashboard

Alleen het dashboard verandert. De webshop, de tracking en de afrekenpagina blijven zoals ze zijn. Het dashboard houdt de huidige lichte mokka-stijl met iconen zonder emoji, Nederlandse notatie (€ 1.234,56, dd-mm-jjjj) en de tijdzone Europe/Amsterdam. Het is ook op mobiel bruikbaar.

## Vaste regels
- Alleen jouw beheerdersaccount komt binnen. Er komen geen namen, e-mailadressen of adressen in beeld.
- Ontbreekt er iets, dan staat er "Geen data" met de reden. Nooit een 0 of een schatting.
- Je kunt maximaal 365 dagen tegelijk bekijken. Alle gegevens van buiten de site worden op de server opgehaald en 5 minuten bewaard voor snelheid.

## 1. Periodekiezer (bovenaan, op elk tabblad)
- Keuzes: Vandaag, Gisteren, 7 dagen, 30 dagen, Deze maand en Eigen periode (met datumkiezer).
- Schakelaar "Vergelijk met vorige periode": elke kaart toont dan het verschil in procenten.
- Filters op campagne en op product of variant.
- Schakelaar "Eigen verkeer uitsluiten", standaard aan.
- De gekozen periode staat in het adres van de pagina, zodat hij blijft staan als je herlaadt of de link deelt.

## 2. Automatisch verversen
- Het dashboard ververst elke 60 seconden, maar alleen als het tabblad open staat. Per bron zie je "Laatst bijgewerkt: uu:mm". De knop om zelf te verversen blijft.
- **Bestellingen:** elke 5 minuten worden ze op de server uit Shopify gehaald met de bestaande koppeling, en bewaard in de bestaande bestellingentabel.
- **Google Ads:** een nieuwe, beveiligde ontvangstfunctie neemt de dagcijfers per campagne aan en zet ze in de tabel ads_daily.
  - Die tabel krijgt twee extra kolommen: campagne-ID en status.
  - Alleen een verzoek met jouw geheime sleutel ADS_INGEST_TOKEN wordt geaccepteerd. Je stelt die zelf in via een beveiligd formulier; ik zie of toon de waarde nooit.
- **Google Ads Script:** ik schrijf het volledige script dat elk uur de laatste 30 dagen per campagne doorstuurt, plus stap-voor-stapuitleg voor het plakken en inplannen in Google Ads.
- Zijn de advertentiecijfers langer dan 3 uur niet bijgewerkt, dan staat er een waarschuwing.
- Tot het script draait, gebruikt het dashboard de advertentiecijfers die er al zijn, met de vermelding van de bron.

## 3. Tabbladen
- **A. Overzicht:** kaarten voor omzet, bestellingen, gemiddelde orderwaarde, advertentiekosten, nettowinst, ROAS, CPA, conversiepercentage en bezoekers. Een lijngrafiek van omzet tegenover advertentiekosten per dag, de top 5 producten en een samenvatting van de trackingstatus.
- **B. Ads:** per campagne en per dag de uitgaven, klikken, vertoningen, CTR, CPC, conversies, conversiewaarde, ROAS, CPA en status. Sorteerbaar, met een totaalregel en export naar een spreadsheet (CSV).
- **C. Bestellingen:** ordernummer, tijd, bedrag, producten en varianten, status, klik-ID ja/nee, utm_source, utm_medium en utm_campaign.
  - Het land staat nog niet in de opgeslagen gegevens. Ik voeg het toe vanuit Shopify, maar dan alleen de landcode.
- **D. Producten en marges:** per variant de verkochte aantallen, omzet, inkoop, marge per stuk, totale marge, break-even CPA en break-even conversieratio.
- **E. Tracking en conversies:**
  - Hoeveel bestellingen een klik-ID hebben, in aantal en procent, ook per campagne. Recente klik-ID's staan er gemaskeerd (alleen de eerste 4 en laatste 4 tekens).
  - Conversies volgens Google Ads tegenover echte bestellingen met een klik-ID, met het verschil per dag ("tracking-gat").
  - Per dag de aantallen productweergaven, toevoegingen aan de winkelwagen, gestarte afrekeningen en aankopen.
  - Statuslampjes (groen, amber of rood) met uitleg: blijft de klik-ID bewaard, kloppen de aankopen met de bestellingen, zijn de advertentiecijfers actueel en is de conversiewaarde niet 0.
- **F. Trechter:** sessies, productweergaven, winkelwagen, afrekenen gestart, gekocht en verlaten winkelwagens, met de uitval per stap. Ook per apparaat, want dat wordt al opgeslagen.
- **G. Instellingen:** inkoopprijzen en kosten (zie hieronder), en de knop voor eigen verkeer.

## 4. Financieel
- Alle prijzen zijn inclusief 21% btw. Je ziet de omzet inclusief btw, het btw-bedrag en de omzet zonder btw.
- **Inkoopprijzen:** een nieuwe tabel per variant die je in Instellingen kunt bewerken.
  - Ik vul hem vooraf met de prijzen die je eerder gaf: Ambient 20/30/40 cm € 8,05 / € 8,80 / € 9,78, Wave 30/50 cm € 7,65 / € 8,25, Wall Lamp per 4 € 9,50, Solar Lantern € 10,40, Flex € 18,00.
  - Ontbreekt de inkoop van een variant, dan staat er "inkoop ontbreekt" en is de winst "onvolledig".
- **Importheffing volgens de staffel van Nova:** één keer per bestelling, op basis van de totale inkoop van die bestelling:
  - inkoop onder € 15: € 3,00
  - € 15 tot en met € 24,99: € 2,50
  - € 25 tot en met € 49,99: € 1,50
  - vanaf € 50: € 0,00
  - De bedragen kun je in Instellingen aanpassen.
- **Kosten:** transactiekosten 2,5% en overige kosten 7% van de omzet zonder btw. Beide kun je aanpassen.
- **Dekkingsbijdrage per bestelling** = omzet zonder btw × (1 − 2,5% − 7%) − inkoop − heffing.
- **Nettowinst** = alle dekkingsbijdragen samen − advertentiekosten. Je ziet ook de winst per bestelling en de winstmarge in procenten.
  - Het bestaande vinkje "advertentiebedrag is inclusief btw" blijft werken.
- **Break-even:** de break-even CPA per variant is de dekkingsbijdrage per stuk. De break-even ROAS is de omzet zonder btw gedeeld door de dekkingsbijdrage. Bij verlies kleurt het rood.
- **Belasting:** "af te dragen btw (indicatie)" per periode, plus een belastingreservering over de winst. Die staat standaard op 0% en uit, en is duidelijk gelabeld als indicatie, geen fiscaal advies.

## 5. Eigen verkeer
- Het merkteken voor eigen verkeer bestaat al. Het wordt voortaan ook automatisch gezet als je als beheerder bent ingelogd, of als je de site opent met ?intern=1.
- Daarmee gemarkeerde bezoeken worden met de schakelaar uitgefilterd. Gewone meting, de klik-ID en het afrekenen blijven ongemoeid.

## 6. Wat niet kan (dit krijg je eerlijk te zien)
- **Aankoopmomenten op de site** worden niet opgeslagen; aankopen komen uit Shopify. De controle "aankopen kloppen met bestellingen" vergelijkt daarom de gestarte afrekeningen met de Shopify-bestellingen, en dat staat er ook bij.
- **Shopify-webhooks:** de bestaande koppeling kan geen webhooks aanmaken. Daarom gebruik ik de verversing elke 5 minuten.

## Oplevering aan het eind
Je krijgt per tabblad wat werkt en met welke gegevens, wat ontbreekt en waarom, en jouw stappen:
- de sleutel ADS_INGEST_TOKEN invullen in het formulier dat ik open
- het Google Ads Script plakken en inplannen
- de inkoopprijzen controleren

Daarnaast een overzicht van de nieuwe onderdelen in de backend en wat bewust niet is gebouwd.

---

## Technical details
- Tables: `product_costs` (variant_key, product, variant, cost_excl_vat, updated_at), `dashboard_settings` (single row: levy tiers jsonb, transaction_rate, other_rate, tax_reserve_pct, tax_reserve_enabled), all admin-read via `has_role`, admin-write for the settings tables, service_role manages. `ads_daily`: add `campaign_id`, `status`, `updated_at`; unique key becomes (date, campaign_id). `shop_orders`: add `country_code`.
- Edge functions: `ingest-ads` (POST, `x-ingest-token` compared constant-time with `ADS_INGEST_TOKEN`, zod-validated rows, max 31 days × 200 campaigns, upsert via service role); `shopify-orders-sync` (Admin REST with `SHOPIFY_ADMIN_TOKEN`, upserts orders including country_code, never name/email/address) scheduled every 5 minutes with pg_cron + pg_net, run via `run_sql`; `dashboard-summary` extended with `from`, `to`, `compare`, `campaign`, `variant` and `exclude_internal` parameters (max 365 days, admin check unchanged, 5-minute in-memory cache).
- Shared, pure metric functions (levy tier, contribution margin, break-even, VAT split, funnel, tracking gap) go in `supabase/functions/_shared/metrics.ts`, mirrored in `src/lib/margins.ts` with unit tests (vitest) for levy tiers and margin formulas. The MCP private tools reuse the same logic.
- Frontend: `src/pages/admin/Dashboard.tsx` split into tab components under `src/pages/admin/dashboard/`; recharts for the line chart; URL search params for state; `document.visibilityState`-gated 60s interval.
- Internal flag: `siteAnalytics.ts` also sets the existing `sg_internal` cookie when `?intern=1` is present or an admin session exists; event payloads stay otherwise unchanged.
