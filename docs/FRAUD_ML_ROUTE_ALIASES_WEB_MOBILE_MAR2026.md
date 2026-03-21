# Fraud / ML / Perplexity route aliases (Web + Mobile)

Replaces former `AIPlaceholderCenter` entries with **real hubs** or **canonical redirects** so deep links and marketing URLs resolve to functional screens.

## Web (`src/Routes.jsx`)

| Path | Behavior |
|------|----------|
| `/advanced-ml-threat-detection-center` | Renders **Enhanced Predictive Threat Intelligence Center** (same as `/enhanced-predictive-threat-intelligence-center`) |
| `/continuous-ml-feedback-outcome-learning-center` | Renders **Auto-Improving Fraud Detection Intelligence Center** |
| `/perplexity-market-research-intelligence-center` | **Redirect** → `/advanced-perplexity-fraud-intelligence-center` |
| `/perplexity-strategic-planning-center` | **Redirect** → `/advanced-perplexity-fraud-forecasting-center` |
| `/perplexity-carousel-intelligence-dashboard` | **Redirect** → `/advanced-perplexity-fraud-intelligence-center` |

## Feature gates (`routeFeatureKeys.js` / Mobile `route_feature_keys.dart`)

New paths use the same `platform_feature_toggles.feature_key` values as the parent hubs (fraud alert + Perplexity fraud intel/forecasting).

## Mobile (`lib/routes/app_routes.dart` + `screenForRoute` in `route_registry.dart`)

| Web-canonical path constant | Screen |
|-----------------------------|--------|
| `advancedMlThreatDetectionCenterWebCanonical` | `AdvancedThreatPredictionDashboard` |
| `continuousMlFeedbackOutcomeLearningCenterWebCanonical` | `PredictiveIncidentPreventionEngine` |
| `perplexityMarketResearchIntelligenceCenterWebCanonical` | `PerplexityFraudDashboardScreen` |
| `perplexityStrategicPlanningCenterWebCanonical` | `EnhancedPerplexityAiFraudForecastingHub` |
| `perplexityCarouselIntelligenceDashboardWebCanonical` | `PerplexityFraudDashboardScreen` |

## UX note (Web)

`advanced-perplexity-fraud-intelligence-center` shows an amber **Live AI / Perplexity** banner when the secure AI proxy returns errors or empty payloads. **Forecasting and correlation prompts** use **live Supabase rollups** (`fraud_alerts`, `content_flags`, `votes`, `revenue_anomalies`, 30d) via `advancedPerplexityFraudService.getFraudIntelligenceSignalsFromSupabase` — not hardcoded demo incident counts. Panel JSON may still be empty if the model returns nothing.

`advanced-perplexity-fraud-forecasting-center` uses `fraudForecastingService.buildHistoricalWindowFromSupabase` (60d daily series) for long-term / seasonal / zone / emerging-threat prompts.
