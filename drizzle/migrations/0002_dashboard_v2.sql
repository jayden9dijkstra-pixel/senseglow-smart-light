CREATE TABLE public.product_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_key text NOT NULL UNIQUE,
  product text NOT NULL,
  variant text NOT NULL DEFAULT '',
  match_pattern text NOT NULL,
  cost_excl_vat numeric NOT NULL CHECK (cost_excl_vat >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_costs TO authenticated;
GRANT ALL ON public.product_costs TO service_role;
ALTER TABLE public.product_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read product costs" ON public.product_costs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert product costs" ON public.product_costs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update product costs" ON public.product_costs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete product costs" ON public.product_costs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Service role manages product costs" ON public.product_costs FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.dashboard_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  levy_tiers jsonb NOT NULL DEFAULT '[{"min":0,"levy":3.00},{"min":15,"levy":2.50},{"min":25,"levy":1.50},{"min":50,"levy":0}]'::jsonb,
  transaction_rate numeric NOT NULL DEFAULT 0.025,
  other_rate numeric NOT NULL DEFAULT 0.07,
  tax_reserve_pct numeric NOT NULL DEFAULT 0,
  tax_reserve_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.dashboard_settings TO authenticated;
GRANT ALL ON public.dashboard_settings TO service_role;
ALTER TABLE public.dashboard_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read settings" ON public.dashboard_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert settings" ON public.dashboard_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update settings" ON public.dashboard_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Service role manages settings" ON public.dashboard_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.ads_daily ADD COLUMN IF NOT EXISTS campaign_id text NOT NULL DEFAULT '';
ALTER TABLE public.ads_daily ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE public.ads_daily ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS ads_daily_date_campaign_id_key ON public.ads_daily (date, campaign_id);

ALTER TABLE public.shop_orders ADD COLUMN IF NOT EXISTS country_code text;
CREATE INDEX IF NOT EXISTS site_events_created_at_idx ON public.site_events (created_at);