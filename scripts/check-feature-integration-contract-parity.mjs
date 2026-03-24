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
  "export const ADMIN_PLATFORM_LOGS_CENTER_ROUTE = '/admin-platform-logs-center';",
  'web admin platform logs route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ANALYTICS_EXPORT_REPORTING_HUB_ROUTE = '/analytics-export-reporting-hub';",
  'web analytics export route constant'
);
assertContains(
  navigationHubRoutes,
  "export const WEBHOOK_INTEGRATION_HUB_ROUTE = '/webhook-integration-hub';",
  'web webhook integration route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ADVANCED_WEBHOOK_ORCHESTRATION_HUB_ROUTE = '/advanced-webhook-orchestration-hub';",
  'web advanced webhook route constant'
);
assertContains(
  navigationHubRoutes,
  "export const EXECUTIVE_REPORTING_COMPLIANCE_AUTOMATION_HUB_ROUTE = '/executive-reporting-compliance-automation-hub';",
  'web executive reporting compliance route constant'
);
assertContains(
  navigationHubRoutes,
  "export const AUTOMATED_EXECUTIVE_REPORTING_CLAUDE_INTELLIGENCE_HUB_ROUTE = '/automated-executive-reporting-claude-intelligence-hub';",
  'web automated executive reporting Claude route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CROSS_DOMAIN_DATA_SYNC_HUB_ROUTE = '/cross-domain-data-sync-hub';",
  'web cross-domain sync route constant'
);

assertContains(
  routeFeatureKeys,
  "'admin-platform-logs-center': 'admin_platform_logs_center'",
  'web admin platform logs feature key'
);
assertContains(
  routeFeatureKeys,
  "'analytics-export-reporting-hub': 'analytics_export_reporting_hub'",
  'web analytics export feature key'
);
assertContains(
  routeFeatureKeys,
  "'webhook-integration-hub': 'analytics_export_reporting_hub'",
  'web webhook integration feature key'
);
assertContains(
  routeFeatureKeys,
  "'advanced-webhook-orchestration-hub': 'analytics_export_reporting_hub'",
  'web advanced webhook feature key'
);
assertContains(
  routeFeatureKeys,
  "'executive-reporting-compliance-automation-hub': 'analytics_export_reporting_hub'",
  'web executive reporting compliance feature key'
);
assertContains(
  routeFeatureKeys,
  "'automated-executive-reporting-claude-intelligence-hub': 'analytics_export_reporting_hub'",
  'web automated executive reporting Claude feature key'
);

assertContains(
  appRoutes,
  'static const String adminPlatformLogsCenterWebCanonical =',
  'mobile admin platform logs canonical route'
);
assertContains(
  appRoutes,
  'static const String analyticsExportReportingHubWebCanonical =',
  'mobile analytics export canonical route'
);
assertContains(
  appRoutes,
  'static const String webhookIntegrationHubWebCanonical =',
  'mobile webhook integration canonical route'
);
assertContains(
  appRoutes,
  'static const String advancedWebhookOrchestrationHubWebCanonical =',
  'mobile advanced webhook canonical route'
);
assertContains(
  appRoutes,
  'static const String executiveReportingComplianceAutomationHubWebCanonical =',
  'mobile executive reporting compliance canonical route'
);
assertContains(
  appRoutes,
  'static const String automatedExecutiveReportingClaudeIntelligenceHubWebCanonical =',
  'mobile automated executive reporting Claude canonical route'
);
assertContains(
  appRoutes,
  "static const String crossDomainDataSyncHub = '/crossDomainDataSyncHub';",
  'mobile cross-domain sync route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.adminPlatformLogsCenterWebCanonical:',
  'mobile registry admin platform logs mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.analyticsExportReportingHubWebCanonical:',
  'mobile registry analytics export mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.webhookIntegrationHubWebCanonical:',
  'mobile registry webhook integration mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.advancedWebhookOrchestrationHubWebCanonical:',
  'mobile registry advanced webhook mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.executiveReportingComplianceAutomationHubWebCanonical:',
  'mobile registry executive reporting compliance mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.automatedExecutiveReportingClaudeIntelligenceHubWebCanonical:',
  'mobile registry automated executive reporting Claude mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.crossDomainDataSyncHub:',
  'mobile registry cross-domain sync mapping'
);

assertContains(
  appUrls,
  'static const String adminPlatformLogsCenter =',
  'mobile URL admin platform logs constant'
);
assertContains(
  appUrls,
  'static const String analyticsExportReportingHub =',
  'mobile URL analytics export constant'
);
assertContains(
  appUrls,
  'static const String webhookIntegrationHub =',
  'mobile URL webhook integration constant'
);
assertContains(
  appUrls,
  'static const String advancedWebhookOrchestrationHub =',
  'mobile URL advanced webhook constant'
);
assertContains(
  appUrls,
  'static const String executiveReportingComplianceAutomationHub =',
  'mobile URL executive reporting compliance constant'
);
assertContains(
  appUrls,
  'static const String automatedExecutiveReportingClaudeIntelligenceHub =',
  'mobile URL automated executive reporting Claude constant'
);
assertContains(
  appUrls,
  'static const String crossDomainDataSyncHub =',
  'mobile URL cross-domain sync constant'
);

assertContains(
  evidenceScript,
  'const featureIntegrationSuiteIds = new Set([42, 78, 96, 175, 187, 193, 207]);',
  'feature integration mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-feature-integration-contract-parity.mjs'",
  'feature integration node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/feature_integration_contract_test.dart'",
  'feature integration flutter evidence token'
);

console.log('Feature integration contract parity checks passed (Web <-> Mobile).');
