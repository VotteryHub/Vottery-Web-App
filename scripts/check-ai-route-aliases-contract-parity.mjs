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
  "export const ADVANCED_ML_THREAT_DETECTION_CENTER_ROUTE = '/advanced-ml-threat-detection-center';",
  'web advanced ML threat route constant'
);
assertContains(
  navigationHubRoutes,
  "export const ZONE_SPECIFIC_THREAT_HEATMAPS_DASHBOARD_ROUTE = '/zone-specific-threat-heatmaps-dashboard';",
  'web zone threat heatmaps route constant'
);
assertContains(
  navigationHubRoutes,
  "export const PERPLEXITY_MARKET_RESEARCH_INTELLIGENCE_CENTER_ROUTE = '/perplexity-market-research-intelligence-center';",
  'web perplexity market research route constant'
);
assertContains(
  navigationHubRoutes,
  "export const PREDICTION_ANALYTICS_DASHBOARD_ROUTE = '/prediction-analytics-dashboard';",
  'web prediction analytics route constant'
);
assertMatches(
  navigationHubRoutes,
  /PREDICTIVE_ANOMALY_ALERTING_DEVIATION_MONITORING_HUB_ROUTE[\s\S]*\/predictive-anomaly-alerting-deviation-monitoring-hub/,
  'web predictive anomaly route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CONTINUOUS_ML_FEEDBACK_OUTCOME_LEARNING_CENTER_ROUTE = '/continuous-ml-feedback-outcome-learning-center';",
  'web continuous ML feedback route constant'
);

assertContains(
  routeFeatureKeys,
  "'advanced-ml-threat-detection-center': 'fraud_detection_alert_management_center'",
  'web advanced ML threat feature key'
);
assertContains(
  routeFeatureKeys,
  "'zone-specific-threat-heatmaps-dashboard': 'fraud_detection_alert_management_center'",
  'web zone heatmaps feature key'
);
assertContains(
  routeFeatureKeys,
  "'perplexity-market-research-intelligence-center': 'advanced_perplexity_fraud_intelligence_center'",
  'web market research feature key'
);
assertContains(
  routeFeatureKeys,
  "'prediction-analytics-dashboard': 'advanced_perplexity_fraud_forecasting_center'",
  'web prediction analytics feature key'
);
assertContains(
  routeFeatureKeys,
  "'predictive-anomaly-alerting-deviation-monitoring-hub': 'fraud_detection_alert_management_center'",
  'web predictive anomaly feature key'
);
assertContains(
  routeFeatureKeys,
  "'continuous-ml-feedback-outcome-learning-center': 'advanced_perplexity_fraud_intelligence_center'",
  'web continuous ML feedback feature key'
);

assertContains(
  appRoutes,
  'static const String advancedMlThreatDetectionCenterWebCanonical =',
  'mobile advanced ML threat canonical route'
);
assertContains(
  appRoutes,
  'static const String zoneSpecificThreatHeatmapsDashboardWebCanonical =',
  'mobile zone heatmaps canonical route'
);
assertContains(
  appRoutes,
  'static const String predictionAnalyticsDashboardWebCanonical =',
  'mobile prediction analytics canonical route'
);
assertContains(
  appRoutes,
  'static const String perplexityMarketResearchIntelligenceCenterWebCanonical =',
  'mobile market research canonical route'
);
assertContains(
  appRoutes,
  'static const String predictiveAnomalyAlertingDeviationMonitoringHubWebCanonical =',
  'mobile predictive anomaly canonical route'
);
assertContains(
  appRoutes,
  'static const String continuousMlFeedbackOutcomeLearningCenterWebCanonical =',
  'mobile continuous ML feedback canonical route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.advancedMlThreatDetectionCenterWebCanonical:',
  'mobile registry advanced ML threat mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.zoneSpecificThreatHeatmapsDashboardWebCanonical:',
  'mobile registry zone heatmaps mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.predictionAnalyticsDashboardWebCanonical:',
  'mobile registry prediction analytics mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.perplexityMarketResearchIntelligenceCenterWebCanonical:',
  'mobile registry market research mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.predictiveAnomalyAlertingDeviationMonitoringHubWebCanonical:',
  'mobile registry predictive anomaly mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.continuousMlFeedbackOutcomeLearningCenterWebCanonical:',
  'mobile registry continuous ML feedback mapping'
);

assertContains(
  appUrls,
  'static const String advancedMlThreatDetectionCenter =',
  'mobile URL advanced ML threat constant'
);
assertContains(
  appUrls,
  'static const String zoneSpecificThreatHeatmapsDashboard =',
  'mobile URL zone heatmaps constant'
);
assertContains(
  appUrls,
  'static const String predictionAnalyticsDashboard =',
  'mobile URL prediction analytics constant'
);
assertContains(
  appUrls,
  'static const String perplexityMarketResearchIntelligenceCenter =',
  'mobile URL market research constant'
);
assertContains(
  appUrls,
  'static const String predictiveAnomalyAlertingDeviationMonitoringHub =',
  'mobile URL predictive anomaly constant'
);
assertContains(
  appUrls,
  'static const String continuousMlFeedbackOutcomeLearningCenter =',
  'mobile URL continuous ML feedback constant'
);

assertContains(
  evidenceScript,
  'const aiRouteAliasesParityIds = new Set([148, 149, 155, 151, 144, 203]);',
  'AI route aliases mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-ai-route-aliases-contract-parity.mjs'",
  'AI route aliases node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/ai_route_aliases_contract_test.dart'",
  'AI route aliases flutter evidence token'
);

console.log('AI route aliases contract parity checks passed (Web <-> Mobile).');
