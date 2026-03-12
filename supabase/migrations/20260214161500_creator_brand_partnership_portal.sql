-- Creator Brand Partnership Portal Schema
-- Enables marketplace connecting creators with brands for sponsored content

-- Brand Profiles Table
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  budget_range TEXT,
  target_audience JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Partnership Opportunities Table
CREATE TABLE IF NOT EXISTS public.partnership_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'video', 'image', 'article', 'election'
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  duration_days INTEGER,
  requirements JSONB DEFAULT '[]'::jsonb,
  target_creator_criteria JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'closed'
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Partnership Proposals Table
CREATE TABLE IF NOT EXISTS public.partnership_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  proposal_text TEXT NOT NULL,
  proposed_budget DECIMAL(10,2),
  proposed_timeline TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending', -- 'pending', 'under_review', 'accepted', 'rejected', 'negotiating'
  brand_response TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Revenue Share Negotiations Table
CREATE TABLE IF NOT EXISTS public.revenue_share_negotiations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.partnership_proposals(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  creator_share_percentage DECIMAL(5,2) NOT NULL,
  brand_share_percentage DECIMAL(5,2) NOT NULL,
  platform_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
  total_budget DECIMAL(10,2) NOT NULL,
  payment_terms TEXT,
  milestones JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'proposed', -- 'proposed', 'counter_offered', 'agreed', 'rejected'
  proposed_by TEXT NOT NULL, -- 'creator' or 'brand'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Partnership Contracts Table
CREATE TABLE IF NOT EXISTS public.partnership_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.partnership_proposals(id) ON DELETE CASCADE,
  negotiation_id UUID REFERENCES public.revenue_share_negotiations(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  contract_terms JSONB NOT NULL,
  total_value DECIMAL(10,2) NOT NULL,
  revenue_split JSONB NOT NULL,
  deliverables JSONB NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled', 'disputed'
  creator_signed BOOLEAN DEFAULT false,
  brand_signed BOOLEAN DEFAULT false,
  creator_signed_at TIMESTAMPTZ,
  brand_signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Partnership Deliverables Tracking
CREATE TABLE IF NOT EXISTS public.partnership_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.partnership_contracts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'submitted', 'approved', 'rejected'
  submission_url TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  payment_amount DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'paid'
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Brand Discovery Preferences
CREATE TABLE IF NOT EXISTS public.creator_brand_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  preferred_industries JSONB DEFAULT '[]'::jsonb,
  excluded_industries JSONB DEFAULT '[]'::jsonb,
  min_budget DECIMAL(10,2),
  preferred_content_types JSONB DEFAULT '[]'::jsonb,
  availability_status TEXT DEFAULT 'open', -- 'open', 'selective', 'closed'
  portfolio_url TEXT,
  rate_card JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON public.brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_partnership_opportunities_brand_id ON public.partnership_opportunities(brand_id);
CREATE INDEX IF NOT EXISTS idx_partnership_opportunities_status ON public.partnership_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_partnership_proposals_opportunity_id ON public.partnership_proposals(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_partnership_proposals_creator_id ON public.partnership_proposals(creator_id);
CREATE INDEX IF NOT EXISTS idx_partnership_proposals_status ON public.partnership_proposals(status);
CREATE INDEX IF NOT EXISTS idx_revenue_share_negotiations_proposal_id ON public.revenue_share_negotiations(proposal_id);
CREATE INDEX IF NOT EXISTS idx_partnership_contracts_creator_id ON public.partnership_contracts(creator_id);
CREATE INDEX IF NOT EXISTS idx_partnership_contracts_brand_id ON public.partnership_contracts(brand_id);
CREATE INDEX IF NOT EXISTS idx_partnership_contracts_status ON public.partnership_contracts(status);
CREATE INDEX IF NOT EXISTS idx_partnership_deliverables_contract_id ON public.partnership_deliverables(contract_id);

-- RLS Policies
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_share_negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_brand_preferences ENABLE ROW LEVEL SECURITY;

-- Brand Profiles Policies
CREATE POLICY "Users can view all brand profiles" ON public.brand_profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own brand profile" ON public.brand_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own brand profile" ON public.brand_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Partnership Opportunities Policies
CREATE POLICY "All users can view active opportunities" ON public.partnership_opportunities FOR SELECT USING (status = 'active' OR brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Brands can create opportunities" ON public.partnership_opportunities FOR INSERT WITH CHECK (brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Brands can update their opportunities" ON public.partnership_opportunities FOR UPDATE USING (brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid()));

-- Partnership Proposals Policies
CREATE POLICY "Creators and brands can view their proposals" ON public.partnership_proposals FOR SELECT USING (
  creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
  brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Creators can create proposals" ON public.partnership_proposals FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()));
CREATE POLICY "Creators and brands can update proposals" ON public.partnership_proposals FOR UPDATE USING (
  creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
  brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);

-- Revenue Share Negotiations Policies
CREATE POLICY "Parties can view their negotiations" ON public.revenue_share_negotiations FOR SELECT USING (
  creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
  brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Parties can create negotiations" ON public.revenue_share_negotiations FOR INSERT WITH CHECK (
  creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
  brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Parties can update negotiations" ON public.revenue_share_negotiations FOR UPDATE USING (
  creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
  brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);

-- Partnership Contracts Policies
CREATE POLICY "Parties can view their contracts" ON public.partnership_contracts FOR SELECT USING (
  creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
  brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "System creates contracts" ON public.partnership_contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Parties can update their contracts" ON public.partnership_contracts FOR UPDATE USING (
  creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
  brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
);

-- Partnership Deliverables Policies
CREATE POLICY "Parties can view deliverables" ON public.partnership_deliverables FOR SELECT USING (
  contract_id IN (
    SELECT id FROM public.partnership_contracts WHERE
    creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
    brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "System creates deliverables" ON public.partnership_deliverables FOR INSERT WITH CHECK (true);
CREATE POLICY "Parties can update deliverables" ON public.partnership_deliverables FOR UPDATE USING (
  contract_id IN (
    SELECT id FROM public.partnership_contracts WHERE
    creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()) OR
    brand_id IN (SELECT id FROM public.brand_profiles WHERE user_id = auth.uid())
  )
);

-- Creator Brand Preferences Policies
CREATE POLICY "Creators can view their preferences" ON public.creator_brand_preferences FOR SELECT USING (creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()));
CREATE POLICY "Creators can create their preferences" ON public.creator_brand_preferences FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()));
CREATE POLICY "Creators can update their preferences" ON public.creator_brand_preferences FOR UPDATE USING (creator_id IN (SELECT id FROM public.user_profiles WHERE id = auth.uid()));