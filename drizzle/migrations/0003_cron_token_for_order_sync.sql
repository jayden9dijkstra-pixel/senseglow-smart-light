CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;
CREATE TABLE IF NOT EXISTS private.cron_tokens (
  name text PRIMARY KEY,
  token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(32), 'hex')
);
REVOKE ALL ON private.cron_tokens FROM anon, authenticated;
INSERT INTO private.cron_tokens(name) VALUES ('shopify-orders-sync') ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.verify_cron_token(_name text, _token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = private, public AS $$
  SELECT EXISTS (SELECT 1 FROM private.cron_tokens WHERE name = _name AND token = _token AND length(_token) > 0)
$$;
REVOKE ALL ON FUNCTION public.verify_cron_token(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_cron_token(text, text) TO service_role;