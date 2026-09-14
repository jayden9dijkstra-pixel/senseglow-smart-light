CREATE TABLE public.order_lookups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  ip TEXT,
  found BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.order_lookups TO service_role;

ALTER TABLE public.order_lookups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages order lookups"
ON public.order_lookups
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE INDEX order_lookups_created_at_idx ON public.order_lookups (created_at DESC);