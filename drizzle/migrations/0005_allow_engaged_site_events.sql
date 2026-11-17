DROP POLICY IF EXISTS "Visitors can record validated site events" ON public.site_events;

CREATE POLICY "Visitors can record validated site events"
ON public.site_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (session_id ~ '^(anon|[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$'::text)
  AND (event_type = ANY (ARRAY['page_view'::text, 'view_item'::text, 'add_to_cart'::text, 'begin_checkout'::text, 'engaged'::text]))
  AND ((path IS NULL) OR (((char_length(path) >= 1) AND (char_length(path) <= 500)) AND (path ~~ '/%'::text)))
  AND ((referrer IS NULL) OR (char_length(referrer) <= 253))
  AND ((device IS NULL) OR (device = ANY (ARRAY['mobile'::text, 'tablet'::text, 'desktop'::text, 'unknown'::text])))
  AND ((country IS NULL) OR (country ~ '^[A-Z0-9]{2}$'::text))
  AND ((locale IS NULL) OR (locale = ANY (ARRAY['nl'::text, 'en'::text, 'fr'::text])))
  AND ((item_name IS NULL) OR (char_length(item_name) <= 200))
  AND ((value IS NULL) OR ((value >= (0)::numeric) AND (value <= (1000000)::numeric)))
);