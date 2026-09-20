CREATE TABLE public.ads_daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL,
  campaign_id text,
  campaign_name text,
  product_handle text,
  product_title text,
  cost numeric NOT NULL DEFAULT 0,
  impressions bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  conversions numeric NOT NULL DEFAULT 0,
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ads_daily_stats_unique
  ON public.ads_daily_stats (stat_date, coalesce(campaign_id, ''), coalesce(product_title, ''));

GRANT SELECT ON public.ads_daily_stats TO authenticated;
GRANT ALL ON public.ads_daily_stats TO service_role;

ALTER TABLE public.ads_daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read ads stats"
  ON public.ads_daily_stats FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role manages ads stats"
  ON public.ads_daily_stats FOR ALL TO service_role
  USING (true) WITH CHECK (true);
