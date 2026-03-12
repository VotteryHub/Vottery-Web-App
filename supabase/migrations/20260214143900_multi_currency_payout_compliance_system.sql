-- Multi-Currency Payout Processing, Creator Compliance Documentation, and Localization & Tax Reporting System
-- Migration: 20260214143900

-- ============================================
-- MULTI-CURRENCY PAYOUT PROCESSING TABLES
-- ============================================

-- Exchange rate cache for real-time currency conversion
CREATE TABLE IF NOT EXISTS public.payout_exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL,
  exchange_rate DECIMAL(18, 8) NOT NULL,
  provider TEXT NOT NULL, -- 'exchangerate-api', 'fixer', 'manual'
  rate_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(base_currency, target_currency, rate_timestamp)
);

CREATE INDEX idx_exchange_rates_currencies ON public.payout_exchange_rates(base_currency, target_currency);
CREATE INDEX idx_exchange_rates_timestamp ON public.payout_exchange_rates(rate_timestamp DESC);

-- Local banking methods per country/creator
CREATE TABLE IF NOT EXISTS public.creator_payout_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  banking_method TEXT NOT NULL, -- 'ACH', 'UPI', 'SWIFT', 'SEPA', 'LOCAL_BANK'
  account_details JSONB NOT NULL DEFAULT '{}', -- Encrypted banking details
  currency TEXT NOT NULL DEFAULT 'USD',
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMPTZ,
  processing_fee_percentage DECIMAL(5, 2) DEFAULT 0.00,
  processing_fee_fixed DECIMAL(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_verification')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, banking_method, country_code)
);

CREATE INDEX idx_creator_payout_methods_creator ON public.creator_payout_methods(creator_id);
CREATE INDEX idx_creator_payout_methods_country ON public.creator_payout_methods(country_code);

-- Fee structures per zone/country
CREATE TABLE IF NOT EXISTS public.payout_fee_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL,
  country_codes TEXT[] NOT NULL,
  banking_method TEXT NOT NULL,
  processing_fee_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  processing_fee_fixed DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency_conversion_fee DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  min_payout_amount DECIMAL(10, 2) DEFAULT 10.00,
  max_payout_amount DECIMAL(10, 2),
  processing_time_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fee_zones_countries ON public.payout_fee_zones USING GIN(country_codes);

-- Transaction confirmation and audit trail
CREATE TABLE IF NOT EXISTS public.payout_transaction_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id UUID NOT NULL,
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  original_amount DECIMAL(10, 2) NOT NULL,
  original_currency TEXT NOT NULL DEFAULT 'USD',
  exchange_rate DECIMAL(18, 8),
  converted_amount DECIMAL(10, 2),
  target_currency TEXT,
  processing_fee DECIMAL(10, 2) DEFAULT 0.00,
  currency_conversion_fee DECIMAL(10, 2) DEFAULT 0.00,
  final_amount DECIMAL(10, 2) NOT NULL,
  banking_method TEXT NOT NULL,
  transaction_reference TEXT,
  confirmation_code TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  audit_trail JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_payout_confirmations_creator ON public.payout_transaction_confirmations(creator_id);
CREATE INDEX idx_payout_confirmations_status ON public.payout_transaction_confirmations(status);
CREATE INDEX idx_payout_confirmations_date ON public.payout_transaction_confirmations(created_at DESC);

-- ============================================
-- CREATOR COMPLIANCE DOCUMENTATION TABLES
-- ============================================

-- Tax form generation and tracking
CREATE TABLE IF NOT EXISTS public.creator_tax_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  tax_year INTEGER NOT NULL,
  form_type TEXT NOT NULL, -- '1099-MISC', 'VAT', 'GST', 'W9', 'W8-BEN'
  form_data JSONB NOT NULL DEFAULT '{}',
  generated_pdf_url TEXT,
  total_earnings DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  tax_withheld DECIMAL(10, 2) DEFAULT 0.00,
  generation_date TIMESTAMPTZ DEFAULT NOW(),
  expiration_date TIMESTAMPTZ,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'filed', 'expired', 'amended')),
  sent_to_creator_at TIMESTAMPTZ,
  filed_with_authority_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, tax_year, form_type)
);

CREATE INDEX idx_tax_forms_creator ON public.creator_tax_forms(creator_id);
CREATE INDEX idx_tax_forms_year ON public.creator_tax_forms(tax_year DESC);
CREATE INDEX idx_tax_forms_expiration ON public.creator_tax_forms(expiration_date);
CREATE INDEX idx_tax_forms_status ON public.creator_tax_forms(status);

-- Jurisdiction-specific compliance checklists
CREATE TABLE IF NOT EXISTS public.compliance_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '[]', -- Array of requirement objects
  tax_registration_required BOOLEAN DEFAULT false,
  business_license_required BOOLEAN DEFAULT false,
  banking_docs_required BOOLEAN DEFAULT false,
  identity_verification_required BOOLEAN DEFAULT true,
  additional_docs JSONB DEFAULT '[]',
  compliance_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_checklists_country ON public.compliance_checklists(country_code);

-- Creator compliance documents storage
CREATE TABLE IF NOT EXISTS public.creator_compliance_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'tax_registration', 'business_license', 'banking_doc', 'identity_doc'
  document_name TEXT NOT NULL,
  document_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  issue_date DATE,
  expiration_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  reviewed_by UUID REFERENCES public.user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_docs_creator ON public.creator_compliance_documents(creator_id);
CREATE INDEX idx_compliance_docs_expiration ON public.creator_compliance_documents(expiration_date);
CREATE INDEX idx_compliance_docs_status ON public.creator_compliance_documents(status);

-- Document expiration tracking and renewal workflows
CREATE TABLE IF NOT EXISTS public.document_renewal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.creator_compliance_documents(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('30_days', '15_days', '7_days', 'expired')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  delivery_method TEXT DEFAULT 'email' CHECK (delivery_method IN ('email', 'sms', 'in_app')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_renewal_reminders_scheduled ON public.document_renewal_reminders(scheduled_for);
CREATE INDEX idx_renewal_reminders_status ON public.document_renewal_reminders(status);

-- ============================================
-- LOCALIZATION & TAX REPORTING TABLES
-- ============================================

-- Multi-language compliance messaging
CREATE TABLE IF NOT EXISTS public.compliance_messages_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_key TEXT NOT NULL,
  language_code TEXT NOT NULL,
  country_code TEXT,
  message_content TEXT NOT NULL,
  message_category TEXT NOT NULL, -- 'tax_form', 'compliance_doc', 'reminder', 'notification'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_key, language_code, country_code)
);

CREATE INDEX idx_compliance_messages_key ON public.compliance_messages_i18n(message_key);
CREATE INDEX idx_compliance_messages_lang ON public.compliance_messages_i18n(language_code);

-- Region-specific tax documentation templates
CREATE TABLE IF NOT EXISTS public.tax_documentation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  form_type TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}',
  required_fields JSONB NOT NULL DEFAULT '[]',
  validation_rules JSONB DEFAULT '{}',
  pdf_template_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_code, form_type)
);

CREATE INDEX idx_tax_templates_country ON public.tax_documentation_templates(country_code);

-- Automated annual tax report schedules
CREATE TABLE IF NOT EXISTS public.tax_report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'annual_summary', 'quarterly_report', 'monthly_statement'
  tax_year INTEGER NOT NULL,
  generation_date DATE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'generating', 'completed', 'failed')),
  report_url TEXT,
  creators_included INTEGER DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0.00,
  generated_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tax_schedules_country ON public.tax_report_schedules(country_code);
CREATE INDEX idx_tax_schedules_year ON public.tax_report_schedules(tax_year DESC);
CREATE INDEX idx_tax_schedules_status ON public.tax_report_schedules(status);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Exchange rates (public read, admin write)
ALTER TABLE public.payout_exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exchange rates are viewable by authenticated users"
  ON public.payout_exchange_rates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Exchange rates are manageable by admins"
  ON public.payout_exchange_rates FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Creator payout methods (creator owns, admin views)
ALTER TABLE public.creator_payout_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage their own payout methods"
  ON public.creator_payout_methods FOR ALL
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can view all payout methods"
  ON public.creator_payout_methods FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Fee zones (public read, admin write)
ALTER TABLE public.payout_fee_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fee zones are viewable by authenticated users"
  ON public.payout_fee_zones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Fee zones are manageable by admins"
  ON public.payout_fee_zones FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Transaction confirmations (creator owns, admin views)
ALTER TABLE public.payout_transaction_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own transaction confirmations"
  ON public.payout_transaction_confirmations FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can manage all transaction confirmations"
  ON public.payout_transaction_confirmations FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Tax forms (creator owns, admin manages)
ALTER TABLE public.creator_tax_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own tax forms"
  ON public.creator_tax_forms FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can manage all tax forms"
  ON public.creator_tax_forms FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Compliance checklists (public read, admin write)
ALTER TABLE public.compliance_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Compliance checklists are viewable by authenticated users"
  ON public.compliance_checklists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Compliance checklists are manageable by admins"
  ON public.compliance_checklists FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Compliance documents (creator owns, admin reviews)
ALTER TABLE public.creator_compliance_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage their own compliance documents"
  ON public.creator_compliance_documents FOR ALL
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can manage all compliance documents"
  ON public.creator_compliance_documents FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Renewal reminders (creator views own, admin manages)
ALTER TABLE public.document_renewal_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their own renewal reminders"
  ON public.document_renewal_reminders FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can manage all renewal reminders"
  ON public.document_renewal_reminders FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Compliance messages (public read, admin write)
ALTER TABLE public.compliance_messages_i18n ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Compliance messages are viewable by authenticated users"
  ON public.compliance_messages_i18n FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Compliance messages are manageable by admins"
  ON public.compliance_messages_i18n FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Tax templates (public read, admin write)
ALTER TABLE public.tax_documentation_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tax templates are viewable by authenticated users"
  ON public.tax_documentation_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Tax templates are manageable by admins"
  ON public.tax_documentation_templates FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Tax report schedules (admin only)
ALTER TABLE public.tax_report_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tax report schedules are manageable by admins"
  ON public.tax_report_schedules FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Get latest exchange rate
CREATE OR REPLACE FUNCTION public.get_latest_exchange_rate(
  p_base_currency TEXT,
  p_target_currency TEXT
)
RETURNS DECIMAL(18, 8) AS $$
DECLARE
  v_rate DECIMAL(18, 8);
BEGIN
  SELECT exchange_rate INTO v_rate
  FROM public.payout_exchange_rates
  WHERE base_currency = p_base_currency
    AND target_currency = p_target_currency
    AND is_active = true
  ORDER BY rate_timestamp DESC
  LIMIT 1;
  
  RETURN COALESCE(v_rate, 1.0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate payout with fees
CREATE OR REPLACE FUNCTION public.calculate_payout_with_fees(
  p_creator_id UUID,
  p_amount DECIMAL(10, 2),
  p_country_code TEXT,
  p_banking_method TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_fee_zone RECORD;
  v_processing_fee DECIMAL(10, 2);
  v_conversion_fee DECIMAL(10, 2);
  v_final_amount DECIMAL(10, 2);
BEGIN
  -- Get fee zone for country and banking method
  SELECT * INTO v_fee_zone
  FROM public.payout_fee_zones
  WHERE p_country_code = ANY(country_codes)
    AND banking_method = p_banking_method
    AND is_active = true
  LIMIT 1;
  
  IF v_fee_zone IS NULL THEN
    -- Default fees if no zone found
    v_processing_fee := p_amount * 0.02; -- 2% default
    v_conversion_fee := 0;
  ELSE
    v_processing_fee := (p_amount * v_fee_zone.processing_fee_percentage / 100) + v_fee_zone.processing_fee_fixed;
    v_conversion_fee := p_amount * v_fee_zone.currency_conversion_fee / 100;
  END IF;
  
  v_final_amount := p_amount - v_processing_fee - v_conversion_fee;
  
  RETURN jsonb_build_object(
    'original_amount', p_amount,
    'processing_fee', v_processing_fee,
    'conversion_fee', v_conversion_fee,
    'final_amount', v_final_amount,
    'fee_zone', v_fee_zone.zone_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate tax form
CREATE OR REPLACE FUNCTION public.generate_tax_form(
  p_creator_id UUID,
  p_country_code TEXT,
  p_tax_year INTEGER,
  p_form_type TEXT
)
RETURNS UUID AS $$
DECLARE
  v_form_id UUID;
  v_total_earnings DECIMAL(10, 2);
BEGIN
  -- Calculate total earnings for the year
  SELECT COALESCE(SUM(amount), 0) INTO v_total_earnings
  FROM public.wallet_transactions
  WHERE user_id = p_creator_id
    AND transaction_type = 'winning'
    AND EXTRACT(YEAR FROM created_at) = p_tax_year;
  
  -- Insert or update tax form
  INSERT INTO public.creator_tax_forms (
    creator_id,
    country_code,
    tax_year,
    form_type,
    total_earnings,
    status
  ) VALUES (
    p_creator_id,
    p_country_code,
    p_tax_year,
    p_form_type,
    v_total_earnings,
    'generated'
  )
  ON CONFLICT (creator_id, tax_year, form_type)
  DO UPDATE SET
    total_earnings = v_total_earnings,
    generation_date = NOW(),
    updated_at = NOW()
  RETURNING id INTO v_form_id;
  
  RETURN v_form_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule document renewal reminders
CREATE OR REPLACE FUNCTION public.schedule_renewal_reminders(
  p_document_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_document RECORD;
BEGIN
  SELECT * INTO v_document
  FROM public.creator_compliance_documents
  WHERE id = p_document_id;
  
  IF v_document.expiration_date IS NOT NULL THEN
    -- Schedule 30-day reminder
    INSERT INTO public.document_renewal_reminders (document_id, creator_id, reminder_type, scheduled_for)
    VALUES (p_document_id, v_document.creator_id, '30_days', v_document.expiration_date - INTERVAL '30 days')
    ON CONFLICT DO NOTHING;
    
    -- Schedule 15-day reminder
    INSERT INTO public.document_renewal_reminders (document_id, creator_id, reminder_type, scheduled_for)
    VALUES (p_document_id, v_document.creator_id, '15_days', v_document.expiration_date - INTERVAL '15 days')
    ON CONFLICT DO NOTHING;
    
    -- Schedule 7-day reminder
    INSERT INTO public.document_renewal_reminders (document_id, creator_id, reminder_type, scheduled_for)
    VALUES (p_document_id, v_document.creator_id, '7_days', v_document.expiration_date - INTERVAL '7 days')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to schedule reminders on document insert/update
CREATE OR REPLACE FUNCTION public.trigger_schedule_renewal_reminders()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.schedule_renewal_reminders(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schedule_reminders_on_document_change
  AFTER INSERT OR UPDATE OF expiration_date
  ON public.creator_compliance_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_schedule_renewal_reminders();