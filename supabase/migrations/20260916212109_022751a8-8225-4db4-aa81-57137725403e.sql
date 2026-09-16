DROP POLICY IF EXISTS "No direct order lookup inserts" ON public.order_lookups;
CREATE POLICY "No direct order lookup inserts"
ON public.order_lookups
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Anyone can record a site event" ON public.site_events;
CREATE POLICY "Visitors can record validated site events"
ON public.site_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id ~ '^(anon|[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$'
  AND event_type IN ('page_view', 'view_item', 'add_to_cart', 'begin_checkout')
  AND (path IS NULL OR (char_length(path) BETWEEN 1 AND 500 AND path LIKE '/%'))
  AND (referrer IS NULL OR char_length(referrer) <= 253)
  AND (device IS NULL OR device IN ('mobile', 'tablet', 'desktop', 'unknown'))
  AND (country IS NULL OR country ~ '^[A-Z0-9]{2}$')
  AND (locale IS NULL OR locale IN ('nl', 'en', 'fr'))
  AND (item_name IS NULL OR char_length(item_name) <= 200)
  AND (value IS NULL OR (value >= 0 AND value <= 1000000))
);