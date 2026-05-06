import React, { lazy } from 'react';
import * as Web from '../../constants/navigationHubRoutes';

const JoltsVideoStudio = lazy(() => import("../../pages/jolts-video-studio"));

// Component imports
import HomeFeedDashboard from '../../pages/home-feed-dashboard/index';
import AuthenticationPortal from '../../pages/authentication-portal/index';
import AuthCallback from '../../pages/auth-callback/index';
import RoleUpgradePage from '../../pages/role-upgrade/index';
import ElectionsDashboard from '../../pages/elections-dashboard/index';
import SecureVotingInterface from '../../pages/secure-voting-interface/index';
import VoteInElectionsHub from '../../pages/vote-in-elections-hub/index';
import VotingCategoriesPage from '../../pages/voting-categories/index';
import ElectionCreationStudio from '../../pages/election-creation-studio/index';
import VoteVerificationPortal from '../../pages/vote-verification-portal/index';
import BlockchainAuditPortal from '../../pages/blockchain-audit-portal/index';
import UserProfileHub from '../../pages/user-profile-hub/index';
import SettingsAccountDashboard from '../../pages/settings-account-dashboard/index';
import DigitalWalletHub from '../../pages/digital-wallet-hub/index';
import VotteryPointsVPUniversalCurrencyCenter from '../../pages/vottery-points-vp-universal-currency-center/index';
import VPRedemptionMarketplaceCharityHub from '../../pages/vp-redemption-marketplace-charity-hub/index';
import DirectMessagingCenter from '../../pages/direct-messaging-center/index';
import NotificationCenterHub from '../../pages/notification-center-hub/index';
import FriendsManagementHub from '../../pages/friends-management-hub/index';
import SocialActivityTimeline from '../../pages/social-activity-timeline/index';
import AdminControlCenter from '../../pages/admin-control-center/index';
import PublicStatusPage from '../../pages/status/index';
import MultiAuthenticationGateway from '../../pages/multi-authentication-gateway/index';
import UserSecurityCenter from '../../pages/user-security-center/index';
import CentralizedSupportTicketingSystem from '../../pages/centralized-support-ticketing-system/index';

/**
 * Kernel Routes (K1-K7).
 * These routes are the bedrock of the platform and should always be available
 * regardless of which specialized feature modules are enabled.
 */
export function getFoundationalRoutes() {
  return [
    { path: Web.HOME_ROOT_ROUTE, element: <HomeFeedDashboard /> },
    { path: Web.HOME_FEED_DASHBOARD_ROUTE, element: <HomeFeedDashboard /> },
    { path: Web.AUTHENTICATION_PORTAL_ROUTE, element: <AuthenticationPortal /> },
    { path: Web.AUTH_CALLBACK_ROUTE, element: <AuthCallback /> },
    { path: Web.ROLE_UPGRADE_ROUTE, element: <RoleUpgradePage /> },
    { path: Web.ELECTIONS_DASHBOARD_ROUTE, element: <ElectionsDashboard /> },
    { path: Web.SECURE_VOTING_INTERFACE_ROUTE, element: <SecureVotingInterface /> },
    { path: Web.VOTE_IN_ELECTIONS_HUB_ROUTE, element: <VoteInElectionsHub /> },
    { path: Web.VOTING_CATEGORIES_ROUTE, element: <VotingCategoriesPage /> },
    { path: Web.ELECTION_CREATION_STUDIO_ROUTE, element: <ElectionCreationStudio /> },
    { path: Web.VOTE_VERIFICATION_PORTAL_ROUTE, element: <VoteVerificationPortal /> },
    { path: Web.BLOCKCHAIN_AUDIT_PORTAL_ROUTE, element: <BlockchainAuditPortal /> },
    { path: Web.USER_PROFILE_HUB_ROUTE, element: <UserProfileHub /> },
    { path: Web.SETTINGS_ACCOUNT_DASHBOARD_ROUTE, element: <SettingsAccountDashboard /> },
    { path: Web.DIGITAL_WALLET_HUB_ROUTE, element: <DigitalWalletHub /> },
    { path: Web.VOTTERY_POINTS_VP_UNIVERSAL_CURRENCY_CENTER_ROUTE, element: <VotteryPointsVPUniversalCurrencyCenter /> },
    { path: Web.VP_REDEMPTION_MARKETPLACE_CHARITY_HUB_ROUTE, element: <VPRedemptionMarketplaceCharityHub /> },
    { path: Web.DIRECT_MESSAGING_CENTER_ROUTE, element: <DirectMessagingCenter /> },
    { path: Web.NOTIFICATION_CENTER_HUB_ROUTE, element: <NotificationCenterHub /> },
    { path: Web.FRIENDS_MANAGEMENT_HUB_ROUTE, element: <FriendsManagementHub /> },
    { path: Web.SOCIAL_ACTIVITY_TIMELINE_ROUTE, element: <SocialActivityTimeline /> },
    { path: Web.ADMIN_CONTROL_CENTER_ROUTE, element: <AdminControlCenter /> },
    { path: Web.STATUS_ROUTE, element: <PublicStatusPage /> },
    { path: Web.PUBLIC_STATUS_PAGE_ROUTE, element: <PublicStatusPage /> },
    { path: Web.MULTI_AUTHENTICATION_GATEWAY_ROUTE, element: <MultiAuthenticationGateway /> },
    { path: Web.USER_SECURITY_CENTER_ROUTE, element: <UserSecurityCenter /> },
    { path: Web.CENTRALIZED_SUPPORT_TICKETING_SYSTEM_ROUTE, element: <CentralizedSupportTicketingSystem /> },
    { path: Web.JOLTS_VIDEO_STUDIO_ROUTE, element: <React.Suspense fallback={<div />}><JoltsVideoStudio /></React.Suspense> },
  ];
}
