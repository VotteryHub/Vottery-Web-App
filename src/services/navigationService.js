import {
  CAMPAIGN_MANAGEMENT_DASHBOARD_ROUTE,
  DIRECT_MESSAGING_CENTER_ROUTE,
  FRIENDS_MANAGEMENT_HUB_ROUTE,
  LIVE_PLATFORM_MONITORING_DASHBOARD_ROUTE,
  NOTIFICATION_CENTER_HUB_ROUTE,
  SECURITY_MONITORING_DASHBOARD_ROUTE,
  SETTINGS_ACCOUNT_DASHBOARD_ROUTE,
  SPONSORED_ELECTIONS_SCHEMA_CPE_MANAGEMENT_HUB_ROUTE,
} from '../constants/navigationHubRoutes';
import { getEffectiveRoles, hasAnyRole } from '../constants/roles';
import { isBatch1RouteAllowed } from '../config/batch1RouteAllowlist';

export const navigationService = {
  getAllScreens() {
    return [
      // Voter Screens
      { id: 'home-feed', name: 'Home Feed', path: '/', category: 'Core', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Home', keywords: ['home', 'feed', 'dashboard', 'main'] },
      { id: 'vote-elections', name: 'Vote in Elections', path: '/vote-in-elections-hub', category: 'Voting', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'CheckSquare', keywords: ['vote', 'elections', 'ballot', 'participate'] },
      { id: 'elections-dashboard', name: 'Elections Dashboard', path: '/elections-dashboard', category: 'Voting', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Vote', keywords: ['elections', 'dashboard', 'overview'] },
      { id: 'voting-categories', name: 'Voting Categories', path: '/voting-categories', category: 'Voting', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Grid3x3', keywords: ['categories', 'topics', 'browse'] },
      { id: 'election-results', name: 'Election Results', path: '/enhanced-election-results-center', category: 'Voting', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'BarChart', keywords: ['results', 'winners', 'outcomes'] },
      { id: 'verify-vote', name: 'Verify Vote', path: '/vote-verification-portal', category: 'Security', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'ShieldCheck', keywords: ['verify', 'check', 'validation'] },
      { id: 'blockchain-audit', name: 'Blockchain Audit', path: '/blockchain-audit-portal', category: 'Security', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'FileSearch', keywords: ['audit', 'blockchain', 'verification'] },
      { id: 'profile', name: 'My Profile', path: '/user-profile-hub', category: 'Account', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'User', keywords: ['profile', 'account', 'settings'] },
      { id: 'wallet', name: 'Digital Wallet', path: '/digital-wallet-hub', category: 'Finance', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Wallet', keywords: ['wallet', 'money', 'balance', 'earnings'] },
      { id: 'vp-currency-center', name: 'VP Currency Center', path: '/vottery-points-vp-universal-currency-center', category: 'Gamification', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Coins', keywords: ['vp', 'vottery points', 'currency', 'rewards', 'xp'] },
      { id: 'vp-redemption-hub', name: 'VP Redemption Hub', path: '/vp-redemption-marketplace-charity-hub', category: 'Gamification', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Gift', keywords: ['vp', 'redemption', 'charity', 'marketplace', 'vip'] },
      { id: 'messages', name: 'Messages', path: DIRECT_MESSAGING_CENTER_ROUTE, category: 'Social', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'MessageSquare', keywords: ['messages', 'chat', 'inbox'] },
      { id: 'notifications', name: 'Notifications', path: NOTIFICATION_CENTER_HUB_ROUTE, category: 'Social', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Bell', keywords: ['notifications', 'alerts', 'updates'] },
      { id: 'friends', name: 'Friends', path: FRIENDS_MANAGEMENT_HUB_ROUTE, category: 'Social', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Users', keywords: ['friends', 'connections', 'network'] },
      { id: 'activity-feed', name: 'Activity Feed', path: '/social-activity-timeline', category: 'Social', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Activity', keywords: ['activity', 'timeline', 'feed'] },
      { id: 'personal-analytics', name: 'Personal Analytics', path: '/personal-analytics-dashboard', category: 'Analytics', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'TrendingUp', keywords: ['analytics', 'stats', 'insights'] },
      { id: 'gamification-rewards', name: 'Rewards & Badges', path: '/gamification-rewards-management-center', category: 'Gamification', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Award', keywords: ['rewards', 'badges', 'achievements', 'gamification'] },
      { id: 'prediction-pool-notifications', name: 'Prediction Pool Notifications', path: '/prediction-pool-notifications-hub', category: 'Gamification', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Bell', keywords: ['prediction', 'pool', 'notifications', 'preferences', 'countdown', 'resolution', 'leaderboard'] },
      { id: 'prize-distribution', name: 'Prize Distribution', path: '/prize-distribution-tracking-center', category: 'Gamification', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Gift', keywords: ['prizes', 'winners', 'gamified'] },
      { id: 'settings', name: 'Settings', path: SETTINGS_ACCOUNT_DASHBOARD_ROUTE, category: 'Account', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Settings', keywords: ['settings', 'preferences', 'configuration'] },

      // Creator Screens
      { id: 'create-election', name: 'Create Election', path: '/election-creation-studio', category: 'Creator Tools', roles: ['creator', 'admin'], icon: 'Plus', keywords: ['create', 'new', 'election', 'campaign'] },
      { id: 'voter-rolls', name: 'Voter Rolls', path: '/voter-rolls-management', category: 'Creator Tools', roles: ['creator', 'admin'], icon: 'Users', keywords: ['voter', 'rolls', 'private', 'invite', 'import', 'verify'] },
      { id: 'creator-reputation', name: 'Creator Reputation', path: '/creator-reputation-election-management-system', category: 'Creator Tools', roles: ['creator', 'admin'], icon: 'Award', keywords: ['reputation', 'score', 'credibility'] },
      { id: 'creator-success-academy', name: 'Creator Success Academy', path: '/creator-success-academy', category: 'Creator Tools', roles: ['creator', 'admin'], icon: 'BookOpen', keywords: ['academy', 'onboarding', 'milestones', 'best practices'] },
      {
        id: 'creator-earnings',
        name: 'Creator Earnings',
        path: '/enhanced-creator-payout-dashboard-with-stripe-connect-integration',
        category: 'Creator Tools',
        roles: ['creator', 'admin'],
        icon: 'DollarSign',
        keywords: ['earnings', 'revenue', 'payouts', 'stripe'],
      },
      { id: 'claude-creator-success-agent', name: 'Claude Creator Success Agent', path: '/claude-creator-success-agent', category: 'Creator Tools', roles: ['creator', 'admin'], icon: 'Brain', keywords: ['claude', 'creator', 'success', 'health', 'churn', 'coaching'] },
      { id: 'content-quality-scoring-claude', name: 'Content Quality Scoring', path: '/content-quality-scoring-claude', category: 'Creator Tools', roles: ['creator', 'admin'], icon: 'FileCheck', keywords: ['content', 'quality', 'scoring', 'neutrality', 'rewrite'] },
      { id: 'presentation-builder', name: 'Presentation Builder', path: '/presentation-builder-audience-q-a-hub', category: 'Creator Tools', roles: ['creator', 'admin'], icon: 'Presentation', keywords: ['presentation', 'slides', 'qa'] },
      { id: 'real-time-analytics', name: 'Real-Time Analytics', path: '/real-time-analytics-dashboard', category: 'Analytics', roles: ['creator', 'admin'], icon: 'BarChart3', keywords: ['analytics', 'realtime', 'metrics'] },
      { id: 'election-insights', name: 'Election Insights', path: '/election-insights-predictive-analytics', category: 'Analytics', roles: ['creator', 'admin'], icon: 'Brain', keywords: ['insights', 'predictions', 'analytics'] },
      { id: 'user-analytics', name: 'User Analytics', path: '/user-analytics-dashboard', category: 'Analytics', roles: ['creator', 'admin'], icon: 'Users', keywords: ['users', 'audience', 'demographics'] },

      // Advertiser Screens
      { id: 'participatory-ads-studio', name: 'Participatory Ads Studio', path: '/participatory-ads-studio', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'Megaphone', keywords: ['ads', 'participatory', 'sponsored elections', 'wizard', 'create'] },
      { id: 'vottery-ads-studio', name: 'Vottery Ads Studio (Unified)', path: '/vottery-ads-studio', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'LayoutGrid', keywords: ['ads', 'unified', 'campaign', 'ad group', 'display', 'spark'] },
      { id: 'campaign-management', name: 'Campaign Management', path: '/campaign-management-dashboard', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'Layers', keywords: ['campaigns', 'manage', 'overview'] },
      { id: 'dynamic-cpe-pricing-engine', name: 'Dynamic CPE Pricing Engine', path: '/dynamic-cpe-pricing-engine-dashboard', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'Activity', keywords: ['cpe', 'pricing', 'zones', 'engagement', 'dynamic'] },
      { id: 'campaign-optimization', name: 'Campaign Optimization', path: '/automated-campaign-optimization-dashboard', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'Zap', keywords: ['optimization', 'improve', 'automate'] },
      { id: 'advertiser-analytics', name: 'Advertiser Analytics', path: '/advertiser-analytics-roi-dashboard', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'TrendingUp', keywords: ['roi', 'analytics', 'performance'] },
      { id: 'advertiser-roi', name: 'Real-Time ROI', path: '/enhanced-real-time-advertiser-roi-dashboard', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'DollarSign', keywords: ['roi', 'realtime', 'revenue'] },
      { id: 'brand-dashboard', name: 'Brand Dashboard', path: '/brand-dashboard-specialized-kpis-center', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'Target', keywords: ['brand', 'kpis', 'metrics'] },
      { id: 'brand-registration', name: 'Brand Registration', path: '/brand-advertiser-registration-portal', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'UserPlus', keywords: ['register', 'signup', 'onboard'] },
      { id: 'campaign-templates', name: 'Campaign Templates', path: '/campaign-template-gallery', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'Layers', keywords: ['templates', 'gallery', 'examples'] },
      { id: 'brand-alerts', name: 'Brand Alerts', path: '/real-time-brand-alert-budget-monitoring-center', category: 'Advertising', roles: ['advertiser', 'admin'], icon: 'Bell', keywords: ['alerts', 'budget', 'monitoring'] },

      // Admin Screens
      { id: 'admin-control', name: 'Admin Control Center', path: '/admin-control-center', category: 'Administration', roles: ['admin'], icon: 'Shield', keywords: ['admin', 'control', 'management'] },
      { id: 'admin-payout-verification', name: 'Admin Payout Verification', path: '/admin-payout-verification-dashboard', category: 'Administration', roles: ['admin'], icon: 'CheckCircle', keywords: ['admin', 'payout', 'verification', 'reconciliation', 'discrepancy'] },
      { id: 'content-moderation', name: 'Content Moderation', path: '/content-moderation-control-center', category: 'Administration', roles: ['admin'], icon: 'Shield', keywords: ['moderation', 'content', 'review'] },
      { id: 'admin-roles', name: 'Role Management', path: '/advanced-admin-role-management-system', category: 'Administration', roles: ['admin'], icon: 'Users', keywords: ['roles', 'permissions', 'access'] },
      { id: 'admin-activity-log', name: 'Activity Log', path: '/unified-admin-activity-log', category: 'Administration', roles: ['admin'], icon: 'FileText', keywords: ['logs', 'audit', 'history'] },
      { id: 'admin-platform-logs', name: 'Platform Logs', path: '/admin-platform-logs-center', category: 'Administration', roles: ['admin'], icon: 'Server', keywords: ['platform', 'logs', 'api', 'system', 'integrations'] },
      { id: 'bulk-management', name: 'Bulk Management', path: '/bulk-management-screen', category: 'Administration', roles: ['admin'], icon: 'Layers', keywords: ['bulk', 'batch', 'operations'] },
      { id: 'mobile-admin', name: 'Mobile Admin', path: '/mobile-admin-dashboard', category: 'Administration', roles: ['admin'], icon: 'Smartphone', keywords: ['mobile', 'admin', 'dashboard'] },

      // AI Intelligence Screens
      { id: 'ai-orchestration', name: 'AI Orchestration', path: '/unified-ai-orchestration-command-center', category: 'AI Intelligence', roles: ['admin'], icon: 'Brain', keywords: ['ai', 'orchestration', 'automation'] },
      { id: 'ai-performance', name: 'AI Performance Dashboard', path: '/ai-performance-orchestration-dashboard', category: 'AI Intelligence', roles: ['admin'], icon: 'Activity', keywords: ['ai', 'performance', 'monitoring'] },
      { id: 'market-research', name: 'Market Research', path: '/perplexity-market-research-intelligence-center', category: 'AI Intelligence', roles: ['admin', 'advertiser'], icon: 'Target', keywords: ['market', 'research', 'intelligence'] },
      { id: 'fraud-prevention', name: 'Fraud Prevention', path: '/fraud-prevention-dashboard-with-perplexity-threat-analysis', category: 'AI Intelligence', roles: ['admin'], icon: 'Shield', keywords: ['fraud', 'prevention', 'security'] },
      { id: 'claude-analytics', name: 'Claude Analytics', path: '/claude-analytics-dashboard-for-campaign-intelligence', category: 'AI Intelligence', roles: ['admin', 'advertiser'], icon: 'Brain', keywords: ['claude', 'analytics', 'intelligence'] },
      { id: 'claude-predictive', name: 'Claude Predictive Analytics', path: '/claude-predictive-analytics-dashboard', category: 'AI Intelligence', roles: ['admin', 'advertiser'], icon: 'Brain', keywords: ['claude', 'predictive', 'analytics', 'forecasting', 'intelligence', 'business'] },
      { id: 'claude-feed-intelligence', name: 'Claude Feed Intelligence', path: '/claude-ai-feed-intelligence-center', category: 'AI Intelligence', roles: ['admin', 'creator', 'advertiser'], icon: 'Brain', keywords: ['claude', 'feed', 'ranking', 'recommendations', 'personalization'] },
      { id: 'context-aware-claude-recommendations-overlay', name: 'Claude Recommendations', path: '/context-aware-claude-recommendations-overlay', category: 'AI Intelligence', roles: ['admin', 'creator', 'advertiser'], icon: 'Sparkles', keywords: ['claude', 'recommendations', 'optimization', 'suggestions', 'ai', 'contextual', 'approval'] },
      { id: 'claude-model-comparison-center', name: 'Claude Model Comparison', path: '/claude-model-comparison-center', category: 'AI Intelligence', roles: ['admin'], icon: 'GitCompare', keywords: ['claude', 'model', 'comparison', 'ab testing', 'sonnet', 'opus', 'performance', 'cost'] },
      { id: 'ai-sentiment', name: 'AI Sentiment Analytics', path: '/ai-sentiment-strategy-analytics', category: 'AI Intelligence', roles: ['admin'], icon: 'Brain', keywords: ['sentiment', 'analysis', 'ai'] },
      { id: 'ai-content-safety', name: 'AI Content Safety', path: '/ai-content-safety-screening-center', category: 'AI Intelligence', roles: ['admin'], icon: 'Shield', keywords: ['content', 'safety', 'screening'] },
      { id: 'claude-dispute', name: 'Claude Dispute Resolution', path: '/claude-ai-dispute-moderation-center', category: 'AI Intelligence', roles: ['admin'], icon: 'Scale', keywords: ['dispute', 'resolution', 'moderation'] },
      { id: 'threat-intelligence', name: 'Threat Intelligence', path: '/enhanced-predictive-threat-intelligence-center', category: 'AI Intelligence', roles: ['admin'], icon: 'Shield', keywords: ['threat', 'intelligence', 'security'] },
      { id: 'fraud-forecasting', name: 'Fraud Forecasting', path: '/advanced-perplexity-fraud-forecasting-center', category: 'AI Intelligence', roles: ['admin'], icon: 'TrendingUp', keywords: ['fraud', 'forecasting', 'prediction'] },
      { id: 'fraud-intelligence', name: 'Fraud Intelligence', path: '/advanced-perplexity-fraud-intelligence-center', category: 'AI Intelligence', roles: ['admin'], icon: 'Shield', keywords: ['fraud', 'intelligence', 'detection'] },
      { id: 'ml-training', name: 'ML Model Training', path: '/ml-model-training-interface', category: 'AI Intelligence', roles: ['admin'], icon: 'Brain', keywords: ['ml', 'machine learning', 'training'] },
      { id: 'cross-domain-intelligence', name: 'Cross-Domain Intelligence', path: '/cross-domain-intelligence-analytics-hub', category: 'AI Intelligence', roles: ['admin'], icon: 'GitMerge', keywords: ['intelligence', 'analytics', 'cross-domain'] },

      // System & Monitoring
      { id: 'platform-monitoring', name: 'Platform Monitoring', path: LIVE_PLATFORM_MONITORING_DASHBOARD_ROUTE, category: 'System', roles: ['admin'], icon: 'Activity', keywords: ['monitoring', 'platform', 'health'] },
      {
        id: 'security-monitoring-dashboard',
        name: 'Security Monitoring',
        path: SECURITY_MONITORING_DASHBOARD_ROUTE,
        category: 'Security',
        roles: ['admin'],
        icon: 'Shield',
        keywords: ['security', 'monitoring', 'dashboard', 'alerts'],
      },
      { id: 'platform-testing', name: 'Platform Testing', path: '/platform-testing-optimization-command-center', category: 'System', roles: ['admin'], icon: 'TestTube', keywords: ['testing', 'optimization', 'qa'] },
      { id: 'health-monitoring', name: 'Health Monitoring', path: '/comprehensive-health-monitoring-dashboard', category: 'System', roles: ['admin'], icon: 'Heart', keywords: ['health', 'monitoring', 'status'] },
      { id: 'advanced-monitoring', name: 'Advanced Monitoring', path: '/advanced-platform-monitoring-event-tracking-hub', category: 'System', roles: ['admin'], icon: 'Activity', keywords: ['monitoring', 'events', 'tracking'] },
      { id: 'api-management', name: 'API Management', path: '/res-tful-api-management-center', category: 'System', roles: ['admin'], icon: 'Code', keywords: ['api', 'management', 'endpoints'] },
      { id: 'api-docs', name: 'API Documentation', path: '/api-documentation-portal', category: 'System', roles: ['admin', 'developer'], icon: 'BookOpen', keywords: ['api', 'docs', 'documentation', 'rest', 'webhooks'] },
      { id: 'webhook-integration', name: 'Webhook Integration', path: '/webhook-integration-hub', category: 'System', roles: ['admin'], icon: 'Webhook', keywords: ['webhooks', 'integration', 'events'] },

      // Security & Compliance
      { id: 'user-security', name: 'User Security', path: '/user-security-center', category: 'Security', roles: ['admin'], icon: 'Lock', keywords: ['security', 'user', 'protection'] },
      { id: 'fraud-detection', name: 'Fraud Detection', path: '/fraud-detection-alert-management-center', category: 'Security', roles: ['admin'], icon: 'AlertTriangle', keywords: ['fraud', 'detection', 'alerts'] },
      { id: 'incident-response', name: 'Incident Response', path: '/automated-incident-response-portal', category: 'Security', roles: ['admin'], icon: 'AlertTriangle', keywords: ['incident', 'response', 'emergency'] },
      { id: 'unified-incident', name: 'Unified Incident Response', path: '/unified-incident-response-orchestration-center', category: 'Security', roles: ['admin'], icon: 'Workflow', keywords: ['incident', 'orchestration', 'response'] },
      { id: 'cryptographic-security', name: 'Cryptographic Security', path: '/cryptographic-security-management-center', category: 'Security', roles: ['admin'], icon: 'Lock', keywords: ['cryptography', 'encryption', 'security'] },
      { id: 'vote-anonymity', name: 'Vote Anonymity', path: '/vote-anonymity-mixnet-control-hub', category: 'Security', roles: ['admin'], icon: 'EyeOff', keywords: ['anonymity', 'privacy', 'mixnet'] },
      { id: 'compliance', name: 'Compliance Dashboard', path: '/compliance-dashboard', category: 'Compliance', roles: ['admin'], icon: 'FileCheck', keywords: ['compliance', 'regulations', 'audit'] },
      { id: 'compliance-audit', name: 'Compliance Audit', path: '/compliance-audit-dashboard', category: 'Compliance', roles: ['admin'], icon: 'FileSearch', keywords: ['audit', 'compliance', 'review'] },
      { id: 'regulatory-compliance', name: 'Regulatory Compliance', path: '/regulatory-compliance-automation-hub', category: 'Compliance', roles: ['admin'], icon: 'FileText', keywords: ['regulatory', 'compliance', 'automation'] },
      { id: 'age-verification', name: 'Age Verification', path: '/age-verification-digital-identity-center', category: 'Compliance', roles: ['admin'], icon: 'UserCheck', keywords: ['age', 'verification', 'identity'] },
      { id: 'bulletin-board', name: 'Public Bulletin Board', path: '/public-bulletin-board-audit-trail-center', category: 'Compliance', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'FileText', keywords: ['bulletin', 'board', 'audit', 'public', 'transparency'] },
      { id: 'advanced-search-hub', name: 'Advanced Search Hub', path: '/advanced-search-discovery-intelligence-hub', category: 'Voting', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Search', keywords: ['search', 'discovery', 'saved searches', 'trending terms', 'filters'] },

      // Payments & Finance
      { id: 'payment-processing', name: 'Payment Processing', path: '/automated-payment-processing-hub', category: 'Finance', roles: ['admin'], icon: 'CreditCard', keywords: ['payments', 'processing', 'transactions'] },
      { id: 'stripe-integration', name: 'Stripe Integration', path: '/stripe-payment-integration-hub', category: 'Finance', roles: ['admin'], icon: 'CreditCard', keywords: ['stripe', 'payments', 'integration'] },
      { id: 'stripe-gamified', name: 'Stripe Gamified', path: '/stripe-lottery-payment-integration-center', category: 'Finance', roles: ['admin'], icon: 'Gift', keywords: ['gamified', 'stripe', 'prizes'] },
      { id: 'stripe-subscription', name: 'Stripe Subscriptions', path: '/stripe-subscription-management-center', category: 'Finance', roles: ['admin'], icon: 'CreditCard', keywords: ['subscriptions', 'stripe', 'billing'] },
      { id: 'user-subscription', name: 'User Subscriptions', path: '/user-subscription-dashboard', category: 'Finance', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'CreditCard', keywords: ['subscription', 'plan', 'billing'] },
      { id: 'multi-currency', name: 'Multi-Currency Settlement', path: '/multi-currency-settlement-dashboard', category: 'Finance', roles: ['admin'], icon: 'DollarSign', keywords: ['currency', 'settlement', 'international'] },
      { id: 'financial-tracking', name: 'Financial Tracking', path: '/financial-tracking-zone-analytics-center', category: 'Finance', roles: ['admin'], icon: 'DollarSign', keywords: ['financial', 'tracking', 'analytics'] },
      { id: 'revenue-analytics', name: 'Revenue Analytics', path: '/enhanced-admin-revenue-analytics-hub', category: 'Finance', roles: ['admin'], icon: 'TrendingUp', keywords: ['revenue', 'analytics', 'earnings'] },
      { id: 'cost-analytics-roi', name: 'Cost Analytics & ROI', path: '/cost-analytics-roi-dashboard', category: 'Finance', roles: ['admin'], icon: 'DollarSign', keywords: ['cost', 'analytics', 'roi', 'redis', 'datadog', 'supabase', 'caching'] },
      { id: 'claude-revenue', name: 'Claude Revenue Intelligence', path: '/anthropic-claude-revenue-risk-intelligence-center', category: 'Finance', roles: ['admin'], icon: 'Brain', keywords: ['revenue', 'risk', 'intelligence'] },

      // Communication & Alerts
      { id: 'alert-management', name: 'Alert Management', path: '/unified-alert-management-center', category: 'Communication', roles: ['admin'], icon: 'Bell', keywords: ['alerts', 'management', 'notifications'] },
      { id: 'alert-rules', name: 'Alert Rules Engine', path: '/custom-alert-rules-engine', category: 'Communication', roles: ['admin'], icon: 'Settings', keywords: ['rules', 'alerts', 'automation'] },
      { id: 'advanced-alert-rules', name: 'Advanced Alert Rules', path: '/advanced-custom-alert-rules-engine', category: 'Communication', roles: ['admin'], icon: 'Settings', keywords: ['advanced', 'rules', 'alerts'] },
      { id: 'multi-channel-comms', name: 'Multi-Channel Communications', path: '/autonomous-multi-channel-communication-hub', category: 'Communication', roles: ['admin'], icon: 'MessageSquare', keywords: ['communications', 'multi-channel', 'messaging'] },
      { id: 'stakeholder-comms', name: 'Stakeholder Communications', path: '/stakeholder-incident-communication-hub', category: 'Communication', roles: ['admin'], icon: 'Users', keywords: ['stakeholder', 'communications', 'incident'] },
      { id: 'sms-emergency-alerts', name: 'SMS Emergency Alerts', path: '/sms-emergency-alerts-hub?tab=sms-critical', category: 'Communication', roles: ['admin'], icon: 'Smartphone', keywords: ['sms', 'emergency', 'alerts', 'critical'] },
      { id: 'email-automation', name: 'Email Automation', path: '/enhanced-resend-email-automation-hub', category: 'Communication', roles: ['admin'], icon: 'Mail', keywords: ['email', 'automation', 'resend'] },
      { id: 'executive-reporting', name: 'Executive Reporting', path: '/executive-reporting-compliance-automation-hub', category: 'Communication', roles: ['admin'], icon: 'FileText', keywords: ['executive', 'reporting', 'compliance'] },
      { id: 'claude-intelligence', name: 'Claude Intelligence Hub', path: '/automated-executive-reporting-claude-intelligence-hub', category: 'Communication', roles: ['admin'], icon: 'Brain', keywords: ['claude', 'intelligence', 'reporting'] },
      { id: 'winner-notification', name: 'Winner Notifications', path: '/real-time-winner-notification-prize-verification-center', category: 'Communication', roles: ['admin'], icon: 'Trophy', keywords: ['winners', 'notifications', 'prizes'] },

      // Gamification & Engagement
      { id: 'vp-economy-health', name: 'VP Economy Health', path: '/vp-economy-health-monitor-dashboard', category: 'Gamification', roles: ['admin'], icon: 'Activity', keywords: ['vp', 'economy', 'inflation', 'supply', 'admin', 'alerts'] },
      { id: 'platform-gamification', name: 'Platform Gamification', path: '/platform-gamification-core-engine', category: 'Gamification', roles: ['admin'], icon: 'Gamepad2', keywords: ['gamification', 'engine', 'rewards'] },
      { id: 'gamification-campaigns', name: 'Gamification Campaigns', path: '/gamification-campaign-management-center', category: 'Gamification', roles: ['admin'], icon: 'Trophy', keywords: ['campaigns', 'gamification', 'management'] },
      { id: '3d-slot-machine', name: '3D Slot Machine', path: '/premium-3d-slot-machine-integration-hub', category: 'Gamification', roles: ['admin'], icon: 'Sparkles', keywords: ['slot', 'machine', '3d', 'gamified'] },
      { id: '3d-gamified-experience', name: '3D Gamified Experience', path: '/3d-gamified-election-experience-center', category: 'Gamification', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Sparkles', keywords: ['3d', 'gamified', 'experience'] },
      { id: 'social-engagement', name: 'Social Engagement', path: '/comprehensive-social-engagement-suite', category: 'Gamification', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Heart', keywords: ['social', 'engagement', 'interaction'] },
      { id: 'sponsored-elections', name: 'Sponsored Elections', path: SPONSORED_ELECTIONS_SCHEMA_CPE_MANAGEMENT_HUB_ROUTE, category: 'Gamification', roles: ['admin', 'advertiser'], icon: 'DollarSign', keywords: ['sponsored', 'elections', 'cpe'] },

      // Advanced Features
      { id: 'plus-minus-voting', name: 'Plus-Minus Voting', path: '/plus-minus-voting-interface', category: 'Voting', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'PlusCircle', keywords: ['plus', 'minus', 'voting', 'method'] },
      { id: 'community-elections', name: 'Community Elections', path: '/community-elections-hub', category: 'Community', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Users', keywords: ['community', 'elections', 'groups'] },
      { id: 'topic-communities', name: 'Topic Communities', path: '/topic-based-community-elections-hub', category: 'Community', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Grid3x3', keywords: ['topics', 'communities', 'groups'] },
      { id: 'topic-preferences', name: 'Topic Preferences', path: '/interactive-topic-preference-collection-hub', category: 'Personalization', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'Target', keywords: ['preferences', 'topics', 'personalization'] },
      { id: 'feed-ranking', name: 'Feed Ranking Engine', path: '/supabase-real-time-feed-ranking-engine', category: 'Personalization', roles: ['admin'], icon: 'Sparkles', keywords: ['feed', 'ranking', 'algorithm'] },
      { id: 'content-distribution', name: 'Content Distribution', path: '/content-distribution-control-center', category: 'System', roles: ['admin'], icon: 'Share2', keywords: ['content', 'distribution', 'control'] },
      { id: 'accessibility', name: 'Accessibility Center', path: '/accessibility-analytics-preferences-center', category: 'Personalization', roles: ['admin'], icon: 'Eye', keywords: ['accessibility', 'preferences', 'analytics'] },
      { id: 'localization', name: 'Localization Control', path: '/global-localization-control-center', category: 'System', roles: ['admin'], icon: 'Globe', keywords: ['localization', 'translation', 'languages'] },
      { id: 'multi-auth', name: 'Multi-Authentication', path: '/multi-authentication-gateway', category: 'Security', roles: ['admin'], icon: 'Lock', keywords: ['authentication', 'multi-factor', 'security'] },
      { id: 'google-analytics', name: 'Google Analytics', path: '/enhanced-google-analytics-integration-center', category: 'Analytics', roles: ['admin'], icon: 'BarChart3', keywords: ['google', 'analytics', 'tracking'] },
      { id: 'pwa-mobile-optimization', name: 'PWA & Mobile Optimization', path: '/progressive-web-app-mobile-optimization-hub', category: 'System', roles: ['admin'], icon: 'Smartphone', keywords: ['pwa', 'mobile', 'optimization', 'progressive', 'web', 'app', 'push', 'notifications', 'offline'] },
      { id: 'supabase-integration', name: 'Supabase Integration', path: '/enhanced-real-time-supabase-integration-hub', category: 'System', roles: ['admin'], icon: 'Database', keywords: ['supabase', 'integration', 'realtime'] },
      { id: 'orchestration-control', name: 'Orchestration Control', path: '/intelligent-orchestration-control-center', category: 'System', roles: ['admin'], icon: 'Workflow', keywords: ['orchestration', 'automation', 'control'] },
      { id: 'team-collaboration', name: 'Team Collaboration', path: '/team-collaboration-center', category: 'Collaboration', roles: ['admin', 'creator'], icon: 'Users', keywords: ['team', 'collaboration', 'workspace'] },
      { id: 'support-ticketing', name: 'Support Ticketing', path: '/centralized-support-ticketing-system', category: 'Support', roles: ['admin'], icon: 'HelpCircle', keywords: ['support', 'tickets', 'help'] },
      { id: 'design-system', name: 'Design System', path: '/design-system-foundation', category: 'System', roles: ['admin'], icon: 'Palette', keywords: ['design', 'system', 'ui', 'components'] },
      { id: 'ai-tutorial', name: 'AI Tutorial System', path: '/ai-guided-interactive-tutorial-system', category: 'Onboarding', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'GraduationCap', keywords: ['tutorial', 'onboarding', 'guide', 'help'] },
      { id: 'interactive-onboarding', name: 'Interactive Onboarding', path: '/interactive-onboarding-wizard', category: 'Onboarding', roles: ['voter', 'creator', 'advertiser', 'admin'], icon: 'UserPlus', keywords: ['onboarding', 'wizard', 'setup', 'welcome'] },
      { id: 'slack-alerts', name: 'Slack Team Alerts', path: '/slack-team-alerts-center', category: 'Communication', roles: ['admin'], icon: 'MessageSquare', keywords: ['slack', 'alerts', 'team', 'notifications'] },
      { id: 'error-recovery', name: 'Error Recovery', path: '/error-recovery-dashboard', category: 'AI Intelligence', roles: ['admin'], icon: 'ShieldAlert', keywords: ['error', 'recovery', 'debugging', 'troubleshooting'] },
      { id: 'api-rate-limiting-dashboard', name: 'API Rate Limiting Dashboard', path: '/api-rate-limiting-dashboard', category: 'AI Intelligence', roles: ['admin', 'developer'], icon: 'Gauge', keywords: ['api', 'rate', 'limiting', 'throttle'] },
      {
        id: 'unified-incident-response-command-center',
        name: 'Unified Incident Response Command Center',
        path: '/unified-incident-response-command-center',
        category: 'AI Intelligence',
        roles: ['admin', 'moderator'],
        icon: 'Workflow',
        keywords: ['incident', 'command', 'correlation', 'resolution'],
        description: 'Intelligent incident correlation and automated resolution',
      },
      {
        id: 'datadog-apm-performance-intelligence-center',
        name: 'Datadog APM Performance Intelligence Center',
        path: '/datadog-apm-performance-intelligence-center',
        category: 'AI Intelligence',
        roles: ['admin', 'moderator'],
        icon: 'Activity',
        keywords: ['datadog', 'apm', 'performance', 'observability'],
        description: 'Deep performance visibility across 200+ API endpoints',
      },
      { id: 'comprehensive-gamification', name: 'Gamification Admin', path: '/comprehensive-gamification-admin-control-center', category: 'Gamification', roles: ['admin'], icon: 'Trophy', keywords: ['gamification', 'admin', 'vp', 'challenges', 'leaderboards', 'predictions', 'redemptions', 'control'] },
      { id: 'admin-quest-configuration', name: 'Quest Configuration', path: '/admin-quest-configuration-control-center', category: 'Gamification', roles: ['admin'], icon: 'Target', keywords: ['quest', 'configuration', 'openai', 'difficulty', 'parameters', 'admin', 'control'] },
    ];
  },

  getScreensByRole(role) {
    const allScreens = this.getAllScreens();
    const effectiveRoles = getEffectiveRoles(role);
    return allScreens?.filter(
      (screen) =>
        isBatch1RouteAllowed(screen?.path) &&
        screen?.roles?.length &&
        screen.roles.some((r) => effectiveRoles.includes(r))
    ) ?? [];
  },

  /** Get required roles for a path (for route guards). Returns null if public. */
  getRequiredRolesForPath(path) {
    const allScreens = this.getAllScreens();
    const screen = allScreens?.find((s) => s?.path === path);
    if (screen?.roles?.length) return screen.roles;
    const p = path?.toLowerCase() || '';
    if (p.startsWith('/admin-') || p.includes('-admin-')) return ['admin'];
    if (p.includes('-monitoring-') || p.includes('-control-center') || p.includes('moderation') || p.includes('compliance') || p.includes('fraud-detection') || p.includes('incident-response')) return ['admin'];
    return null;
  },

  getScreensByCategory(category) {
    const allScreens = this.getAllScreens();
    return allScreens?.filter(screen => screen?.category === category);
  },

  searchScreens(query) {
    if (!query) return [];
    const allScreens = this.getAllScreens();
    const lowerQuery = query?.toLowerCase();
    
    return allScreens?.filter(screen => {
      const nameMatch = screen?.name?.toLowerCase()?.includes(lowerQuery);
      const keywordMatch = screen?.keywords?.some(k => k?.includes(lowerQuery));
      const categoryMatch = screen?.category?.toLowerCase()?.includes(lowerQuery);
      return nameMatch || keywordMatch || categoryMatch;
    });
  },

  getCategories() {
    const allScreens = this.getAllScreens();
    const categories = [...new Set(allScreens?.map(s => s?.category))];
    return categories?.sort();
  },

  getCategoryIcon(category) {
    const iconMap = {
      'Core': 'Home',
      'Voting': 'Vote',
      'Security': 'Shield',
      'Account': 'User',
      'Finance': 'DollarSign',
      'Social': 'Users',
      'Analytics': 'BarChart3',
      'Gamification': 'Trophy',
      'Creator Tools': 'Wand2',
      'Advertising': 'Megaphone',
      'Administration': 'Settings',
      'AI Intelligence': 'Brain',
      'System': 'Server',
      'Compliance': 'FileCheck',
      'Communication': 'MessageSquare',
      'Community': 'Users',
      'Personalization': 'Sparkles',
      'Collaboration': 'Users',
      'Support': 'HelpCircle',
      'Onboarding': 'GraduationCap',
    };
    return iconMap?.[category] || 'Folder';
  },
};
