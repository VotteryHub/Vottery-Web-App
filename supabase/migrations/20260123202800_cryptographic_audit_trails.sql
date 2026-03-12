-- =====================================================
-- VOTTERY PLATFORM: Cryptographic Audit Trails & Bulletin Board
-- Migration: 20260123202800_cryptographic_audit_trails.sql
-- =====================================================

-- 1. PUBLIC BULLETIN BOARD
-- =====================================================

CREATE TABLE public.bulletin_board_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('vote_cast', 'election_created', 'vote_tallied', 'audit_performed', 'election_modified')),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    transaction_hash TEXT NOT NULL UNIQUE,
    previous_hash TEXT,
    merkle_root TEXT,
    cryptographic_proof JSONB DEFAULT '{}'::jsonb,
    proof_type TEXT CHECK (proof_type IN ('rsa', 'elgamal', 'zkp', 'merkle')),
    proof_available BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. TAMPER-EVIDENT AUDIT LOGS
-- =====================================================

CREATE TABLE public.cryptographic_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_index INTEGER NOT NULL,
    action TEXT NOT NULL,
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    details TEXT,
    log_hash TEXT NOT NULL,
    previous_log_hash TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    cryptographic_signature TEXT,
    verified BOOLEAN DEFAULT false
);

-- 3. ZERO-KNOWLEDGE PROOFS STORAGE
-- =====================================================

CREATE TABLE public.zero_knowledge_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vote_id UUID REFERENCES public.votes(id) ON DELETE CASCADE,
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    commitment TEXT NOT NULL,
    challenge TEXT NOT NULL,
    response TEXT NOT NULL,
    public_key TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. THRESHOLD CRYPTOGRAPHY KEY SHARES
-- =====================================================

CREATE TABLE public.trustee_key_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    trustee_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    share_index INTEGER NOT NULL,
    encrypted_share TEXT NOT NULL,
    public_verification_key TEXT NOT NULL,
    threshold INTEGER NOT NULL,
    total_trustees INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(election_id, trustee_id, share_index)
);

-- 5. VVSG 2.0 COMPLIANCE TRACKING
-- =====================================================

CREATE TABLE public.vvsg_compliance_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name TEXT NOT NULL,
    test_category TEXT NOT NULL,
    vvsg_requirement TEXT NOT NULL,
    test_status TEXT DEFAULT 'pending' CHECK (test_status IN ('pending', 'pass', 'fail', 'warning')),
    test_score DECIMAL(5,2) DEFAULT 0.00,
    test_details JSONB DEFAULT '{}'::jsonb,
    last_run TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    next_scheduled_run TIMESTAMPTZ
);

CREATE TABLE public.vvsg_compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    overall_score DECIMAL(5,2) NOT NULL,
    certification_status TEXT CHECK (certification_status IN ('Certified', 'Pending', 'Failed')),
    test_results JSONB DEFAULT '[]'::jsonb,
    auditor_notes TEXT,
    next_audit_date TIMESTAMPTZ
);

-- 6. CRYPTOGRAPHIC KEYS MANAGEMENT
-- =====================================================

CREATE TABLE public.election_cryptographic_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE,
    key_type TEXT NOT NULL CHECK (key_type IN ('rsa_public', 'rsa_private', 'elgamal_public', 'elgamal_private', 'mixnet')),
    key_data TEXT NOT NULL,
    key_algorithm TEXT NOT NULL,
    key_size INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked'))
);

-- 7. INDEXES
-- =====================================================

CREATE INDEX idx_bulletin_board_election_id ON public.bulletin_board_transactions(election_id);
CREATE INDEX idx_bulletin_board_type ON public.bulletin_board_transactions(transaction_type);
CREATE INDEX idx_bulletin_board_hash ON public.bulletin_board_transactions(transaction_hash);
CREATE INDEX idx_bulletin_board_created_at ON public.bulletin_board_transactions(created_at DESC);

CREATE INDEX idx_audit_logs_election_id ON public.cryptographic_audit_logs(election_id);
CREATE INDEX idx_audit_logs_index ON public.cryptographic_audit_logs(log_index);
CREATE INDEX idx_audit_logs_timestamp ON public.cryptographic_audit_logs(timestamp DESC);

CREATE INDEX idx_zkp_vote_id ON public.zero_knowledge_proofs(vote_id);
CREATE INDEX idx_zkp_election_id ON public.zero_knowledge_proofs(election_id);
CREATE INDEX idx_zkp_verified ON public.zero_knowledge_proofs(verified);

CREATE INDEX idx_trustee_shares_election_id ON public.trustee_key_shares(election_id);
CREATE INDEX idx_trustee_shares_trustee_id ON public.trustee_key_shares(trustee_id);

CREATE INDEX idx_vvsg_tests_status ON public.vvsg_compliance_tests(test_status);
CREATE INDEX idx_vvsg_tests_last_run ON public.vvsg_compliance_tests(last_run DESC);

CREATE INDEX idx_crypto_keys_election_id ON public.election_cryptographic_keys(election_id);
CREATE INDEX idx_crypto_keys_type ON public.election_cryptographic_keys(key_type);

-- 8. FUNCTIONS
-- =====================================================

-- Function to generate hash chain for audit logs
CREATE OR REPLACE FUNCTION public.generate_audit_log_hash(
    p_log_index INTEGER,
    p_action TEXT,
    p_details TEXT,
    p_previous_hash TEXT,
    p_timestamp TIMESTAMPTZ
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_data TEXT;
    v_hash TEXT;
BEGIN
    v_data := p_log_index::TEXT || p_action || COALESCE(p_details, '') || 
              COALESCE(p_previous_hash, '0') || p_timestamp::TEXT;
    v_hash := encode(digest(v_data, 'sha256'), 'hex');
    RETURN '0x' || v_hash;
END;
$$;

-- Function to verify hash chain integrity
CREATE OR REPLACE FUNCTION public.verify_audit_log_chain(p_election_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_log RECORD;
    v_expected_hash TEXT;
    v_previous_hash TEXT := NULL;
BEGIN
    FOR v_log IN 
        SELECT * FROM public.cryptographic_audit_logs 
        WHERE election_id = p_election_id 
        ORDER BY log_index ASC
    LOOP
        v_expected_hash := public.generate_audit_log_hash(
            v_log.log_index,
            v_log.action,
            v_log.details,
            v_previous_hash,
            v_log.timestamp
        );
        
        IF v_log.log_hash != v_expected_hash THEN
            RETURN false;
        END IF;
        
        v_previous_hash := v_log.log_hash;
    END LOOP;
    
    RETURN true;
END;
$$;

-- Function to add bulletin board transaction
CREATE OR REPLACE FUNCTION public.add_bulletin_board_transaction(
    p_transaction_type TEXT,
    p_election_id UUID,
    p_user_id UUID,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_transaction_id UUID;
    v_previous_hash TEXT;
    v_transaction_hash TEXT;
    v_data TEXT;
BEGIN
    -- Get previous transaction hash
    SELECT transaction_hash INTO v_previous_hash
    FROM public.bulletin_board_transactions
    WHERE election_id = p_election_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Generate new transaction hash
    v_data := p_transaction_type || p_election_id::TEXT || 
              COALESCE(p_user_id::TEXT, '') || COALESCE(v_previous_hash, '0') || 
              NOW()::TEXT;
    v_transaction_hash := '0x' || encode(digest(v_data, 'sha256'), 'hex');
    
    -- Insert transaction
    INSERT INTO public.bulletin_board_transactions (
        transaction_type,
        election_id,
        user_id,
        transaction_hash,
        previous_hash,
        metadata
    ) VALUES (
        p_transaction_type,
        p_election_id,
        p_user_id,
        v_transaction_hash,
        v_previous_hash,
        p_metadata
    ) RETURNING id INTO v_transaction_id;
    
    RETURN v_transaction_id;
END;
$$;

-- 9. ENABLE RLS
-- =====================================================

ALTER TABLE public.bulletin_board_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cryptographic_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zero_knowledge_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trustee_key_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vvsg_compliance_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vvsg_compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_cryptographic_keys ENABLE ROW LEVEL SECURITY;

-- 10. RLS POLICIES
-- =====================================================

-- Public read access to bulletin board (transparency)
CREATE POLICY "public_read_bulletin_board"
ON public.bulletin_board_transactions
FOR SELECT
TO public
USING (true);

-- Public read access to audit logs (transparency)
CREATE POLICY "public_read_audit_logs"
ON public.cryptographic_audit_logs
FOR SELECT
TO public
USING (true);

-- Public read access to ZKP (verification)
CREATE POLICY "public_read_zkp"
ON public.zero_knowledge_proofs
FOR SELECT
TO public
USING (true);

-- Authenticated users can create ZKP for their votes
CREATE POLICY "users_create_own_zkp"
ON public.zero_knowledge_proofs
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM public.votes v
    WHERE v.id = vote_id AND v.user_id = auth.uid()
));

-- Trustees manage their key shares
CREATE POLICY "trustees_manage_own_shares"
ON public.trustee_key_shares
FOR ALL
TO authenticated
USING (trustee_id = auth.uid())
WITH CHECK (trustee_id = auth.uid());

-- Public read access to VVSG compliance
CREATE POLICY "public_read_vvsg_tests"
ON public.vvsg_compliance_tests
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_read_vvsg_reports"
ON public.vvsg_compliance_reports
FOR SELECT
TO public
USING (true);

-- Election creators manage cryptographic keys
CREATE POLICY "creators_manage_election_keys"
ON public.election_cryptographic_keys
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.elections e
    WHERE e.id = election_id AND e.created_by = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.elections e
    WHERE e.id = election_id AND e.created_by = auth.uid()
));

-- 11. TRIGGERS
-- =====================================================

-- Trigger to automatically create bulletin board transaction on vote cast
CREATE OR REPLACE FUNCTION public.create_bulletin_board_entry_on_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM public.add_bulletin_board_transaction(
        'vote_cast',
        NEW.election_id,
        NEW.user_id,
        jsonb_build_object(
            'vote_id', NEW.id,
            'vote_hash', NEW.vote_hash,
            'blockchain_hash', NEW.blockchain_hash
        )
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_bulletin_board_on_vote
    AFTER INSERT ON public.votes
    FOR EACH ROW
    EXECUTE FUNCTION public.create_bulletin_board_entry_on_vote();

-- 12. MOCK DATA
-- =====================================================

DO $$
DECLARE
    v_election_id UUID;
    v_user_id UUID;
    v_transaction_id UUID;
BEGIN
    -- Get existing election and user
    SELECT id INTO v_election_id FROM public.elections LIMIT 1;
    SELECT id INTO v_user_id FROM public.user_profiles LIMIT 1;
    
    IF v_election_id IS NOT NULL AND v_user_id IS NOT NULL THEN
        -- Create sample bulletin board transactions
        v_transaction_id := public.add_bulletin_board_transaction(
            'election_created',
            v_election_id,
            v_user_id,
            '{"description": "Election initialized with cryptographic parameters"}'::jsonb
        );
        
        -- Create sample VVSG compliance tests
        INSERT INTO public.vvsg_compliance_tests (
            test_name,
            test_category,
            vvsg_requirement,
            test_status,
            test_score,
            test_details
        ) VALUES
            ('End-to-End Encryption Verification', 'Security', 'VVSG 2.0 Section 7.2.1', 'pass', 100.00, '{"encryption": "RSA-2048"}'::jsonb),
            ('Zero-Knowledge Proof Validation', 'Cryptography', 'VVSG 2.0 Section 7.3.2', 'pass', 99.80, '{"protocol": "Schnorr"}'::jsonb),
            ('Audit Trail Integrity Check', 'Auditability', 'VVSG 2.0 Section 8.1.1', 'pass', 100.00, '{"hash_chain": "verified"}'::jsonb),
            ('Voter Privacy Protection', 'Privacy', 'VVSG 2.0 Section 6.4.3', 'pass', 99.50, '{"anonymization": "mixnet"}'::jsonb);
        
        -- Create sample compliance report
        INSERT INTO public.vvsg_compliance_reports (
            overall_score,
            certification_status,
            test_results,
            auditor_notes,
            next_audit_date
        ) VALUES (
            99.70,
            'Certified',
            '[]'::jsonb,
            'All cryptographic protocols functioning correctly. System meets VVSG 2.0 requirements.',
            CURRENT_TIMESTAMP + INTERVAL '90 days'
        );
        
        RAISE NOTICE 'Cryptographic audit trails and bulletin board initialized successfully';
    ELSE
        RAISE NOTICE 'No existing elections or users found. Run previous migrations first.';
    END IF;
END $$;