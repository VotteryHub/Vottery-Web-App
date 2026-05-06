# Production Rollout & Incident Runbook

## 1. Canary Strategy
We will use a phased rollout to minimize blast radius.

- **Phase 1 (5%)**: Internal users and selected beta testers.
- **Phase 2 (25%)**: Regional rollout (Primary market).
- **Phase 3 (100%)**: Full global availability.

### Rollback Conditions
- Error rate increase > 1% over baseline.
- Critical module failure (Auth, Voting, Payments).
- Latency spike > 500ms for p95.

## 2. Database Migration Plan
1. **Pre-deployment**: Run non-breaking migrations (add columns, new tables).
2. **Deployment**: Update code and Edge Functions.
3. **Post-deployment**: Run cleanup migrations (drop old columns) after 24h stability.

**Rollback**: Standard Supabase database restores are available via PITR.

## 3. Day-1 Feature Flag Defaults
| Module | State | Rationale |
| :--- | :--- | :--- |
| `core-voting` | **ON** | Mission critical. |
| `gamification` | **ON** | High engagement driver. |
| `ai-orchestration` | **OFF** | Manual enable after verify infra load. |
| `country-restrictions` | **ON** | Regulatory compliance. |

## 4. Incident Runbook

### Step 1: Triage
- Check **Sentry** for crash spikes.
- Check **Supabase Edge Function logs** for 5xx errors.
- Check **Stripe Dashboard** for payment failures.

### Step 2: Immediate Response
1. **Kill-switch**: If a specific module is failing, disable it in `platform_feature_toggles`.
2. **Revert Frontend**: Use Vercel "Instant Rollback" to previous stable commit.
3. **Notify Team**: Alerts sent via Slack/SMS integration.

### Step 3: Resolution
- Patch the root cause in staging.
- Verify fix with smoke tests.
- Re-deploy to production.

## 5. Critical Contacts
- **DevOps/Supabase**: Osita
- **Frontend/Vercel**: Antigravity
- **Security/Compliance**: Legal Team
