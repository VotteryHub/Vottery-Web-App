-- Compliance Dashboard Migration
-- Tables for regulatory filing generation, audit trails, multi-jurisdiction compliance tracking, and policy violation reports

-- Create ENUM types for compliance module
CREATE TYPE public.filing_status AS ENUM ('pending', 'submitted', 'approved', 'rejected', 'under_review');
CREATE TYPE public.filing_type AS ENUM ('aml_report', 'tax_withholding', 'transaction_report', 'cross_border_payments', 'kyc_compliance', 'data_protection', 'consumer_protection');
CREATE TYPE public.violation_type AS ENUM ('advertising_policy', 'payment_policy', 'data_privacy', 'content_policy', 'fraud_attempt', 'terms_violation', 'regulatory_breach');
CREATE TYPE public.violation_status AS ENUM ('open', 'under_review', 'resolved', 'dismissed', 'escalated');
CREATE TYPE public.compliance_status AS ENUM ('compliant', 'non_compliant', 'pending_review', 'warning', 'critical');

-- Regulatory Filings Table
CREATE TABLE public.regulatory_filings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filing_type public.filing_type NOT NULL,
    jurisdiction TEXT NOT NULL,
    regulatory_authority TEXT NOT NULL,
    filing_reference TEXT,
    status public.filing_status DEFAULT 'pending'::public.filing_status,
    submission_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    filing_data JSONB,
    document_url TEXT,
    submitted_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Policy Violations Table
CREATE TABLE public.policy_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    violation_type public.violation_type NOT NULL,
    violator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    affected_entity_type TEXT,
    affected_entity_id UUID,
    severity public.alert_severity NOT NULL,
    status public.violation_status DEFAULT 'open'::public.violation_status,
    description TEXT NOT NULL,
    evidence JSONB,
    detection_method TEXT,
    detected_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    penalty_applied TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Multi-Jurisdiction Compliance Tracking Table
CREATE TABLE public.jurisdiction_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction TEXT NOT NULL UNIQUE,
    region TEXT,
    compliance_status public.compliance_status DEFAULT 'pending_review'::public.compliance_status,
    compliance_score DECIMAL(5,2),
    regulatory_framework TEXT,
    required_filings TEXT[],
    active_regulations JSONB,
    last_audit_date TIMESTAMPTZ,
    next_audit_date TIMESTAMPTZ,
    compliance_officer UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    issues_identified INTEGER DEFAULT 0,
    issues_resolved INTEGER DEFAULT 0,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_regulatory_filings_jurisdiction ON public.regulatory_filings(jurisdiction);
CREATE INDEX idx_regulatory_filings_status ON public.regulatory_filings(status);
CREATE INDEX idx_regulatory_filings_filing_type ON public.regulatory_filings(filing_type);
CREATE INDEX idx_regulatory_filings_submitted_by ON public.regulatory_filings(submitted_by);
CREATE INDEX idx_regulatory_filings_due_date ON public.regulatory_filings(due_date);

CREATE INDEX idx_policy_violations_violator_id ON public.policy_violations(violator_id);
CREATE INDEX idx_policy_violations_status ON public.policy_violations(status);
CREATE INDEX idx_policy_violations_severity ON public.policy_violations(severity);
CREATE INDEX idx_policy_violations_violation_type ON public.policy_violations(violation_type);
CREATE INDEX idx_policy_violations_detected_at ON public.policy_violations(detected_at);

CREATE INDEX idx_jurisdiction_compliance_jurisdiction ON public.jurisdiction_compliance(jurisdiction);
CREATE INDEX idx_jurisdiction_compliance_status ON public.jurisdiction_compliance(compliance_status);
CREATE INDEX idx_jurisdiction_compliance_officer ON public.jurisdiction_compliance(compliance_officer);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_compliance_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Apply update triggers
CREATE TRIGGER update_regulatory_filings_updated_at
    BEFORE UPDATE ON public.regulatory_filings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_compliance_updated_at();

CREATE TRIGGER update_policy_violations_updated_at
    BEFORE UPDATE ON public.policy_violations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_compliance_updated_at();

CREATE TRIGGER update_jurisdiction_compliance_last_updated
    BEFORE UPDATE ON public.jurisdiction_compliance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_compliance_updated_at();

-- Enable Row Level Security
ALTER TABLE public.regulatory_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisdiction_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for regulatory_filings
CREATE POLICY "authenticated_users_view_regulatory_filings"
ON public.regulatory_filings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_create_regulatory_filings"
ON public.regulatory_filings
FOR INSERT
TO authenticated
WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "users_update_own_regulatory_filings"
ON public.regulatory_filings
FOR UPDATE
TO authenticated
USING (submitted_by = auth.uid())
WITH CHECK (submitted_by = auth.uid());

-- RLS Policies for policy_violations
CREATE POLICY "authenticated_users_view_policy_violations"
ON public.policy_violations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_create_policy_violations"
ON public.policy_violations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_update_policy_violations"
ON public.policy_violations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for jurisdiction_compliance
CREATE POLICY "authenticated_users_view_jurisdiction_compliance"
ON public.jurisdiction_compliance
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_users_manage_jurisdiction_compliance"
ON public.jurisdiction_compliance
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Mock Data for Compliance Dashboard
DO $$
DECLARE
    admin_user_id UUID;
    filing_id_1 UUID := gen_random_uuid();
    filing_id_2 UUID := gen_random_uuid();
    filing_id_3 UUID := gen_random_uuid();
    violation_id_1 UUID := gen_random_uuid();
    violation_id_2 UUID := gen_random_uuid();
BEGIN
    SELECT id INTO admin_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        -- Insert regulatory filings
        INSERT INTO public.regulatory_filings (id, filing_type, jurisdiction, regulatory_authority, filing_reference, status, submission_date, due_date, submitted_by, filing_data) VALUES
            (filing_id_1, 'aml_report'::public.filing_type, 'United States', 'FinCEN', 'AML-2026-001', 'submitted'::public.filing_status, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', admin_user_id, '{"total_transactions": 12458, "flagged_transactions": 23, "reporting_period": "January 2026"}'::jsonb),
            (filing_id_2, 'tax_withholding'::public.filing_type, 'United States', 'IRS', 'TAX-2026-Q1', 'approved'::public.filing_status, NOW() - INTERVAL '10 days', NOW() + INTERVAL '75 days', admin_user_id, '{"total_withholding": 45230.50, "forms_generated": 342, "quarter": "Q1 2026"}'::jsonb),
            (filing_id_3, 'transaction_report'::public.filing_type, 'European Union', 'EBA', 'TR-EU-2026-003', 'pending'::public.filing_status, NULL, NOW() + INTERVAL '7 days', admin_user_id, '{"cross_border_transactions": 1847, "reporting_period": "Week 3, January 2026"}'::jsonb);

        -- Insert policy violations
        INSERT INTO public.policy_violations (id, violation_type, violator_id, severity, status, description, evidence, detection_method) VALUES
            (violation_id_1, 'advertising_policy'::public.violation_type, admin_user_id, 'medium'::public.alert_severity, 'under_review'::public.violation_status, 'Campaign contains prohibited content related to misleading claims', '{"campaign_id": "camp_12345", "flagged_content": "Guaranteed returns claim", "detection_confidence": 0.92}'::jsonb, 'ai_content_analysis'),
            (violation_id_2, 'fraud_attempt'::public.violation_type, admin_user_id, 'high'::public.alert_severity, 'open'::public.violation_status, 'Multiple accounts detected from same IP with coordinated voting patterns', '{"ip_address": "192.168.1.100", "accounts_involved": 5, "voting_pattern_similarity": 0.95}'::jsonb, 'perplexity_threat_intelligence');

        -- Insert jurisdiction compliance tracking
        INSERT INTO public.jurisdiction_compliance (jurisdiction, region, compliance_status, compliance_score, regulatory_framework, required_filings, active_regulations, last_audit_date, next_audit_date, compliance_officer, issues_identified, issues_resolved) VALUES
            ('United States', 'North America', 'compliant'::public.compliance_status, 98.5, 'Federal and State Regulations', ARRAY['aml_report', 'tax_withholding', 'transaction_report'], '{"GDPR": false, "CCPA": true, "AML": true, "KYC": true}'::jsonb, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', admin_user_id, 3, 3),
            ('European Union', 'Europe', 'compliant'::public.compliance_status, 96.2, 'EU Directives and GDPR', ARRAY['data_protection', 'transaction_report', 'consumer_protection'], '{"GDPR": true, "PSD2": true, "AML": true}'::jsonb, NOW() - INTERVAL '45 days', NOW() + INTERVAL '45 days', admin_user_id, 5, 4),
            ('United Kingdom', 'Europe', 'warning'::public.compliance_status, 88.7, 'UK Financial Regulations', ARRAY['aml_report', 'data_protection'], '{"GDPR": true, "FCA_Rules": true, "AML": true}'::jsonb, NOW() - INTERVAL '60 days', NOW() + INTERVAL '30 days', admin_user_id, 8, 5),
            ('Canada', 'North America', 'compliant'::public.compliance_status, 94.3, 'Canadian Federal Regulations', ARRAY['aml_report', 'tax_withholding'], '{"PIPEDA": true, "FINTRAC": true, "AML": true}'::jsonb, NOW() - INTERVAL '20 days', NOW() + INTERVAL '70 days', admin_user_id, 2, 2),
            ('Australia', 'Asia-Pacific', 'pending_review'::public.compliance_status, 85.0, 'Australian Regulatory Framework', ARRAY['aml_report', 'consumer_protection'], '{"Privacy_Act": true, "AUSTRAC": true, "ASIC": true}'::jsonb, NOW() - INTERVAL '90 days', NOW() + INTERVAL '10 days', admin_user_id, 12, 7);

        RAISE NOTICE 'Compliance dashboard mock data created successfully';
    ELSE
        RAISE NOTICE 'No admin user found. Please run auth migration first.';
    END IF;
END $$;