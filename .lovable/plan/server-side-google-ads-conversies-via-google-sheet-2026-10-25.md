# Server-side Google Ads-conversies via Google Sheet

## Wat er gebeurt
Elke betaalde, echte Shopify-order met een opgeslagen Google-klik-ID komt één keer als rij in de Sheet "SenseGlow - Aankoop server (Google Ads import)", tabblad Blad1. Google Ads haalt die Sheet op als geplande import voor de conversie "Aankoop - server".

## Belangrijk vooraf
1. **Service-account maak jij zelf aan.** Ik kan in jouw Google Cloud geen account aanmaken, dus ik kan het e-mailadres niet zomaar geven. Stappen: Google Cloud Console > IAM > Service accounts > Aanmaken > Sleutel toevoegen (JSON) en Google Sheets API aanzetten. Je plakt de JSON in een beveiligd formulier dat ik open. Daarna lees ik het e-mailadres eruit en geef het je, zodat je de Sheet ermee deelt (Bewerker).
2. **Toestemming.** Klik-ID's worden nu opgeslagen zonder de cookiekeuze van de bezoeker. Google vereist toestemming voor bezoekers uit de EU. Daarom sla ik voortaan de advertentiekeuze mee op en schrijf ik alleen rijen voor orders waar die keuze "geaccepteerd" was. Bestaande orders zonder vastgelegde keuze: zie de vraag hieronder bij de backfill.
3. Alleen echte gclid's tellen. gbraid/wbraid (iPhone-klikken) passen niet in deze kolom en worden overgeslagen.

## Regels per order
- Alleen status betaald; testorders (Shopify-test of door jou gemarkeerd als test) en draft orders overslaan.
- Kolommen: Google Click ID, `Aankoop - server`, tijd in Europe/Amsterdam met offset (bv. `2026-10-25T14:30:00+01:00`), bedrag na korting zonder verzending met punt (`34.95`), `EUR`, ordernummer (`1008`), `WEB`.
- Eén keer per Order ID: vastgelegd in de database én gecontroleerd tegen kolom F van de Sheet.
- Geen naam, e-mail, telefoon, adres of IP opslaan of versturen.

## Trigger
De bestaande order-sync (elke 5 minuten) controleert na elke run nieuwe betaalde orders en schrijft ze weg. Geen aparte webhook nodig; mislukt de Sheet, dan probeert de volgende run het opnieuw.

## Backfill
Eenmalig dezelfde logica voor betaalde orders van de afgelopen 90 dagen met gclid. Na afloop meld ik het aantal geschreven rijen.

## Technisch
- Secret `GOOGLE_SERVICE_ACCOUNT_JSON`; edge-helper `_shared/google-sheets.ts` die een JWT tekent (RS256) en een access token haalt, daarna `values:append` (USER_ENTERED, RAW voor gclid) op `Blad1!A:G`.
- Spreadsheet-ID als secret `ADS_IMPORT_SHEET_ID` (uit de link die jij geeft).
- Migratie: kolommen `ad_consent` + `consent_at` op `checkout_attribution`; tabel `ads_conversion_exports` (order_number PK, exported_at, status, error) met RLS, alleen admin-lezen, server-schrijven.
- `attribution-capture` neemt de huidige cookiekeuze mee; `shop_orders` krijgt de keuze bij koppelen.
- Pure functie voor rijopbouw (tijd/bedrag/filter) met vitest-tests voor tijdzone, decimaalpunt, test/draft-filter en dedup.
- Backfill als admin-only actie in `shopify-orders-sync` (`mode=backfill`), die het aantal rijen teruggeeft.
