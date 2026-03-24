import fs from 'node:fs';
import path from 'node:path';

const webRoot = process.cwd();
const mobileRoot = path.resolve(webRoot, '..', 'Vottery-Mobile-App');

const read = (p) => fs.readFileSync(p, 'utf8');
function assertContains(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

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
  "export const UNIFIED_AI_DECISION_ORCHESTRATION_COMMAND_CENTER_ROUTE = '/unified-ai-decision-orchestration-command-center';",
  'web unified AI decision route constant'
);
assertContains(
  navigationHubRoutes,
  "export const UNIFIED_AI_ORCHESTRATION_COMMAND_CENTER_ROUTE = '/unified-ai-orchestration-command-center';",
  'web unified AI orchestration route constant'
);
assertContains(
  navigationHubRoutes,
  "export const AUTOMATIC_AI_FAILOVER_ENGINE_CONTROL_CENTER_ROUTE = '/automatic-ai-failover-engine-control-center';",
  'web automatic AI failover route constant'
);
assertContains(
  navigationHubRoutes,
  "export const AI_PERFORMANCE_ORCHESTRATION_DASHBOARD_ROUTE = '/ai-performance-orchestration-dashboard';",
  'web AI performance orchestration route constant'
);
assertContains(
  navigationHubRoutes,
  "export const UNIFIED_INCIDENT_RESPONSE_ORCHESTRATION_CENTER_ROUTE = '/unified-incident-response-orchestration-center';",
  'web unified incident response orchestration route constant'
);

assertContains(
  routeFeatureKeys,
  "'unified-ai-decision-orchestration-command-center':",
  'web unified AI decision feature key'
);
assertContains(
  routeFeatureKeys,
  "'unified-ai-orchestration-command-center':",
  'web unified AI orchestration feature key'
);
assertContains(
  routeFeatureKeys,
  "'automatic-ai-failover-engine-control-center': 'live_platform_monitoring_dashboard'",
  'web automatic AI failover feature key'
);
assertContains(
  routeFeatureKeys,
  "'ai-performance-orchestration-dashboard': 'real_time_performance_testing_suite'",
  'web AI performance feature key'
);
assertContains(
  routeFeatureKeys,
  "'unified-incident-response-orchestration-center': 'unified_incident_response_orchestration_center'",
  'web unified incident response feature key'
);

assertContains(
  appRoutes,
  'static const String unifiedAiDecisionOrchestrationCommandCenterWebCanonical =',
  'mobile unified AI decision canonical route'
);
assertContains(
  appRoutes,
  'static const String unifiedAiOrchestrationCommandCenterWebCanonical =',
  'mobile unified AI orchestration canonical route'
);
assertContains(
  appRoutes,
  'static const String automaticAiFailoverEngineControlCenterWebCanonical =',
  'mobile automatic AI failover canonical route'
);
assertContains(
  appRoutes,
  'static const String aiPerformanceOrchestrationDashboardWebCanonical =',
  'mobile AI performance canonical route'
);
assertContains(
  appRoutes,
  'static const String unifiedIncidentResponseOrchestrationCenterWebCanonical =',
  'mobile unified incident response canonical route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.unifiedAiDecisionOrchestrationCommandCenterWebCanonical:',
  'mobile registry unified AI decision mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.unifiedAiOrchestrationCommandCenterWebCanonical:',
  'mobile registry unified AI orchestration mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.automaticAiFailoverEngineControlCenterWebCanonical:',
  'mobile registry automatic AI failover mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.aiPerformanceOrchestrationDashboardWebCanonical:',
  'mobile registry AI performance mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.unifiedIncidentResponseOrchestrationCenterWebCanonical:',
  'mobile registry incident response mapping'
);

assertContains(
  appUrls,
  'static const String unifiedAiDecisionOrchestrationCommandCenter =',
  'mobile URL unified AI decision constant'
);
assertContains(
  appUrls,
  'static const String unifiedAiOrchestrationCommandCenter =',
  'mobile URL unified AI orchestration constant'
);
assertContains(
  appUrls,
  'static const String automaticAiFailoverEngineControlCenter =',
  'mobile URL automatic AI failover constant'
);
assertContains(
  appUrls,
  'static const String aiPerformanceOrchestrationDashboard =',
  'mobile URL AI performance constant'
);
assertContains(
  appUrls,
  'static const String unifiedIncidentResponseOrchestrationCenter =',
  'mobile URL unified incident response constant'
);

assertContains(
  evidenceScript,
  'const aiOrchestrationFailoverIds = new Set([196, 197, 198, 199, 200, 201]);',
  'AI orchestration mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-ai-orchestration-contract-parity.mjs'",
  'AI orchestration node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/ai_orchestration_contract_test.dart'",
  'AI orchestration flutter evidence token'
);

console.log('AI orchestration contract parity checks passed (Web <-> Mobile).');
