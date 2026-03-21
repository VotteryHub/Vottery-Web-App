# Claude / Gemini / AI ops routes — placeholder removal (Mar 2026)

Former `AIPlaceholderCenter` Web routes are wired to **real page modules**. Mobile **web-canonical** path constants resolve in `screenForRoute()` to the closest functional screens.

## Web (`src/Routes.jsx`)

| Path | Component |
|------|-----------|
| `/anthropic-claude-revenue-risk-intelligence-center` | `RegionalRevenueAnalyticsDashboard` |
| `/claude-analytics-dashboard-for-campaign-intelligence` | `ClaudeAnalyticsDashboardForCampaignIntelligence` |
| `/claude-predictive-analytics-dashboard` | `ClaudePredictiveAnalyticsDashboard` |
| `/claude-ai-content-curation-intelligence-center` | `ClaudeAIContentCurationIntelligenceCenter` |
| `/claude-model-comparison-center` | `ClaudeModelComparisonCenter` |
| `/claude-content-optimization-engine` | `ClaudeContentOptimizationEngine` |
| `/automatic-ai-failover-engine-control-center` | `AutomaticAIFailoverEngineControlCenter` (wraps `GeminiFallbackOrchestrationHub` + `HeaderNavigation`) |
| `/ai-performance-orchestration-dashboard` | `AIPerformanceOrchestrationDashboard` (multi-provider metrics via `GeminiMonitoringService`) |
| `/ai-powered-performance-advisor-hub` | `FeaturePerformanceDashboard` |
| `/open-ai-carousel-content-intelligence-center` | `ContentDistributionControlCenter` |
| `/autonomous-claude-agent-orchestration-hub` | `UnifiedAIOrchestrationCommandCenter` (alias of `/unified-ai-orchestration-command-center`) |
| `/enhanced-real-time-behavioral-heatmaps-center` | `ZoneSpecificThreatHeatmapsDashboard` |
| `/gemini-cost-efficiency-analyzer-case-report-generator` | `GeminiCostEfficiencyAnalyzerCaseReportGenerator` |

## Mobile (`lib/routes/app_routes.dart` + `route_registry.dart`)

| Web-canonical path | Screen |
|--------------------|--------|
| `/anthropic-claude-revenue-risk-intelligence-center` | `CreatorRevenueForecastingDashboard` |
| `/claude-analytics-dashboard-for-campaign-intelligence` | `AiPoweredPredictiveAnalyticsEngine` |
| `/claude-predictive-analytics-dashboard` | `AiPoweredPredictiveAnalyticsEngine` |
| `/claude-ai-content-curation-intelligence-center` | `AnthropicContentIntelligenceHub` |
| `/claude-model-comparison-center` | `ClaudeModelComparisonCenter` |
| `/claude-content-optimization-engine` | `ContentQualityScoringClaude` |
| `/automatic-ai-failover-engine-control-center` | `AutomaticAIFailoverEngineControlCenter` |
| `/ai-performance-orchestration-dashboard` | `UnifiedAIPerformanceDashboard` |
| `/ai-powered-performance-advisor-hub` | `FeaturePerformanceDashboard` |
| `/open-ai-carousel-content-intelligence-center` | `ContentDistributionControlCenter` |
| `/autonomous-claude-agent-orchestration-hub` | `ClaudeAutonomousActionsHub` |
| `/enhanced-real-time-behavioral-heatmaps-center` | `ZoneSpecificThreatHeatmapsDashboard` |
| `/gemini-cost-efficiency-analyzer-case-report-generator` | `GeminiCostEfficiencyAnalyzer` |

**Note:** Web **`/automatic-ai-failover-engine-control-center`** uses the `AutomaticAIFailoverEngineControlCenter` page wrapper, which renders the same **Gemini Fallback Orchestration** surface as `/gemini-fallback-orchestration-hub` (Mobile parity: `AutomaticAIFailoverEngineControlCenter` screen). **AI performance orchestration** Web vs Mobile: both are multi-provider orchestration UIs (`AIPerformanceOrchestrationDashboard` vs `UnifiedAIPerformanceDashboard`).

## Feature gates

See `routeFeatureKeys.js` and `lib/config/route_feature_keys.dart` — paths map to existing `platform_feature_toggles.feature_key` values (creator revenue, Claude feed, anthropic content, content quality, monitoring, performance testing, content distribution, incident orchestration, fraud detection).
