import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

const read = (p) => fs.readFileSync(p, 'utf8');
const assertContains = (haystack, needle, label) => {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
};
const assertMatches = (haystack, regex, label) => {
  if (!regex.test(haystack)) {
    throw new Error(`Missing ${label}: ${regex}`);
  }
};

const navigationHubRoutes = read(
  path.resolve(webRoot, 'src', 'constants', 'navigationHubRoutes.js')
);
const routeFeatureKeys = read(
  path.resolve(webRoot, 'src', 'config', 'routeFeatureKeys.js')
);
const appRoutes = read(path.resolve(mobileRoot, 'lib', 'routes', 'app_routes.dart'));
const routeRegistry = read(
  path.resolve(mobileRoot, 'lib', 'config', 'route_registry.dart')
);
const appUrls = read(path.resolve(mobileRoot, 'lib', 'constants', 'app_urls.dart'));
const evidenceScript = read(
  path.resolve(webRoot, 'scripts', 'apply-regression-evidence.mjs')
);

assertContains(
  navigationHubRoutes,
  "export const USER_PROFILE_HUB_ROUTE = '/user-profile-hub';",
  'web user profile route constant'
);
assertContains(
  navigationHubRoutes,
  "export const UNIFIED_GAMIFICATION_DASHBOARD_ROUTE = '/unified-gamification-dashboard';",
  'web unified gamification route constant'
);
assertMatches(
  navigationHubRoutes,
  /DYNAMIC_QUEST_MANAGEMENT_DASHBOARD_ROUTE[\s\S]*\/dynamic-quest-management-dashboard/,
  'web quest management route constant'
);
assertMatches(
  navigationHubRoutes,
  /VP_ECONOMY_HEALTH_MONITOR_DASHBOARD_ROUTE[\s\S]*\/vp-economy-health-monitor-dashboard/,
  'web VP economy route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CREATOR_SUCCESS_ACADEMY_ROUTE = '/creator-success-academy';",
  'web creator success route constant'
);
assertContains(
  navigationHubRoutes,
  "export const NOTIFICATION_CENTER_HUB_ROUTE = '/notification-center-hub';",
  'web notification center route constant'
);
assertMatches(
  navigationHubRoutes,
  /PREDICTION_POOL_NOTIFICATIONS_HUB_ROUTE[\s\S]*\/prediction-pool-notifications-hub/,
  'web prediction pool notifications route constant'
);
assertContains(
  navigationHubRoutes,
  "export const COMPREHENSIVE_GAMIFICATION_ADMIN_CONTROL_CENTER_ROUTE =",
  'web comprehensive gamification admin route constant'
);

assertContains(
  routeFeatureKeys,
  "'user-profile-hub': 'user_profile_hub'",
  'web user profile feature key'
);
assertContains(
  routeFeatureKeys,
  "'unified-gamification-dashboard': 'unified_gamification_dashboard'",
  'web unified gamification feature key'
);
assertContains(
  routeFeatureKeys,
  "'dynamic-quest-management-dashboard': 'dynamic_quest_management_dashboard'",
  'web quest management feature key'
);
assertContains(
  routeFeatureKeys,
  "'vp-economy-health-monitor-dashboard': 'gamified_elections'",
  'web VP economy feature key'
);
assertContains(
  routeFeatureKeys,
  "'creator-success-academy': 'creator_success_academy'",
  'web creator success feature key'
);
assertContains(
  routeFeatureKeys,
  "'notification-center-hub': 'notification_center_hub'",
  'web notification center feature key'
);
assertContains(
  routeFeatureKeys,
  "'prediction-pool-notifications-hub': 'prediction_pools'",
  'web prediction pool notifications feature key'
);

assertContains(
  appRoutes,
  'static const String userProfileWebCanonical =',
  'mobile user profile canonical route'
);
assertContains(
  appRoutes,
  'static const String unifiedGamificationDashboardWebCanonical =',
  'mobile unified gamification canonical route'
);
assertContains(
  appRoutes,
  'static const String questManagementDashboardWebCanonical =',
  'mobile quest management canonical route'
);
assertContains(
  appRoutes,
  'static const String vpEconomyHealthMonitorWebCanonical =',
  'mobile VP economy canonical route'
);
assertContains(
  appRoutes,
  'static const String creatorSuccessAcademyWebCanonical =',
  'mobile creator success canonical route'
);
assertContains(
  appRoutes,
  'static const String notificationCenterHubWebCanonical =',
  'mobile notification center canonical route'
);
assertContains(
  appRoutes,
  'static const String predictionPoolNotificationsHubWebCanonical =',
  'mobile prediction pool notifications canonical route'
);
assertContains(
  appRoutes,
  'static const String comprehensiveGamificationAdminControlCenterWebCanonical =',
  'mobile comprehensive gamification admin canonical route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.userProfileWebCanonical:',
  'mobile registry user profile mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.unifiedGamificationDashboardWebCanonical:',
  'mobile registry unified gamification mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.questManagementDashboardWebCanonical:',
  'mobile registry quest management mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.vpEconomyHealthMonitorWebCanonical:',
  'mobile registry VP economy mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.creatorSuccessAcademyWebCanonical:',
  'mobile registry creator success mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.notificationCenterHubWebCanonical:',
  'mobile registry notification center mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.predictionPoolNotificationsHubWebCanonical:',
  'mobile registry prediction pool notifications mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.comprehensiveGamificationAdminControlCenterWebCanonical:',
  'mobile registry comprehensive gamification admin mapping'
);

assertContains(appUrls, 'static const String userProfileHub =', 'mobile URL user profile constant');
assertContains(
  appUrls,
  'static const String unifiedGamificationDashboard =',
  'mobile URL unified gamification constant'
);
assertContains(
  appUrls,
  'static const String dynamicQuestManagementDashboard =',
  'mobile URL quest management constant'
);
assertContains(
  appUrls,
  'static const String vpEconomyHealthMonitorDashboard =',
  'mobile URL VP economy constant'
);
assertContains(
  appUrls,
  'static const String creatorSuccessAcademy =',
  'mobile URL creator success constant'
);
assertContains(
  appUrls,
  'static const String notificationCenterHub =',
  'mobile URL notification center constant'
);
assertContains(
  appUrls,
  'static const String predictionPoolNotificationsHub =',
  'mobile URL prediction pool notifications constant'
);
assertContains(
  appUrls,
  'static const String comprehensiveGamificationAdminControlCenter =',
  'mobile URL comprehensive gamification admin constant'
);

assertContains(
  evidenceScript,
  'const achievementUnlockFlowIds = new Set([27, 33, 34, 35, 36, 43, 49, 68, 180]);',
  'achievement unlock mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-achievement-unlock-contract-parity.mjs'",
  'achievement unlock node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/achievement_unlock_contract_test.dart'",
  'achievement unlock flutter evidence token'
);

console.log('Achievement unlock contract parity checks passed (Web <-> Mobile).');
