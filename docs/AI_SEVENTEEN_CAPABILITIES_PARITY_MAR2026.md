# Seventeen AI capability surfaces — Web + Mobile parity (Mar 2026)

Canonical list (aligned to `AI_CLAUDE_GEMINI_ROUTE_WIRING_WEB_MOBILE_MAR2026.md`, `FRAUD_ML_ROUTE_ALIASES_WEB_MOBILE_MAR2026.md`, and Perplexity fraud/market stacks). **Routing** is defined there; **this doc** tracks **data wiring** (no mock-first prompts where Supabase can supply signals).

| # | Capability | Web | Mobile | Data / service parity notes |
|---|------------|-----|--------|------------------------------|
| 1 | Anthropic / Claude revenue risk center | `RegionalRevenueAnalyticsDashboard` | `CreatorRevenueForecastingDashboard` | Revenue streams + zone recs: `revenueIntelligenceService` / `RevenueIntelligenceService` |
| 2 | Claude campaign intelligence analytics | `ClaudeAnalyticsDashboardForCampaignIntelligence` | `AiPoweredPredictiveAnalyticsEngine` | Claude services + campaign analytics |
| 3 | Claude predictive analytics | `ClaudePredictiveAnalyticsDashboard` | `AiPoweredPredictiveAnalyticsEngine` | Same as row 2 target on mobile (alias) |
| 4 | Claude AI content curation | `ClaudeAIContentCurationIntelligenceCenter` | `AnthropicContentIntelligenceHub` | Content / Anthropic hubs |
| 5 | Claude model comparison | `ClaudeModelComparisonCenter` | `ClaudeModelComparisonCenter` | `claudeModelComparisonService` |
| 6 | Claude content optimization / quality | `ClaudeContentOptimizationEngine` | `ContentQualityScoringClaude` | `contentQualityScoringService` |
| 7 | Automatic AI failover / Gemini orchestration | `AutomaticAIFailoverEngineControlCenter` | `AutomaticAIFailoverEngineControlCenter` | Gemini fallback orchestration |
| 8 | AI performance orchestration | `AIPerformanceOrchestrationDashboard` | `UnifiedAIPerformanceDashboard` | Multi-provider metrics |
| 9 | AI-powered performance advisor | `FeaturePerformanceDashboard` | `FeaturePerformanceDashboard` | Performance advisor |
| 10 | OpenAI carousel / distribution intelligence | `ContentDistributionControlCenter` | `ContentDistributionControlCenter` | Distribution control |
| 11 | Autonomous Claude agent orchestration | `UnifiedAIOrchestrationCommandCenter` (alias) | `ClaudeAutonomousActionsHub` | Orchestration |
| 12 | Real-time behavioral / zone heatmaps | `ZoneSpecificThreatHeatmapsDashboard` | `ZoneSpecificThreatHeatmapsDashboard` | Threat / zone analytics |
| 13 | Gemini cost efficiency analyzer | `GeminiCostEfficiencyAnalyzerCaseReportGenerator` | `GeminiCostEfficiencyAnalyzer` | Cost analyzer services |
| 14 | Advanced ML threat detection (alias) | `EnhancedPredictiveThreatIntelligenceCenter` | `AdvancedThreatPredictionDashboard` | Threat intel services |
| 15 | Continuous ML feedback (alias) | `AutoImprovingFraudDetectionIntelligenceCenter` | `PredictiveIncidentPreventionEngine` | Fraud learning surfaces |
| 16 | Perplexity fraud intelligence + market redirects | `AdvancedPerplexityFraudIntelligenceCenter` | `PerplexityFraudDashboardScreen` | **`advancedPerplexityFraudService.getFraudIntelligenceSignalsFromSupabase`** + **`AdvancedPerplexityFraudService`** (30d signals) |
| 17 | Perplexity fraud forecasting (30–90d) | `AdvancedPerplexityFraudForecastingCenter` + `advanced-perplexity-60-90-day-threat-forecasting-center` | `EnhancedPerplexityAiFraudForecastingHub` | **`fraudForecastingService.buildHistoricalWindowFromSupabase`** + **`AdvancedPerplexityFraudService.buildDailyIncidentSeriesForForecast`** |

## Market research payloads (Web)

- `perplexityMarketResearchService.buildMarketResearchPromptInputsFromSupabase` — replaces hardcoded brand/vote mocks in `perplexity-market-research-intelligence-center` (still reachable if route is mounted; primary marketing URLs may redirect to fraud intel).
- `getInternalMarketResearchContext` — shared snapshot keys with Mobile `PerplexityService.getInternalMarketResearchContext`.

## Revenue / zone intelligence

- Zone recommendations: Supabase-first (`prize_redemptions`, `user_profiles`, `country_restrictions`) before static marketing defaults.
- Claude-off **revenue forecast** fallbacks: stream-derived drivers/risks (no generic “India/Africa” marketing bullets).

## Honest limitations

- **RLS**: Non-admin users may see partial aggregates; org-wide intelligence needs admin/service-role patterns or RPCs.
- **Perplexity model output** remains probabilistic; parity is on **inputs** and **fallback honesty**, not identical model text.
