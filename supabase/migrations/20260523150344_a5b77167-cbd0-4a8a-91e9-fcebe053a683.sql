-- Add admin to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- After enum commit, add admin policies (run in separate statement context)
COMMIT;

-- Admins inherit staff visibility on referrals
CREATE POLICY "Admins can view all referrals"
ON public.referrals FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any referral"
ON public.referrals FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete referrals"
ON public.referrals FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all referral notes"
ON public.referral_notes FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can add referral notes"
ON public.referral_notes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = author_id AND public.has_role(auth.uid(), 'admin'));

-- Admins can manage user roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can assign roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can remove roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));