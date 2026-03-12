-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS carousel_coaching_action_items CASCADE;
DROP TABLE IF EXISTS carousel_coaching_conversations CASCADE;
DROP TABLE IF EXISTS carousel_compliance_violations CASCADE;
DROP TABLE IF EXISTS carousel_system_health CASCADE;
DROP TABLE IF EXISTS carousel_template_purchases CASCADE;
DROP TABLE IF EXISTS carousel_templates CASCADE;
DROP TABLE IF EXISTS carousel_creator_subscriptions CASCADE;
DROP TABLE IF EXISTS carousel_creator_tiers CASCADE;
DROP TABLE IF EXISTS carousel_on_call_routing CASCADE;
DROP TABLE IF EXISTS carousel_alert_rules CASCADE;
DROP TABLE IF EXISTS carousel_incidents CASCADE;

-- Carousel Health Alerting with Twilio SMS
CREATE TABLE carousel_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_type TEXT NOT NULL CHECK (carousel_type IN ('horizontal', 'vertical', 'gradient')),
  incident_type TEXT NOT NULL CHECK (incident_type IN ('performance_degradation', 'system_outage', 'anomaly_detected', 'high_error_rate')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  metrics JSONB,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carousel_alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_type TEXT NOT NULL CHECK (carousel_type IN ('horizontal', 'vertical', 'gradient', 'all')),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('performance_degradation', 'system_outage', 'anomaly_detection', 'error_rate')),
  threshold_value NUMERIC NOT NULL,
  threshold_operator TEXT NOT NULL CHECK (threshold_operator IN ('>', '<', '>=', '<=', '=')),
  time_window_minutes INTEGER DEFAULT 5,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_active BOOLEAN DEFAULT true,
  notification_channels JSONB DEFAULT '[]'::jsonb,
  escalation_delay_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carousel_on_call_routing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  available_hours JSONB DEFAULT '{"start": "00:00", "end": "23:59"}'::jsonb,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carousel Creator Tiers Subscription System
CREATE TABLE carousel_creator_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL UNIQUE CHECK (tier_name IN ('basic', 'pro', 'business', 'vip')),
  tier_display_name TEXT NOT NULL,
  price_monthly NUMERIC(10,2) NOT NULL,
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_carousels INTEGER,
  sponsorship_priority INTEGER DEFAULT 0,
  analytics_access TEXT DEFAULT 'basic' CHECK (analytics_access IN ('basic', 'standard', 'premium', 'enterprise')),
  exclusive_tools JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carousel_creator_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  tier_id UUID REFERENCES carousel_creator_tiers(id) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id)
);

-- Carousel Template Marketplace
CREATE TABLE carousel_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  template_name TEXT NOT NULL,
  description TEXT,
  carousel_type TEXT NOT NULL CHECK (carousel_type IN ('horizontal', 'vertical', 'gradient')),
  template_data JSONB NOT NULL,
  preview_images JSONB DEFAULT '[]'::jsonb,
  price NUMERIC(10,2) NOT NULL,
  revenue_split_creator INTEGER DEFAULT 70,
  revenue_split_platform INTEGER DEFAULT 30,
  category TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  total_purchases INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carousel_template_purchases (
  purchase_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  purchase_price NUMERIC(10,2) NOT NULL,
  creator_revenue NUMERIC(10,2) NOT NULL,
  platform_revenue NUMERIC(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  stripe_payment_intent_id TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES carousel_templates(id) ON DELETE CASCADE,
  CONSTRAINT fk_buyer FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_creator FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Carousel Security Audit & Compliance
CREATE TABLE carousel_system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name TEXT NOT NULL UNIQUE,
  system_type TEXT NOT NULL,
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'warning', 'critical', 'offline')),
  last_check_at TIMESTAMPTZ DEFAULT NOW(),
  metrics JSONB DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carousel_compliance_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  anomaly_score NUMERIC(5,2) DEFAULT 0,
  policy_violated TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  remediation_status TEXT DEFAULT 'pending' CHECK (remediation_status IN ('pending', 'in_progress', 'resolved', 'ignored')),
  remediation_action TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time Coaching API with Claude Streaming
CREATE TABLE carousel_coaching_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  conversation_title TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carousel_coaching_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES carousel_coaching_conversations(id) NOT NULL,
  creator_id UUID REFERENCES auth.users(id) NOT NULL,
  action_title TEXT NOT NULL,
  action_description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default carousel creator tiers
INSERT INTO carousel_creator_tiers (tier_name, tier_display_name, price_monthly, features, max_carousels, sponsorship_priority, analytics_access, exclusive_tools) VALUES
('basic', 'Basic Free', 0.00, '{"features": ["Up to 3 carousels", "Basic analytics", "Standard templates", "Community support"]}'::jsonb, 3, 0, 'basic', '[]'::jsonb),
('pro', 'Pro', 9.99, '{"features": ["Up to 10 carousels", "Advanced analytics", "Premium templates", "Priority support", "Custom branding"]}'::jsonb, 10, 1, 'standard', '["Custom CSS", "Advanced animations"]'::jsonb),
('business', 'Business', 29.99, '{"features": ["Unlimited carousels", "Premium analytics", "All templates", "Priority support", "White-label options", "API access"]}'::jsonb, NULL, 2, 'premium', '["Custom CSS", "Advanced animations", "API integration", "Webhook support"]'::jsonb),
('vip', 'VIP', 99.99, '{"features": ["Unlimited carousels", "Enterprise analytics", "All templates", "24/7 dedicated support", "White-label options", "Full API access", "Custom development"]}'::jsonb, NULL, 3, 'enterprise', '["Custom CSS", "Advanced animations", "API integration", "Webhook support", "Custom development", "Dedicated account manager"]'::jsonb);

-- Insert 12 carousel systems for health monitoring
INSERT INTO carousel_system_health (system_name, system_type, health_score, status, metrics) VALUES
('Carousel Personalization Engine', 'personalization', 100, 'healthy', '{"uptime": 99.9, "latency_ms": 45}'::jsonb),
('Carousel Real-Time Bidding', 'monetization', 100, 'healthy', '{"uptime": 99.8, "latency_ms": 120}'::jsonb),
('Google Analytics Carousel Tracking', 'analytics', 100, 'healthy', '{"uptime": 99.95, "events_tracked": 1500000}'::jsonb),
('Unified Carousel Operations Hub', 'operations', 100, 'healthy', '{"uptime": 99.7, "active_monitors": 12}'::jsonb),
('Claude Carousel Optimization Coach', 'ai_coaching', 100, 'healthy', '{"uptime": 99.6, "conversations": 450}'::jsonb),
('Datadog APM Carousel', 'monitoring', 100, 'healthy', '{"uptime": 99.9, "traces_collected": 2500000}'::jsonb),
('Carousel Health Alerting', 'alerting', 100, 'healthy', '{"uptime": 99.8, "alerts_sent": 120}'::jsonb),
('Real-time Coaching API', 'ai_coaching', 100, 'healthy', '{"uptime": 99.5, "streaming_sessions": 89}'::jsonb),
('Carousel Creator Tiers', 'subscription', 100, 'healthy', '{"uptime": 99.9, "active_subscriptions": 567}'::jsonb),
('Carousel Template Marketplace', 'marketplace', 100, 'healthy', '{"uptime": 99.7, "total_sales": 1234}'::jsonb),
('Carousel Security Audit', 'security', 100, 'healthy', '{"uptime": 99.95, "violations_detected": 3}'::jsonb),
('Carousel Feed Orchestration', 'content', 100, 'healthy', '{"uptime": 99.8, "content_items": 45000}'::jsonb);

-- RLS Policies
ALTER TABLE carousel_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_on_call_routing ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_creator_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_template_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_compliance_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_coaching_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_coaching_action_items ENABLE ROW LEVEL SECURITY;

-- Admin access for all tables
CREATE POLICY "Admins can manage carousel incidents" ON carousel_incidents FOR ALL USING ((auth.jwt() ->> 'role')::text = 'admin');
CREATE POLICY "Admins can manage alert rules" ON carousel_alert_rules FOR ALL USING ((auth.jwt() ->> 'role')::text = 'admin');
CREATE POLICY "Admins can manage on-call routing" ON carousel_on_call_routing FOR ALL USING ((auth.jwt() ->> 'role')::text = 'admin');
CREATE POLICY "Everyone can view carousel tiers" ON carousel_creator_tiers FOR SELECT USING (true);
CREATE POLICY "Admins can manage carousel tiers" ON carousel_creator_tiers FOR ALL USING ((auth.jwt() ->> 'role')::text = 'admin');
CREATE POLICY "Creators can view their subscriptions" ON carousel_creator_subscriptions FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can manage their subscriptions" ON carousel_creator_subscriptions FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Everyone can view active templates" ON carousel_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Creators can manage their templates" ON carousel_templates FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Users can view their purchases" ON carousel_template_purchases FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = creator_id);
CREATE POLICY "Users can create purchases" ON carousel_template_purchases FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Everyone can view system health" ON carousel_system_health FOR SELECT USING (true);
CREATE POLICY "Admins can manage system health" ON carousel_system_health FOR ALL USING ((auth.jwt() ->> 'role')::text = 'admin');
CREATE POLICY "Admins can view compliance violations" ON carousel_compliance_violations FOR SELECT USING ((auth.jwt() ->> 'role')::text = 'admin');
CREATE POLICY "Admins can manage compliance violations" ON carousel_compliance_violations FOR ALL USING ((auth.jwt() ->> 'role')::text = 'admin');
CREATE POLICY "Creators can view their coaching conversations" ON carousel_coaching_conversations FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can manage their coaching conversations" ON carousel_coaching_conversations FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Creators can view their action items" ON carousel_coaching_action_items FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can manage their action items" ON carousel_coaching_action_items FOR ALL USING (auth.uid() = creator_id);

-- Indexes for performance
CREATE INDEX idx_carousel_incidents_carousel_type ON carousel_incidents(carousel_type);
CREATE INDEX idx_carousel_incidents_status ON carousel_incidents(status);
CREATE INDEX idx_carousel_incidents_severity ON carousel_incidents(severity);
CREATE INDEX idx_carousel_alert_rules_carousel_type ON carousel_alert_rules(carousel_type);
CREATE INDEX idx_carousel_alert_rules_is_active ON carousel_alert_rules(is_active);
CREATE INDEX idx_carousel_creator_subscriptions_creator_id ON carousel_creator_subscriptions(creator_id);
CREATE INDEX idx_carousel_creator_subscriptions_status ON carousel_creator_subscriptions(status);
CREATE INDEX idx_carousel_templates_creator_id ON carousel_templates(creator_id);
CREATE INDEX idx_carousel_templates_is_active ON carousel_templates(is_active);
CREATE INDEX idx_carousel_template_purchases_buyer_id ON carousel_template_purchases(buyer_id);
CREATE INDEX idx_carousel_template_purchases_creator_id ON carousel_template_purchases(creator_id);
CREATE INDEX idx_carousel_system_health_status ON carousel_system_health(status);
CREATE INDEX idx_carousel_compliance_violations_system_name ON carousel_compliance_violations(system_name);
CREATE INDEX idx_carousel_compliance_violations_severity ON carousel_compliance_violations(severity);
CREATE INDEX idx_carousel_coaching_conversations_creator_id ON carousel_coaching_conversations(creator_id);
CREATE INDEX idx_carousel_coaching_action_items_creator_id ON carousel_coaching_action_items(creator_id);