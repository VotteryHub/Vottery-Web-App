# Supabase Migrations Required for AI Implementations

Run these migrations in order (oldest first) so all AI features work end-to-end. Apply via Supabase Dashboard SQL editor or `supabase db push` / migration runner.

---

## 1. **Required migrations (in order)**

| Migration file | Purpose |
|----------------|--------|
| **20260225160000_sms_optimization_failover_tables.sql** | Creates `sms_optimization_history` (original_content, optimized_content, original_length, optimized_length, optimization_type, parameters, created_at) and SMS provider tables. **Required** for Web and Mobile SMS optimization logging (optimization_type: `gemini`). |
| **20260227120000_content_moderation_groups_enhancements.sql** | Creates `content_moderation_results`. **Required** for content-moderation-trigger (posts, comments, elections). |
| **20260207215000_ai_dependency_risk_mitigation_system.sql** | (If present) AI dependency risk tables. |
| **20260207220000_ai_dependency_risk_mitigation_system.sql** | AI service performance metrics, case reports, fallback config, gemini_monitoring_logs. **Required** for AI orchestration and monitoring. |
| **20260207221500_update_ai_fallback_types.sql** | (If present) Updates AI fallback types. |
| **20260127233000_voting_session_persistence_api_rate_limiting.sql** | Creates `api_rate_limits`. **Required** for ai-proxy Edge function (rate limiting per user/endpoint). |
| **20260307120000_gemini_recommendation_sync.sql** | Adds `votes.recommendation_synced_at`, creates `recommendation_sync_logs`. **Required** for Gemini recommendation sync (replaces Shaped). |
| **20260307180000_feature_implementation_notifications_trigger.sql** | Trigger on `feature_requests`: when status becomes `implemented`, creates `feature_implementation_notifications` for submitter and upvoters. **Required** for User Feedback Portal “feature implemented” notifications. |
| **20260309120000_abstention_vote_change_live_results.sql** | Adds vote_abstentions.source, elections.live_results_locked_at, vote_audit_markers table, RLS. Required for abstention, vote change approval, live results lock. |
| **20260309130000_seed_exhaustive_feature_toggles.sql** | Seeds exhaustive platform feature toggles. Idempotent. |
| **20260309140000_seed_domain_feature_toggles.sql** | Seeds domain-level toggles (creator, advertiser, admin, etc.) for strategic launch control. Idempotent. |
| **20260309150000_platform_feature_toggles_public_read.sql** | RLS: allow SELECT for all users on `platform_feature_toggles` so Web/Mobile can gate features; write stays admin-only. |
| **20260309160000_seed_comprehensive_audit_toggles.sql** | Seeds all remaining features from Comprehensive Feature Audit (150+ toggles). Idempotent. |

---

## 2. **Tables used by AI (ensure they exist)**

- **api_rate_limits** — ai-proxy uses this for per-user rate limits (`/ai-proxy/${provider}`). Must have columns used by the Edge (e.g. user_id, endpoint, request_count, window_start).
- **ai_usage_logs** — ai-proxy inserts here (user_id, provider, method, tokens_used, cost_estimate, timestamp). If this table does not exist, create it or the insert will fail (you can comment out the insert in ai-proxy temporarily).
- **sms_optimization_history** — Web and Mobile write here with columns: original_content, optimized_content, original_length, optimized_length, optimization_type, parameters, created_at.
- **content_moderation_results** — content-moderation-trigger inserts here (content_id, content_type, etc.).
- **votes** — must have column `recommendation_synced_at` (TIMESTAMPTZ, nullable) for Gemini recommendation sync.
- **recommendation_sync_logs** — created by 20260307120000_gemini_recommendation_sync.sql.
- **elections** — for content-moderation-trigger on elections, must have `status` (e.g. include `'rejected'`) and `moderation_notes` (TEXT). If your schema does not have these, add them (e.g. add `moderation_notes` and ensure status enum includes `rejected`).

---

## 3. **Optional: create ai_usage_logs if missing**

If your project has no migration that creates `ai_usage_logs`, run:

```sql
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  provider TEXT NOT NULL,
  method TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_estimate DECIMAL(10, 6) DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_timestamp ON ai_usage_logs(timestamp DESC);
```

---

## 4. **Optional: elections table for moderation**

If the content-moderation-trigger should set `elections.status = 'rejected'` and `elections.moderation_notes`, ensure:

- `elections.status` allows the value `'rejected'` (e.g. add to enum or use TEXT).
- `elections.moderation_notes` exists (TEXT, nullable). If missing:

```sql
ALTER TABLE elections ADD COLUMN IF NOT EXISTS moderation_notes TEXT;
-- If status is an enum, add 'rejected': ALTER TYPE elections_status_enum ADD VALUE IF NOT EXISTS 'rejected';
```

---

## 5. **Summary checklist**

- [ ] **20260225160000_sms_optimization_failover_tables.sql** — SMS history (Web + Mobile).
- [ ] **20260227120000_content_moderation_groups_enhancements.sql** — Moderation results.
- [ ] **20260207220000_ai_dependency_risk_mitigation_system.sql** — AI metrics and fallback.
- [ ] **20260127233000_voting_session_persistence_api_rate_limiting.sql** — api_rate_limits for ai-proxy.
- [ ] **20260307120000_gemini_recommendation_sync.sql** — votes.recommendation_synced_at + recommendation_sync_logs.
- [ ] **20260307150000_content_moderation_industry_standard.sql** — content_moderation_results allows `election`; elections.moderation_notes; moderation_log, moderation_config, user_moderation_history, moderation_reviews (Mobile); policy_categories; notifications table/columns for content_removed.
- [ ] **ai_usage_logs** table exists (create manually if needed).
- [ ] **elections** has status (including `rejected`) and **moderation_notes** if using election moderation.

After these are applied, AI features (Gemini recommendations, ai-proxy chat/embeddings, SMS optimization with Gemini, content moderation for posts/comments/elections) will have the correct schema and logging.
