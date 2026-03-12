-- Creator Country Verification System
-- Purpose: Enable country-specific creator verification with tax ID validation and banking details

-- 1. Extend user_profiles table with country verification fields
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS tax_id_type TEXT,
ADD COLUMN IF NOT EXISTS tax_id_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS banking_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS compliance_docs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_review', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 2. Create creator verification history table
CREATE TABLE IF NOT EXISTS public.creator_verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  tax_id TEXT,
  tax_id_type TEXT,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  verification_method TEXT,
  verification_notes TEXT,
  documents_submitted JSONB DEFAULT '[]'::jsonb,
  verified_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_country_code ON public.user_profiles(country_code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verification_status ON public.user_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tax_id_verified ON public.user_profiles(tax_id_verified);
CREATE INDEX IF NOT EXISTS idx_creator_verification_history_creator_id ON public.creator_verification_history(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_verification_history_created_at ON public.creator_verification_history(created_at DESC);

-- 4. Enable RLS
ALTER TABLE public.creator_verification_history ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Users can view their own verification history
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'creator_verification_history' 
    AND policyname = 'users_view_own_verification_history'
  ) THEN
    CREATE POLICY "users_view_own_verification_history"
    ON public.creator_verification_history
    FOR SELECT
    TO authenticated
    USING (creator_id = auth.uid());
  END IF;
END $$;

-- Admins can view all verification history
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'creator_verification_history' 
    AND policyname = 'admin_manage_verification_history'
  ) THEN
    CREATE POLICY "admin_manage_verification_history"
    ON public.creator_verification_history
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    );
  END IF;
END $$;

-- 6. Functions

-- Function to validate tax ID format by country
CREATE OR REPLACE FUNCTION public.validate_tax_id(
  p_country_code TEXT,
  p_tax_id TEXT,
  p_tax_id_type TEXT
)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- USA: SSN (9 digits)
  IF p_country_code = 'US' AND p_tax_id_type = 'SSN' THEN
    IF p_tax_id ~ '^[0-9]{9}$' OR p_tax_id ~ '^[0-9]{3}-[0-9]{2}-[0-9]{4}$' THEN
      RETURN QUERY SELECT true, NULL::TEXT;
    ELSE
      RETURN QUERY SELECT false, 'Invalid SSN format. Expected: XXX-XX-XXXX or 9 digits'::TEXT;
    END IF;
  
  -- India: PAN (10 alphanumeric)
  ELSIF p_country_code = 'IN' AND p_tax_id_type = 'PAN' THEN
    IF p_tax_id ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' THEN
      RETURN QUERY SELECT true, NULL::TEXT;
    ELSE
      RETURN QUERY SELECT false, 'Invalid PAN format. Expected: 5 letters + 4 digits + 1 letter'::TEXT;
    END IF;
  
  -- Nigeria: TIN (11 digits)
  ELSIF p_country_code = 'NG' AND p_tax_id_type = 'TIN' THEN
    IF p_tax_id ~ '^[0-9]{11}$' THEN
      RETURN QUERY SELECT true, NULL::TEXT;
    ELSE
      RETURN QUERY SELECT false, 'Invalid TIN format. Expected: 11 digits'::TEXT;
    END IF;
  
  -- Generic validation for other countries
  ELSE
    IF LENGTH(p_tax_id) >= 5 THEN
      RETURN QUERY SELECT true, NULL::TEXT;
    ELSE
      RETURN QUERY SELECT false, 'Tax ID must be at least 5 characters'::TEXT;
    END IF;
  END IF;
END;
$$;

-- Function to get creator verification status
CREATE OR REPLACE FUNCTION public.get_creator_verification_status(p_creator_id UUID)
RETURNS TABLE (
  creator_id UUID,
  country_code TEXT,
  tax_id_verified BOOLEAN,
  verification_status TEXT,
  banking_details_complete BOOLEAN,
  compliance_docs_count INTEGER,
  verified_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.country_code,
    up.tax_id_verified,
    up.verification_status,
    (up.banking_details IS NOT NULL AND jsonb_typeof(up.banking_details) = 'object' AND up.banking_details != '{}'::jsonb) AS banking_details_complete,
    COALESCE(jsonb_array_length(up.compliance_docs), 0) AS compliance_docs_count,
    up.verified_at
  FROM public.user_profiles up
  WHERE up.id = p_creator_id;
END;
$$;

-- Function to update creator verification status
CREATE OR REPLACE FUNCTION public.update_creator_verification(
  p_creator_id UUID,
  p_new_status TEXT,
  p_verification_notes TEXT DEFAULT NULL,
  p_verified_by UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_status TEXT;
  v_country_code TEXT;
  v_tax_id TEXT;
  v_tax_id_type TEXT;
BEGIN
  -- Get current status
  SELECT verification_status, country_code, tax_id, tax_id_type
  INTO v_old_status, v_country_code, v_tax_id, v_tax_id_type
  FROM public.user_profiles
  WHERE id = p_creator_id;

  -- Update user profile
  UPDATE public.user_profiles
  SET 
    verification_status = p_new_status,
    verification_notes = COALESCE(p_verification_notes, verification_notes),
    verified_at = CASE WHEN p_new_status = 'verified' THEN CURRENT_TIMESTAMP ELSE verified_at END,
    verified_by = CASE WHEN p_new_status = 'verified' THEN COALESCE(p_verified_by, auth.uid()) ELSE verified_by END,
    tax_id_verified = CASE WHEN p_new_status = 'verified' THEN true ELSE tax_id_verified END,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_creator_id;

  -- Insert history record
  INSERT INTO public.creator_verification_history (
    creator_id,
    country_code,
    tax_id,
    tax_id_type,
    previous_status,
    new_status,
    verification_notes,
    verified_by
  ) VALUES (
    p_creator_id,
    v_country_code,
    v_tax_id,
    v_tax_id_type,
    v_old_status,
    p_new_status,
    p_verification_notes,
    COALESCE(p_verified_by, auth.uid())
  );

  RETURN true;
END;
$$;

-- 7. Insert default tax ID types reference data
CREATE TABLE IF NOT EXISTS public.tax_id_types_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  tax_id_type TEXT NOT NULL,
  tax_id_label TEXT NOT NULL,
  format_description TEXT,
  validation_regex TEXT,
  example TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_country_tax_type UNIQUE (country_code, tax_id_type)
);

-- Insert common tax ID types
INSERT INTO public.tax_id_types_reference (country_code, country_name, tax_id_type, tax_id_label, format_description, validation_regex, example)
VALUES
  ('US', 'United States', 'SSN', 'Social Security Number', '9 digits (XXX-XX-XXXX)', '^[0-9]{3}-[0-9]{2}-[0-9]{4}$', '123-45-6789'),
  ('US', 'United States', 'EIN', 'Employer Identification Number', '9 digits (XX-XXXXXXX)', '^[0-9]{2}-[0-9]{7}$', '12-3456789'),
  ('IN', 'India', 'PAN', 'Permanent Account Number', '10 alphanumeric (AAAAA9999A)', '^[A-Z]{5}[0-9]{4}[A-Z]{1}$', 'ABCDE1234F'),
  ('NG', 'Nigeria', 'TIN', 'Tax Identification Number', '11 digits', '^[0-9]{11}$', '12345678901'),
  ('GB', 'United Kingdom', 'UTR', 'Unique Taxpayer Reference', '10 digits', '^[0-9]{10}$', '1234567890'),
  ('CA', 'Canada', 'SIN', 'Social Insurance Number', '9 digits (XXX-XXX-XXX)', '^[0-9]{3}-[0-9]{3}-[0-9]{3}$', '123-456-789'),
  ('AU', 'Australia', 'TFN', 'Tax File Number', '8-9 digits', '^[0-9]{8,9}$', '123456789'),
  ('DE', 'Germany', 'TIN', 'Tax Identification Number', '11 digits', '^[0-9]{11}$', '12345678901')
ON CONFLICT (country_code, tax_id_type) DO NOTHING;

-- Enable RLS for reference table
ALTER TABLE public.tax_id_types_reference ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read tax ID types
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'tax_id_types_reference' 
    AND policyname = 'all_users_view_tax_id_types'
  ) THEN
    CREATE POLICY "all_users_view_tax_id_types"
    ON public.tax_id_types_reference
    FOR SELECT
    TO authenticated
    USING (is_active = true);
  END IF;
END $$;