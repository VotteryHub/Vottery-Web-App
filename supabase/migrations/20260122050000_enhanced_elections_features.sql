-- =====================================================
-- VOTTERY PLATFORM: Enhanced Elections Features
-- Migration: 20260122050000_enhanced_elections_features.sql
-- =====================================================

-- 1. CUSTOM TYPES
-- =====================================================

CREATE TYPE public.permission_type AS ENUM ('public', 'group_only', 'country_specific');
CREATE TYPE public.biometric_requirement AS ENUM ('none', 'fingerprint', 'face_id', 'any');

-- 2. ALTER ELECTIONS TABLE
-- =====================================================

ALTER TABLE public.elections
ADD COLUMN unique_election_id TEXT UNIQUE,
ADD COLUMN election_url TEXT,
ADD COLUMN qr_code_data TEXT,
ADD COLUMN regional_fees JSONB DEFAULT '{}'::jsonb,
ADD COLUMN biometric_required public.biometric_requirement DEFAULT 'none'::public.biometric_requirement,
ADD COLUMN permission_type public.permission_type DEFAULT 'public'::public.permission_type,
ADD COLUMN allowed_countries JSONB DEFAULT '[]'::jsonb,
ADD COLUMN group_id TEXT,
ADD COLUMN show_real_time_prize BOOLEAN DEFAULT true,
ADD COLUMN winner_notifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN winners_announced BOOLEAN DEFAULT false;

-- 3. ADMIN CONTROLS TABLE
-- =====================================================

CREATE TABLE public.admin_participation_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_name TEXT NOT NULL UNIQUE,
    globally_enabled BOOLEAN DEFAULT false,
    disabled_countries JSONB DEFAULT '[]'::jsonb,
    enabled_countries JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. INDEXES
-- =====================================================

CREATE INDEX idx_elections_unique_election_id ON public.elections(unique_election_id);
CREATE INDEX idx_elections_permission_type ON public.elections(permission_type);
CREATE INDEX idx_admin_controls_feature_name ON public.admin_participation_controls(feature_name);

-- 5. FUNCTIONS
-- =====================================================

-- Function to generate unique election ID
CREATE OR REPLACE FUNCTION public.generate_unique_election_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_id TEXT;
    id_exists BOOLEAN;
BEGIN
    LOOP
        new_id := 'ELEC-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYY') || '-' ||
                  LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');

        SELECT EXISTS(SELECT 1 FROM public.elections WHERE unique_election_id = new_id) INTO id_exists;

        IF NOT id_exists THEN
            RETURN new_id;
        END IF;
    END LOOP;
END;
$$;

-- Function to auto-generate election URL and QR code data on insert
CREATE OR REPLACE FUNCTION public.auto_generate_election_identifiers()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    base_url TEXT := 'https://vottery.com/vote/';
BEGIN
    IF NEW.unique_election_id IS NULL THEN
        NEW.unique_election_id := public.generate_unique_election_id();
    END IF;

    IF NEW.election_url IS NULL THEN
        NEW.election_url := base_url || NEW.unique_election_id;
    END IF;

    IF NEW.qr_code_data IS NULL THEN
        NEW.qr_code_data := NEW.election_url;
    END IF;

    RETURN NEW;
END;
$$;

-- Function to update admin controls timestamp
CREATE OR REPLACE FUNCTION public.update_admin_controls_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.admin_participation_controls ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES
-- =====================================================

-- Admin controls - only admins can manage
CREATE POLICY "admins_manage_participation_controls"
ON public.admin_participation_controls
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

-- Public can view admin controls (to check if features are enabled)
CREATE POLICY "public_view_participation_controls"
ON public.admin_participation_controls
FOR SELECT
TO public
USING (true);

-- 8. TRIGGERS
-- =====================================================

CREATE TRIGGER on_election_insert_generate_identifiers
    BEFORE INSERT ON public.elections
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_election_identifiers();

CREATE TRIGGER update_admin_controls_updated_at
    BEFORE UPDATE ON public.admin_participation_controls
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_controls_timestamp();

-- 9. SEED ADMIN CONTROLS
-- =====================================================

INSERT INTO public.admin_participation_controls (feature_name, globally_enabled, notes)
VALUES
    ('participation_fees', false, 'Enable/disable participation fees globally or by country'),
    ('biometric_voting', true, 'Enable/disable biometric voting requirements'),
    ('regional_pricing', false, 'Enable/disable regional pricing structure')
ON CONFLICT (feature_name) DO NOTHING;

-- 10. COMPLETION NOTICE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'Enhanced elections features migration completed successfully';
END $$;