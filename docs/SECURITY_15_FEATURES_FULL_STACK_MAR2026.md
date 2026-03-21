# Security & fraud stack — 15-feature closure (Web + Mobile + Edge) — Mar 2026

This document maps the **original cross-stack security / fraud / ML parity checklist** to concrete implementation. Items marked **100%** have code paths + shared constants; **ops** rows need env/migration/deploy.

| # | Feature | Web | Mobile | Edge / DB | Status |
|---|---------|-----|--------|-----------|--------|
| 1 | **Perplexity fraud / forecasting** | `advanced-perplexity-*` hubs, `ai-proxy` `perplexity` | `PerplexityService`, fraud screens | `ai-proxy` | **100%** (live data depends on API keys) |
| 2 | **60–90 day threat forecasting** | `advanced-perplexity-60-90-day-threat-forecasting-center` + services | Related hubs / Perplexity | `ai-proxy` | **100%** |
| 3 | **Shaped → Gemini + 60s + 2.0× sponsored** | `geminiRecommendationService.js`: `SYNC_INTERVAL_SECONDS=60`, sponsored boost, `meta.latencyMs` / `RECOMMENDATION_LATENCY_BUDGET_MS` | `SharedConstants.geminiRecommendationSyncIntervalSeconds`, `sponsoredElectionRankingWeightMultiplier`; `feed_ranking_service` applies 2.0×; `AIRecommendationsService` latency log | `recommendation_sync_logs`, `votes.recommendation_synced_at` | **100%** (budget is **observed**, not guaranteed network SLA) |
| 4 | **Churn + `ml_predictions`** | `creatorChurnPredictionService`, `invokeUserChurnRefreshIfDue` via `AuthContext` | Same invoke + cron Edge | `creator-churn-prediction-cron`, `creator-churn-user-refresh`, migration `20260322103000_ml_predictions_and_geo_login_security.sql` | **100%** + **ops: migrate** |
| 5 | **Push timing** | Consumers call `smart-push-timing` with user JWT | Same | **`smart-push-timing` now requires JWT; `userId` must match session** | **100%** (update any server callers to send user JWT) |
| 6 | **Auth / JWT on sensitive checkout** | `create-subscription-checkout` requires `Authorization` + `userId===session` | Same | `create-subscription-checkout` | **100%** + **breaking: clients must send Bearer** |
| 7 | **MFA management** | MFA UI → Edge | Same | `mfa-management`: anon JWT for auth, service role for DB; **userId must match**; SQLi scan; **60/hr** limit | **100%** |
| 8 | **Tier-aware AI rate limits** | `ai-proxy` + `user_subscriptions` / `subscription_plans` | Same | `user_endpoint_rate_counters` + `enforceUserEndpointHourlyLimit` | **100%** + **ops: migrate** |
| 9 | **hCaptcha** | `validate-captcha` + forms | `captcha_service` → Edge | `validate-captcha` + SQLi + geo gate | **100%** |
| 10 | **Broad API rate limits** | N/A | N/A | **120/hr** `stripe-secure-proxy`; **30/hr** `create-subscription-checkout`; **60/hr** `mfa-management`; shared helper `userEndpointRateLimit.ts` | **100%** |
| 11 | **SQL injection heuristics** | N/A | N/A | `sqlInjectionDetection.ts` on **`ai-proxy`, `validate-captcha`, `stripe-secure-proxy`, `smart-push-timing`, `webhook-dispatcher`, `create-subscription-checkout`, `mfa-management`, `content-moderation-trigger`, `prediction-pool-notifications`, `blockchain-query` (params)** | **100%** |
| 12 | **IP / geo + velocity** | `validate-captcha` + `securityLoginGeoService` after login | `invokeRecordLoginGeoIfDue` after session | **`record-login-geo`**, `user_geo_login_events`, `security_events.geo_velocity_anomaly` | **100%** + **ops: deploy function + migrate** |
| 13 | **CORS allowlist** | Prior sweep (`shared/corsConfig.ts`) | N/A (native) | All listed functions use `getCorsHeaders` | **100%** |
| 14 | **Webhook replay / idempotency** | N/A | N/A | **Stripe** (existing), **Telnyx**, **`webhook-dispatcher`** (`checkWebhookIdempotency` + optional `WEBHOOK_DISPATCHER_SECRET`), **`prediction-pool-notifications`** | **100%** + **ops: set `WEBHOOK_DISPATCHER_SECRET` for dispatch API** |
| 15 | **Fraud / ML depth** | Fraud hubs + real services | Parity services | Logging + `ml_predictions`, cron upserts | **100%** (model depth = product/data, not stub removal) |

## Required ops

1. Apply migrations: `20260321120000_user_endpoint_rate_counters.sql`, `20260322103000_ml_predictions_and_geo_login_security.sql`.
2. Deploy Edge functions (at minimum): `record-login-geo`, updated `smart-push-timing`, `webhook-dispatcher`, `create-subscription-checkout`, `mfa-management`, `stripe-secure-proxy`, `prediction-pool-notifications`, `content-moderation-trigger`, `blockchain-query`, `ai-proxy`.
3. Set secrets: `CRON_SECRET` (churn cron), optional `WEBHOOK_DISPATCHER_SECRET` (internal dispatch hardening).
4. Update any **server-side** caller of `smart-push-timing` or `create-subscription-checkout` to pass the **end-user JWT**.

## Shared constants (parity)

| Constant | Web | Mobile |
|----------|-----|--------|
| Churn refresh | `API_PATHS.CREATOR_CHURN_USER_REFRESH` | `SharedConstants.creatorChurnUserRefresh` |
| Login geo | `API_PATHS.RECORD_LOGIN_GEO` | `SharedConstants.recordLoginGeo` |
| 60s / 2.0× / 100ms budget | `geminiRecommendationService.js` exports & `meta` | `SharedConstants.geminiRecommendationSyncIntervalSeconds`, `sponsoredElectionRankingWeightMultiplier`, `recommendationLatencyBudgetMs` |
