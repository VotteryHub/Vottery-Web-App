import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertContains(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

const routeConstants = read(
  path.resolve(webRoot, 'src', 'constants', 'navigationHubRoutes.js')
);
const routeFeatureKeys = read(
  path.resolve(webRoot, 'src', 'config', 'routeFeatureKeys.js')
);
const appRoutes = read(
  path.resolve(mobileRoot, 'lib', 'routes', 'app_routes.dart')
);
const routeRegistry = read(
  path.resolve(mobileRoot, 'lib', 'config', 'route_registry.dart')
);
const appUrls = read(
  path.resolve(mobileRoot, 'lib', 'constants', 'app_urls.dart')
);
const evidenceScript = read(
  path.resolve(webRoot, 'scripts', 'apply-regression-evidence.mjs')
);

// Web constants
assertContains(
  routeConstants,
  "export const SMS_WEBHOOK_DELIVERY_ANALYTICS_HUB_ROUTE = '/sms-webhook-delivery-analytics-hub';",
  'web sms webhook route constant'
);
assertContains(
  routeConstants,
  "export const SMS_EMERGENCY_ALERTS_HUB_ROUTE = '/sms-emergency-alerts-hub';",
  'web sms emergency route constant'
);
assertContains(
  routeConstants,
  "export const TELNYX_SMS_PROVIDER_MANAGEMENT_CENTER_ROUTE = '/telnyx-sms-provider-management-center';",
  'web telnyx route constant'
);
assertContains(
  routeConstants,
  "export const CUSTOM_ALERT_RULES_ENGINE_ROUTE = '/custom-alert-rules-engine';",
  'web alert rules route constant'
);
assertContains(
  routeConstants,
  "export const ADVANCED_CUSTOM_ALERT_RULES_ENGINE_ROUTE = '/advanced-custom-alert-rules-engine';",
  'web advanced alert rules route constant'
);
assertContains(
  routeConstants,
  "export const UNIFIED_ALERT_MANAGEMENT_CENTER_ROUTE = '/unified-alert-management-center';",
  'web unified alert center route constant'
);

// Web feature keys
assertContains(
  routeFeatureKeys,
  "'sms-webhook-delivery-analytics-hub': 'unified_alert_management_center'",
  'web sms webhook feature key'
);
assertContains(
  routeFeatureKeys,
  "'sms-emergency-alerts-hub': 'unified_alert_management_center'",
  'web sms emergency feature key'
);
assertContains(
  routeFeatureKeys,
  "'telnyx-sms-provider-management-center': 'unified_alert_management_center'",
  'web telnyx feature key'
);

// Mobile web-canonical routes
assertContains(
  appRoutes,
  "static const String smsWebhookDeliveryAnalyticsHubWebCanonical =",
  'mobile sms webhook canonical route'
);
assertContains(
  appRoutes,
  "static const String smsEmergencyAlertsHubWebCanonical =",
  'mobile sms emergency canonical route'
);
assertContains(
  appRoutes,
  "static const String telnyxSmsProviderManagementCenterWebCanonical =",
  'mobile telnyx canonical route'
);
assertContains(
  appRoutes,
  "static const String customAlertRulesEngineWebCanonical =",
  'mobile custom alert canonical route'
);
assertContains(
  appRoutes,
  "static const String advancedCustomAlertRulesEngineWebCanonical =",
  'mobile advanced alert canonical route'
);
assertContains(
  appRoutes,
  "static const String unifiedAlertManagementCenterWebCanonical =",
  'mobile unified alert canonical route'
);

// Mobile registry parity
assertContains(
  routeRegistry,
  'case AppRoutes.smsWebhookDeliveryAnalyticsHubWebCanonical:',
  'mobile registry sms webhook canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.smsEmergencyAlertsHubWebCanonical:',
  'mobile registry sms emergency canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.telnyxSmsProviderManagementCenterWebCanonical:',
  'mobile registry telnyx canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.customAlertRulesEngineWebCanonical:',
  'mobile registry custom alert canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.advancedCustomAlertRulesEngineWebCanonical:',
  'mobile registry advanced alert canonical mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.unifiedAlertManagementCenterWebCanonical:',
  'mobile registry unified alert canonical mapping'
);

// Mobile URL constants
assertContains(
  appUrls,
  'static const String smsWebhookDeliveryAnalyticsHub =',
  'mobile app URL sms webhook constant'
);
assertContains(
  appUrls,
  'static const String smsEmergencyAlertsHub =',
  'mobile app URL sms emergency constant'
);
assertContains(
  appUrls,
  'static const String telnyxSmsProviderManagementCenter =',
  'mobile app URL telnyx constant'
);
assertContains(
  appUrls,
  'static const String customAlertRulesEngine =',
  'mobile app URL custom alert constant'
);
assertContains(
  appUrls,
  'static const String advancedCustomAlertRulesEngine =',
  'mobile app URL advanced alert constant'
);
assertContains(
  appUrls,
  'static const String unifiedAlertManagementCenter =',
  'mobile app URL unified alert constant'
);

// Evidence map checks for AMBER tranche IDs.
assertContains(
  evidenceScript,
  'const smsProviderFailoverIds = new Set([218, 219, 221, 222, 223]);',
  'sms failover mapped IDs'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/sms_alerts_contract_test.dart'",
  'sms flutter evidence token'
);

console.log('SMS/alert contract parity checks passed (Web <-> Mobile).');
