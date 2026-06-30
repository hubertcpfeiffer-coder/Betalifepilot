-- 0012_oauth_states: CSRF + User-Mapping fuer OAuth-Flows (service_role-only).
CREATE TABLE IF NOT EXISTS public.oauth_states (
  state       text PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider    text NOT NULL DEFAULT 'google',
  redirect_to text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '10 minutes')
);
CREATE INDEX IF NOT EXISTS idx_oauth_states_user_id ON public.oauth_states(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON public.oauth_states(expires_at);
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.oauth_states FROM anon, authenticated;
COMMENT ON TABLE public.oauth_states IS
  'CSRF + User-Mapping fuer OAuth-Flows. service_role-only (RLS an, keine Policy, Grants entzogen).';
