-- Creator Community Hub Tables
CREATE TABLE IF NOT EXISTS public.creator_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('strategy_sharing', 'trend_discussion', 'monetization', 'platform_updates', 'general')),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  member_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  reputation_threshold INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.community_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.creator_communities(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  reply_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.community_discussions(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.creator_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_one_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  creator_two_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  partnership_type TEXT NOT NULL CHECK (partnership_type IN ('collaboration', 'mentorship', 'project', 'content_exchange')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  audience_overlap_score DECIMAL(5,2),
  content_synergy_score DECIMAL(5,2),
  project_title TEXT,
  project_description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('one_on_one', 'group', 'workshop', 'review')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  topic TEXT NOT NULL,
  notes TEXT,
  progress_rating INTEGER CHECK (progress_rating >= 1 AND progress_rating <= 5),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.creator_reputation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  influence_score INTEGER DEFAULT 0,
  contribution_quality_score INTEGER DEFAULT 0,
  peer_recognition_badges JSONB DEFAULT '[]'::jsonb,
  total_contributions INTEGER DEFAULT 0,
  helpful_votes_received INTEGER DEFAULT 0,
  mentorship_sessions_completed INTEGER DEFAULT 0,
  partnerships_completed INTEGER DEFAULT 0,
  overall_reputation INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'newcomer' CHECK (rank IN ('newcomer', 'contributor', 'expert', 'leader', 'legend')),
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Creator Marketplace Tables
CREATE TABLE IF NOT EXISTS public.creator_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('sponsored_content', 'collaboration_bundle', 'consultation', 'exclusive_access', 'content_review', 'custom')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  portfolio_samples JSONB DEFAULT '[]'::jsonb,
  pricing_tiers JSONB NOT NULL,
  availability_calendar JSONB DEFAULT '{}'::jsonb,
  delivery_time_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.creator_services(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed')),
  selected_tier TEXT NOT NULL,
  base_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  creator_payout DECIMAL(10,2) NOT NULL,
  scheduled_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  buyer_notes TEXT,
  creator_notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.marketplace_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'payout', 'fee')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  stripe_payout_id TEXT,
  escrow_released BOOLEAN DEFAULT false,
  escrow_release_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.marketplace_revenue_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  platform_percentage DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  creator_percentage DECIMAL(5,2) NOT NULL DEFAULT 85.00,
  platform_amount DECIMAL(10,2) NOT NULL,
  creator_amount DECIMAL(10,2) NOT NULL,
  processing_fee DECIMAL(10,2) DEFAULT 0,
  net_creator_payout DECIMAL(10,2) NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Claude Creator Success Agent Tables
CREATE TABLE IF NOT EXISTS public.creator_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  engagement_score INTEGER DEFAULT 0,
  content_quality_score INTEGER DEFAULT 0,
  audience_growth_rate DECIMAL(5,2) DEFAULT 0,
  revenue_trend TEXT CHECK (revenue_trend IN ('increasing', 'stable', 'declining', 'unknown')),
  churn_risk_level TEXT DEFAULT 'low' CHECK (churn_risk_level IN ('low', 'medium', 'high', 'critical')),
  churn_probability DECIMAL(5,2) DEFAULT 0,
  last_active_date TIMESTAMPTZ,
  days_since_last_content INTEGER DEFAULT 0,
  health_status TEXT DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'at_risk', 'critical', 'churned')),
  monitored_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.content_optimization_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('posting_time', 'content_format', 'topic_suggestion', 'audience_targeting', 'engagement_strategy')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  optimal_posting_times JSONB,
  trending_topics JSONB,
  predicted_engagement_score INTEGER,
  earnings_optimization_potential DECIMAL(10,2),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'applied', 'dismissed')),
  generated_by TEXT DEFAULT 'claude_agent',
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.milestone_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('first_earning', 'revenue_threshold', 'audience_size', 'engagement_rate', 'content_count', 'partnership', 'custom')),
  milestone_name TEXT NOT NULL,
  milestone_description TEXT,
  target_value DECIMAL(10,2),
  achieved_value DECIMAL(10,2),
  is_achieved BOOLEAN DEFAULT false,
  achieved_at TIMESTAMPTZ,
  celebration_sent BOOLEAN DEFAULT false,
  reward_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.churn_prevention_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  intervention_type TEXT NOT NULL CHECK (intervention_type IN ('engagement_reminder', 'content_suggestion', 'revenue_opportunity', 'support_outreach', 'incentive_offer')),
  trigger_reason TEXT NOT NULL,
  intervention_message TEXT NOT NULL,
  recommended_actions JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'acknowledged', 'completed', 'expired')),
  effectiveness_score INTEGER,
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- RLS Policies
ALTER TABLE public.creator_communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_reputation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_revenue_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_optimization_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churn_prevention_interventions ENABLE ROW LEVEL SECURITY;

-- Creator Communities Policies
CREATE POLICY "Users can view public communities" ON public.creator_communities
  FOR SELECT USING (is_private = false OR creator_id = auth.uid());

CREATE POLICY "Creators can create communities" ON public.creator_communities
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their communities" ON public.creator_communities
  FOR UPDATE USING (auth.uid() = creator_id);

-- Community Discussions Policies
CREATE POLICY "Users can view discussions" ON public.community_discussions
  FOR SELECT USING (true);

CREATE POLICY "Creators can create discussions" ON public.community_discussions
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their discussions" ON public.community_discussions
  FOR UPDATE USING (auth.uid() = creator_id);

-- Discussion Replies Policies
CREATE POLICY "Users can view replies" ON public.discussion_replies
  FOR SELECT USING (true);

CREATE POLICY "Creators can create replies" ON public.discussion_replies
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Creator Partnerships Policies
CREATE POLICY "Creators can view their partnerships" ON public.creator_partnerships
  FOR SELECT USING (auth.uid() IN (creator_one_id, creator_two_id));

CREATE POLICY "Creators can create partnerships" ON public.creator_partnerships
  FOR INSERT WITH CHECK (auth.uid() IN (creator_one_id, creator_two_id));

CREATE POLICY "Creators can update their partnerships" ON public.creator_partnerships
  FOR UPDATE USING (auth.uid() IN (creator_one_id, creator_two_id));

-- Mentorship Sessions Policies
CREATE POLICY "Users can view their mentorship sessions" ON public.mentorship_sessions
  FOR SELECT USING (auth.uid() IN (mentor_id, mentee_id));

CREATE POLICY "Users can create mentorship sessions" ON public.mentorship_sessions
  FOR INSERT WITH CHECK (auth.uid() IN (mentor_id, mentee_id));

CREATE POLICY "Users can update their mentorship sessions" ON public.mentorship_sessions
  FOR UPDATE USING (auth.uid() IN (mentor_id, mentee_id));

-- Creator Reputation Scores Policies
CREATE POLICY "Users can view reputation scores" ON public.creator_reputation_scores
  FOR SELECT USING (true);

CREATE POLICY "System can manage reputation scores" ON public.creator_reputation_scores
  FOR ALL USING (true);

-- Creator Services Policies
CREATE POLICY "Users can view active services" ON public.creator_services
  FOR SELECT USING (is_active = true OR creator_id = auth.uid());

CREATE POLICY "Creators can create services" ON public.creator_services
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their services" ON public.creator_services
  FOR UPDATE USING (auth.uid() = creator_id);

-- Service Bookings Policies
CREATE POLICY "Users can view their bookings" ON public.service_bookings
  FOR SELECT USING (auth.uid() IN (buyer_id, creator_id));

CREATE POLICY "Users can create bookings" ON public.service_bookings
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their bookings" ON public.service_bookings
  FOR UPDATE USING (auth.uid() IN (buyer_id, creator_id));

-- Marketplace Transactions Policies
CREATE POLICY "Users can view their transactions" ON public.marketplace_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.service_bookings
      WHERE service_bookings.id = marketplace_transactions.booking_id
      AND (service_bookings.buyer_id = auth.uid() OR service_bookings.creator_id = auth.uid())
    )
  );

-- Marketplace Revenue Splits Policies
CREATE POLICY "Users can view their revenue splits" ON public.marketplace_revenue_splits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.service_bookings
      WHERE service_bookings.id = marketplace_revenue_splits.booking_id
      AND (service_bookings.buyer_id = auth.uid() OR service_bookings.creator_id = auth.uid())
    )
  );

-- Creator Health Metrics Policies
CREATE POLICY "Creators can view their health metrics" ON public.creator_health_metrics
  FOR SELECT USING (auth.uid() = creator_id);

-- Content Optimization Recommendations Policies
CREATE POLICY "Creators can view their recommendations" ON public.content_optimization_recommendations
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update their recommendations" ON public.content_optimization_recommendations
  FOR UPDATE USING (auth.uid() = creator_id);

-- Milestone Achievements Policies
CREATE POLICY "Creators can view their milestones" ON public.milestone_achievements
  FOR SELECT USING (auth.uid() = creator_id);

-- Churn Prevention Interventions Policies
CREATE POLICY "Creators can view their interventions" ON public.churn_prevention_interventions
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update their interventions" ON public.churn_prevention_interventions
  FOR UPDATE USING (auth.uid() = creator_id);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_creator_communities_category ON public.creator_communities(category);
CREATE INDEX IF NOT EXISTS idx_community_discussions_community_id ON public.community_discussions(community_id);
CREATE INDEX IF NOT EXISTS idx_community_discussions_trending ON public.community_discussions(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_creator_partnerships_status ON public.creator_partnerships(status);
CREATE INDEX IF NOT EXISTS idx_creator_services_creator_id ON public.creator_services(creator_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_creator_health_metrics_risk ON public.creator_health_metrics(churn_risk_level);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_creator ON public.content_optimization_recommendations(creator_id);

-- Functions
CREATE OR REPLACE FUNCTION public.calculate_creator_reputation(p_creator_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_influence INTEGER := 0;
  v_quality INTEGER := 0;
  v_total INTEGER := 0;
BEGIN
  SELECT 
    COALESCE(influence_score, 0),
    COALESCE(contribution_quality_score, 0)
  INTO v_influence, v_quality
  FROM public.creator_reputation_scores
  WHERE creator_id = p_creator_id;
  
  v_total := (v_influence * 0.6) + (v_quality * 0.4);
  
  UPDATE public.creator_reputation_scores
  SET overall_reputation = v_total,
      rank = CASE
        WHEN v_total >= 1000 THEN 'legend'
        WHEN v_total >= 750 THEN 'leader'
        WHEN v_total >= 500 THEN 'expert'
        WHEN v_total >= 250 THEN 'contributor'
        ELSE 'newcomer'
      END,
      updated_at = CURRENT_TIMESTAMP
  WHERE creator_id = p_creator_id;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.calculate_marketplace_revenue_split(
  p_booking_id UUID,
  p_total_amount DECIMAL(10,2)
)
RETURNS UUID AS $$
DECLARE
  v_split_id UUID;
  v_platform_pct DECIMAL(5,2) := 15.00;
  v_creator_pct DECIMAL(5,2) := 85.00;
  v_platform_amt DECIMAL(10,2);
  v_creator_amt DECIMAL(10,2);
  v_processing_fee DECIMAL(10,2) := p_total_amount * 0.029 + 0.30;
  v_net_payout DECIMAL(10,2);
BEGIN
  v_platform_amt := p_total_amount * (v_platform_pct / 100);
  v_creator_amt := p_total_amount * (v_creator_pct / 100);
  v_net_payout := v_creator_amt - v_processing_fee;
  
  INSERT INTO public.marketplace_revenue_splits (
    booking_id,
    total_amount,
    platform_percentage,
    creator_percentage,
    platform_amount,
    creator_amount,
    processing_fee,
    net_creator_payout
  ) VALUES (
    p_booking_id,
    p_total_amount,
    v_platform_pct,
    v_creator_pct,
    v_platform_amt,
    v_creator_amt,
    v_processing_fee,
    v_net_payout
  ) RETURNING id INTO v_split_id;
  
  RETURN v_split_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;