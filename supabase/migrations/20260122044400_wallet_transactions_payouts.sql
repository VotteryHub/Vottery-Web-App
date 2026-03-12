-- =====================================================
-- VOTTERY PLATFORM: Wallet, Transactions, and Payouts
-- Migration: 20260122044400_wallet_transactions_payouts.sql
-- =====================================================

-- 1. CUSTOM TYPES
-- =====================================================

CREATE TYPE public.transaction_type AS ENUM ('winning', 'redemption', 'payout', 'refund', 'fee');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.redemption_type AS ENUM ('cash', 'gift_card', 'crypto', 'bank_transfer');
CREATE TYPE public.redemption_status AS ENUM ('pending', 'processing', 'completed', 'rejected');
CREATE TYPE public.payout_method AS ENUM ('bank_transfer', 'paypal', 'stripe', 'crypto_wallet');

-- 2. CORE TABLES
-- =====================================================

-- User Wallets
CREATE TABLE public.user_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    available_balance DECIMAL(10,2) DEFAULT 0.00,
    locked_balance DECIMAL(10,2) DEFAULT 0.00,
    total_winnings DECIMAL(10,2) DEFAULT 0.00,
    total_redeemed DECIMAL(10,2) DEFAULT 0.00,
    total_payouts DECIMAL(10,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Transactions
CREATE TABLE public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.user_wallets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    transaction_type public.transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    status public.transaction_status DEFAULT 'pending'::public.transaction_status,
    description TEXT,
    reference_id TEXT,
    election_id UUID REFERENCES public.elections(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Prize Redemptions
CREATE TABLE public.prize_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    wallet_id UUID REFERENCES public.user_wallets(id) ON DELETE CASCADE NOT NULL,
    redemption_type public.redemption_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    conversion_rate DECIMAL(10,4) DEFAULT 1.0000,
    final_amount DECIMAL(10,2) NOT NULL,
    status public.redemption_status DEFAULT 'pending'::public.redemption_status,
    payment_details JSONB DEFAULT '{}'::jsonb,
    transaction_id UUID REFERENCES public.wallet_transactions(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT,
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Payout Settings
CREATE TABLE public.payout_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    auto_payout_enabled BOOLEAN DEFAULT false,
    minimum_payout_threshold DECIMAL(10,2) DEFAULT 100.00,
    preferred_method public.payout_method DEFAULT 'bank_transfer'::public.payout_method,
    payout_schedule TEXT DEFAULT 'manual',
    bank_details JSONB DEFAULT '{}'::jsonb,
    crypto_wallet_address TEXT,
    paypal_email TEXT,
    stripe_account_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES
-- =====================================================

CREATE INDEX idx_user_wallets_user_id ON public.user_wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_type ON public.wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_transactions_status ON public.wallet_transactions(status);
CREATE INDEX idx_prize_redemptions_user_id ON public.prize_redemptions(user_id);
CREATE INDEX idx_prize_redemptions_status ON public.prize_redemptions(status);
CREATE INDEX idx_payout_settings_user_id ON public.payout_settings(user_id);

-- 4. FUNCTIONS (BEFORE RLS POLICIES)
-- =====================================================

-- Function to create wallet automatically for new user
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_wallets (user_id, available_balance, locked_balance, total_winnings)
    VALUES (NEW.id, 0.00, 0.00, 0.00);
    
    INSERT INTO public.payout_settings (user_id, auto_payout_enabled, minimum_payout_threshold)
    VALUES (NEW.id, false, 100.00);
    
    RETURN NEW;
END;
$$;

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
        IF NEW.transaction_type = 'winning' THEN
            UPDATE public.user_wallets
            SET available_balance = available_balance + NEW.amount,
                total_winnings = total_winnings + NEW.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.wallet_id;
        ELSIF NEW.transaction_type IN ('redemption', 'payout') THEN
            UPDATE public.user_wallets
            SET available_balance = available_balance - NEW.amount,
                total_redeemed = total_redeemed + NEW.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.wallet_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_wallet_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_settings ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES
-- =====================================================

-- User Wallets Policies
CREATE POLICY "users_manage_own_user_wallets"
ON public.user_wallets
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Wallet Transactions Policies
CREATE POLICY "users_view_own_wallet_transactions"
ON public.wallet_transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "users_create_own_wallet_transactions"
ON public.wallet_transactions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Prize Redemptions Policies
CREATE POLICY "users_manage_own_prize_redemptions"
ON public.prize_redemptions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Payout Settings Policies
CREATE POLICY "users_manage_own_payout_settings"
ON public.payout_settings
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. TRIGGERS
-- =====================================================

-- Trigger to create wallet for new user
CREATE TRIGGER on_user_profile_created_wallet
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_wallet();

-- Trigger to update wallet balance on transaction
CREATE TRIGGER on_transaction_completed
    AFTER INSERT ON public.wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_wallet_balance();

-- Trigger to update timestamps
CREATE TRIGGER update_user_wallets_updated_at
    BEFORE UPDATE ON public.user_wallets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_wallet_updated_at();

CREATE TRIGGER update_prize_redemptions_updated_at
    BEFORE UPDATE ON public.prize_redemptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_wallet_updated_at();

CREATE TRIGGER update_payout_settings_updated_at
    BEFORE UPDATE ON public.payout_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_wallet_updated_at();

-- 8. MOCK DATA
-- =====================================================

DO $$
DECLARE
    existing_user_id UUID;
    v_wallet_id UUID;
    v_transaction_id UUID;
BEGIN
    -- Get existing user from user_profiles
    SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    
    IF existing_user_id IS NOT NULL THEN
        -- Create wallet for existing user
        INSERT INTO public.user_wallets (id, user_id, available_balance, locked_balance, total_winnings, currency)
        VALUES (gen_random_uuid(), existing_user_id, 2500.00, 500.00, 3000.00, 'INR')
        RETURNING id INTO v_wallet_id;
        
        -- Create sample transactions
        INSERT INTO public.wallet_transactions (wallet_id, user_id, transaction_type, amount, balance_before, balance_after, status, description, reference_id)
        VALUES 
            (v_wallet_id, existing_user_id, 'winning'::public.transaction_type, 1500.00, 0.00, 1500.00, 'completed'::public.transaction_status, 'Prize from Climate Action Election', 'WIN-2026-001'),
            (v_wallet_id, existing_user_id, 'winning'::public.transaction_type, 1500.00, 1500.00, 3000.00, 'completed'::public.transaction_status, 'Prize from Tech Innovation Poll', 'WIN-2026-002'),
            (v_wallet_id, existing_user_id, 'redemption'::public.transaction_type, 500.00, 3000.00, 2500.00, 'completed'::public.transaction_status, 'Redeemed to bank account', 'RED-2026-001');
        
        -- Get the redemption transaction ID
        SELECT id INTO v_transaction_id FROM public.wallet_transactions 
        WHERE wallet_id = v_wallet_id AND reference_id = 'RED-2026-001' LIMIT 1;
        
        -- Create sample redemption
        INSERT INTO public.prize_redemptions (user_id, wallet_id, redemption_type, amount, conversion_rate, final_amount, status, transaction_id, processing_fee)
        VALUES 
            (existing_user_id, v_wallet_id, 'bank_transfer'::public.redemption_type, 500.00, 1.0000, 500.00, 'completed'::public.redemption_status, v_transaction_id, 10.00);
        
        -- Create payout settings
        INSERT INTO public.payout_settings (user_id, auto_payout_enabled, minimum_payout_threshold, preferred_method, payout_schedule)
        VALUES 
            (existing_user_id, true, 1000.00, 'bank_transfer'::public.payout_method, 'weekly')
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Wallet mock data created successfully for user %', existing_user_id;
    ELSE
        RAISE NOTICE 'No existing users found. Run user profiles migration first.';
    END IF;
END $$;