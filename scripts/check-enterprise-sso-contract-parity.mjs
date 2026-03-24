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
  "export const ENTERPRISE_SSO_INTEGRATION_HUB_ROUTE = '/enterprise-sso-integration-hub';",
  'web enterprise SSO route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ENTERPRISE_OPERATIONS_CENTER_ROUTE = '/enterprise-operations-center';",
  'web enterprise operations route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ENTERPRISE_ANALYTICS_HUB_ROUTE = '/enterprise-analytics-hub';",
  'web enterprise analytics route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ENTERPRISE_API_ACCESS_CENTER_ROUTE = '/enterprise-api-access-center';",
  'web enterprise API access route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ENTERPRISE_COMPLIANCE_REPORTS_CENTER_ROUTE = '/enterprise-compliance-reports-center';",
  'web enterprise compliance route constant'
);

assertContains(
  routeFeatureKeys,
  "'enterprise-sso-integration-hub': 'enterprise_sso'",
  'web enterprise SSO feature key'
);
assertContains(
  routeFeatureKeys,
  "'enterprise-operations-center': 'enterprise_white_label'",
  'web enterprise operations feature key'
);
assertContains(
  routeFeatureKeys,
  "'enterprise-analytics-hub': 'enterprise_white_label'",
  'web enterprise analytics feature key'
);
assertContains(
  routeFeatureKeys,
  "'enterprise-api-access-center': 'enterprise_white_label'",
  'web enterprise API feature key'
);
assertContains(
  routeFeatureKeys,
  "'enterprise-compliance-reports-center': 'enterprise_white_label'",
  'web enterprise compliance feature key'
);

assertContains(
  appRoutes,
  'static const String enterpriseSsoIntegrationWebCanonical =',
  'mobile enterprise SSO canonical route'
);
assertContains(
  appRoutes,
  'static const String enterpriseAnalyticsHubWebCanonical =',
  'mobile enterprise analytics canonical route'
);
assertContains(
  appRoutes,
  'static const String enterpriseApiAccessCenterWebCanonical =',
  'mobile enterprise API canonical route'
);
assertContains(
  appRoutes,
  'static const String enterpriseComplianceReportsCenterWebCanonical =',
  'mobile enterprise compliance canonical route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.enterpriseSsoIntegrationWebCanonical:',
  'mobile registry enterprise SSO mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.enterpriseAnalyticsHubWebCanonical:',
  'mobile registry enterprise analytics mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.enterpriseApiAccessCenterWebCanonical:',
  'mobile registry enterprise API mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.enterpriseComplianceReportsCenterWebCanonical:',
  'mobile registry enterprise compliance mapping'
);

assertContains(
  appUrls,
  'static const String enterpriseSsoIntegrationHub =',
  'mobile URL enterprise SSO constant'
);
assertContains(
  appUrls,
  'static const String enterpriseOperationsCenter =',
  'mobile URL enterprise operations constant'
);
assertContains(
  appUrls,
  'static const String enterpriseAnalyticsHub =',
  'mobile URL enterprise analytics constant'
);
assertContains(
  appUrls,
  'static const String enterpriseApiAccessCenter =',
  'mobile URL enterprise API constant'
);
assertContains(
  appUrls,
  'static const String enterpriseComplianceReportsCenter =',
  'mobile URL enterprise compliance constant'
);

assertContains(
  evidenceScript,
  'const enterpriseSsoRouteFlowIds = new Set([88]);',
  'enterprise SSO mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-enterprise-sso-contract-parity.mjs'",
  'enterprise SSO node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/enterprise_sso_contract_test.dart'",
  'enterprise SSO flutter evidence token'
);

console.log('Enterprise SSO contract parity checks passed (Web <-> Mobile).');
