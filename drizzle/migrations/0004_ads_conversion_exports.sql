ALTER TABLE public.checkout_attribution ADD COLUMN IF NOT EXISTS ad_consent text, ADD COLUMN IF NOT EXISTS consent_at timestamptz;
ALTER TABLE public.shop_orders ADD COLUMN IF NOT EXISTS ad_consent text;
CREATE TABLE public.ads_conversion_exports (
  order_number text PRIMARY KEY,
  exported_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'written',
  error text
);
GRANT SELECT ON public.ads_conversion_exports TO authenticated;
GRANT ALL ON public.ads_conversion_exports TO service_role;
ALTER TABLE public.ads_conversion_exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read conversion exports" ON public.ads_conversion_exports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Service role manages conversion exports" ON public.ads_conversion_exports FOR ALL TO service_role USING (true) WITH CHECK (true);