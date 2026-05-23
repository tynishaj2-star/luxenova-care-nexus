ALTER TYPE public.referral_status ADD VALUE IF NOT EXISTS 'Missing Documents';
ALTER TYPE public.referral_status ADD VALUE IF NOT EXISTS 'Partner Referral Needed';
ALTER TYPE public.referral_status ADD VALUE IF NOT EXISTS 'Food / Essentials Support';
ALTER TYPE public.referral_status ADD VALUE IF NOT EXISTS 'Sponsor Match Needed';
ALTER TYPE public.referral_status ADD VALUE IF NOT EXISTS 'Completed';