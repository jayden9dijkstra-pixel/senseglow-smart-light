-- Herkomst van elke afrekenlink, gekoppeld aan het Shopify cart-token.
CREATE TABLE public.checkout_attribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_token text NOT NULL UNIQUE,
  gclid text,
  gbraid text,
  wbraid text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  landing_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.checkout_attribution TO authenticated;
GRANT ALL ON public.checkout_attribution TO service_role;

ALTER TABLE public.checkout_attribution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read attribution"
ON public.checkout_attribution FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages attribution"
ON public.checkout_attribution FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Shopify-bestellingen met de gekoppelde herkomst.
CREATE TABLE public.shop_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id bigint NOT NULL UNIQUE,
  order_number text NOT NULL,
  ordered_at timestamptz NOT NULL,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  financial_status text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  cart_token text,
  gclid text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  landing_path text,
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX shop_orders_ordered_at_idx ON public.shop_orders (ordered_at DESC);
CREATE INDEX shop_orders_cart_token_idx ON public.shop_orders (cart_token);

GRANT SELECT ON public.shop_orders TO authenticated;
GRANT ALL ON public.shop_orders TO service_role;

ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read shop orders"
ON public.shop_orders FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages shop orders"
ON public.shop_orders FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Eigen bezoeken markeren zodat ze uit de cijfers gefilterd kunnen worden.
ALTER TABLE public.site_events ADD COLUMN IF NOT EXISTS internal boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS site_events_created_at_idx ON public.site_events (created_at DESC);