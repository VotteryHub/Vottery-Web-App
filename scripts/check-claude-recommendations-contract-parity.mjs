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
  "export const CLAUDE_AI_FEED_INTELLIGENCE_CENTER_ROUTE = '/claude-ai-feed-intelligence-center';",
  'web Claude feed route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CONTEXT_AWARE_CLAUDE_RECOMMENDATIONS_OVERLAY_ROUTE = '/context-aware-claude-recommendations-overlay';",
  'web Claude contextual overlay route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CLAUDE_AI_CONTENT_CURATION_INTELLIGENCE_CENTER_ROUTE = '/claude-ai-content-curation-intelligence-center';",
  'web Claude curation route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CLAUDE_MODEL_COMPARISON_CENTER_ROUTE = '/claude-model-comparison-center';",
  'web Claude model comparison route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CLAUDE_CONTENT_OPTIMIZATION_ENGINE_ROUTE = '/claude-content-optimization-engine';",
  'web Claude optimization route constant'
);
assertContains(
  navigationHubRoutes,
  "export const CLAUDE_DECISION_REASONING_HUB_ROUTE = '/claude-decision-reasoning-hub';",
  'web Claude decision route constant'
);

assertContains(
  routeFeatureKeys,
  "'claude-ai-feed-intelligence-center': 'claude_ai_feed_intelligence_center'",
  'web Claude feed feature key'
);
assertContains(
  routeFeatureKeys,
  "'context-aware-claude-recommendations-overlay': 'context_aware_claude_recommendations_overlay'",
  'web Claude contextual overlay feature key'
);
assertContains(
  routeFeatureKeys,
  "'claude-ai-content-curation-intelligence-center': 'anthropic_content_intelligence_center'",
  'web Claude curation feature key'
);
assertContains(
  routeFeatureKeys,
  "'claude-model-comparison-center': 'claude_ai_feed_intelligence_center'",
  'web Claude model comparison feature key'
);
assertContains(
  routeFeatureKeys,
  "'claude-content-optimization-engine': 'content_quality_scoring_claude'",
  'web Claude optimization feature key'
);
assertContains(
  routeFeatureKeys,
  "'claude-decision-reasoning-hub': 'claude_decision_reasoning_hub'",
  'web Claude decision feature key'
);

assertContains(
  appRoutes,
  'static const String claudeAiFeedIntelligenceCenterWebCanonical =',
  'mobile Claude feed canonical route'
);
assertContains(
  appRoutes,
  'static const String contextAwareClaudeRecommendationsOverlayWebCanonical =',
  'mobile Claude contextual overlay canonical route'
);
assertContains(
  appRoutes,
  'static const String claudeAiContentCurationIntelligenceCenterWebCanonical =',
  'mobile Claude curation canonical route'
);
assertContains(
  appRoutes,
  'static const String claudeModelComparisonCenterWebCanonical =',
  'mobile Claude model comparison canonical route'
);
assertContains(
  appRoutes,
  'static const String claudeContentOptimizationEngineWebCanonical =',
  'mobile Claude optimization canonical route'
);
assertContains(
  appRoutes,
  "static const String claudeDecisionReasoningHub =",
  'mobile Claude decision route'
);

assertContains(
  routeRegistry,
  'case AppRoutes.claudeAiFeedIntelligenceCenterWebCanonical:',
  'mobile registry Claude feed mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.contextAwareClaudeRecommendationsOverlayWebCanonical:',
  'mobile registry Claude contextual overlay mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.claudeAiContentCurationIntelligenceCenterWebCanonical:',
  'mobile registry Claude curation mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.claudeModelComparisonCenterWebCanonical:',
  'mobile registry Claude model comparison mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.claudeContentOptimizationEngineWebCanonical:',
  'mobile registry Claude optimization mapping'
);
assertContains(
  routeRegistry,
  'case AppRoutes.claudeDecisionReasoningHub:',
  'mobile registry Claude decision mapping'
);

assertContains(
  appUrls,
  'static const String claudeAiFeedIntelligenceCenter =',
  'mobile URL Claude feed constant'
);
assertContains(
  appUrls,
  'static const String contextAwareClaudeRecommendationsOverlay =',
  'mobile URL Claude contextual overlay constant'
);
assertContains(
  appUrls,
  'static const String claudeAiContentCurationIntelligenceCenter =',
  'mobile URL Claude curation constant'
);
assertContains(
  appUrls,
  'static const String claudeModelComparisonCenter =',
  'mobile URL Claude model comparison constant'
);
assertContains(
  appUrls,
  'static const String claudeContentOptimizationEngine =',
  'mobile URL Claude optimization constant'
);
assertContains(
  appUrls,
  'static const String claudeDecisionReasoningHub =',
  'mobile URL Claude decision constant'
);

assertContains(
  evidenceScript,
  'const claudeRecommendationsFlowIds = new Set([24, 141, 142, 201]);',
  'Claude recommendations mapped IDs'
);
assertContains(
  evidenceScript,
  "'node:scripts/check-claude-recommendations-contract-parity.mjs'",
  'Claude recommendations node evidence token'
);
assertContains(
  evidenceScript,
  "'flutter:test/navigation/claude_recommendations_contract_test.dart'",
  'Claude recommendations flutter evidence token'
);

console.log('Claude recommendations contract parity checks passed (Web <-> Mobile).');
