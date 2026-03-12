# Implementation Summary — Partial Features & Discrepancies (March 2026)

This document summarizes what was implemented to complete partially implemented features, add missing pieces, and fix Web vs Mobile discrepancies following the [Feature Cross-Check QA Report](FEATURE_CROSSCHECK_FULL_QA_REPORT_MAR2026.md).

---

## 1. Country-based payout calculation (payout engine)

**Status:** ✅ Implemented

- **Migration:** `supabase/migrations/20260310100000_prize_redemptions_country_split_audit.sql` — adds to `prize_redemptions`: `country_code`, `creator_percentage`, `platform_percentage`, `split_source`.
- **Edge:** `supabase/functions/stripe-secure-proxy/index.ts` — `createPayout` loads creator `user_profiles.country_code` / `country_iso`, calls `calculate_revenue_split_with_country(userId, amountDollars, countryCode)`, and inserts the audit columns into `prize_redemptions`; resolves `wallet_id` from `user_wallets` when possible.
- **Web:** `src/features/payouts/api.js` — `requestPayout` loads creator country from `user_profiles`, calls `calculate_revenue_split_with_country`, and includes the same audit columns in the `prize_redemptions` insert.

---

## 2. Creator SMS triggers (Twilio)

**Status:** ✅ Implemented

- **Edge:** `supabase/functions/creator-sms-triggers/index.ts` — Cron-invokable; selects `milestone_achievements` with `is_achieved=true` and `celebration_sent=false`, sends SMS via `send-sms-alert`, sets `celebration_sent=true`.
- **Partnership accepted:** `src/services/smsAlertService.js` — `sendPartnershipAcceptedAlert(creatorId, brandName)`. `src/services/creatorBrandPartnershipService.js` calls it when creating a contract (after setting proposal status to `accepted`).
- **Content optimization:** `src/services/claudeCreatorSuccessService.js` — After inserting `content_optimization_recommendations`, if any are high/urgent, calls `smsAlertService.sendContentOptimizationAlert(creatorId, highPriority)`.

**Cron:** Schedule `creator-sms-triggers` (e.g. every 15–30 min). See [DEPLOY_EDGE_AND_CRON_COPY_PASTE.md](DEPLOY_EDGE_AND_CRON_COPY_PASTE.md).

---

## 3. Mobile admin parity (discrepancies)

**Status:** ✅ Implemented

- **URLs:** `vottery M/lib/constants/app_urls.dart` — Added `countryRevenueShareManagement`, `regionalRevenueAnalytics`, `claudeDisputeResolution`, `multiCurrencySettlement` (each = `webAppBase` + Web path).
- **Routes:** `lib/routes/app_routes.dart` — Added `countryRevenueShareAdmin`, `regionalRevenueAnalyticsAdmin`, `claudeDisputeResolutionAdmin`, `multiCurrencySettlementAdmin`.
- **Main:** `lib/main.dart` — Four new route cases that open `WebAdminLauncherScreen` with the correct title and URL (admin-only).
- **Admin drawer:** `lib/presentation/admin_dashboard/admin_dashboard.dart` — Four new ListTiles: “Country revenue share”, “Regional revenue analytics”, “Dispute resolution”, “Multi-currency settlement”, each pushing the corresponding route (opens Web admin in browser).

---

## 4. Participatory Ads budget alerts (Slack/Discord)

**Status:** ✅ Implemented

- **Edge:** `supabase/functions/participatory-ads-budget-alert/index.ts` — Reads `sponsored_elections` (active, `budget_spent/budget_total >= 0.9`), posts to `SLACK_WEBHOOK_URL` and/or `DISCORD_WEBHOOK_URL`, updates `alert_sent_at`.

**Cron & secrets:** See [DEPLOY_EDGE_AND_CRON_COPY_PASTE.md](DEPLOY_EDGE_AND_CRON_COPY_PASTE.md).

---

## 5. Compliance / tax doc expiration reminders

**Status:** ✅ Implemented

- **Edge:** `supabase/functions/compliance-doc-reminders/index.ts` — Finds `creator_compliance_documents` expiring in 30/15/7 days or expired, inserts into `document_renewal_reminders` (one per document per `reminder_type`); uses existing tables from `20260214143900_multi_currency_payout_compliance_system.sql`.

**Cron:** Schedule `compliance-doc-reminders` (e.g. daily). See [DEPLOY_EDGE_AND_CRON_COPY_PASTE.md](DEPLOY_EDGE_AND_CRON_COPY_PASTE.md).

---

## 6. Creator onboarding wizard (Mobile)

**Status:** ✅ Implemented

- **Screen:** `vottery M/lib/presentation/creator_onboarding_wizard/creator_onboarding_wizard_screen.dart` — Single guided flow: Identity verification → Tax setup → Banking → First earnings; each step navigates to existing screens (`CreatorVerificationKycScreen`, `stripeConnectPayoutManagementHub`, `creatorEarningsCommandCenter`).
- **Route:** `AppRoutes.creatorOnboardingWizard` in `app_routes.dart`; case in `main.dart` with `RoleRouteGuard(requiredRoles: AppRoles.creatorRoles)`.

**Entry:** Navigate to `AppRoutes.creatorOnboardingWizard` (e.g. from Creator Studio or profile menu for new creators).

---

## Deployment checklist

| Item | Action |
|------|--------|
| Migrations | Apply `20260310100000_prize_redemptions_country_split_audit.sql` if not already applied. |
| Edge functions | Deploy `creator-sms-triggers`, `participatory-ads-budget-alert`, `compliance-doc-reminders`. |
| Cron | Schedule the three functions per [DEPLOY_EDGE_AND_CRON_COPY_PASTE.md](DEPLOY_EDGE_AND_CRON_COPY_PASTE.md). |
| Secrets | Set `SLACK_WEBHOOK_URL` and/or `DISCORD_WEBHOOK_URL` for `participatory-ads-budget-alert`. |
| Optional | Confirm `sponsored_elections.alert_sent_at` exists (e.g. from migration `20260123212700`); confirm `prize_redemptions.wallet_id` handling where required. |

---

## Summary table (Web vs Mobile)

| Feature | Web (React) | Mobile (Flutter) |
|---------|-------------|------------------|
| Country payout audit | `api.js` requestPayout + Edge | Same backend (PayoutApi / wallet) |
| SMS triggers | N/A (Edge + Web services) | N/A (Edge) |
| Country revenue admin | Existing page | WebAdminLauncherScreen (new route) |
| Regional analytics admin | Existing page | WebAdminLauncherScreen (new route) |
| Dispute resolution admin | Existing page | WebAdminLauncherScreen (new route) |
| Multi-currency settlement admin | Existing page | WebAdminLauncherScreen (new route) |
| Compliance reminders | Edge cron | N/A (backend) |
| Creator onboarding wizard | N/A (existing flows) | CreatorOnboardingWizardScreen (new) |
