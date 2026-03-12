-- Multi-Currency Payout Processing System
-- Purpose: Enable international creator payouts with real-time exchange rates, local banking methods, and automated currency conversion

-- 1. Exchange Rates Table
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL,
  rate NUMERIC(12, 6) NOT NULL,
  provider TEXT DEFAULT 'openexchangerates',
  last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT unique_currency_pair UNIQUE (base_currency, target_currency)
);

-- 2. Banking Methods Configuration
CREATE TYPE public.banking_method_type AS ENUM ('ACH', 'UPI', 'SWIFT', 'SEPA', 'WIRE', 'PAYPAL', 'STRIPE', 'CRYPTO');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'on_hold');

CREATE TABLE IF NOT EXISTS public.banking_methods_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method_type public.banking_method_type NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  processing_time_days INTEGER DEFAULT 3,
  minimum_amount NUMERIC(10, 2) DEFAULT 10.00,
  maximum_amount NUMERIC(10, 2) DEFAULT 100000.00,
  supported_currencies TEXT[] DEFAULT ARRAY['USD'],
  required_fields JSONB DEFAULT '{}'::jsonb,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_method_country UNIQUE (method_type, country_code)
);

-- 3. Payout Fee Structures
CREATE TABLE IF NOT EXISTS public.payout_fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  zone public.zone_identifier,
  banking_method public.banking_method_type NOT NULL,
  fee_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed', 'tiered'
  fee_percentage NUMERIC(5, 2) DEFAULT 0.00,
  fixed_fee NUMERIC(10, 2) DEFAULT 0.00,
  minimum_fee NUMERIC(10, 2) DEFAULT 0.00,
  maximum_fee NUMERIC(10, 2) DEFAULT 999999.99,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  effective_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  effective_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Multi-Currency Payouts
CREATE TABLE IF NOT EXISTS public.multi_currency_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES public.user_wallets(id) ON DELETE CASCADE NOT NULL,
  source_amount NUMERIC(12, 2) NOT NULL,
  source_currency TEXT NOT NULL DEFAULT 'USD',
  target_amount NUMERIC(12, 2) NOT NULL,
  target_currency TEXT NOT NULL,
  exchange_rate NUMERIC(12, 6) NOT NULL,
  banking_method public.banking_method_type NOT NULL,
  country_code TEXT NOT NULL,
  payout_status public.payout_status DEFAULT 'pending',
  processing_fee NUMERIC(10, 2) DEFAULT 0.00,
  net_amount NUMERIC(12, 2) NOT NULL,
  banking_details JSONB NOT NULL,
  transaction_reference TEXT,
  confirmation_code TEXT,
  initiated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Payout Audit Trail
CREATE TABLE IF NOT EXISTS public.payout_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id UUID REFERENCES public.multi_currency_payouts(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  previous_status public.payout_status,
  new_status public.payout_status,
  event_description TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  performed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Currency Conversion Logs
CREATE TABLE IF NOT EXISTS public.currency_conversion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id UUID REFERENCES public.multi_currency_payouts(id) ON DELETE CASCADE,
  source_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  source_amount NUMERIC(12, 2) NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL,
  exchange_rate NUMERIC(12, 6) NOT NULL,
  rate_provider TEXT DEFAULT 'openexchangerates',
  conversion_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON public.exchange_rates(base_currency, target_currency);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_active ON public.exchange_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_banking_methods_country ON public.banking_methods_config(country_code);
CREATE INDEX IF NOT EXISTS idx_banking_methods_type ON public.banking_methods_config(method_type);
CREATE INDEX IF NOT EXISTS idx_payout_fees_country ON public.payout_fee_structures(country_code);
CREATE INDEX IF NOT EXISTS idx_payout_fees_method ON public.payout_fee_structures(banking_method);
CREATE INDEX IF NOT EXISTS idx_multi_currency_payouts_creator ON public.multi_currency_payouts(creator_id);
CREATE INDEX IF NOT EXISTS idx_multi_currency_payouts_status ON public.multi_currency_payouts(payout_status);
CREATE INDEX IF NOT EXISTS idx_multi_currency_payouts_country ON public.multi_currency_payouts(country_code);
CREATE INDEX IF NOT EXISTS idx_payout_audit_trail_payout ON public.payout_audit_trail(payout_id);
CREATE INDEX IF NOT EXISTS idx_currency_conversion_logs_payout ON public.currency_conversion_logs(payout_id);

-- 8. Enable RLS
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banking_methods_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multi_currency_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_conversion_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies

-- Exchange Rates: Public read, admin write
CREATE POLICY "public_view_exchange_rates"
ON public.exchange_rates
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admin_manage_exchange_rates"
ON public.exchange_rates
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Banking Methods: Public read active, admin manage
CREATE POLICY "public_view_banking_methods"
ON public.banking_methods_config
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admin_manage_banking_methods"
ON public.banking_methods_config
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Payout Fee Structures: Admin only
CREATE POLICY "admin_manage_payout_fees"
ON public.payout_fee_structures
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Multi-Currency Payouts: Creators view own, admin view all
CREATE POLICY "creators_view_own_payouts"
ON public.multi_currency_payouts
FOR SELECT
TO authenticated
USING (creator_id = auth.uid());

CREATE POLICY "creators_create_own_payouts"
ON public.multi_currency_payouts
FOR INSERT
TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "admin_manage_all_payouts"
ON public.multi_currency_payouts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Payout Audit Trail: Creators view own, admin view all
CREATE POLICY "creators_view_own_audit_trail"
ON public.payout_audit_trail
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.multi_currency_payouts
    WHERE id = payout_audit_trail.payout_id AND creator_id = auth.uid()
  )
);

CREATE POLICY "admin_view_all_audit_trail"
ON public.payout_audit_trail
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Currency Conversion Logs: Creators view own, admin view all
CREATE POLICY "creators_view_own_conversion_logs"
ON public.currency_conversion_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.multi_currency_payouts
    WHERE id = currency_conversion_logs.payout_id AND creator_id = auth.uid()
  )
);

CREATE POLICY "admin_view_all_conversion_logs"
ON public.currency_conversion_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 10. Functions

-- Function to get current exchange rate
CREATE OR REPLACE FUNCTION public.get_exchange_rate(
  p_source_currency TEXT,
  p_target_currency TEXT
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rate NUMERIC;
BEGIN
  IF p_source_currency = p_target_currency THEN
    RETURN 1.0;
  END IF;

  SELECT rate INTO v_rate
  FROM public.exchange_rates
  WHERE base_currency = p_source_currency
    AND target_currency = p_target_currency
    AND is_active = true
  ORDER BY last_updated DESC
  LIMIT 1;

  IF v_rate IS NULL THEN
    RAISE EXCEPTION 'Exchange rate not found for % to %', p_source_currency, p_target_currency;
  END IF;

  RETURN v_rate;
END;
$$;

-- Function to calculate payout fee
CREATE OR REPLACE FUNCTION public.calculate_payout_fee(
  p_country_code TEXT,
  p_banking_method public.banking_method_type,
  p_amount NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_fee NUMERIC := 0.00;
  v_fee_structure RECORD;
BEGIN
  SELECT * INTO v_fee_structure
  FROM public.payout_fee_structures
  WHERE country_code = p_country_code
    AND banking_method = p_banking_method
    AND is_active = true
    AND (effective_from IS NULL OR effective_from <= CURRENT_TIMESTAMP)
    AND (effective_until IS NULL OR effective_until > CURRENT_TIMESTAMP)
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_fee_structure IS NULL THEN
    RETURN 0.00;
  END IF;

  IF v_fee_structure.fee_type = 'percentage' THEN
    v_fee := p_amount * (v_fee_structure.fee_percentage / 100);
  ELSIF v_fee_structure.fee_type = 'fixed' THEN
    v_fee := v_fee_structure.fixed_fee;
  END IF;

  -- Apply minimum and maximum fee constraints
  v_fee := GREATEST(v_fee, v_fee_structure.minimum_fee);
  v_fee := LEAST(v_fee, v_fee_structure.maximum_fee);

  RETURN v_fee;
END;
$$;

-- Function to update payout status with audit trail
CREATE OR REPLACE FUNCTION public.update_payout_status(
  p_payout_id UUID,
  p_new_status public.payout_status,
  p_event_description TEXT,
  p_event_data JSONB DEFAULT '{}'::jsonb
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_previous_status public.payout_status;
BEGIN
  SELECT payout_status INTO v_previous_status
  FROM public.multi_currency_payouts
  WHERE id = p_payout_id;

  IF v_previous_status IS NULL THEN
    RAISE EXCEPTION 'Payout not found';
  END IF;

  UPDATE public.multi_currency_payouts
  SET payout_status = p_new_status,
      updated_at = CURRENT_TIMESTAMP,
      processed_at = CASE WHEN p_new_status = 'processing' THEN CURRENT_TIMESTAMP ELSE processed_at END,
      completed_at = CASE WHEN p_new_status = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
  WHERE id = p_payout_id;

  INSERT INTO public.payout_audit_trail (
    payout_id,
    event_type,
    previous_status,
    new_status,
    event_description,
    event_data,
    performed_by
  ) VALUES (
    p_payout_id,
    'status_change',
    v_previous_status,
    p_new_status,
    p_event_description,
    p_event_data,
    auth.uid()
  );

  RETURN true;
END;
$$;

-- 11. Triggers

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_payout_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_banking_methods_timestamp
BEFORE UPDATE ON public.banking_methods_config
FOR EACH ROW
EXECUTE FUNCTION public.update_payout_timestamp();

CREATE TRIGGER update_payout_fee_structures_timestamp
BEFORE UPDATE ON public.payout_fee_structures
FOR EACH ROW
EXECUTE FUNCTION public.update_payout_timestamp();

CREATE TRIGGER update_multi_currency_payouts_timestamp
BEFORE UPDATE ON public.multi_currency_payouts
FOR EACH ROW
EXECUTE FUNCTION public.update_payout_timestamp();

-- 12. Mock Data

DO $$
BEGIN
  -- Insert exchange rates
  INSERT INTO public.exchange_rates (base_currency, target_currency, rate, provider) VALUES
    ('USD', 'INR', 83.25, 'openexchangerates'),
    ('USD', 'NGN', 1580.50, 'openexchangerates'),
    ('USD', 'EUR', 0.92, 'openexchangerates'),
    ('USD', 'GBP', 0.79, 'openexchangerates'),
    ('USD', 'JPY', 149.85, 'openexchangerates'),
    ('USD', 'CAD', 1.36, 'openexchangerates'),
    ('USD', 'AUD', 1.52, 'openexchangerates')
  ON CONFLICT (base_currency, target_currency) DO NOTHING;

  -- Insert banking methods configuration
  INSERT INTO public.banking_methods_config (method_type, country_code, country_name, processing_time_days, minimum_amount, supported_currencies, required_fields) VALUES
    ('ACH', 'US', 'United States', 3, 10.00, ARRAY['USD'], '{"account_number": "required", "routing_number": "required", "account_type": "required"}'::jsonb),
    ('UPI', 'IN', 'India', 1, 10.00, ARRAY['INR'], '{"upi_id": "required", "phone_number": "required"}'::jsonb),
    ('SWIFT', 'NG', 'Nigeria', 5, 50.00, ARRAY['NGN', 'USD'], '{"account_number": "required", "swift_code": "required", "bank_name": "required", "account_holder_name": "required"}'::jsonb),
    ('SEPA', 'DE', 'Germany', 2, 10.00, ARRAY['EUR'], '{"iban": "required", "bic": "required", "account_holder_name": "required"}'::jsonb),
    ('WIRE', 'GB', 'United Kingdom', 3, 50.00, ARRAY['GBP', 'USD'], '{"account_number": "required", "sort_code": "required", "account_holder_name": "required"}'::jsonb)
  ON CONFLICT (method_type, country_code) DO NOTHING;

  -- Insert payout fee structures
  INSERT INTO public.payout_fee_structures (country_code, banking_method, fee_type, fee_percentage, fixed_fee, minimum_fee, maximum_fee, currency) VALUES
    ('US', 'ACH', 'percentage', 1.50, 0.00, 0.50, 10.00, 'USD'),
    ('IN', 'UPI', 'percentage', 0.50, 0.00, 0.25, 5.00, 'INR'),
    ('NG', 'SWIFT', 'fixed', 0.00, 25.00, 25.00, 50.00, 'USD'),
    ('DE', 'SEPA', 'percentage', 1.00, 0.00, 0.50, 15.00, 'EUR'),
    ('GB', 'WIRE', 'percentage', 2.00, 0.00, 1.00, 20.00, 'GBP');

  RAISE NOTICE 'Multi-currency payout processing mock data created successfully';
END $$;