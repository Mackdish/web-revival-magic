ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text, ADD COLUMN IF NOT EXISTS phone text;
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  service text,
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 200),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 4000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY inquiries_read ON public.inquiries FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_crm_member());
CREATE POLICY inquiries_insert_own ON public.inquiries FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'new');
CREATE POLICY inquiries_staff_update ON public.inquiries FOR UPDATE TO authenticated USING (public.is_crm_member()) WITH CHECK (public.is_crm_member());
CREATE POLICY profiles_staff_read ON public.profiles FOR SELECT TO authenticated USING (public.is_crm_member());