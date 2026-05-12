import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import * as Web from '../../constants/navigationHubRoutes';

// Lazy loaded components (matches Routes.jsx logic)
const CryptographicSecurityManagementCenter = lazy(() => import("../../pages/cryptographic-security-management-center"));
const VoteAnonymityMixnetControlHub = lazy(() => import("../../pages/vote-anonymity-mixnet-control-hub"));
const JoltsVideoStudio = lazy(() => import("../../pages/jolts-video-studio"));
const RevenueSplitAnalyticsImpactDashboard = lazy(() => import("../../pages/revenue-split-analytics-impact-dashboard"));
const DynamicRevenueSharingConfigurationCenter = lazy(() => import("../../pages/dynamic-revenue-sharing-configuration-center/index"));
const RevenueSplitTestingSandboxEnvironment = lazy(() => import("../../pages/revenue-split-testing-sandbox-environment/index"));
const ThreeDFeedPerformanceAnalyticsDashboard = lazy(() => import("../../pages/3d-feed-performance-analytics-dashboard/index"));
const LiveStreamingRealTimeBroadcastCenter = lazy(() => import("../../pages/live-streaming-real-time-broadcast-center/index"));
const GoogleAnalyticsSecurityEventsIntegrationHub = lazy(() => import("../../pages/google-analytics-security-events-integration-hub/index"));
const Premium2DCarouselComponentLibraryHub = lazy(() => import("../../pages/premium-2d-carousel-component-library-hub/index"));
const CarouselPerformanceAnalyticsHub = lazy(() => import("../../pages/carousel-performance-analytics-hub/index"));
const CarouselABTestingDashboard = lazy(() => import("../../pages/carousel-ab-testing-dashboard/index"));
const AdvancedCarouselROIAnalyticsDashboard = lazy(() => import("../../pages/advanced-carousel-roi-analytics-dashboard/index"));
const CarouselFeedOrchestrationEngine = lazy(() => import("../../pages/carousel-feed-orchestration-engine/index"));
const CreatorCarouselOptimizationStudio = lazy(() => import("../../pages/creator-carousel-optimization-studio/index"));
const AdvancedCarouselFraudDetectionPreventionCenter = lazy(() => import("../../pages/advanced-carousel-fraud-detection-prevention-center/index"));
const RealTimeCarouselMonitoringHub = lazy(() => import("../../pages/real-time-carousel-monitoring-hub/index"));
const CarouselHealthScalingDashboard = lazy(() => import("../../pages/carousel-health-scaling-dashboard/index"));
const AIGuidedInteractiveTutorialSystem = lazy(() => import('../../pages/ai-guided-interactive-tutorial-system/index'));
const CreatorCommunityHub = lazy(() => import('../../pages/creator-community-hub/index'));
const MomentsCreationStudio = lazy(() => import('../../pages/moments-creation-studio/index'));
const RealTimeNotificationsHubWithPushIntegration = lazy(() => import('../../pages/real-time-notifications-hub-with-push-integration/index'));
const GuidedOnboardingToursInteractiveTutorialSystem = lazy(() => import('../../pages/guided-onboarding-tours-interactive-tutorial-system/index'));
const UnifiedAIDecisionOrchestrationCommandCenter = lazy(() => import('../../pages/unified-ai-decision-orchestration-command-center/index'));
const CommunityEngagementDashboard = lazy(() => import('../../pages/community-engagement-dashboard/index'));
const CrossDomainDataSyncHub = lazy(() => import('../../pages/cross-domain-data-sync-hub/index'));
const ComprehensiveFeatureAnalyticsDashboard = lazy(() => import('../../pages/comprehensive-feature-analytics-dashboard/index'));
const ProductionDeploymentHub = lazy(() => import('../../pages/production-deployment-hub/index'));
const SecurityComplianceAuditScreen = lazy(() => import('../../pages/security-compliance-audit-screen/index'));
const UnifiedPaymentOrchestrationHub = lazy(() => import('../../pages/unified-payment-orchestration-hub/index'));
const CostAnalyticsROIDashboard = lazy(() => import('../../pages/cost-analytics-roi-dashboard/index'));

// ── Missing lazy imports (referenced in route map but were missing) ─────────
const Premium3DSlotMachineIntegrationHub = lazy(() => import('../../pages/premium-3d-slot-machine-integration-hub/index'));
const UnifiedIncidentResponseCommandCenter = lazy(() => import('../../pages/unified-incident-response-command-center/index'));
const AutomaticAIFailoverEngineControlCenter = lazy(() => import('../../pages/automatic-ai-failover-engine-control-center/index'));
const AIPerformanceOrchestrationDashboard = lazy(() => import('../../pages/ai-performance-orchestration-dashboard/index'));
const PublicBulletinBoardAuditTrailCenter = lazy(() => import('../../pages/public-bulletin-board-audit-trail-center/index'));
const EnhancedHomeFeedDashboard = lazy(() => import('../../pages/enhanced-home-feed-dashboard/index'));
const AppPerformanceDashboard = lazy(() => import('../../pages/app-performance-dashboard/index'));
const EnhancedHubsDiscoveryManagementHub = lazy(() => import('../../pages/enhanced-hubs-discovery-management-hub/index'));

// ── Finance Modules ─────────────────────────────────────────────────────────
const StripeSubscriptionManagementCenter = lazy(() => import('../../pages/stripe-subscription-management-center/index'));
const UserSubscriptionDashboard = lazy(() => import('../../pages/user-subscription-dashboard/index'));
const AnthropicClaudeRevenueRiskIntelligenceCenter = lazy(() => import('../../pages/anthropic-claude-revenue-risk-intelligence-center/index'));
const StripeGamifiedPaymentIntegrationCenter = lazy(() => import('../../pages/stripe-lottery-payment-integration-center/index'));

// ── New Admin Dashboard Modules ─────────────────────────────────────────────
const AdminAiContentModeration = lazy(() => import('../../pages/admin-ai-content-moderation/index'));
const AdminFraudDetectionCenter = lazy(() => import('../../pages/admin-fraud-detection-center/index'));
const AdminNotificationIntelligence = lazy(() => import('../../pages/admin-notification-intelligence/index'));
const AdminRevenueIntelligence = lazy(() => import('../../pages/admin-revenue-intelligence/index'));
const AdminSocialActivityAnalytics = lazy(() => import('../../pages/admin-social-activity-analytics/index'));
const AdminSocialEngagementAnalytics = lazy(() => import('../../pages/admin-social-engagement-analytics/index'));
const AdminSocialTimelineAnalytics = lazy(() => import('../../pages/admin-social-timeline-analytics/index'));
const AdminAccessibilityAnalytics = lazy(() => import('../../pages/admin-accessibility-analytics/index'));
const AdminElectionModerationHub = lazy(() => import('../../pages/admin-election-moderation-hub/index'));
const AdminHealthCheck = lazy(() => import('../../pages/admin-health-check/index'));
const AlgorithmCommandCenter = lazy(() => import('../../pages/admin/algorithm-command-center/index'));


import VoterRollsManagement from '../../pages/voter-rolls-management/index';
import AdminQuestConfigurationControlCenter from '../../pages/admin-quest-configuration-control-center/index';
import VotteryPointsVPUniversalCurrencyCenter from '../../pages/vottery-points-vp-universal-currency-center/index';
import VpRedemptionMarketplaceCharityHub from '../../pages/vp-redemption-marketplace-charity-hub/index';
import SponsoredElectionsSchemaCPEManagementHub from '../../pages/sponsored-elections-schema-cpe-management-hub/index';
// Standard imports (shared with Routes.jsx - will be removed from Routes.jsx later)
import CollaborativeVotingRoom from "../../pages/collaborative-voting-room/index";
import AIAnalyticsHub from "../../pages/ai-analytics-hub/index";
import AdvancedMonitoringHubWithAutomatedIncidentResponse from "../../pages/advanced-monitoring-hub-with-automated-incident-response/index";
import ProductionMonitoringDashboard from "../../pages/production-monitoring-dashboard/index";
import DatadogAPMPerformanceIntelligenceCenter from "../../pages/datadog-apm-performance-intelligence-center/index";
import EnhancedIncidentResponseAnalytics from "../../pages/enhanced-incident-response-analytics/index";
import UserFeedbackPortalWithFeatureRequestSystem from "../../pages/user-feedback-portal-with-feature-request-system/index";
import FeatureImplementationTrackingEngagementAnalyticsCenter from "../../pages/feature-implementation-tracking-engagement-analytics-center/index";
import AdSlotManagerInventoryControlCenter from "../../pages/ad-slot-manager-inventory-control-center/index";
import AdNetworkStatusAndSplitDashboard from "../../pages/ad-network-status-and-split-dashboard/index";
import DynamicAdRenderingFillRateAnalyticsHub from "../../pages/dynamic-ad-rendering-fill-rate-analytics-hub/index";
import GamificationProgressionAchievementHub from "../../pages/gamification-progression-achievement-hub/index";
import EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing from "../../pages/enhanced-automated-payout-calculation-engine-with-country-based-processing";
import RegionalRevenueAnalyticsDashboard from "../../pages/regional-revenue-analytics-dashboard";
import RevenueFraudDetectionAnomalyPreventionCenter from "../../pages/revenue-fraud-detection-anomaly-prevention-center/index";
import PredictiveAnomalyAlertingDeviationMonitoringHub from "../../pages/predictive-anomaly-alerting-deviation-monitoring-hub/index";
import DualAdvertisingSystemAnalyticsDashboard from "../../pages/dual-advertising-system-analytics-dashboard/index";
import AIDependencyRiskMitigationCommandCenter from "../../pages/ai-dependency-risk-mitigation-command-center/index";
import GeminiFallbackOrchestrationHub from "../../pages/gemini-fallback-orchestration-hub/index";
import EnhancedDynamicRevenueSharingConfigurationCenter from "../../pages/enhanced-dynamic-revenue-sharing-configuration-center/index";
import CountryRevenueShareManagementCenter from "../../pages/country-revenue-share-management-center/index";
import LocalizationTaxReportingIntelligenceCenter from "../../pages/localization-tax-reporting-intelligence-center/index";
import ClaudeCreatorSuccessAgent from "../../pages/claude-creator-success-agent/index";
import InternationalPaymentDisputeResolutionCenter from "../../pages/international-payment-dispute-resolution-center/index";
import CreatorBrandPartnershipPortal from "../../pages/creator-brand-partnership-portal/index";
import CreatorReputationElectionManagementSystem from '../../pages/creator-reputation-election-management-system/index';
import CreatorSuccessAcademy from '../../pages/creator-success-academy/index';
import UnifiedIncidentResponseOrchestrationCenter from '../../pages/unified-incident-response-orchestration-center/index';
import AdvancedPerplexityFraudIntelligenceCenter from '../../pages/advanced-perplexity-fraud-intelligence-center/index';
import AdvancedPerplexityFraudForecastingCenter from '../../pages/advanced-perplexity-fraud-forecasting-center/index';
import AdvancedPerplexity6090DayThreatForecastingCenter from '../../pages/advanced-perplexity-60-90-day-threat-forecasting-center/index';
import AdvancedAIFraudPreventionCommandCenter from '../../pages/advanced-ai-fraud-prevention-command-center/index';
import AutoImprovingFraudDetectionIntelligenceCenter from '../../pages/auto-improving-fraud-detection-intelligence-center/index';
import EnhancedPredictiveThreatIntelligenceCenter from '../../pages/enhanced-predictive-threat-intelligence-center/index';
import AutomatedSecurityTestingFramework from '../../pages/automated-security-testing-framework/index';
import AnthropicSecurityReasoningIntegrationHub from '../../pages/anthropic-security-reasoning-integration-hub/index';
import SecurityVulnerabilityRemediationControlCenter from '../../pages/security-vulnerability-remediation-control-center/index';
import SecurityComplianceAutomationCenter from '../../pages/security-compliance-automation-center/index';
import UnifiedBusinessIntelligenceHub from '../../pages/unified-business-intelligence-hub/index';
import EnhancedRealTimeSupabaseIntegrationHub from '../../pages/enhanced-real-time-supabase-integration-hub/index';
import InteractiveTopicPreferenceCollectionHub from '../../pages/interactive-topic-preference-collection-hub/index';
import AccessibilityAnalyticsPreferencesCenter from '../../pages/accessibility-analytics-preferences-center/index';
import EnhancedGoogleAnalyticsIntegrationCenter from '../../pages/enhanced-google-analytics-integration-center/index';
import ClaudeAnalyticsDashboardForCampaignIntelligence from '../../pages/claude-analytics-dashboard-for-campaign-intelligence/index';
import ClaudePredictiveAnalyticsDashboard from '../../pages/claude-predictive-analytics-dashboard/index';
import ClaudeAIContentCurationIntelligenceCenter from '../../pages/claude-ai-content-curation-intelligence-center/index';
import ClaudeModelComparisonCenter from '../../pages/claude-model-comparison-center/index';
import ClaudeContentOptimizationEngine from '../../pages/claude-content-optimization-engine/index';
import GeminiCostEfficiencyAnalyzerCaseReportGenerator from '../../pages/gemini-cost-efficiency-analyzer-case-report-generator/index';
import EnhancedElectionResultsCenter from '../../pages/enhanced-election-results-center/index';
import PrizeDistributionTrackingCenter from '../../pages/prize-distribution-tracking-center/index';
import ComprehensiveGamificationAdminControlCenter from '../../pages/comprehensive-gamification-admin-control-center/index';
import GamificationMultiLanguageIntelligenceCenter from '../../pages/gamification-multi-language-intelligence-center/index';
import DynamicQuestManagementDashboard from '../../pages/dynamic-quest-management-dashboard/index';
import ElectionPredictionPoolsInterface from '../../pages/election-prediction-pools-interface/index';
import UnifiedGamificationDashboard from '../../pages/unified-gamification-dashboard/index';
import GamificationCampaignManagementCenter from '../../pages/gamification-campaign-management-center/index';
import GamificationRewardsManagementCenter from '../../pages/gamification-rewards-management-center/index';
import VPEconomyHealthMonitorDashboard from '../../pages/vp-economy-health-monitor-dashboard/index';
import EnhancedPerformanceMonitoringDashboard from '../../pages/enhanced-performance-monitoring-dashboard/index';
import PredictionAnalyticsDashboard from '../../pages/prediction-analytics-dashboard/index';
import PredictionPoolNotificationsHub from '../../pages/prediction-pool-notifications-hub/index';
import QueryPerformanceMonitoringDashboard from '../../pages/query-performance-monitoring-dashboard/index';
import SupabaseAdvisorVerificationDashboard from '../../pages/supabase-advisor-verification-dashboard/index';
import ContentModerationControlCenter from '../../pages/content-moderation-control-center/index';
import ContentRemovedAppealPage from '../../pages/content-removed-appeal/index';
import PersonalAnalyticsDashboard from '../../pages/personal-analytics-dashboard/index';
import UserAnalyticsDashboard from '../../pages/user-analytics-dashboard/index';
import RealTimeAnalyticsDashboard from '../../pages/real-time-analytics-dashboard/index';
import EnhancedAnalyticsDashboards from '../../pages/enhanced-analytics-dashboards/index';
import ElectionInsightsPredictiveAnalytics from '../../pages/election-insights-predictive-analytics/index';
import AdvancedSearchDiscoveryIntelligenceHub from '../../pages/advanced-search-discovery-intelligence-hub/index';
import ClaudeAIFeedIntelligenceCenter from '../../pages/claude-ai-feed-intelligence-center/index';
import ContextAwareClaudeRecommendationsOverlay from '../../pages/context-aware-claude-recommendations-overlay/index';
import ParticipatoryAdsStudio from '../../pages/participatory-ads-studio/index';
import VotteryAdsStudio from '../../pages/vottery-ads-studio/index';
import CampaignManagementDashboard from '../../pages/campaign-management-dashboard/index';
import DynamicCpePricingEngineDashboard from '../../pages/dynamic-cpe-pricing-engine-dashboard/index';
import AdvertiserAnalyticsROIDashboard from '../../pages/advertiser-analytics-roi-dashboard/index';
import EnhancedRealTimeAdvertiserROIDashboard from '../../pages/enhanced-real-time-advertiser-roi-dashboard/index';
import AutomatedCampaignOptimizationDashboard from '../../pages/automated-campaign-optimization-dashboard/index';
import CampaignTemplateGallery from '../../pages/campaign-template-gallery/index';
import BrandAdvertiserRegistrationPortal from '../../pages/brand-advertiser-registration-portal/index';
import BrandDashboardSpecializedKPIsCenter from '../../pages/brand-dashboard-specialized-kp-is-center/index';
import RealTimeBrandAlertBudgetMonitoringCenter from '../../pages/real-time-brand-alert-budget-monitoring-center/index';
import AutomatedPaymentProcessingHub from '../../pages/automated-payment-processing-hub/index';
import StripePaymentIntegrationHub from '../../pages/stripe-payment-integration-hub/index';
import MultiCurrencySettlementDashboard from '../../pages/multi-currency-settlement-dashboard/index';
import FinancialTrackingZoneAnalyticsCenter from '../../pages/financial-tracking-zone-analytics-center/index';
import ComplianceDashboard from '../../pages/compliance-dashboard/index';
import CountryRestrictionsAdmin from '../../pages/country-restrictions-admin/index';
import PlatformIntegrationsAdmin from '../../pages/platform-integrations-admin/index';
import ComplianceAuditDashboard from '../../pages/compliance-audit-dashboard/index';
import RegulatoryComplianceAutomationHub from '../../pages/regulatory-compliance-automation-hub/index';
import LivePlatformMonitoringDashboard from '../../pages/live-platform-monitoring-dashboard/index';
import AdvancedPlatformMonitoringEventTrackingHub from '../../pages/advanced-platform-monitoring-event-tracking-hub/index';
import PlatformGamificationCoreEngine from '../../pages/platform-gamification-core-engine/index';
import AdSenseRevenueAnalyticsDashboard from '../../pages/ad-sense-revenue-analytics-dashboard/index';
import VotteryAdsAdminConfig from '../../pages/vottery-ads-admin-config/index';
import FraudDetectionAlertManagementCenter from '../../pages/fraud-detection-alert-management-center/index';
import CustomAlertRulesEngine from '../../pages/custom-alert-rules-engine/index';
import AdvancedCustomAlertRulesEngine from '../../pages/advanced-custom-alert-rules-engine/index';
import UnifiedAlertManagementCenter from '../../pages/unified-alert-management-center/index';
import AutomatedIncidentResponsePortal from '../../pages/automated-incident-response-portal/index';
import AISentimentStrategyAnalytics from '../../pages/ai-sentiment-strategy-analytics/index';
import AIContentSafetyScreeningCenter from '../../pages/ai-content-safety-screening-center/index';
import AnthropicContentIntelligenceCenter from '../../pages/anthropic-content-intelligence-center/index';
import AnthropicAdvancedContentAnalysisCenter from '../../pages/anthropic-advanced-content-analysis-center/index';
import ClaudeAIDisputeModerationCenter from '../../pages/claude-ai-dispute-moderation-center/index';
import MLModelTrainingInterface from '../../pages/ml-model-training-interface/index';
import UnifiedAIOrchestrationCommandCenter from '../../pages/unified-ai-orchestration-command-center/index';
import AutonomousMultiChannelCommunicationHub from '../../pages/autonomous-multi-channel-communication-hub/index';
import TelnyxSMSProviderManagementCenter from '../../pages/telnyx-sms-provider-management-center/index';
import SMSWebhookDeliveryAnalyticsHub from '../../pages/sms-webhook-delivery-analytics-hub/index';
import CrossDomainIntelligenceAnalyticsHub from '../../pages/cross-domain-intelligence-analytics-hub/index';
import IntelligentOrchestrationControlCenter from '../../pages/intelligent-orchestration-control-center/index';
import SupabaseRealTimeFeedRankingEngine from '../../pages/supabase-real-time-feed-ranking-engine/index';
import ContentDistributionControlCenter from '../../pages/content-distribution-control-center/index';
import EnhancedResendEmailAutomationHub from '../../pages/enhanced-resend-email-automation-hub/index';
import StakeholderIncidentCommunicationHub from '../../pages/stakeholder-incident-communication-hub/index';
import TeamCollaborationCenter from '../../pages/team-collaboration-center/index';
import UnifiedAdminActivityLog from '../../pages/unified-admin-activity-log/index';
import AdminPlatformLogsCenter from '../../pages/admin-platform-logs-center/index';
import EnterpriseOperationsCenter from '../../pages/enterprise-operations-center/index';
import BulkManagementScreen from '../../pages/bulk-management-screen/index';
import MobileAdminDashboard from '../../pages/mobile-admin-dashboard/index';
import DesignSystemFoundation from '../../pages/design-system-foundation/index';
import ThreeDGamifiedElectionExperienceCenter from '../../pages/3d-gamified-election-experience-center/index';
import EnhancedAdminRevenueAnalyticsHub from '../../pages/enhanced-admin-revenue-analytics-hub/index';
import ComprehensiveSocialEngagementSuite from '../../pages/comprehensive-social-engagement-suite/index';
import AdvancedAdminRoleManagementSystem from '../../pages/advanced-admin-role-management-system/index';
import ElectionComplianceAuditDashboard from '../../pages/election-compliance-audit-dashboard/index';
import CommunityElectionsHub from '../../pages/community-elections-hub/index';
import TopicBasedCommunityElectionsHub from '../../pages/topic-based-community-elections-hub/index';
import OpenAISMSOptimizationStudio from '../../pages/open-ai-sms-optimization-studio/index';
import AIPoweredRevenueForecastingIntelligenceCenter from '../../pages/ai-powered-revenue-forecasting-intelligence-center/index';
import ShapedAISyncDockerAutomationHub from '../../pages/shaped-ai-sync-docker-automation-hub/index';
import SmartPushNotificationsOptimizationCenter from '../../pages/smart-push-notifications-optimization-center/index';
import EnhancedCreatorPayoutDashboard from '../../pages/enhanced-creator-payout-dashboard-with-stripe-connect-integration/index';
import AdminPayoutVerificationDashboard from '../../pages/admin-payout-verification-dashboard/index';
import StripeConnectLinking from '../../pages/stripe-connect-linking/index';
import StripeConnectAccountLinkingInterface from '../../pages/stripe-connect-account-linking-interface/index';
import LocationBasedVoting from '../../pages/location-based-voting/index';
import PlusMinusVotingInterface from '../../pages/plus-minus-voting-interface/index';
import ZoneSpecificThreatHeatmapsDashboard from '../../pages/zone-specific-threat-heatmaps-dashboard/index';
import UnifiedRevenueIntelligenceDashboard from '../../pages/unified-revenue-intelligence-dashboard/index';
import CreatorGrowthAnalyticsDashboard from '../../pages/creator-growth-analytics-dashboard/index';
import CreatorChurnPredictionIntelligenceCenter from '../../pages/creator-churn-prediction-intelligence-center/index';
import CreatorMarketplaceScreenEnhanced from '../../pages/creator-marketplace-screen/index';
import EnhancedMCQCreationStudio from '../../pages/enhanced-mcq-creation-studio/index';
import EnhancedMCQPreVotingInterface from '../../pages/enhanced-mcq-pre-voting-interface/index';
import LiveQuestionInjectionManagementCenter from '../../pages/live-question-injection-management-center/index';
import EnhancedMCQImageInterface from '../../pages/enhanced-mcq-image-interface/index';
import MCQAnalyticsIntelligenceDashboard from '../../pages/mcq-analytics-intelligence-dashboard/index';
import RealTimeMCQSyncMonitorDashboard from '../../pages/real-time-mcq-sync-monitor-dashboard/index';
import MCQAlertAutomationConfigurationCenter from '../../pages/mcq-alert-automation-configuration-center/index';
import MCQABTestingAnalyticsDashboard from '../../pages/mcq-a-b-testing-analytics-dashboard/index';
import RealTimeThreatCorrelationDashboard from '../../pages/real-time-threat-correlation-dashboard/index';
import RealTimeThreatCorrelationIntelligenceHub from '../../pages/real-time-threat-correlation-intelligence-hub/index';
import VoterEducationHub from '../../pages/voter-education-hub/index';
import FeaturePerformanceDashboard from '../../pages/feature-performance-dashboard/index';
import ProductionLoadTestingSuite from '../../pages/production-load-testing-suite/index';
import ComprehensiveHealthMonitoringDashboard from '../../pages/comprehensive-health-monitoring-dashboard/index';
import LoadTestingPerformanceAnalyticsCenter from '../../pages/load-testing-performance-analytics-center/index';
import PerformanceOptimizationEngineDashboard from '../../pages/performance-optimization-engine-dashboard/index';
import RealTimeWebSocketMonitoringCommandCenter from '../../pages/real-time-web-socket-monitoring-command-center/index';
import AutomatedDataCacheManagementHub from '../../pages/automated-data-cache-management-hub/index';
import AdvancedSupabaseRealTimeCoordinationHub from '../../pages/advanced-supabase-real-time-coordination-hub/index';
import EnhancedRealTimeWebSocketCoordinationHub from '../../pages/enhanced-real-time-web-socket-coordination-hub/index';
import ElectionIntegrityMonitoringHub from '../../pages/election-integrity-monitoring-hub/index';
import CreatorMonetizationStudio from '../../pages/creator-monetization-studio/index';
import AgeVerificationDigitalIdentityCenter from '../../pages/age-verification-digital-identity-center/index';
import PresentationBuilderAudienceQAHub from '../../pages/presentation-builder-audience-q-a-hub/index';
import PredictiveCreatorInsightsDashboard from '../../pages/predictive-creator-insights-dashboard/index';
import CreatorRevenueForecastingDashboard from '../../pages/creator-revenue-forecasting-dashboard/index';
import ContentQualityScoringClaude from '../../pages/content-quality-scoring-claude/index';
import PublicStatusPage from '../../pages/status/index';
import MobileOperationsCommandConsole from '../../pages/mobile-operations-command-console/index';
import PredictiveIncidentPrevention24h from '../../pages/predictive-incident-prevention-24h/index';
import EnhancedPremiumSubscriptionCenter from '../../pages/enhanced-premium-subscription-center/index';
import RealTimePerformanceTestingSuite from '../../pages/real-time-performance-testing-suite/index';
import RealTimeRevenueOptimizationEngine from '../../pages/real-time-revenue-optimization-engine/index';
import ClaudeDecisionReasoningHub from '../../pages/claude-decision-reasoning-hub/index';
import MultiRegionFailoverOrchestration from '../../pages/multi-region-failover-orchestration/index';
import PerformanceRegressionDetection from '../../pages/performance-regression-detection/index';
import AdminAutomationControlPanel from '../../pages/admin-automation-control-panel/index';
import AnalyticsExportReportingHub from '../../pages/analytics-export-reporting-hub/index';
import ApiDocumentationPortal from '../../pages/api-documentation-portal/index';
import RestfulApiManagementCenter from '../../pages/res-tful-api-management-center/index';
import WebhookIntegrationHub from '../../pages/webhook-integration-hub/index';
import AdvancedWebhookOrchestrationHub from '../../pages/advanced-webhook-orchestration-hub/index';
import ExecutiveReportingComplianceAutomationHub from '../../pages/executive-reporting-compliance-automation-hub/index';
import AutomatedExecutiveReportingClaudeIntelligenceHub from '../../pages/automated-executive-reporting-claude-intelligence-hub/index';
import APIRateLimitingDashboard from '../../pages/api-rate-limiting-dashboard/index';
import AuthCallback from '../../pages/auth-callback/index';

/**
 * Feature Module Routes.
 * These are non-core, specialized features that can be toggled by the admin panel.
 */
export function getModuleRoutes() {
  return [
    { path: Web.VOTER_ROLLS_MANAGEMENT_ROUTE, element: <VoterRollsManagement /> },
    { path: Web.CREATOR_REPUTATION_ELECTION_MANAGEMENT_SYSTEM_ROUTE, element: <CreatorReputationElectionManagementSystem /> },
    { path: Web.CREATOR_SUCCESS_ACADEMY_ROUTE, element: <CreatorSuccessAcademy /> },
    { path: Web.CLAUDE_CREATOR_SUCCESS_AGENT_ROUTE, element: <ClaudeCreatorSuccessAgent /> },
    { path: Web.DYNAMIC_CPE_PRICING_ENGINE_DASHBOARD_ROUTE, element: <DynamicCpePricingEngineDashboard /> },
    { path: Web.ENHANCED_ELECTION_RESULTS_CENTER_ROUTE, element: <EnhancedElectionResultsCenter /> },
    { path: Web.ENHANCED_AUTOMATED_PAYOUT_CALCULATION_ENGINE_WITH_COUNTRY_BASED_PROCESSING_ROUTE, element: <EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing /> },
    { path: Web.ELECTION_PREDICTION_POOLS_INTERFACE_ROUTE, element: <ElectionPredictionPoolsInterface /> },
    { path: Web.UNIFIED_GAMIFICATION_DASHBOARD_ROUTE, element: <UnifiedGamificationDashboard /> },
    { path: Web.VP_ECONOMY_HEALTH_MONITOR_DASHBOARD_ROUTE, element: <VPEconomyHealthMonitorDashboard /> },
    { path: Web.ENHANCED_PERFORMANCE_MONITORING_DASHBOARD_ROUTE, element: <EnhancedPerformanceMonitoringDashboard /> },
    { path: Web.PREDICTION_ANALYTICS_DASHBOARD_ROUTE, element: <PredictionAnalyticsDashboard /> },
    { path: Web.PREDICTION_POOL_NOTIFICATIONS_HUB_ROUTE, element: <PredictionPoolNotificationsHub /> },
    { path: Web.COMPREHENSIVE_GAMIFICATION_ADMIN_CONTROL_CENTER_ROUTE, element: <ComprehensiveGamificationAdminControlCenter /> },
    { path: Web.ADMIN_QUEST_CONFIGURATION_CONTROL_CENTER_ROUTE, element: <AdminQuestConfigurationControlCenter /> },
    { path: Web.VOTTERY_POINTS_VP_UNIVERSAL_CURRENCY_CENTER_ROUTE, element: <VotteryPointsVPUniversalCurrencyCenter /> },
    { path: Web.VP_REDEMPTION_MARKETPLACE_CHARITY_HUB_ROUTE, element: <VpRedemptionMarketplaceCharityHub /> },
    { path: Web.SPONSORED_ELECTIONS_SCHEMA_CPE_MANAGEMENT_HUB_ROUTE, element: <SponsoredElectionsSchemaCPEManagementHub /> },
    { path: Web.PRIZE_DISTRIBUTION_TRACKING_CENTER_ROUTE, element: <PrizeDistributionTrackingCenter /> },
    { path: Web.QUERY_PERFORMANCE_MONITORING_DASHBOARD_ROUTE, element: <QueryPerformanceMonitoringDashboard /> },
    { path: Web.SUPABASE_ADVISOR_VERIFICATION_DASHBOARD_ROUTE, element: <SupabaseAdvisorVerificationDashboard /> },
    { path: Web.CONTENT_MODERATION_CONTROL_CENTER_ROUTE, element: <ContentModerationControlCenter /> },
    { path: Web.CONTENT_REMOVED_APPEAL_ROUTE, element: <ContentRemovedAppealPage /> },
    { path: Web.PERSONAL_ANALYTICS_DASHBOARD_ROUTE, element: <PersonalAnalyticsDashboard /> },
    { path: Web.USER_ANALYTICS_DASHBOARD_ROUTE, element: <UserAnalyticsDashboard /> },
    { path: Web.REAL_TIME_ANALYTICS_DASHBOARD_ROUTE, element: <RealTimeAnalyticsDashboard /> },
    { path: Web.ENHANCED_ANALYTICS_DASHBOARDS_ROUTE, element: <EnhancedAnalyticsDashboards /> },
    { path: Web.ELECTION_INSIGHTS_PREDICTIVE_ANALYTICS_ROUTE, element: <ElectionInsightsPredictiveAnalytics /> },
    { path: Web.COLLABORATIVE_VOTING_ROOM_ROUTE, element: <CollaborativeVotingRoom /> },
    { path: Web.AI_ANALYTICS_HUB_ROUTE, element: <AIAnalyticsHub /> },
    { path: Web.VOTTERY_ADS_STUDIO_ROUTE, element: <VotteryAdsStudio /> },
    { path: Web.PARTICIPATORY_ADS_STUDIO_ROUTE, element: <ParticipatoryAdsStudio /> },
    { path: Web.CAMPAIGN_MANAGEMENT_DASHBOARD_ROUTE, element: <CampaignManagementDashboard /> },
    { path: Web.ADVERTISER_ANALYTICS_ROI_DASHBOARD_ROUTE, element: <AdvertiserAnalyticsROIDashboard /> },
    { path: Web.ENHANCED_REAL_TIME_ADVERTISER_ROI_DASHBOARD_ROUTE, element: <EnhancedRealTimeAdvertiserROIDashboard /> },
    { path: Web.AUTOMATED_CAMPAIGN_OPTIMIZATION_DASHBOARD_ROUTE, element: <AutomatedCampaignOptimizationDashboard /> },
    { path: Web.CAMPAIGN_TEMPLATE_GALLERY_ROUTE, element: <CampaignTemplateGallery /> },
    { path: Web.BRAND_ADVERTISER_REGISTRATION_PORTAL_ROUTE, element: <BrandAdvertiserRegistrationPortal /> },
    { path: Web.REAL_TIME_BRAND_ALERT_BUDGET_MONITORING_CENTER_ROUTE, element: <RealTimeBrandAlertBudgetMonitoringCenter /> },
    { path: Web.BRAND_DASHBOARD_SPECIALIZED_KPIS_CENTER_ROUTE, element: <BrandDashboardSpecializedKPIsCenter /> },
    { path: Web.AUTOMATED_PAYMENT_PROCESSING_HUB_ROUTE, element: <AutomatedPaymentProcessingHub /> },
    { path: Web.STRIPE_PAYMENT_INTEGRATION_HUB_ROUTE, element: <StripePaymentIntegrationHub /> },
    { path: Web.MULTI_CURRENCY_SETTLEMENT_DASHBOARD_ROUTE, element: <MultiCurrencySettlementDashboard /> },
    { path: Web.FINANCIAL_TRACKING_ZONE_ANALYTICS_CENTER_ROUTE, element: <FinancialTrackingZoneAnalyticsCenter /> },
    { path: Web.COMPLIANCE_DASHBOARD_ROUTE, element: <ComplianceDashboard /> },
    { path: Web.COUNTRY_RESTRICTIONS_ADMIN_ROUTE, element: <CountryRestrictionsAdmin /> },
    { path: Web.PLATFORM_INTEGRATIONS_ADMIN_ROUTE, element: <PlatformIntegrationsAdmin /> },
    { path: Web.COMPLIANCE_AUDIT_DASHBOARD_ROUTE, element: <ComplianceAuditDashboard /> },
    { path: Web.REGULATORY_COMPLIANCE_AUTOMATION_HUB_ROUTE, element: <RegulatoryComplianceAutomationHub /> },
    { path: Web.ADVANCED_MONITORING_HUB_WITH_AUTOMATED_INCIDENT_RESPONSE_ROUTE, element: <AdvancedMonitoringHubWithAutomatedIncidentResponse /> },
    { path: Web.PRODUCTION_MONITORING_DASHBOARD_ROUTE, element: <ProductionMonitoringDashboard /> },
    { path: Web.DATADOG_APM_PERFORMANCE_INTELLIGENCE_CENTER_ROUTE, element: <DatadogAPMPerformanceIntelligenceCenter /> },
    { path: Web.ENHANCED_INCIDENT_RESPONSE_ANALYTICS_ROUTE, element: <EnhancedIncidentResponseAnalytics /> },
    { path: Web.USER_FEEDBACK_PORTAL_WITH_FEATURE_REQUEST_SYSTEM_ROUTE, element: <UserFeedbackPortalWithFeatureRequestSystem /> },
    { path: Web.FEATURE_IMPLEMENTATION_TRACKING_ENGAGEMENT_ANALYTICS_CENTER_ROUTE, element: <FeatureImplementationTrackingEngagementAnalyticsCenter /> },
    { path: Web.LIVE_PLATFORM_MONITORING_DASHBOARD_ROUTE, element: <LivePlatformMonitoringDashboard /> },
    { path: Web.ADVANCED_PLATFORM_MONITORING_EVENT_TRACKING_HUB_ROUTE, element: <AdvancedPlatformMonitoringEventTrackingHub /> },
    { path: Web.PLATFORM_GAMIFICATION_CORE_ENGINE_ROUTE, element: <PlatformGamificationCoreEngine /> },
    { path: Web.GAMIFICATION_CAMPAIGN_MANAGEMENT_CENTER_ROUTE, element: <GamificationCampaignManagementCenter /> },
    { path: Web.GAMIFICATION_REWARDS_MANAGEMENT_CENTER_ROUTE, element: <GamificationRewardsManagementCenter /> },
    { path: Web.SECURITY_COMPLIANCE_AUTOMATION_CENTER_ROUTE, element: <SecurityComplianceAutomationCenter /> },
    { path: Web.AD_SLOT_MANAGER_INVENTORY_CONTROL_CENTER_ROUTE, element: <AdSlotManagerInventoryControlCenter /> },
    { path: Web.AD_NETWORK_STATUS_AND_SPLIT_DASHBOARD_ROUTE, element: <AdNetworkStatusAndSplitDashboard /> },
    { path: Web.DYNAMIC_AD_RENDERING_FILL_RATE_ANALYTICS_HUB_ROUTE, element: <DynamicAdRenderingFillRateAnalyticsHub /> },
    { path: Web.GAMIFICATION_PROGRESSION_ACHIEVEMENT_HUB_ROUTE, element: <GamificationProgressionAchievementHub /> },
    { path: Web.PREMIUM_3D_SLOT_MACHINE_INTEGRATION_HUB_ROUTE, element: <Premium3DSlotMachineIntegrationHub /> },
    { path: Web.AD_SENSE_REVENUE_ANALYTICS_DASHBOARD_ROUTE, element: <AdSenseRevenueAnalyticsDashboard /> },
    { path: Web.VOTTERY_ADS_ADMIN_CONFIG_ROUTE, element: <VotteryAdsAdminConfig /> },
    { path: Web.FRAUD_DETECTION_ALERT_MANAGEMENT_CENTER_ROUTE, element: <FraudDetectionAlertManagementCenter /> },
    { path: Web.CUSTOM_ALERT_RULES_ENGINE_ROUTE, element: <CustomAlertRulesEngine /> },
    { path: Web.ADVANCED_CUSTOM_ALERT_RULES_ENGINE_ROUTE, element: <AdvancedCustomAlertRulesEngine /> },
    { path: Web.UNIFIED_ALERT_MANAGEMENT_CENTER_ROUTE, element: <UnifiedAlertManagementCenter /> },
    { path: Web.AUTOMATED_INCIDENT_RESPONSE_PORTAL_ROUTE, element: <AutomatedIncidentResponsePortal /> },
    { path: Web.UNIFIED_INCIDENT_RESPONSE_ORCHESTRATION_CENTER_ROUTE, element: <UnifiedIncidentResponseOrchestrationCenter /> },
    { path: Web.UNIFIED_INCIDENT_RESPONSE_COMMAND_CENTER_ROUTE, element: <UnifiedIncidentResponseCommandCenter /> },
    { path: Web.ADVANCED_PERPLEXITY_FRAUD_INTELLIGENCE_CENTER_ROUTE, element: <AdvancedPerplexityFraudIntelligenceCenter /> },
    { path: Web.ADVANCED_PERPLEXITY_FRAUD_FORECASTING_CENTER_ROUTE, element: <AdvancedPerplexityFraudForecastingCenter /> },
    { path: Web.ENHANCED_PREDICTIVE_THREAT_INTELLIGENCE_CENTER_ROUTE, element: <EnhancedPredictiveThreatIntelligenceCenter /> },
    { path: Web.AUTO_IMPROVING_FRAUD_DETECTION_INTELLIGENCE_CENTER_ROUTE, element: <AutoImprovingFraudDetectionIntelligenceCenter /> },
    { path: Web.AI_SENTIMENT_STRATEGY_ANALYTICS_ROUTE, element: <AISentimentStrategyAnalytics /> },
    { path: Web.AI_CONTENT_SAFETY_SCREENING_CENTER_ROUTE, element: <AIContentSafetyScreeningCenter /> },
    { path: Web.CLAUDE_AI_DISPUTE_MODERATION_CENTER_ROUTE, element: <ClaudeAIDisputeModerationCenter /> },
    { path: Web.ML_MODEL_TRAINING_INTERFACE_ROUTE, element: <MLModelTrainingInterface /> },
    { path: Web.UNIFIED_AI_ORCHESTRATION_COMMAND_CENTER_ROUTE, element: <UnifiedAIOrchestrationCommandCenter /> },
    { path: Web.UNIFIED_AI_DECISION_ORCHESTRATION_COMMAND_CENTER_ROUTE, element: <UnifiedAIDecisionOrchestrationCommandCenter /> },
    { path: Web.AI_POWERED_REVENUE_FORECASTING_INTELLIGENCE_CENTER_ROUTE, element: <AIPoweredRevenueForecastingIntelligenceCenter /> },
    { path: Web.SHAPED_AI_SYNC_DOCKER_AUTOMATION_HUB_ROUTE, element: <ShapedAISyncDockerAutomationHub /> },
    { path: Web.ANTHROPIC_CONTENT_INTELLIGENCE_CENTER_ROUTE, element: <AnthropicContentIntelligenceCenter /> },
    { path: Web.ANTHROPIC_ADVANCED_CONTENT_ANALYSIS_CENTER_ROUTE, element: <AnthropicAdvancedContentAnalysisCenter /> },
    { path: Web.CLAUDE_ANALYTICS_DASHBOARD_FOR_CAMPAIGN_INTELLIGENCE_ROUTE, element: <ClaudeAnalyticsDashboardForCampaignIntelligence /> },
    { path: Web.CLAUDE_PREDICTIVE_ANALYTICS_DASHBOARD_ROUTE, element: <ClaudePredictiveAnalyticsDashboard /> },
    { path: Web.CLAUDE_AI_FEED_INTELLIGENCE_CENTER_ROUTE, element: <ClaudeAIFeedIntelligenceCenter /> },
    { path: Web.CLAUDE_AI_CONTENT_CURATION_INTELLIGENCE_CENTER_ROUTE, element: <ClaudeAIContentCurationIntelligenceCenter /> },
    { path: Web.CLAUDE_MODEL_COMPARISON_CENTER_ROUTE, element: <ClaudeModelComparisonCenter /> },
    { path: Web.CLAUDE_CONTENT_OPTIMIZATION_ENGINE_ROUTE, element: <ClaudeContentOptimizationEngine /> },
    { path: Web.ADVANCED_PERPLEXITY_60_90_DAY_THREAT_FORECASTING_CENTER_ROUTE, element: <AdvancedPerplexity6090DayThreatForecastingCenter /> },
    { path: Web.AUTOMATIC_AI_FAILOVER_ENGINE_CONTROL_CENTER_ROUTE, element: <AutomaticAIFailoverEngineControlCenter /> },
    { path: Web.AI_PERFORMANCE_ORCHESTRATION_DASHBOARD_ROUTE, element: <AIPerformanceOrchestrationDashboard /> },
    { path: Web.ADVANCED_AI_FRAUD_PREVENTION_COMMAND_CENTER_ROUTE, element: <AdvancedAIFraudPreventionCommandCenter /> },
    { path: Web.AUTOMATED_SECURITY_TESTING_FRAMEWORK_ROUTE, element: <AutomatedSecurityTestingFramework /> },
    { path: Web.ANTHROPIC_SECURITY_REASONING_INTEGRATION_HUB_ROUTE, element: <AnthropicSecurityReasoningIntegrationHub /> },
    { path: Web.SECURITY_VULNERABILITY_REMEDIATION_CONTROL_CENTER_ROUTE, element: <SecurityVulnerabilityRemediationControlCenter /> },
    { path: Web.CONTEXT_AWARE_CLAUDE_RECOMMENDATIONS_OVERLAY_ROUTE, element: <ContextAwareClaudeRecommendationsOverlay /> },
    { path: Web.GEMINI_COST_EFFICIENCY_ANALYZER_CASE_REPORT_GENERATOR_ROUTE, element: <GeminiCostEfficiencyAnalyzerCaseReportGenerator /> },
    { path: Web.AUTONOMOUS_MULTI_CHANNEL_COMMUNICATION_HUB_ROUTE, element: <AutonomousMultiChannelCommunicationHub /> },
    { path: Web.TELNYX_SMS_PROVIDER_MANAGEMENT_CENTER_ROUTE, element: <TelnyxSMSProviderManagementCenter /> },
    { path: Web.SMS_WEBHOOK_DELIVERY_ANALYTICS_HUB_ROUTE, element: <SMSWebhookDeliveryAnalyticsHub /> },
    { path: Web.CROSS_DOMAIN_INTELLIGENCE_ANALYTICS_HUB_ROUTE, element: <CrossDomainIntelligenceAnalyticsHub /> },
    { path: Web.INTELLIGENT_ORCHESTRATION_CONTROL_CENTER_ROUTE, element: <IntelligentOrchestrationControlCenter /> },
    { path: Web.ENHANCED_REAL_TIME_SUPABASE_INTEGRATION_HUB_ROUTE, element: <EnhancedRealTimeSupabaseIntegrationHub /> },
    { path: Web.SUPABASE_REAL_TIME_FEED_RANKING_ENGINE_ROUTE, element: <SupabaseRealTimeFeedRankingEngine /> },
    { path: Web.CONTENT_DISTRIBUTION_CONTROL_CENTER_ROUTE, element: <ContentDistributionControlCenter /> },
    { path: Web.ADVANCED_SEARCH_DISCOVERY_INTELLIGENCE_HUB_ROUTE, element: <AdvancedSearchDiscoveryIntelligenceHub /> },
    { path: Web.INTERACTIVE_TOPIC_PREFERENCE_COLLECTION_HUB_ROUTE, element: <InteractiveTopicPreferenceCollectionHub /> },
    { path: Web.ACCESSIBILITY_ANALYTICS_PREFERENCES_CENTER_ROUTE, element: <AccessibilityAnalyticsPreferencesCenter /> },
    { path: Web.ENHANCED_RESEND_EMAIL_AUTOMATION_HUB_ROUTE, element: <EnhancedResendEmailAutomationHub /> },
    { path: Web.STAKEHOLDER_INCIDENT_COMMUNICATION_HUB_ROUTE, element: <StakeholderIncidentCommunicationHub /> },
    { path: Web.TEAM_COLLABORATION_CENTER_ROUTE, element: <TeamCollaborationCenter /> },
    { path: Web.UNIFIED_ADMIN_ACTIVITY_LOG_ROUTE, element: <UnifiedAdminActivityLog /> },
    { path: Web.BULK_MANAGEMENT_SCREEN_ROUTE, element: <BulkManagementScreen /> },
    { path: Web.MOBILE_ADMIN_DASHBOARD_ROUTE, element: <MobileAdminDashboard /> },
    { path: Web.DESIGN_SYSTEM_FOUNDATION_ROUTE, element: <DesignSystemFoundation /> },
    { path: Web.THREE_D_GAMIFIED_ELECTION_EXPERIENCE_CENTER_ROUTE, element: <ThreeDGamifiedElectionExperienceCenter /> },
    { path: Web.ENHANCED_ADMIN_REVENUE_ANALYTICS_HUB_ROUTE, element: <EnhancedAdminRevenueAnalyticsHub /> },
    { path: Web.UNIFIED_BUSINESS_INTELLIGENCE_HUB_ROUTE, element: <UnifiedBusinessIntelligenceHub /> },
    { path: Web.COMPREHENSIVE_SOCIAL_ENGAGEMENT_SUITE_ROUTE, element: <ComprehensiveSocialEngagementSuite /> },
    { path: Web.ADVANCED_ADMIN_ROLE_MANAGEMENT_SYSTEM_ROUTE, element: <AdvancedAdminRoleManagementSystem /> },
    { path: Web.ELECTION_COMPLIANCE_AUDIT_DASHBOARD_ROUTE, element: <ElectionComplianceAuditDashboard /> },
    { path: Web.PUBLIC_BULLETIN_BOARD_AUDIT_TRAIL_CENTER_ROUTE, element: <PublicBulletinBoardAuditTrailCenter /> },
    { path: Web.COMMUNITY_ELECTIONS_HUB_ROUTE, element: <CommunityElectionsHub /> },
    { path: Web.TOPIC_BASED_COMMUNITY_ELECTIONS_HUB_ROUTE, element: <TopicBasedCommunityElectionsHub /> },
    { path: Web.ENHANCED_GOOGLE_ANALYTICS_INTEGRATION_CENTER_ROUTE, element: <EnhancedGoogleAnalyticsIntegrationCenter /> },
    { path: Web.API_RATE_LIMITING_DASHBOARD_ROUTE, element: <APIRateLimitingDashboard /> },
    { path: Web.INTERNATIONAL_PAYMENT_DISPUTE_RESOLUTION_CENTER_ROUTE, element: <InternationalPaymentDisputeResolutionCenter /> },
    { path: Web.CREATOR_BRAND_PARTNERSHIP_PORTAL_ROUTE, element: <CreatorBrandPartnershipPortal /> },
    { path: Web.ENHANCED_CREATOR_PAYOUT_DASHBOARD_WITH_STRIPE_CONNECT_INTEGRATION_ROUTE, element: <EnhancedCreatorPayoutDashboard /> },
    { path: Web.ADMIN_PAYOUT_VERIFICATION_DASHBOARD_ROUTE, element: <AdminPayoutVerificationDashboard /> },
    { path: Web.STRIPE_CONNECT_LINKING_ROUTE, element: <StripeConnectLinking /> },
    { path: Web.PLUS_MINUS_VOTING_INTERFACE_ROUTE, element: <PlusMinusVotingInterface /> },
    { path: Web.ZONE_SPECIFIC_THREAT_HEATMAPS_DASHBOARD_ROUTE, element: <ZoneSpecificThreatHeatmapsDashboard /> },
    { path: Web.CREATOR_GROWTH_ANALYTICS_DASHBOARD_ROUTE, element: <CreatorGrowthAnalyticsDashboard /> },
    { path: Web.CREATOR_CHURN_PREDICTION_INTELLIGENCE_CENTER_ROUTE, element: <CreatorChurnPredictionIntelligenceCenter /> },
    { path: Web.CREATOR_MARKETPLACE_SCREEN_ROUTE, element: <CreatorMarketplaceScreenEnhanced /> },
    { path: Web.UNIFIED_REVENUE_INTELLIGENCE_DASHBOARD_ROUTE, element: <UnifiedRevenueIntelligenceDashboard /> },
    { path: Web.ENHANCED_MCQ_CREATION_STUDIO_ROUTE, element: <EnhancedMCQCreationStudio /> },
    { path: Web.ENHANCED_MCQ_PRE_VOTING_INTERFACE_ROUTE, element: <EnhancedMCQPreVotingInterface /> },
    { path: Web.LIVE_QUESTION_INJECTION_MANAGEMENT_CENTER_ROUTE, element: <LiveQuestionInjectionManagementCenter /> },
    { path: Web.ENHANCED_MCQ_IMAGE_INTERFACE_ROUTE, element: <EnhancedMCQImageInterface /> },
    { path: Web.MCQ_ANALYTICS_INTELLIGENCE_DASHBOARD_ROUTE, element: <MCQAnalyticsIntelligenceDashboard /> },
    { path: Web.REAL_TIME_MCQ_SYNC_MONITOR_DASHBOARD_ROUTE, element: <RealTimeMCQSyncMonitorDashboard /> },
    { path: Web.MCQ_ALERT_AUTOMATION_CONFIGURATION_CENTER_ROUTE, element: <MCQAlertAutomationConfigurationCenter /> },
    { path: Web.MCQ_A_B_TESTING_ANALYTICS_DASHBOARD_ROUTE, element: <MCQABTestingAnalyticsDashboard /> },
    { path: Web.REAL_TIME_THREAT_CORRELATION_DASHBOARD_ROUTE, element: <RealTimeThreatCorrelationDashboard /> },
    { path: Web.REAL_TIME_THREAT_CORRELATION_INTELLIGENCE_HUB_ROUTE, element: <RealTimeThreatCorrelationIntelligenceHub /> },
    { path: Web.VOTER_EDUCATION_HUB_ROUTE, element: <VoterEducationHub /> },
    { path: Web.FEATURE_PERFORMANCE_DASHBOARD_ROUTE, element: <FeaturePerformanceDashboard /> },
    { path: Web.PRODUCTION_LOAD_TESTING_SUITE_ROUTE, element: <ProductionLoadTestingSuite /> },
    { path: Web.COMPREHENSIVE_HEALTH_MONITORING_DASHBOARD_ROUTE, element: <ComprehensiveHealthMonitoringDashboard /> },
    { path: Web.LOAD_TESTING_PERFORMANCE_ANALYTICS_CENTER_ROUTE, element: <LoadTestingPerformanceAnalyticsCenter /> },
    { path: Web.PERFORMANCE_OPTIMIZATION_ENGINE_DASHBOARD_ROUTE, element: <PerformanceOptimizationEngineDashboard /> },
    { path: Web.REAL_TIME_WEB_SOCKET_MONITORING_COMMAND_CENTER_ROUTE, element: <RealTimeWebSocketMonitoringCommandCenter /> },
    { path: Web.AUTOMATED_DATA_CACHE_MANAGEMENT_HUB_ROUTE, element: <AutomatedDataCacheManagementHub /> },
    { path: Web.ADVANCED_SUPABASE_REAL_TIME_COORDINATION_HUB_ROUTE, element: <AdvancedSupabaseRealTimeCoordinationHub /> },
    { path: Web.ENHANCED_REAL_TIME_WEB_SOCKET_COORDINATION_HUB_ROUTE, element: <EnhancedRealTimeWebSocketCoordinationHub /> },
    { path: Web.ELECTION_INTEGRITY_MONITORING_HUB_ROUTE, element: <ElectionIntegrityMonitoringHub /> },
    { path: Web.CREATOR_MONETIZATION_STUDIO_ROUTE, element: <CreatorMonetizationStudio /> },
    { path: Web.AGE_VERIFICATION_DIGITAL_IDENTITY_CENTER_ROUTE, element: <AgeVerificationDigitalIdentityCenter /> },
    { path: Web.PRESENTATION_BUILDER_AUDIENCE_Q_A_HUB_ROUTE, element: <PresentationBuilderAudienceQAHub /> },
    { path: Web.PREDICTIVE_CREATOR_INSIGHTS_DASHBOARD_ROUTE, element: <PredictiveCreatorInsightsDashboard /> },
    { path: Web.CREATOR_REVENUE_FORECASTING_DASHBOARD_ROUTE, element: <CreatorRevenueForecastingDashboard /> },
    { path: Web.CONTENT_QUALITY_SCORING_CLAUDE_ROUTE, element: <ContentQualityScoringClaude /> },
    { path: Web.ENHANCED_HOME_FEED_DASHBOARD_ROUTE, element: <EnhancedHomeFeedDashboard /> },
    { path: Web.APP_PERFORMANCE_DASHBOARD_ROUTE, element: <AppPerformanceDashboard /> },
    { path: Web.REAL_TIME_REVENUE_OPTIMIZATION_ENGINE_ROUTE, element: <RealTimeRevenueOptimizationEngine /> },
    { path: Web.CLAUDE_DECISION_REASONING_HUB_ROUTE, element: <ClaudeDecisionReasoningHub /> },
    { path: Web.MULTI_REGION_FAILOVER_ORCHESTRATION_ROUTE, element: <MultiRegionFailoverOrchestration /> },
    { path: Web.PERFORMANCE_REGRESSION_DETECTION_ROUTE, element: <PerformanceRegressionDetection /> },
    { path: Web.ADMIN_AUTOMATION_CONTROL_PANEL_ROUTE, element: <AdminAutomationControlPanel /> },
    { path: Web.ANALYTICS_EXPORT_REPORTING_HUB_ROUTE, element: <AnalyticsExportReportingHub /> },
    { path: Web.RES_TFUL_API_MANAGEMENT_CENTER_ROUTE, element: <RestfulApiManagementCenter /> },
    { path: Web.WEBHOOK_INTEGRATION_HUB_ROUTE, element: <WebhookIntegrationHub /> },
    { path: Web.ADVANCED_WEBHOOK_ORCHESTRATION_HUB_ROUTE, element: <AdvancedWebhookOrchestrationHub /> },
    { path: Web.EXECUTIVE_REPORTING_COMPLIANCE_AUTOMATION_HUB_ROUTE, element: <ExecutiveReportingComplianceAutomationHub /> },
    { path: Web.AUTOMATED_EXECUTIVE_REPORTING_CLAUDE_INTELLIGENCE_HUB_ROUTE, element: <AutomatedExecutiveReportingClaudeIntelligenceHub /> },
    { path: Web.MOBILE_OPERATIONS_COMMAND_CONSOLE_ROUTE, element: <MobileOperationsCommandConsole /> },
    { path: Web.PREDICTIVE_INCIDENT_PREVENTION_24H_ROUTE, element: <PredictiveIncidentPrevention24h /> },
    { path: Web.ENHANCED_PREMIUM_SUBSCRIPTION_CENTER_ROUTE, element: <EnhancedPremiumSubscriptionCenter /> },
    { path: Web.REAL_TIME_PERFORMANCE_TESTING_SUITE_ROUTE, element: <RealTimePerformanceTestingSuite /> },

    // Lazy loaded module routes
    { path: Web.CRYPTOGRAPHIC_SECURITY_MANAGEMENT_CENTER_ROUTE, element: <CryptographicSecurityManagementCenter /> },
    { path: Web.VOTE_ANONYMITY_MIXNET_CONTROL_HUB_ROUTE, element: <VoteAnonymityMixnetControlHub /> },

    { path: Web.REVENUE_SPLIT_ANALYTICS_IMPACT_DASHBOARD_ROUTE, element: <RevenueSplitAnalyticsImpactDashboard /> },
    { path: Web.DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE, element: <DynamicRevenueSharingConfigurationCenter /> },
    { path: Web.ENHANCED_DYNAMIC_REVENUE_SHARING_CONFIGURATION_CENTER_ROUTE, element: <EnhancedDynamicRevenueSharingConfigurationCenter /> },
    { path: Web.REGIONAL_REVENUE_ANALYTICS_DASHBOARD_ROUTE, element: <RegionalRevenueAnalyticsDashboard /> },
    { path: Web.REVENUE_FRAUD_DETECTION_ANOMALY_PREVENTION_CENTER_ROUTE, element: <RevenueFraudDetectionAnomalyPreventionCenter /> },
    { path: Web.LOCALIZATION_TAX_REPORTING_INTELLIGENCE_CENTER_ROUTE, element: <LocalizationTaxReportingIntelligenceCenter /> },
    { path: Web.REVENUE_SPLIT_TESTING_SANDBOX_ENVIRONMENT_ROUTE, element: <RevenueSplitTestingSandboxEnvironment /> },
    { path: Web.THREE_D_FEED_PERFORMANCE_ANALYTICS_DASHBOARD_ROUTE, element: <ThreeDFeedPerformanceAnalyticsDashboard /> },
    { path: Web.LIVE_STREAMING_REAL_TIME_BROADCAST_CENTER_ROUTE, element: <LiveStreamingRealTimeBroadcastCenter /> },
    { path: Web.GOOGLE_ANALYTICS_SECURITY_EVENTS_INTEGRATION_HUB_ROUTE, element: <GoogleAnalyticsSecurityEventsIntegrationHub /> },
    { path: Web.PREMIUM_2D_CAROUSEL_COMPONENT_LIBRARY_HUB_ROUTE, element: <Premium2DCarouselComponentLibraryHub /> },
    { path: Web.CAROUSEL_PERFORMANCE_ANALYTICS_HUB_ROUTE, element: <CarouselPerformanceAnalyticsHub /> },
    { path: Web.CAROUSEL_AB_TESTING_DASHBOARD_ROUTE, element: <CarouselABTestingDashboard /> },
    { path: Web.ADVANCED_CAROUSEL_ROI_ANALYTICS_DASHBOARD_ROUTE, element: <AdvancedCarouselROIAnalyticsDashboard /> },
    { path: Web.CAROUSEL_FEED_ORCHESTRATION_ENGINE_ROUTE, element: <CarouselFeedOrchestrationEngine /> },
    { path: Web.CREATOR_CAROUSEL_OPTIMIZATION_STUDIO_ROUTE, element: <CreatorCarouselOptimizationStudio /> },
    { path: Web.ADVANCED_CAROUSEL_FRAUD_DETECTION_PREVENTION_CENTER_ROUTE, element: <AdvancedCarouselFraudDetectionPreventionCenter /> },
    { path: Web.REAL_TIME_CAROUSEL_MONITORING_HUB_ROUTE, element: <RealTimeCarouselMonitoringHub /> },
    { path: Web.CAROUSEL_HEALTH_SCALING_DASHBOARD_ROUTE, element: <CarouselHealthScalingDashboard /> },
    { path: Web.AI_GUIDED_INTERACTIVE_TUTORIAL_SYSTEM_ROUTE, element: <AIGuidedInteractiveTutorialSystem /> },
    { path: Web.CREATOR_COMMUNITY_HUB_ROUTE, element: <CreatorCommunityHub /> },
    { path: Web.MOMENTS_CREATION_STUDIO_ROUTE, element: <MomentsCreationStudio /> },
    { path: Web.REAL_TIME_NOTIFICATIONS_HUB_WITH_PUSH_INTEGRATION_ROUTE, element: <RealTimeNotificationsHubWithPushIntegration /> },
    { path: Web.GUIDED_ONBOARDING_TOURS_INTERACTIVE_TUTORIAL_SYSTEM_ROUTE, element: <GuidedOnboardingToursInteractiveTutorialSystem /> },
    { path: Web.CROSS_DOMAIN_DATA_SYNC_HUB_ROUTE, element: <CrossDomainDataSyncHub /> },
    { path: Web.COMPREHENSIVE_FEATURE_ANALYTICS_DASHBOARD_ROUTE, element: <ComprehensiveFeatureAnalyticsDashboard /> },
    { path: Web.PRODUCTION_DEPLOYMENT_HUB_ROUTE, element: <ProductionDeploymentHub /> },
    { path: Web.SECURITY_COMPLIANCE_AUDIT_SCREEN_ROUTE, element: <SecurityComplianceAuditScreen /> },
    { path: Web.UNIFIED_PAYMENT_ORCHESTRATION_HUB_ROUTE, element: <UnifiedPaymentOrchestrationHub /> },
    { path: Web.COST_ANALYTICS_ROI_DASHBOARD_ROUTE, element: <CostAnalyticsROIDashboard /> },
    { path: Web.STRIPE_SUBSCRIPTION_MANAGEMENT_CENTER_ROUTE, element: <StripeSubscriptionManagementCenter /> },
    { path: Web.USER_SUBSCRIPTION_DASHBOARD_ROUTE, element: <UserSubscriptionDashboard /> },
    { path: Web.ANTHROPIC_CLAUDE_REVENUE_RISK_INTELLIGENCE_CENTER_ROUTE, element: <AnthropicClaudeRevenueRiskIntelligenceCenter /> },
    { path: Web.STRIPE_LOTTERY_PAYMENT_INTEGRATION_CENTER_ROUTE, element: <StripeGamifiedPaymentIntegrationCenter /> },

    // New Admin Dashboard Module Routes
    { path: Web.ADMIN_AI_CONTENT_MODERATION_ROUTE, element: <AdminAiContentModeration /> },
    { path: Web.ADMIN_FRAUD_DETECTION_CENTER_ROUTE, element: <AdminFraudDetectionCenter /> },
    { path: Web.ADMIN_NOTIFICATION_INTELLIGENCE_ROUTE, element: <AdminNotificationIntelligence /> },
    { path: Web.ADMIN_REVENUE_INTELLIGENCE_ROUTE, element: <AdminRevenueIntelligence /> },
    { path: Web.ADMIN_SOCIAL_ACTIVITY_ANALYTICS_ROUTE, element: <AdminSocialActivityAnalytics /> },
    { path: Web.ADMIN_SOCIAL_ENGAGEMENT_ANALYTICS_ROUTE, element: <AdminSocialEngagementAnalytics /> },
    { path: Web.ADMIN_SOCIAL_TIMELINE_ANALYTICS_ROUTE, element: <AdminSocialTimelineAnalytics /> },
    { path: Web.ADMIN_ACCESSIBILITY_ANALYTICS_ROUTE, element: <AdminAccessibilityAnalytics /> },
    { path: Web.ADMIN_ELECTION_MODERATION_HUB_ROUTE, element: <AdminElectionModerationHub /> },
    { path: Web.ADMIN_HEALTH_CHECK_ROUTE, element: <AdminHealthCheck /> },
    { path: Web.ALGORITHM_COMMAND_CENTER_ROUTE, element: <AlgorithmCommandCenter /> },

    { path: Web.ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE, element: <EnhancedHubsDiscoveryManagementHub /> },
    { path: Web.CREATOR_MONETIZATION_STUDIO_ROUTE, element: <CreatorMonetizationStudio /> },

    // Redirects and Special Cases
    { path: Web.FRIEND_REQUESTS_LEGACY_ROUTE, element: <Navigate to={Web.FRIENDS_MANAGEMENT_HUB_ROUTE} replace /> },
    { path: Web.HUBS_SHORTCUT_ROUTE, element: <Navigate to={Web.ENHANCED_HUBS_DISCOVERY_MANAGEMENT_HUB_ROUTE} replace /> },
    { path: Web.BRAND_DASHBOARD_SPECIALIZED_KP_IS_CENTER_ALIAS_ROUTE, element: <Navigate to={Web.BRAND_DASHBOARD_SPECIALIZED_KPIS_CENTER_ROUTE} replace /> },
    { path: Web.ENHANCED_MULTI_CURRENCY_SETTLEMENT_DASHBOARD_ROUTE, element: <Navigate to={Web.MULTI_CURRENCY_SETTLEMENT_DASHBOARD_ROUTE} replace /> },
    { path: Web.USER_FEEDBACK_PORTAL_REDIRECT_ROUTE, element: <Navigate to={Web.USER_FEEDBACK_PORTAL_WITH_FEATURE_REQUEST_SYSTEM_ROUTE} replace /> },
    { path: Web.SECURITY_MONITORING_DASHBOARD_ROUTE, element: <Navigate to={Web.LIVE_PLATFORM_MONITORING_DASHBOARD_ROUTE} replace /> },
    { path: Web.PERPLEXITY_MARKET_RESEARCH_INTELLIGENCE_CENTER_ROUTE, element: <Navigate to={Web.ADVANCED_PERPLEXITY_FRAUD_INTELLIGENCE_CENTER_ROUTE} replace /> },
    { path: Web.FRAUD_PREVENTION_DASHBOARD_WITH_PERPLEXITY_THREAT_ANALYSIS_ROUTE, element: <Navigate to={Web.ADVANCED_PERPLEXITY_FRAUD_INTELLIGENCE_CENTER_ROUTE} replace /> },
    { path: Web.PLATFORM_TESTING_OPTIMIZATION_COMMAND_CENTER_ROUTE, element: <Navigate to={Web.FEATURE_PERFORMANCE_DASHBOARD_ROUTE} replace /> },
    { path: Web.REAL_TIME_WINNER_NOTIFICATION_PRIZE_VERIFICATION_CENTER_ROUTE, element: <Navigate to={Web.PRIZE_DISTRIBUTION_TRACKING_CENTER_ROUTE} replace /> },
    { path: Web.PROGRESSIVE_WEB_APP_MOBILE_OPTIMIZATION_HUB_ROUTE, element: <Navigate to={Web.MOBILE_ADMIN_DASHBOARD_ROUTE} replace /> },
    { path: Web.ERROR_RECOVERY_DASHBOARD_ROUTE, element: <Navigate to={Web.AUTOMATED_INCIDENT_RESPONSE_PORTAL_ROUTE} replace /> },
    { path: Web.CREATOR_EARNINGS_COMMAND_CENTER_ROUTE, element: <Navigate to={Web.ENHANCED_CREATOR_PAYOUT_DASHBOARD_WITH_STRIPE_CONNECT_INTEGRATION_ROUTE} replace /> },
    { path: Web.PERPLEXITY_STRATEGIC_PLANNING_CENTER_ROUTE, element: <Navigate to={Web.ADVANCED_PERPLEXITY_FRAUD_FORECASTING_CENTER_ROUTE} replace /> },
    { path: Web.PERPLEXITY_CAROUSEL_INTELLIGENCE_DASHBOARD_ROUTE, element: <Navigate to={Web.ADVANCED_PERPLEXITY_FRAUD_INTELLIGENCE_CENTER_ROUTE} replace /> },
    { path: Web.RESEND_EMAIL_AUTOMATION_ORCHESTRATION_CENTER_ROUTE, element: <Navigate to={Web.ENHANCED_RESEND_EMAIL_AUTOMATION_HUB_ROUTE} replace /> },
    { path: Web.AUTONOMOUS_CLAUDE_AGENT_ORCHESTRATION_HUB_ROUTE, element: <UnifiedAIOrchestrationCommandCenter /> },
    { path: Web.GLOBAL_LANGUAGE_SETTINGS_HUB_ROUTE, element: <Navigate to={Web.GLOBAL_LOCALIZATION_CONTROL_CENTER_ROUTE} replace /> },
    { path: Web.LIVEQUESTIONINJECTIONCONTROLCENTER_ROUTE, element: <Navigate to={Web.LIVE_QUESTION_INJECTION_MANAGEMENT_CENTER_ROUTE} replace /> },
  ];
}
