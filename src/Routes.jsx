import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { Breadcrumbs } from "./components/Breadcrumbs";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingRedirect from "./components/OnboardingRedirect";
import { FeatureGateByPath } from "./components/FeatureGate";
import { navigationService } from "./services/navigationService";
import CollaborativeVotingRoom from "./pages/collaborative-voting-room/index";
import AIAnalyticsHub from "./pages/ai-analytics-hub/index";
import AdvancedMonitoringHubWithAutomatedIncidentResponse from "./pages/advanced-monitoring-hub-with-automated-incident-response/index";
import ProductionMonitoringDashboard from "./pages/production-monitoring-dashboard/index";
import DatadogAPMPerformanceIntelligenceCenter from "./pages/datadog-apm-performance-intelligence-center/index";
import EnhancedIncidentResponseAnalytics from "./pages/enhanced-incident-response-analytics/index";
import UserFeedbackPortalWithFeatureRequestSystem from "./pages/user-feedback-portal-with-feature-request-system/index";
import FeatureImplementationTrackingEngagementAnalyticsCenter from "./pages/feature-implementation-tracking-engagement-analytics-center/index";
import AdSlotManagerInventoryControlCenter from "./pages/ad-slot-manager-inventory-control-center/index";
import AdNetworkStatusAndSplitDashboard from "./pages/ad-network-status-and-split-dashboard/index";
import DynamicAdRenderingFillRateAnalyticsHub from "./pages/dynamic-ad-rendering-fill-rate-analytics-hub/index";
import GamificationProgressionAchievementHub from "./pages/gamification-progression-achievement-hub/index";

import EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing from "./pages/enhanced-automated-payout-calculation-engine-with-country-based-processing";
import CreatorCountryVerificationInterface from "./pages/creator-country-verification-interface";
import RegionalRevenueAnalyticsDashboard from "./pages/regional-revenue-analytics-dashboard";

import RevenueFraudDetectionAnomalyPreventionCenter from "./pages/revenue-fraud-detection-anomaly-prevention-center/index";
import PredictiveAnomalyAlertingDeviationMonitoringHub from "./pages/predictive-anomaly-alerting-deviation-monitoring-hub/index";

import DualAdvertisingSystemAnalyticsDashboard from "./pages/dual-advertising-system-analytics-dashboard/index";

import AIDependencyRiskMitigationCommandCenter from "./pages/ai-dependency-risk-mitigation-command-center/index";
import GeminiFallbackOrchestrationHub from "./pages/gemini-fallback-orchestration-hub/index";
import EnhancedDynamicRevenueSharingConfigurationCenter from "./pages/enhanced-dynamic-revenue-sharing-configuration-center/index";
import CountryRevenueShareManagementCenter from "./pages/country-revenue-share-management-center/index";

import LocalizationTaxReportingIntelligenceCenter from "./pages/localization-tax-reporting-intelligence-center/index";

import ClaudeCreatorSuccessAgent from "./pages/claude-creator-success-agent/index";

import InternationalPaymentDisputeResolutionCenter from "./pages/international-payment-dispute-resolution-center/index";
import CreatorBrandPartnershipPortal from "./pages/creator-brand-partnership-portal/index";
import CreatorReputationElectionManagementSystem from './pages/creator-reputation-election-management-system/index';
import CreatorSuccessAcademy from './pages/creator-success-academy/index';
import EnhancedRealTimeAdvertiserROIDashboard from './pages/enhanced-real-time-advertiser-roi-dashboard/index';
import UnifiedIncidentResponseOrchestrationCenter from './pages/unified-incident-response-orchestration-center/index';
import AdvancedPerplexityFraudIntelligenceCenter from './pages/advanced-perplexity-fraud-intelligence-center/index';
import AdvancedPerplexityFraudForecastingCenter from './pages/advanced-perplexity-fraud-forecasting-center/index';
import EnhancedPredictiveThreatIntelligenceCenter from './pages/enhanced-predictive-threat-intelligence-center/index';
import EnhancedRealTimeSupabaseIntegrationHub from './pages/enhanced-real-time-supabase-integration-hub/index';
import InteractiveTopicPreferenceCollectionHub from './pages/interactive-topic-preference-collection-hub/index';
import AccessibilityAnalyticsPreferencesCenter from './pages/accessibility-analytics-preferences-center/index';
import EnhancedGoogleAnalyticsIntegrationCenter from './pages/enhanced-google-analytics-integration-center/index';

import HomeFeedDashboard from './pages/home-feed-dashboard/index';
import AuthenticationPortal from './pages/authentication-portal/index';
import RoleUpgradePage from './pages/role-upgrade/index';
import ElectionsDashboard from './pages/elections-dashboard/index';
import SecureVotingInterface from './pages/secure-voting-interface/index';
import VoteInElectionsHub from './pages/vote-in-elections-hub/index';
import VotingCategoriesPage from './pages/voting-categories/index';
import EnhancedElectionResultsCenter from './pages/enhanced-election-results-center/index';
import ElectionCreationStudio from './pages/election-creation-studio/index';
import PrizeDistributionTrackingCenter from './pages/prize-distribution-tracking-center/index';
import VoteVerificationPortal from './pages/vote-verification-portal/index';
import BlockchainAuditPortal from './pages/blockchain-audit-portal/index';
import VotteryPointsVPUniversalCurrencyCenter from './pages/vottery-points-vp-universal-currency-center/index';
import ComprehensiveGamificationAdminControlCenter from './pages/comprehensive-gamification-admin-control-center/index';
import GamificationMultiLanguageIntelligenceCenter from './pages/gamification-multi-language-intelligence-center/index';
import DynamicQuestManagementDashboard from './pages/dynamic-quest-management-dashboard/index';
import ElectionPredictionPoolsInterface from './pages/election-prediction-pools-interface/index';
import UnifiedGamificationDashboard from './pages/unified-gamification-dashboard/index';
import VPEconomyHealthMonitorDashboard from './pages/vp-economy-health-monitor-dashboard/index';
import EnhancedPerformanceMonitoringDashboard from './pages/enhanced-performance-monitoring-dashboard/index';
import PredictionAnalyticsDashboard from './pages/prediction-analytics-dashboard/index';
import PredictionPoolNotificationsHub from './pages/prediction-pool-notifications-hub/index';
import QueryPerformanceMonitoringDashboard from './pages/query-performance-monitoring-dashboard/index';
import SupabaseAdvisorVerificationDashboard from './pages/supabase-advisor-verification-dashboard/index';
import UserProfileHub from './pages/user-profile-hub/index';
import DigitalWalletHub from './pages/digital-wallet-hub/index';
import DirectMessagingCenter from './pages/direct-messaging-center/index';
import NotificationCenterHub from './pages/notification-center-hub/index';
import FriendsManagementHub from './pages/friends-management-hub/index';
import SocialActivityTimeline from './pages/social-activity-timeline/index';
import AdminControlCenter from './pages/admin-control-center/index';
import ContentModerationControlCenter from './pages/content-moderation-control-center/index';
import ContentRemovedAppealPage from './pages/content-removed-appeal/index';
import SettingsAccountDashboard from './pages/settings-account-dashboard/index';
import PersonalAnalyticsDashboard from './pages/personal-analytics-dashboard/index';
import UserAnalyticsDashboard from './pages/user-analytics-dashboard/index';
import RealTimeAnalyticsDashboard from './pages/real-time-analytics-dashboard/index';
import EnhancedAnalyticsDashboards from './pages/enhanced-analytics-dashboards/index';
import ElectionInsightsPredictiveAnalytics from './pages/election-insights-predictive-analytics/index';
import ParticipatoryAdsStudio from './pages/participatory-ads-studio/index';
import VotteryAdsStudio from './pages/vottery-ads-studio/index';
import CampaignManagementDashboard from './pages/campaign-management-dashboard/index';
import AdvertiserAnalyticsROIDashboard from './pages/advertiser-analytics-roi-dashboard/index';
import AutomatedCampaignOptimizationDashboard from './pages/automated-campaign-optimization-dashboard/index';
import CampaignTemplateGallery from './pages/campaign-template-gallery/index';
import BrandAdvertiserRegistrationPortal from './pages/brand-advertiser-registration-portal/index';
import BrandDashboardSpecializedKPIsCenter from './pages/brand-dashboard-specialized-kp-is-center/index';
import AutomatedPaymentProcessingHub from './pages/automated-payment-processing-hub/index';
import StripePaymentIntegrationHub from './pages/stripe-payment-integration-hub/index';
import MultiCurrencySettlementDashboard from './pages/multi-currency-settlement-dashboard/index';
import FinancialTrackingZoneAnalyticsCenter from './pages/financial-tracking-zone-analytics-center/index';
import ComplianceDashboard from './pages/compliance-dashboard/index';
import CountryRestrictionsAdmin from './pages/country-restrictions-admin/index';
import PlatformIntegrationsAdmin from './pages/platform-integrations-admin/index';
import ComplianceAuditDashboard from './pages/compliance-audit-dashboard/index';
import RegulatoryComplianceAutomationHub from './pages/regulatory-compliance-automation-hub/index';
import LivePlatformMonitoringDashboard from './pages/live-platform-monitoring-dashboard/index';
import AdvancedPlatformMonitoringEventTrackingHub from './pages/advanced-platform-monitoring-event-tracking-hub/index';
import PlatformGamificationCoreEngine from './pages/platform-gamification-core-engine/index';
import Premium3DSlotMachineIntegrationHub from './pages/premium-3d-slot-machine-integration-hub/index';
import AdSenseRevenueAnalyticsDashboard from './pages/ad-sense-revenue-analytics-dashboard/index';
import VotteryAdsAdminConfig from './pages/vottery-ads-admin-config/index';
import UserSecurityCenter from './pages/user-security-center/index';
import FraudDetectionAlertManagementCenter from './pages/fraud-detection-alert-management-center/index';
import CustomAlertRulesEngine from './pages/custom-alert-rules-engine/index';
import UnifiedAlertManagementCenter from './pages/unified-alert-management-center/index';
import AutomatedIncidentResponsePortal from './pages/automated-incident-response-portal/index';
import AISentimentStrategyAnalytics from './pages/ai-sentiment-strategy-analytics/index';
import AIContentSafetyScreeningCenter from './pages/ai-content-safety-screening-center/index';
import ClaudeAIDisputeModerationCenter from './pages/claude-ai-dispute-moderation-center/index';
import MLModelTrainingInterface from './pages/ml-model-training-interface/index';
import UnifiedAIOrchestrationCommandCenter from './pages/unified-ai-orchestration-command-center/index';
import AutonomousMultiChannelCommunicationHub from './pages/autonomous-multi-channel-communication-hub/index';
import TelnyxSMSProviderManagementCenter from './pages/telnyx-sms-provider-management-center/index';
import SMSWebhookDeliveryAnalyticsHub from './pages/sms-webhook-delivery-analytics-hub/index';
import CrossDomainIntelligenceAnalyticsHub from './pages/cross-domain-intelligence-analytics-hub/index';
import IntelligentOrchestrationControlCenter from './pages/intelligent-orchestration-control-center/index';
import SupabaseRealTimeFeedRankingEngine from './pages/supabase-real-time-feed-ranking-engine/index';
import ContentDistributionControlCenter from './pages/content-distribution-control-center/index';
import EnhancedResendEmailAutomationHub from './pages/enhanced-resend-email-automation-hub/index';
import StakeholderIncidentCommunicationHub from './pages/stakeholder-incident-communication-hub/index';
import CentralizedSupportTicketingSystem from './pages/centralized-support-ticketing-system/index';
import TeamCollaborationCenter from './pages/team-collaboration-center/index';
import UnifiedAdminActivityLog from './pages/unified-admin-activity-log/index';
import BulkManagementScreen from './pages/bulk-management-screen/index';
import MobileAdminDashboard from './pages/mobile-admin-dashboard/index';
import DesignSystemFoundation from './pages/design-system-foundation/index';
import ThreeDGamifiedElectionExperienceCenter from './pages/3d-gamified-election-experience-center/index';
import EnhancedAdminRevenueAnalyticsHub from './pages/enhanced-admin-revenue-analytics-hub/index';
import ComprehensiveSocialEngagementSuite from './pages/comprehensive-social-engagement-suite/index';
import MultiAuthenticationGateway from './pages/multi-authentication-gateway/index';
import GlobalLocalizationControlCenter from './pages/global-localization-control-center/index';
import AdvancedAdminRoleManagementSystem from './pages/advanced-admin-role-management-system/index';
import ElectionComplianceAuditDashboard from './pages/election-compliance-audit-dashboard/index';
import CommunityElectionsHub from './pages/community-elections-hub/index';
import TopicBasedCommunityElectionsHub from './pages/topic-based-community-elections-hub/index';

import OpenAISMSOptimizationStudio from './pages/open-ai-sms-optimization-studio/index';
import AIPoweredRevenueForecastingIntelligenceCenter from './pages/ai-powered-revenue-forecasting-intelligence-center/index';
import ShapedAISyncDockerAutomationHub from './pages/shaped-ai-sync-docker-automation-hub/index';

import SmartPushNotificationsOptimizationCenter from './pages/smart-push-notifications-optimization-center/index';
import EnhancedCreatorPayoutDashboard from './pages/enhanced-creator-payout-dashboard-with-stripe-connect-integration/index';
import AdminPayoutVerificationDashboard from './pages/admin-payout-verification-dashboard/index';
import StripeConnectLinking from './pages/stripe-connect-linking/index';
import StripeConnectAccountLinkingInterface from './pages/stripe-connect-account-linking-interface/index';
import LocationBasedVoting from './pages/location-based-voting/index';
import ZoneSpecificThreatHeatmapsDashboard from './pages/zone-specific-threat-heatmaps-dashboard/index';
import UnifiedRevenueIntelligenceDashboard from './pages/unified-revenue-intelligence-dashboard/index';
import CreatorGrowthAnalyticsDashboard from './pages/creator-growth-analytics-dashboard/index';
import CreatorChurnPredictionIntelligenceCenter from './pages/creator-churn-prediction-intelligence-center/index';
import CreatorMarketplaceScreenEnhanced from './pages/creator-marketplace-screen/index';

import EnhancedMCQCreationStudio from './pages/enhanced-mcq-creation-studio/index';
import EnhancedMCQPreVotingInterface from './pages/enhanced-mcq-pre-voting-interface/index';
import LiveQuestionInjectionManagementCenter from './pages/live-question-injection-management-center/index';
import EnhancedMCQImageInterface from './pages/enhanced-mcq-image-interface/index';
import MCQAnalyticsIntelligenceDashboard from './pages/mcq-analytics-intelligence-dashboard/index';
import RealTimeMCQSyncMonitorDashboard from './pages/real-time-mcq-sync-monitor-dashboard/index';
import MCQAlertAutomationConfigurationCenter from './pages/mcq-alert-automation-configuration-center/index';
import MCQABTestingAnalyticsDashboard from './pages/mcq-a-b-testing-analytics-dashboard/index';
import RealTimeThreatCorrelationDashboard from './pages/real-time-threat-correlation-dashboard/index';
import RealTimeThreatCorrelationIntelligenceHub from './pages/real-time-threat-correlation-intelligence-hub/index';
import VoterEducationHub from './pages/voter-education-hub/index';
import FeaturePerformanceDashboard from './pages/feature-performance-dashboard/index';
import ProductionLoadTestingSuite from './pages/production-load-testing-suite/index';
import ElectionIntegrityMonitoringHub from './pages/election-integrity-monitoring-hub/index';
import CreatorMonetizationStudio from './pages/creator-monetization-studio/index';
import PredictiveCreatorInsightsDashboard from './pages/predictive-creator-insights-dashboard/index';
import EnhancedHomeFeedDashboard from './pages/enhanced-home-feed-dashboard/index';
import AppPerformanceDashboard from './pages/app-performance-dashboard/index';
import EnhancedGroupsDiscoveryManagementHub from './pages/enhanced-groups-discovery-management-hub/index';
import VoterRollsManagement from './pages/voter-rolls-management/index';

// New page imports for missing routes
import StripeSubscriptionManagementCenter from './pages/stripe-subscription-management-center/index';
import UserSubscriptionDashboard from './pages/user-subscription-dashboard/index';
import AdminSubscriptionAnalyticsHub from './pages/admin-subscription-analytics-hub/index';
import PublicStatusPage from './pages/status/index';
import MobileOperationsCommandConsole from './pages/mobile-operations-command-console/index';
import PredictiveIncidentPrevention24h from './pages/predictive-incident-prevention-24h/index';
import EnhancedPremiumSubscriptionCenter from './pages/enhanced-premium-subscription-center/index';
import RealTimePerformanceTestingSuite from './pages/real-time-performance-testing-suite/index';
import InteractiveOnboardingWizard from './pages/interactive-onboarding-wizard/index';
import RealTimeRevenueOptimizationEngine from './pages/real-time-revenue-optimization-engine/index';
import ClaudeDecisionReasoningHub from './pages/claude-decision-reasoning-hub/index';
import MultiRegionFailoverOrchestration from './pages/multi-region-failover-orchestration/index';
import PerformanceRegressionDetection from './pages/performance-regression-detection/index';
import AdminAutomationControlPanel from './pages/admin-automation-control-panel/index';
import AnalyticsExportReportingHub from './pages/analytics-export-reporting-hub/index';
import ApiDocumentationPortal from './pages/api-documentation-portal/index';
import APIRateLimitingDashboard from './pages/api-rate-limiting-dashboard/index';

const CryptographicSecurityManagementCenter = lazy(() => import("./pages/cryptographic-security-management-center"));
const VoteAnonymityMixnetControlHub = lazy(() => import("./pages/vote-anonymity-mixnet-control-hub"));
const JoltsVideoStudio = lazy(() => import("./pages/jolts-video-studio"));
const RevenueSplitAnalyticsImpactDashboard = lazy(() => import("./pages/revenue-split-analytics-impact-dashboard"));
const AIGuidedInteractiveTutorialSystem = lazy(() => import('./pages/ai-guided-interactive-tutorial-system/index'));
const UnifiedAIDecisionOrchestrationCommandCenter = lazy(() => import('./pages/unified-ai-decision-orchestration-command-center/index'));
const AIPlaceholderCenter = lazy(() => import('./pages/ai-placeholder-center/index'));
const CommunityEngagementDashboard = lazy(() => import('./pages/community-engagement-dashboard/index'));
const CrossDomainDataSyncHub = lazy(() => import('./pages/cross-domain-data-sync-hub/index'));
const ComprehensiveFeatureAnalyticsDashboard = lazy(() => import('./pages/comprehensive-feature-analytics-dashboard/index'));
const ProductionDeploymentHub = lazy(() => import('./pages/production-deployment-hub/index'));
const SecurityComplianceAuditScreen = lazy(() => import('./pages/security-compliance-audit-screen/index'));
const UnifiedPaymentOrchestrationHub = lazy(() => import('./pages/unified-payment-orchestration-hub/index'));
const CostAnalyticsROIDashboard = lazy(() => import('./pages/cost-analytics-roi-dashboard/index'));
const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
        </div>
    </div>
);

function wrapWithRoleGuard(path, element) {
    const requiredRoles = navigationService?.getRequiredRolesForPath(path);
    return requiredRoles ? <ProtectedRoute path={path} requiredRoles={requiredRoles}>{element}</ProtectedRoute> : element;
}

function Routes() {
    const routes = [
        { path: "/", element: <HomeFeedDashboard /> },
        { path: "/home-feed-dashboard", element: <HomeFeedDashboard /> },
        { path: "/authentication-portal", element: <AuthenticationPortal /> },
        { path: "/role-upgrade", element: <RoleUpgradePage /> },
        { path: "/elections-dashboard", element: <ElectionsDashboard /> },
        { path: "/secure-voting-interface", element: <SecureVotingInterface /> },
        { path: "/vote-in-elections-hub", element: <VoteInElectionsHub /> },
        { path: "/voting-categories", element: <VotingCategoriesPage /> },
        { path: "/enhanced-election-results-center", element: <EnhancedElectionResultsCenter /> },
        { path: "/election-creation-studio", element: <ElectionCreationStudio /> },
        { path: "/voter-rolls-management", element: <VoterRollsManagement /> },
        {
            path: "/creator-reputation-election-management-system",
            element: <CreatorReputationElectionManagementSystem />,
        },
        { path: "/creator-success-academy", element: <CreatorSuccessAcademy /> },
        { path: "/prize-distribution-tracking-center", element: <PrizeDistributionTrackingCenter /> },
        { path: "/vote-verification-portal", element: <VoteVerificationPortal /> },
        { path: "/blockchain-audit-portal", element: <BlockchainAuditPortal /> },
        { path: "/vottery-points-vp-universal-currency-center", element: <VotteryPointsVPUniversalCurrencyCenter /> },
        { path: "/comprehensive-gamification-admin-control-center", element: <ComprehensiveGamificationAdminControlCenter /> },
        { path: "/gamification-multi-language-intelligence-center", element: <GamificationMultiLanguageIntelligenceCenter /> },
        { path: "/dynamic-quest-management-dashboard", element: <DynamicQuestManagementDashboard /> },
        { path: "/open-ai-quest-generation-studio", element: <Navigate to="/dynamic-quest-management-dashboard" replace /> },
        { path: "/admin-quest-configuration-control-center", element: <Navigate to="/dynamic-quest-management-dashboard" replace /> },
        { path: "/election-prediction-pools-interface", element: <ElectionPredictionPoolsInterface /> },
        { path: "/unified-gamification-dashboard", element: <UnifiedGamificationDashboard /> },
        { path: "/vp-economy-health-monitor-dashboard", element: <VPEconomyHealthMonitorDashboard /> },
        { path: "/enhanced-performance-monitoring-dashboard", element: <EnhancedPerformanceMonitoringDashboard /> },
        { path: "/prediction-analytics-dashboard", element: <PredictionAnalyticsDashboard /> },
        { path: "/prediction-pool-notifications-hub", element: <PredictionPoolNotificationsHub /> },
        { path: "/query-performance-monitoring-dashboard", element: <QueryPerformanceMonitoringDashboard /> },
        { path: "/supabase-advisor-verification-dashboard", element: <SupabaseAdvisorVerificationDashboard /> },
        { path: "/user-profile-hub", element: <UserProfileHub /> },
        { path: "/digital-wallet-hub", element: <DigitalWalletHub /> },
        { path: "/direct-messaging-center", element: <DirectMessagingCenter /> },
        { path: "/notification-center-hub", element: <NotificationCenterHub /> },
        { path: "/friends-management-hub", element: <FriendsManagementHub /> },
        { path: "/friend-requests", element: <Navigate to="/friends-management-hub" replace /> },
        { path: "/groups", element: <Navigate to="/enhanced-groups-discovery-management-hub" replace /> },
        { path: "/social-activity-timeline", element: <SocialActivityTimeline /> },
        { path: "/admin-control-center", element: <AdminControlCenter /> },
        { path: "/content-moderation-control-center", element: <ContentModerationControlCenter /> },
        { path: "/content-removed-appeal", element: <ContentRemovedAppealPage /> },
        { path: "/settings-account-dashboard", element: <SettingsAccountDashboard /> },
        { path: "/personal-analytics-dashboard", element: <PersonalAnalyticsDashboard /> },
        { path: "/user-analytics-dashboard", element: <UserAnalyticsDashboard /> },
        { path: "/real-time-analytics-dashboard", element: <RealTimeAnalyticsDashboard /> },
        { path: "/enhanced-analytics-dashboards", element: <EnhancedAnalyticsDashboards /> },
        { path: "/election-insights-predictive-analytics", element: <ElectionInsightsPredictiveAnalytics /> },
        { path: "/collaborative-voting-room", element: <CollaborativeVotingRoom /> },
        { path: "/ai-analytics-hub", element: <AIAnalyticsHub /> },
        { path: "/vottery-ads-studio", element: <VotteryAdsStudio /> },
        { path: "/participatory-ads-studio", element: <Navigate to="/vottery-ads-studio" replace /> },
        { path: "/campaign-management-dashboard", element: <CampaignManagementDashboard /> },
        { path: "/sponsored-elections-schema-cpe-management-hub", element: <CampaignManagementDashboard /> },
        { path: "/advertiser-analytics-roi-dashboard", element: <AdvertiserAnalyticsROIDashboard /> },
        { path: "/enhanced-real-time-advertiser-roi-dashboard", element: <EnhancedRealTimeAdvertiserROIDashboard /> },
        { path: "/automated-campaign-optimization-dashboard", element: <AutomatedCampaignOptimizationDashboard /> },
        { path: "/campaign-template-gallery", element: <CampaignTemplateGallery /> },
        { path: "/brand-advertiser-registration-portal", element: <BrandAdvertiserRegistrationPortal /> },
        { path: "/brand-dashboard-specialized-kpis-center", element: <BrandDashboardSpecializedKPIsCenter /> },
        { path: "/automated-payment-processing-hub", element: <AutomatedPaymentProcessingHub /> },
        { path: "/stripe-payment-integration-hub", element: <StripePaymentIntegrationHub /> },
        { path: "/multi-currency-settlement-dashboard", element: <MultiCurrencySettlementDashboard /> },
        { path: "/financial-tracking-zone-analytics-center", element: <FinancialTrackingZoneAnalyticsCenter /> },
        { path: "/compliance-dashboard", element: <ComplianceDashboard /> },
        { path: "/country-restrictions-admin", element: <CountryRestrictionsAdmin /> },
        { path: "/platform-integrations-admin", element: <PlatformIntegrationsAdmin /> },
        { path: "/compliance-audit-dashboard", element: <ComplianceAuditDashboard /> },
        { path: "/regulatory-compliance-automation-hub", element: <RegulatoryComplianceAutomationHub /> },
        {
            path: "/advanced-monitoring-hub-with-automated-incident-response",
            element: <AdvancedMonitoringHubWithAutomatedIncidentResponse />,
        },
        { path: "/production-monitoring-dashboard", element: <ProductionMonitoringDashboard /> },
        { path: "/datadog-apm-performance-intelligence-center", element: <DatadogAPMPerformanceIntelligenceCenter /> },
        { path: "/enhanced-incident-response-analytics", element: <EnhancedIncidentResponseAnalytics /> },
        {
            path: "/user-feedback-portal-with-feature-request-system",
            element: <UserFeedbackPortalWithFeatureRequestSystem />,
        },
        {
            path: "/feature-implementation-tracking-engagement-analytics-center",
            element: <FeatureImplementationTrackingEngagementAnalyticsCenter />,
        },
        { path: "/live-platform-monitoring-dashboard", element: <LivePlatformMonitoringDashboard /> },
        {
            path: "/advanced-platform-monitoring-event-tracking-hub",
            element: <AdvancedPlatformMonitoringEventTrackingHub />,
        },
        { path: "/platform-gamification-core-engine", element: <PlatformGamificationCoreEngine /> },
        { path: "/ad-slot-manager-inventory-control-center", element: <AdSlotManagerInventoryControlCenter /> },
        { path: "/ad-network-status-and-split-dashboard", element: <AdNetworkStatusAndSplitDashboard /> },
        { path: "/dynamic-ad-rendering-fill-rate-analytics-hub", element: <DynamicAdRenderingFillRateAnalyticsHub /> },
        { path: "/gamification-progression-achievement-hub", element: <GamificationProgressionAchievementHub /> },
        { path: "/premium-3d-slot-machine-integration-hub", element: <Premium3DSlotMachineIntegrationHub /> },
        { path: "/ad-sense-revenue-analytics-dashboard", element: <AdSenseRevenueAnalyticsDashboard /> },
        { path: "/vottery-ads-admin-config", element: <VotteryAdsAdminConfig /> },
        { path: "/user-security-center", element: <UserSecurityCenter /> },
        { path: "/fraud-detection-alert-management-center", element: <FraudDetectionAlertManagementCenter /> },
        { path: "/custom-alert-rules-engine", element: <CustomAlertRulesEngine /> },
        { path: "/unified-alert-management-center", element: <UnifiedAlertManagementCenter /> },
        { path: "/automated-incident-response-portal", element: <AutomatedIncidentResponsePortal /> },
        {
            path: "/unified-incident-response-orchestration-center",
            element: <UnifiedIncidentResponseOrchestrationCenter />,
        },
        {
            path: "/advanced-perplexity-fraud-intelligence-center",
            element: <AdvancedPerplexityFraudIntelligenceCenter />,
        },
        {
            path: "/advanced-perplexity-fraud-forecasting-center",
            element: <AdvancedPerplexityFraudForecastingCenter />,
        },
        {
            path: "/enhanced-predictive-threat-intelligence-center",
            element: <EnhancedPredictiveThreatIntelligenceCenter />,
        },
        { path: "/ai-sentiment-strategy-analytics", element: <AISentimentStrategyAnalytics /> },
        { path: "/ai-content-safety-screening-center", element: <AIContentSafetyScreeningCenter /> },
        { path: "/claude-ai-dispute-moderation-center", element: <ClaudeAIDisputeModerationCenter /> },
        { path: "/ml-model-training-interface", element: <MLModelTrainingInterface /> },
        { path: "/unified-ai-orchestration-command-center", element: <UnifiedAIOrchestrationCommandCenter /> },
        { path: "/unified-ai-decision-orchestration-command-center", element: <UnifiedAIDecisionOrchestrationCommandCenter /> },
        { path: "/ai-powered-revenue-forecasting-intelligence-center", element: <AIPoweredRevenueForecastingIntelligenceCenter /> },
        { path: "/shaped-ai-sync-docker-automation-hub", element: <ShapedAISyncDockerAutomationHub /> },
        { path: "/anthropic-content-intelligence-center", element: <AIPlaceholderCenter /> },
        { path: "/anthropic-advanced-content-analysis-center", element: <AIPlaceholderCenter /> },
        { path: "/anthropic-claude-revenue-risk-intelligence-center", element: <AIPlaceholderCenter /> },
        { path: "/claude-analytics-dashboard-for-campaign-intelligence", element: <AIPlaceholderCenter /> },
        { path: "/claude-predictive-analytics-dashboard", element: <AIPlaceholderCenter /> },
        { path: "/claude-ai-feed-intelligence-center", element: <AIPlaceholderCenter /> },
        { path: "/claude-ai-content-curation-intelligence-center", element: <AIPlaceholderCenter /> },
        { path: "/claude-model-comparison-center", element: <AIPlaceholderCenter /> },
        { path: "/claude-content-optimization-engine", element: <AIPlaceholderCenter /> },
        { path: "/perplexity-market-research-intelligence-center", element: <AIPlaceholderCenter /> },
        { path: "/advanced-perplexity-60-90-day-threat-forecasting-center", element: <AIPlaceholderCenter /> },
        { path: "/perplexity-strategic-planning-center", element: <AIPlaceholderCenter /> },
        { path: "/perplexity-carousel-intelligence-dashboard", element: <AIPlaceholderCenter /> },
        { path: "/automatic-ai-failover-engine-control-center", element: <AIPlaceholderCenter /> },
        { path: "/ai-performance-orchestration-dashboard", element: <AIPlaceholderCenter /> },
        { path: "/ai-powered-performance-advisor-hub", element: <AIPlaceholderCenter /> },
        { path: "/advanced-ai-fraud-prevention-command-center", element: <AIPlaceholderCenter /> },
        { path: "/advanced-ml-threat-detection-center", element: <AIPlaceholderCenter /> },
        { path: "/continuous-ml-feedback-outcome-learning-center", element: <AIPlaceholderCenter /> },
        { path: "/open-ai-carousel-content-intelligence-center", element: <AIPlaceholderCenter /> },
        { path: "/context-aware-claude-recommendations-overlay", element: <AIPlaceholderCenter /> },
        { path: "/resend-email-automation-orchestration-center", element: <Navigate to="/enhanced-resend-email-automation-hub" replace /> },
        { path: "/autonomous-claude-agent-orchestration-hub", element: <AIPlaceholderCenter /> },
        { path: "/enhanced-real-time-behavioral-heatmaps-center", element: <AIPlaceholderCenter /> },
        { path: "/gemini-cost-efficiency-analyzer-case-report-generator", element: <AIPlaceholderCenter /> },
        { path: "/autonomous-multi-channel-communication-hub", element: <AutonomousMultiChannelCommunicationHub /> },
        { path: "/telnyx-sms-provider-management-center", element: <TelnyxSMSProviderManagementCenter /> },
        { path: "/sms-webhook-delivery-analytics-hub", element: <SMSWebhookDeliveryAnalyticsHub /> },
        { path: "/cross-domain-intelligence-analytics-hub", element: <CrossDomainIntelligenceAnalyticsHub /> },
        { path: "/intelligent-orchestration-control-center", element: <IntelligentOrchestrationControlCenter /> },
        { path: "/enhanced-real-time-supabase-integration-hub", element: <EnhancedRealTimeSupabaseIntegrationHub /> },
        { path: "/supabase-real-time-feed-ranking-engine", element: <SupabaseRealTimeFeedRankingEngine /> },
        { path: "/content-distribution-control-center", element: <ContentDistributionControlCenter /> },
        { path: "/interactive-topic-preference-collection-hub", element: <InteractiveTopicPreferenceCollectionHub /> },
        { path: "/accessibility-analytics-preferences-center", element: <AccessibilityAnalyticsPreferencesCenter /> },
        { path: "/enhanced-resend-email-automation-hub", element: <EnhancedResendEmailAutomationHub /> },
        { path: "/stakeholder-incident-communication-hub", element: <StakeholderIncidentCommunicationHub /> },
        { path: "/centralized-support-ticketing-system", element: <CentralizedSupportTicketingSystem /> },
        { path: "/team-collaboration-center", element: <TeamCollaborationCenter /> },
        { path: "/unified-admin-activity-log", element: <UnifiedAdminActivityLog /> },
        { path: "/bulk-management-screen", element: <BulkManagementScreen /> },
        { path: "/mobile-admin-dashboard", element: <MobileAdminDashboard /> },
        { path: "/design-system-foundation", element: <DesignSystemFoundation /> },
        { path: "/3d-gamified-election-experience-center", element: <ThreeDGamifiedElectionExperienceCenter /> },
        { path: "/enhanced-admin-revenue-analytics-hub", element: <EnhancedAdminRevenueAnalyticsHub /> },
        { path: "/comprehensive-social-engagement-suite", element: <ComprehensiveSocialEngagementSuite /> },
        { path: "/multi-authentication-gateway", element: <MultiAuthenticationGateway /> },
        { path: "/global-localization-control-center", element: <GlobalLocalizationControlCenter /> },
        { path: "/advanced-admin-role-management-system", element: <AdvancedAdminRoleManagementSystem /> },
        { path: "/election-compliance-audit-dashboard", element: <ElectionComplianceAuditDashboard /> },
        { path: "/community-elections-hub", element: <CommunityElectionsHub /> },
        { path: "/topic-based-community-elections-hub", element: <TopicBasedCommunityElectionsHub /> },
        {
            path: "/enhanced-google-analytics-integration-center",
            element: <EnhancedGoogleAnalyticsIntegrationCenter />,
        },
        { path: "/api-rate-limiting-dashboard", element: <APIRateLimitingDashboard /> },
        { path: "/international-payment-dispute-resolution-center", element: <InternationalPaymentDisputeResolutionCenter /> },
        { path: "/creator-brand-partnership-portal", element: <CreatorBrandPartnershipPortal /> },
        { path: "/smart-push-notifications-optimization-center", element: <SmartPushNotificationsOptimizationCenter /> },
        { path: "/enhanced-creator-payout-dashboard-with-stripe-connect-integration", element: <EnhancedCreatorPayoutDashboard /> },
        { path: "/admin-payout-verification-dashboard", element: <AdminPayoutVerificationDashboard /> },
        { path: "/stripe-connect-linking", element: <StripeConnectLinking /> },
        { path: '/location-based-voting', element: <LocationBasedVoting /> },
        { path: '/zone-specific-threat-heatmaps-dashboard', element: <ZoneSpecificThreatHeatmapsDashboard /> },
        { path: '/creator-growth-analytics-dashboard', element: <CreatorGrowthAnalyticsDashboard /> },
        { path: '/creator-churn-prediction-intelligence-center', element: <CreatorChurnPredictionIntelligenceCenter /> },
        { path: '/creator-marketplace-screen', element: <CreatorMarketplaceScreenEnhanced /> },
        { path: '/unified-revenue-intelligence-dashboard', element: <UnifiedRevenueIntelligenceDashboard /> },
        { path: '/enhanced-mcq-creation-studio', element: <EnhancedMCQCreationStudio /> },
        { path: '/enhanced-mcq-pre-voting-interface', element: <EnhancedMCQPreVotingInterface /> },
        { path: '/live-question-injection-management-center', element: <LiveQuestionInjectionManagementCenter /> },
        { path: '/enhanced-mcq-image-interface', element: <EnhancedMCQImageInterface /> },
        { path: '/mcq-analytics-intelligence-dashboard', element: <MCQAnalyticsIntelligenceDashboard /> },
        { path: '/real-time-mcq-sync-monitor-dashboard', element: <RealTimeMCQSyncMonitorDashboard /> },
        { path: '/mcq-alert-automation-configuration-center', element: <MCQAlertAutomationConfigurationCenter /> },
        { path: '/mcq-a-b-testing-analytics-dashboard', element: <MCQABTestingAnalyticsDashboard /> },
        { path: '/real-time-threat-correlation-dashboard', element: <RealTimeThreatCorrelationDashboard /> },
        { path: '/real-time-threat-correlation-intelligence-hub', element: <RealTimeThreatCorrelationIntelligenceHub /> },
        { path: '/voter-education-hub', element: <VoterEducationHub /> },
        { path: '/feature-performance-dashboard', element: <FeaturePerformanceDashboard /> },
        { path: '/production-load-testing-suite', element: <ProductionLoadTestingSuite /> },
        { path: '/election-integrity-monitoring-hub', element: <ElectionIntegrityMonitoringHub /> },
        { path: '/creator-monetization-studio', element: <CreatorMonetizationStudio /> },
        { path: '/predictive-creator-insights-dashboard', element: <PredictiveCreatorInsightsDashboard /> },
        { path: '/enhanced-home-feed-dashboard', element: <EnhancedHomeFeedDashboard /> },
        { path: '/app-performance-dashboard', element: <AppPerformanceDashboard /> },
        { path: '/enhanced-groups-discovery-management-hub', element: <EnhancedGroupsDiscoveryManagementHub /> },
        // New 6-feature routes
        { path: '/real-time-revenue-optimization-engine', element: <RealTimeRevenueOptimizationEngine /> },
        { path: '/claude-decision-reasoning-hub', element: <ClaudeDecisionReasoningHub /> },
        { path: '/multi-region-failover-orchestration', element: <MultiRegionFailoverOrchestration /> },
        { path: '/performance-regression-detection', element: <PerformanceRegressionDetection /> },
        { path: '/admin-automation-control-panel', element: <AdminAutomationControlPanel /> },
        { path: '/analytics-export-reporting-hub', element: <AnalyticsExportReportingHub /> },
        { path: '/api-documentation-portal', element: <ApiDocumentationPortal /> },
        // Subscription Architecture Routes (Feature 1)
        { path: '/stripe-subscription-management-center', element: <StripeSubscriptionManagementCenter /> },
        { path: '/user-subscription-dashboard', element: <UserSubscriptionDashboard /> },
        { path: '/admin-subscription-analytics-hub', element: <AdminSubscriptionAnalyticsHub /> },
        // New Feature Routes
        { path: '/status', element: <PublicStatusPage /> },
        { path: '/public-status-page', element: <PublicStatusPage /> },
        { path: '/mobile-operations-command-console', element: <MobileOperationsCommandConsole /> },
        { path: '/predictive-incident-prevention-24h', element: <PredictiveIncidentPrevention24h /> },
        { path: '/enhanced-premium-subscription-center', element: <EnhancedPremiumSubscriptionCenter /> },
        { path: '/real-time-performance-testing-suite', element: <RealTimePerformanceTestingSuite /> },
        // New routes for missing pages
        { path: '/comprehensive-gamification-admin-control-center', element: <ComprehensiveGamificationAdminControlCenter /> },
        { path: '/gamification-multi-language-intelligence-center', element: <GamificationMultiLanguageIntelligenceCenter /> },
        { path: '/dynamic-quest-management-dashboard', element: <DynamicQuestManagementDashboard /> },
        { path: '/election-prediction-pools-interface', element: <ElectionPredictionPoolsInterface /> },
        { path: '/unified-gamification-dashboard', element: <UnifiedGamificationDashboard /> },
        // D.2 - New onboarding and tutorial routes
        { path: '/interactive-onboarding-wizard', element: <InteractiveOnboardingWizard /> },
        { path: '/ai-guided-interactive-tutorial-system', element: <AIGuidedInteractiveTutorialSystem /> },
        { path: '/community-engagement-dashboard', element: <CommunityEngagementDashboard /> },
        // D.3 - Cross-Domain Data Sync Hub
        { path: '/cross-domain-data-sync-hub', element: <CrossDomainDataSyncHub /> },
        { path: '/comprehensive-feature-analytics-dashboard', element: <ComprehensiveFeatureAnalyticsDashboard /> },
        // D.7 - Production Deployment Hub
        { path: '/production-deployment-hub', element: <ProductionDeploymentHub /> },
        // D.8 - Security Compliance Audit Screen
        { path: '/security-compliance-audit-screen', element: <SecurityComplianceAuditScreen /> },
        // D.9 - Unified Payment Orchestration Hub
        { path: '/unified-payment-orchestration-hub', element: <UnifiedPaymentOrchestrationHub /> },
        // Cost Analytics & ROI Dashboard (Redis, Datadog, Supabase, cost-per-query, caching ROI)
        { path: '/cost-analytics-roi-dashboard', element: <CostAnalyticsROIDashboard /> },
    ];

    return (
        <BrowserRouter>
            <OnboardingRedirect>
            <ErrorBoundary>
                <ScrollToTop />
                <Breadcrumbs />
                <Suspense fallback={<LoadingFallback />}>
                    <RouterRoutes>
                        {routes?.map((route, index) => (
                            <Route
                                key={index}
                                path={route?.path}
                                element={wrapWithRoleGuard(
                                    route?.path,
                                    <FeatureGateByPath path={route?.path}>{route?.element}</FeatureGateByPath>
                                )}
                            />
                        ))}
                        <Route
                            path="/enhanced-dynamic-revenue-sharing-configuration-center"
                            element={wrapWithRoleGuard('/enhanced-dynamic-revenue-sharing-configuration-center', <EnhancedDynamicRevenueSharingConfigurationCenter />)}
                        />
                        <Route path="/revenue-fraud-detection-anomaly-prevention-center" element={wrapWithRoleGuard('/revenue-fraud-detection-anomaly-prevention-center', <RevenueFraudDetectionAnomalyPreventionCenter />)} />
                        <Route path="/predictive-anomaly-alerting-deviation-monitoring-hub" element={wrapWithRoleGuard('/predictive-anomaly-alerting-deviation-monitoring-hub', <PredictiveAnomalyAlertingDeviationMonitoringHub />)} />
                        <Route path="/dual-advertising-system-analytics-dashboard" element={wrapWithRoleGuard('/dual-advertising-system-analytics-dashboard', <DualAdvertisingSystemAnalyticsDashboard />)} />
                        <Route path="/ai-dependency-risk-mitigation-command-center" element={wrapWithRoleGuard('/ai-dependency-risk-mitigation-command-center', <AIDependencyRiskMitigationCommandCenter />)} />
                        <Route path="/gemini-fallback-orchestration-hub" element={wrapWithRoleGuard('/gemini-fallback-orchestration-hub', <GeminiFallbackOrchestrationHub />)} />
                        <Route path="/country-revenue-share-management-center" element={wrapWithRoleGuard('/country-revenue-share-management-center', <CountryRevenueShareManagementCenter />)} />
                        <Route path="/enhanced-automated-payout-calculation-engine-with-country-based-processing" element={wrapWithRoleGuard('/enhanced-automated-payout-calculation-engine-with-country-based-processing', <EnhancedAutomatedPayoutCalculationEngineWithCountryBasedProcessing />)} />
                        <Route path="/creator-country-verification-interface" element={wrapWithRoleGuard('/creator-country-verification-interface', <CreatorCountryVerificationInterface />)} />
                        <Route path="/regional-revenue-analytics-dashboard" element={wrapWithRoleGuard('/regional-revenue-analytics-dashboard', <RegionalRevenueAnalyticsDashboard />)} />
                        <Route path="/localization-tax-reporting-intelligence-center" element={wrapWithRoleGuard('/localization-tax-reporting-intelligence-center', <LocalizationTaxReportingIntelligenceCenter />)} />
                        <Route path="/claude-creator-success-agent" element={wrapWithRoleGuard('/claude-creator-success-agent', <ClaudeCreatorSuccessAgent />)} />
                        <Route path="/telnyx-sms-provider-management-center" element={wrapWithRoleGuard('/telnyx-sms-provider-management-center', <TelnyxSMSProviderManagementCenter />)} />
                        <Route path="/sms-webhook-delivery-analytics-hub" element={wrapWithRoleGuard('/sms-webhook-delivery-analytics-hub', <SMSWebhookDeliveryAnalyticsHub />)} />
                        <Route path="/open-ai-sms-optimization-studio" element={wrapWithRoleGuard('/open-ai-sms-optimization-studio', <OpenAISMSOptimizationStudio />)} />
                        <Route path="/stripe-connect-account-linking-interface" element={wrapWithRoleGuard('/stripe-connect-account-linking-interface', <StripeConnectAccountLinkingInterface />)} />
                        <Route path="/vottery-points-vp-universal-currency-center" element={wrapWithRoleGuard('/vottery-points-vp-universal-currency-center', <VotteryPointsVPUniversalCurrencyCenter />)} />
                        <Route path="/comprehensive-gamification-admin-control-center" element={wrapWithRoleGuard('/comprehensive-gamification-admin-control-center', <ComprehensiveGamificationAdminControlCenter />)} />
                        <Route path="/gamification-multi-language-intelligence-center" element={wrapWithRoleGuard('/gamification-multi-language-intelligence-center', <GamificationMultiLanguageIntelligenceCenter />)} />
                        <Route path="/dynamic-quest-management-dashboard" element={wrapWithRoleGuard('/dynamic-quest-management-dashboard', <DynamicQuestManagementDashboard />)} />
                        <Route path="/open-ai-quest-generation-studio" element={<Navigate to="/dynamic-quest-management-dashboard" replace />} />
                        <Route path="/admin-quest-configuration-control-center" element={wrapWithRoleGuard('/admin-quest-configuration-control-center', <Navigate to="/dynamic-quest-management-dashboard" replace />)} />
                        <Route path="/election-prediction-pools-interface" element={wrapWithRoleGuard('/election-prediction-pools-interface', <ElectionPredictionPoolsInterface />)} />
                        <Route path="/unified-gamification-dashboard" element={wrapWithRoleGuard('/unified-gamification-dashboard', <UnifiedGamificationDashboard />)} />
                        <Route path="/vp-economy-health-monitor-dashboard" element={wrapWithRoleGuard('/vp-economy-health-monitor-dashboard', <VPEconomyHealthMonitorDashboard />)} />
                        <Route path="/enhanced-performance-monitoring-dashboard" element={wrapWithRoleGuard('/enhanced-performance-monitoring-dashboard', <EnhancedPerformanceMonitoringDashboard />)} />
                        <Route path="/prediction-analytics-dashboard" element={wrapWithRoleGuard('/prediction-analytics-dashboard', <PredictionAnalyticsDashboard />)} />
                        <Route path="/query-performance-monitoring-dashboard" element={wrapWithRoleGuard('/query-performance-monitoring-dashboard', <QueryPerformanceMonitoringDashboard />)} />
                        <Route path="/supabase-advisor-verification-dashboard" element={wrapWithRoleGuard('/supabase-advisor-verification-dashboard', <SupabaseAdvisorVerificationDashboard />)} />
                    </RouterRoutes>
                </Suspense>
            </ErrorBoundary>
            </OnboardingRedirect>
        </BrowserRouter>
    );
}
export default Routes;
