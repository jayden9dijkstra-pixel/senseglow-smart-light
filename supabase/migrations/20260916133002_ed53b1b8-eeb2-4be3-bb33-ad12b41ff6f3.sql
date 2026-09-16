-- Restrict has_role so signed-in users can only probe their own roles.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (auth.uid() IS NULL OR _user_id = auth.uid())
  )
$function$;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- Explicit, scoped read access for order lookup logs (admins only).
GRANT SELECT ON public.order_lookups TO authenticated;
GRANT ALL ON public.order_lookups TO service_role;

DROP POLICY IF EXISTS "Admins can read order lookups" ON public.order_lookups;
CREATE POLICY "Admins can read order lookups"
ON public.order_lookups
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));