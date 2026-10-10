
- Private MCP tools (orders, sales, funnel, attribution, ads) query with the caller's OAuth token and require the admin role; why: database RLS stays the single access boundary and no service key is used in MCP.
- Dashboard metrics live as pure functions in src/lib/dashboardMetrics.ts (tested with vitest); edge functions only return raw, PII-free data; why: one tested source of truth for margin, levy and VAT rules.
- Shopify orders sync into shop_orders via supabase/functions/_shared/shopify-orders.ts (cron every 5 min + on dashboard load) and never overwrite stored attribution with empty values; why: attribution is irreplaceable once lost.
- Google Ads daily stats arrive via the ingest-ads function (x-ingest-token = ADS_INGEST_TOKEN) from a Google Ads Script; why: the connector gateway cannot be called from edge functions.
