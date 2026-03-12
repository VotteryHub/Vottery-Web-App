-- Creator Compliance Documentation System
-- Purpose: Automated tax form generation, jurisdiction-specific compliance, document tracking, and renewal reminders

-- 1. Tax Form Types
CREATE TYPE public.tax_form_type AS ENUM ('1099_MISC', '1099_NEC', 'W9', 'VAT_RETURN', 'GST_RETURN', 'INCOME_TAX', 'WITHHOLDING_CERTIFICATE', 'OTHER');
CREATE TYPE public.document_status AS ENUM ('pending', 'generated', 'submitted', 'approved', 'rejected', 'expired', 'renewal_required');
CREATE TYPE public.compliance_checklist_status AS ENUM ('not_started', 'in_progress', 'completed', 'failed', 'expired');

-- 2. Tax Form Templates
CREATE TABLE IF NOT EXISTS public.tax_form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type public.tax_form_type NOT NULL,
  country_code TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  form_name TEXT NOT NULL,
  form_version TEXT DEFAULT '1.0',
  template_html TEXT NOT NULL,
  required_fields JSONB NOT NULL,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  generation_frequency TEXT DEFAULT 'annual', -- 'monthly', 'quarterly', 'annual'
  filing_deadline TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_form_country UNIQUE (form_type, country_code, form_version)
);

-- 3. Creator Tax Documents
CREATE TABLE IF NOT EXISTS public.creator_tax_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  form_type public.tax_form_type NOT NULL,
  country_code TEXT NOT NULL,
  tax_year INTEGER NOT NULL,
  document_status public.document_status DEFAULT 'pending',
  document_url TEXT,
  document_data JSONB NOT NULL,
  generated_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  renewal_reminder_sent BOOLEAN DEFAULT false,
  renewal_reminder_date TIMESTAMPTZ,
  total_earnings NUMERIC(12, 2) DEFAULT 0.00,
  tax_withheld NUMERIC(12, 2) DEFAULT 0.00,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Compliance Checklists
CREATE TABLE IF NOT EXISTS public.compliance_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  checklist_name TEXT NOT NULL,
  checklist_items JSONB NOT NULL,
  required_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  compliance_frequency TEXT DEFAULT 'annual',
  is_mandatory BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_checklist_jurisdiction UNIQUE (country_code, jurisdiction, checklist_name)
);

-- 5. Creator Compliance Status
CREATE TABLE IF NOT EXISTS public.creator_compliance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  checklist_id UUID REFERENCES public.compliance_checklists(id) ON DELETE CASCADE NOT NULL,
  country_code TEXT NOT NULL,
  status public.compliance_checklist_status DEFAULT 'not_started',
  completed_items JSONB DEFAULT '[]'::jsonb,
  pending_items JSONB DEFAULT '[]'::jsonb,
  completion_percentage NUMERIC(5, 2) DEFAULT 0.00,
  last_reviewed_at TIMESTAMPTZ,
  next_review_date TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_creator_checklist UNIQUE (creator_id, checklist_id)
);

-- 6. Document Expiration Tracking
CREATE TABLE IF NOT EXISTS public.document_expiration_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES public.creator_tax_documents(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  expiration_date TIMESTAMPTZ NOT NULL,
  reminder_schedule JSONB DEFAULT '[{"days_before": 30}, {"days_before": 14}, {"days_before": 7}]'::jsonb,
  reminders_sent JSONB DEFAULT '[]'::jsonb,
  auto_renewal_enabled BOOLEAN DEFAULT false,
  renewal_status TEXT DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Automated Renewal Reminders
CREATE TABLE IF NOT EXISTS public.automated_renewal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  document_id UUID REFERENCES public.creator_tax_documents(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  reminder_date TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  delivery_status TEXT DEFAULT 'pending',
  delivery_channel TEXT DEFAULT 'email',
  reminder_content JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Jurisdiction-Specific Requirements
CREATE TABLE IF NOT EXISTS public.jurisdiction_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_name TEXT NOT NULL,
  description TEXT,
  required_forms TEXT[] DEFAULT ARRAY[]::TEXT[],
  filing_frequency TEXT DEFAULT 'annual',
  deadline_rules JSONB DEFAULT '{}'::jsonb,
  penalties JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Indexes
CREATE INDEX IF NOT EXISTS idx_tax_form_templates_country ON public.tax_form_templates(country_code);
CREATE INDEX IF NOT EXISTS idx_tax_form_templates_type ON public.tax_form_templates(form_type);
CREATE INDEX IF NOT EXISTS idx_creator_tax_documents_creator ON public.creator_tax_documents(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_tax_documents_status ON public.creator_tax_documents(document_status);
CREATE INDEX IF NOT EXISTS idx_creator_tax_documents_expiration ON public.creator_tax_documents(expiration_date);
CREATE INDEX IF NOT EXISTS idx_compliance_checklists_country ON public.compliance_checklists(country_code);
CREATE INDEX IF NOT EXISTS idx_creator_compliance_status_creator ON public.creator_compliance_status(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_compliance_status_status ON public.creator_compliance_status(status);
CREATE INDEX IF NOT EXISTS idx_document_expiration_tracking_creator ON public.document_expiration_tracking(creator_id);
CREATE INDEX IF NOT EXISTS idx_document_expiration_tracking_expiration ON public.document_expiration_tracking(expiration_date);
CREATE INDEX IF NOT EXISTS idx_automated_renewal_reminders_creator ON public.automated_renewal_reminders(creator_id);
CREATE INDEX IF NOT EXISTS idx_automated_renewal_reminders_date ON public.automated_renewal_reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_jurisdiction_requirements_country ON public.jurisdiction_requirements(country_code);

-- 10. Enable RLS
ALTER TABLE public.tax_form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_compliance_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_expiration_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automated_renewal_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisdiction_requirements ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies

-- Tax Form Templates: Public read active, admin manage
CREATE POLICY "public_view_tax_form_templates"
ON public.tax_form_templates
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admin_manage_tax_form_templates"
ON public.tax_form_templates
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Creator Tax Documents: Creators view own, admin view all
CREATE POLICY "creators_view_own_tax_documents"
ON public.creator_tax_documents
FOR SELECT
TO authenticated
USING (creator_id = auth.uid());

CREATE POLICY "creators_create_own_tax_documents"
ON public.creator_tax_documents
FOR INSERT
TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "admin_manage_all_tax_documents"
ON public.creator_tax_documents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Compliance Checklists: Public read active, admin manage
CREATE POLICY "public_view_compliance_checklists"
ON public.compliance_checklists
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admin_manage_compliance_checklists"
ON public.compliance_checklists
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Creator Compliance Status: Creators manage own, admin view all
CREATE POLICY "creators_manage_own_compliance_status"
ON public.creator_compliance_status
FOR ALL
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "admin_view_all_compliance_status"
ON public.creator_compliance_status
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Document Expiration Tracking: Creators view own, admin view all
CREATE POLICY "creators_view_own_expiration_tracking"
ON public.document_expiration_tracking
FOR SELECT
TO authenticated
USING (creator_id = auth.uid());

CREATE POLICY "admin_manage_expiration_tracking"
ON public.document_expiration_tracking
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Automated Renewal Reminders: Creators view own, system create
CREATE POLICY "creators_view_own_renewal_reminders"
ON public.automated_renewal_reminders
FOR SELECT
TO authenticated
USING (creator_id = auth.uid());

CREATE POLICY "system_create_renewal_reminders"
ON public.automated_renewal_reminders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Jurisdiction Requirements: Public read active, admin manage
CREATE POLICY "public_view_jurisdiction_requirements"
ON public.jurisdiction_requirements
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admin_manage_jurisdiction_requirements"
ON public.jurisdiction_requirements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 12. Functions

-- Function to generate tax document
CREATE OR REPLACE FUNCTION public.generate_tax_document(
  p_creator_id UUID,
  p_form_type public.tax_form_type,
  p_country_code TEXT,
  p_tax_year INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_document_id UUID;
  v_template RECORD;
  v_earnings NUMERIC;
BEGIN
  -- Get template
  SELECT * INTO v_template
  FROM public.tax_form_templates
  WHERE form_type = p_form_type
    AND country_code = p_country_code
    AND is_active = true
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_template IS NULL THEN
    RAISE EXCEPTION 'Tax form template not found for % in %', p_form_type, p_country_code;
  END IF;

  -- Calculate earnings for tax year
  SELECT COALESCE(SUM(amount), 0) INTO v_earnings
  FROM public.wallet_transactions
  WHERE user_id = p_creator_id
    AND transaction_type = 'winning'
    AND EXTRACT(YEAR FROM created_at) = p_tax_year;

  -- Create document
  INSERT INTO public.creator_tax_documents (
    creator_id,
    form_type,
    country_code,
    tax_year,
    document_status,
    document_data,
    generated_at,
    total_earnings,
    expiration_date
  ) VALUES (
    p_creator_id,
    p_form_type,
    p_country_code,
    p_tax_year,
    'generated',
    jsonb_build_object(
      'template_id', v_template.id,
      'form_name', v_template.form_name,
      'total_earnings', v_earnings,
      'generated_by', 'system'
    ),
    CURRENT_TIMESTAMP,
    v_earnings,
    CURRENT_TIMESTAMP + INTERVAL '1 year'
  ) RETURNING id INTO v_document_id;

  -- Create expiration tracking
  INSERT INTO public.document_expiration_tracking (
    creator_id,
    document_id,
    document_type,
    document_name,
    expiration_date
  ) VALUES (
    p_creator_id,
    v_document_id,
    p_form_type::TEXT,
    v_template.form_name,
    CURRENT_TIMESTAMP + INTERVAL '1 year'
  );

  RETURN v_document_id;
END;
$$;

-- Function to check expiring documents and schedule reminders
CREATE OR REPLACE FUNCTION public.schedule_expiration_reminders()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tracking RECORD;
  v_reminder_schedule JSONB;
  v_reminder JSONB;
  v_reminder_date TIMESTAMPTZ;
  v_reminders_scheduled INTEGER := 0;
BEGIN
  FOR v_tracking IN
    SELECT *
    FROM public.document_expiration_tracking
    WHERE expiration_date > CURRENT_TIMESTAMP
      AND expiration_date <= CURRENT_TIMESTAMP + INTERVAL '60 days'
  LOOP
    v_reminder_schedule := v_tracking.reminder_schedule;

    FOR v_reminder IN SELECT * FROM jsonb_array_elements(v_reminder_schedule)
    LOOP
      v_reminder_date := v_tracking.expiration_date - (v_reminder->>'days_before')::INTEGER * INTERVAL '1 day';

      IF v_reminder_date >= CURRENT_TIMESTAMP AND NOT EXISTS (
        SELECT 1 FROM public.automated_renewal_reminders
        WHERE document_id = v_tracking.document_id
          AND reminder_date = v_reminder_date
      ) THEN
        INSERT INTO public.automated_renewal_reminders (
          creator_id,
          document_id,
          reminder_type,
          reminder_date,
          reminder_content
        ) VALUES (
          v_tracking.creator_id,
          v_tracking.document_id,
          'expiration_warning',
          v_reminder_date,
          jsonb_build_object(
            'document_name', v_tracking.document_name,
            'expiration_date', v_tracking.expiration_date,
            'days_until_expiration', v_reminder->>'days_before'
          )
        );

        v_reminders_scheduled := v_reminders_scheduled + 1;
      END IF;
    END LOOP;
  END LOOP;

  RETURN v_reminders_scheduled;
END;
$$;

-- 13. Triggers

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_compliance_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_tax_form_templates_timestamp
BEFORE UPDATE ON public.tax_form_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_compliance_timestamp();

CREATE TRIGGER update_creator_tax_documents_timestamp
BEFORE UPDATE ON public.creator_tax_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_compliance_timestamp();

CREATE TRIGGER update_compliance_checklists_timestamp
BEFORE UPDATE ON public.compliance_checklists
FOR EACH ROW
EXECUTE FUNCTION public.update_compliance_timestamp();

CREATE TRIGGER update_creator_compliance_status_timestamp
BEFORE UPDATE ON public.creator_compliance_status
FOR EACH ROW
EXECUTE FUNCTION public.update_compliance_timestamp();

-- 14. Mock Data

DO $$
DECLARE
  v_creator_id UUID;
BEGIN
  SELECT id INTO v_creator_id FROM public.user_profiles LIMIT 1;

  -- Insert tax form templates
  INSERT INTO public.tax_form_templates (form_type, country_code, jurisdiction, form_name, template_html, required_fields, filing_deadline) VALUES
    ('1099_MISC', 'US', 'Federal', '1099-MISC Miscellaneous Income', '<html>1099-MISC Template</html>', '{"payer_name": "required", "payer_tin": "required", "recipient_name": "required", "recipient_tin": "required", "miscellaneous_income": "required"}'::jsonb, 'January 31'),
    ('VAT_RETURN', 'GB', 'HMRC', 'VAT Return Form', '<html>VAT Return Template</html>', '{"vat_registration_number": "required", "total_sales": "required", "total_purchases": "required", "vat_due": "required"}'::jsonb, 'Quarterly'),
    ('GST_RETURN', 'IN', 'GST Council', 'GST Return GSTR-1', '<html>GST Return Template</html>', '{"gstin": "required", "legal_name": "required", "total_taxable_value": "required", "total_tax": "required"}'::jsonb, 'Monthly')
  ON CONFLICT (form_type, country_code, form_version) DO NOTHING;

  -- Insert compliance checklists
  INSERT INTO public.compliance_checklists (country_code, jurisdiction, checklist_name, checklist_items, required_documents) VALUES
    ('US', 'Federal', 'USA Creator Compliance', '[{"id": 1, "item": "Submit W-9 Form", "required": true}, {"id": 2, "item": "Verify Tax ID", "required": true}, {"id": 3, "item": "Banking Details", "required": true}]'::jsonb, ARRAY['W9', '1099_MISC']),
    ('IN', 'GST Council', 'India Creator Compliance', '[{"id": 1, "item": "GST Registration", "required": true}, {"id": 2, "item": "PAN Card Verification", "required": true}, {"id": 3, "item": "Bank Account Details", "required": true}]'::jsonb, ARRAY['GST_RETURN']),
    ('NG', 'Federal', 'Nigeria Creator Compliance', '[{"id": 1, "item": "TIN Verification", "required": true}, {"id": 2, "item": "Bank Verification Number", "required": true}, {"id": 3, "item": "Tax Clearance Certificate", "required": false}]'::jsonb, ARRAY['INCOME_TAX'])
  ON CONFLICT (country_code, jurisdiction, checklist_name) DO NOTHING;

  -- Insert jurisdiction requirements
  INSERT INTO public.jurisdiction_requirements (country_code, jurisdiction, requirement_type, requirement_name, description, required_forms, filing_frequency) VALUES
    ('US', 'Federal', 'tax_reporting', 'Annual 1099 Filing', 'All creators earning over $600 must receive 1099-MISC', ARRAY['1099_MISC'], 'annual'),
    ('GB', 'HMRC', 'vat_compliance', 'Quarterly VAT Return', 'VAT registered creators must file quarterly returns', ARRAY['VAT_RETURN'], 'quarterly'),
    ('IN', 'GST Council', 'gst_compliance', 'Monthly GST Return', 'GST registered creators must file monthly GSTR-1', ARRAY['GST_RETURN'], 'monthly');

  IF v_creator_id IS NOT NULL THEN
    -- Generate sample tax document
    PERFORM public.generate_tax_document(v_creator_id, '1099_MISC', 'US', 2025);
  END IF;

  RAISE NOTICE 'Creator compliance documentation mock data created successfully';
END $$;