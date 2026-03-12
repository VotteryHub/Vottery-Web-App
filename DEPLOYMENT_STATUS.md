# Vottery Deployment Status

**Last Updated:** March 2026  
**Project Ref:** `mdmdlhmtjmznmvkmgrzb`

---

## 1. Edge Functions (25 total)

| Function | Status | Notes |
|----------|--------|-------|
| `load-testing-auto-response` | ✅ Deployed | Scale, pause, circuit breakers, rollback |
| `draws-initiate` | ✅ Deployed | Returns `winner_position` for slot machine reveal |
| `smart-push-timing` | ✅ Deployed | Optimal send time from user_activity_logs |
| `content-moderation-trigger` | ✅ Deployed | Claude AI moderation for posts/comments |
| `platform-gamification-api` | ✅ Deployed | VP, quests, gamification |
| `stripe-webhook-verified` | ✅ Deployed | Stripe Connect webhooks |
| `stripe-secure-proxy` | ✅ Deployed | Payout creation |
| `send-sms-alert` | ✅ Deployed | Telnyx SMS |
| `creator-churn-prediction-cron` | ✅ Deployed | Churn prediction |
| All others | ✅ Deployed | See `supabase/functions/` |

**Deploy all:**
```powershell
cd vottery_1/vottery
supabase functions deploy load-testing-auto-response
supabase functions deploy draws-initiate
supabase functions deploy smart-push-timing
supabase functions deploy content-moderation-trigger
# ... or deploy each individually
```

---

## 2. Migrations

| Migration | Status | Action |
|-----------|--------|--------|
| `20260302190000_admin_alert_contacts` | ⚠️ Run manually | If `admin_alert_contacts` table missing, run in Supabase SQL Editor |
| `20260302120000` (payout_settings) | In RUN_THIS | Part of RUN_THIS_IN_SUPABASE_DASHBOARD.sql |
| `20260302140000` (notification_settings) | In RUN_THIS | Part of RUN_THIS_IN_SUPABASE_DASHBOARD.sql |

**Manual step:** Open Supabase Dashboard → SQL Editor → run `supabase/migrations/20260302190000_admin_alert_contacts.sql` if table does not exist.

---

## 3. Required Secrets

| Secret | Purpose |
|--------|---------|
| `ANTHROPIC_API_KEY` | Claude content moderation, MCQ optimization |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge functions (auto) |
| `STRIPE_SECRET_KEY` | Payouts |
| `TELNYX_API_KEY` | SMS alerts |
| `PLATFORM_GAMIFICATION_API_KEY` | Gamification API |

---

## 4. Mobile-Priority Classification

**Implemented on Mobile:**
- Touch-friendly controls (44pt min)
- Smart Push client integration
- Profile/Privacy toggles
- Offline cache for Load Test history
- Error Boundary, Pagination, Push Intelligence

**Not on Mobile (admin-only / Web sufficient):**
- Load Testing Suite (admin)
- MCQ Alert config (admin)
- 3D Carousels
- MetaMask/WalletConnect
- Datadog RUM

---

## 5. Quick Deploy

```powershell
.\deploy-supabase.ps1
```

Or step-by-step:
1. `supabase login`
2. `supabase link --project-ref mdmdlhmtjmznmvkmgrzb`
3. `supabase db push` (may fail if schema exists; run manual migrations)
4. `supabase functions deploy <function-name>` for each function
