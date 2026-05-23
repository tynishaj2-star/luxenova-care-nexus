GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, public, service_role;
ALTER FUNCTION public.has_role(uuid, public.app_role) OWNER TO postgres;