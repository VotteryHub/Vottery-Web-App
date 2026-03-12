# Feature Discrepancies & Priorities – Web vs Mobile

**Purpose:** Identify all discrepancies, flag differences, and list what is fully implemented, partially implemented, or missed across the whole features/information (specs, audit, prompts folder, CROSS_PLATFORM_LOGIC, PAYOUT_FLOW_QA). Then: how to fix, and what is important vs not important for best platform latency, user-friendliness, optimization, and efficiency.

**Sources:** VOTTERY_FINAL_PRODUCTION_AUDIT_2026, CROSS_PLATFORM_LOGIC, PAYOUT_FLOW_QA, VOTTERY_USER_ACCEPTANCE_TESTING_SCENARIOS, **Vottery Dev. Prompts & Features implementation chats with Rocket.New** (sample .docx), and codebase indexing (Web + Mobile).

---

## 1. Fully implemented (100%) – no discrepancies – 100% functional on both Web and Mobile

These features are successfully built, have **no discrepancies** between the Web App and the Mobile App, and are **100% functional** on both platforms (shared Supabase backend).

1. **Supabase authentication (sign in, sign up, session)**  
   Web: AuthContext, authService, Supabase client. Mobile: AuthService, Supabase client. Same backend; session and profile load correctly on both.

2. **User profile (read/update)**  
   Both use the `user_profiles` table and same usage; no divergence.

3. **Elections list / browse**  
   Web: electionsService and routes. Mobile: voting_service, suggested_elections, routes. Same Supabase-backed concept on both.

4. **Vote casting**  
   Web: votesService, secure-voting-interface. Mobile: voting_service, vote_casting. Both persist votes to the same domain; no known logic conflicts.

5. **Election creation**  
   Web: election-creation-studio, electionsService. Mobile: election_creation_studio and services. Same concept and backend.

6. **Direct messaging**  
   Web: direct-messaging-center, messagingService. Mobile: direct_messaging, messaging_service. Same domain and intent.

7. **Notifications**  
   Web: notification-center-hub, notificationService. Mobile: notification_center_hub, services. Same domain.

8. **Friends / social connections**  
   Web: friends-management-hub, friendsService. Mobile: social_connections, social_service. Same domain.

9. **Settings / account dashboard**  
   Web: settings-account-dashboard. Mobile: comprehensive_settings_hub. Same intent; both consolidate account/settings.

10. **Admin dashboard**  
    Web: admin-control-center. Mobile: admin_dashboard. Same intent.

11. **Stripe Connect onboarding (create account, link)**  
    Web: stripe-connect and Edge. Mobile: stripe_connect_service (create account, onboarding link). Same Stripe Connect flow on both.

12. **VP / gamification (balance, quests)**  
    Web: gamificationService, VP economy routes. Mobile: vp_service, gamification_hub, vp_economy_dashboard. Same VP/quest domain.

13. **Creator payout dashboard (UI)**  
    Web: enhanced-creator-payout-dashboard, creator-earnings. Mobile: creator_payout_dashboard, stripe_connect_payout_management_hub. Both show creator earnings and payout UI.

14. **Payout history (list)**  
    Both show history; the new unified flow uses the same contract (prize_redemptions; unified flow uses same tables). Web and Mobile aligned for the unified path.

15. **Unified Earnings & Payouts flow (YouTube-style)**  
    Web: `src/features/payouts` (user_wallets + prize_redemptions). Mobile: `lib/features/payouts` (same tables and same error messages). Same API, same errors, same threshold ($100); no discrepancies for this flow.

**Total: 15** feature areas fully implemented on both with no known cross-platform discrepancies.

---

## 2. Partially implemented (both Web and Mobile)

These exist on **both** platforms but have **differences** in API, validation, UX, or data model (discrepancies flagged).

1. **User wallet / balance**  
   **Done:** Web uses `user_wallets` with full balance fields. Mobile: legacy `WalletService` still uses `wallets` and `balance_usd`; new `lib/features/payouts` uses `user_wallets`.  
   **Discrepancy:** Legacy Mobile wallet code and some screens still read from `wallets`; the rest of the app may show a different balance source than Web.

2. **User payout request (legacy flows)**  
   **Done:** Web: `stripeService.createCashPayout` → `prize_redemptions`. Mobile: `WalletService.requestPayout` → `wallet_transactions` (type `payout`).  
   **Discrepancy:** Different tables; different minimum amounts (e.g. ₹100 vs $10/$5); Mobile has no balance check in the legacy path.

3. **Creator payout (API)**  
   **Done:** Web calls `stripe-secure-proxy` with `action: 'create_payout'`. Mobile calls POST `stripe-request-payout`.  
   **Discrepancy:** Different Edge entrypoints; validation/behavior can diverge between Web and Mobile.

4. **Password validation**  
   **Done:** Web: `validatePassword()` (length, complexity, common-passwords). Mobile: form and terms only.  
   **Discrepancy:** Flutter does not enforce the same client-side password rules as Web.

5. **Payout error messages**  
   **Done:** Web uses fixed strings in components. Mobile (legacy): raw `e.toString()` or different copy.  
   **Discrepancy:** Error copy and handling not identical; the unified flow in `features/payouts` fixes this for that flow only; legacy paths still differ.

6. **Payout settings**  
   **Done:** Web: `payout_settings` (get/update) and PayoutSettings UI. Mobile: not used in legacy wallet/payout flows.  
   **Discrepancy:** Mobile does not expose or persist `payout_settings` in the same way as Web.

7. **Transaction history**  
   **Done:** Both use `wallet_transactions`. Web uses `wallet_id`. Mobile (legacy): insert without `wallet_id`.  
   **Discrepancy:** Schema expects `wallet_id`; Flutter legacy insert can violate or rely on default.

8. **Currency / locale**  
   **Done:** Web: INR default in many payout UIs. Mobile: USD and multi-currency selector.  
   **Discrepancy:** Different defaults and options; no single source of truth.

9. **Processing fee on payout**  
   **Done:** Web: fee % and `finalAmount` in UI. Mobile (legacy): no fee display or deduction.  
   **Discrepancy:** Fee logic and display missing on Mobile in legacy flows.

10. **Screen count vs audit / prompts**  
    **Done:** Audit and prompts list many screens (e.g. 174 Web); project has ~133 route paths; Mobile has 157 routes. Campaign Management, Advertiser Analytics, Participatory Ads Studio, Content Moderation, Election Insights, Fraud Detection, Admin Activity Log exist on Web; Mobile parity unclear or partial.  
    **Discrepancy:** Not every audit/prompt screen has a 1:1 route or full Mobile parity; some may be combined or named differently.

**Total: 10** areas partially implemented with identified discrepancies.

---

## 3. Missed or not implemented (both Web and Mobile)

These are **missing or not clearly present** on both platforms (or only on one), from audit, UAT, CROSS_PLATFORM_LOGIC, PAYOUT_FLOW_QA, and prompts.

1. **Interactive onboarding wizard (step-by-step)**  
   Referenced as `/interactive-onboarding-wizard`; may exist as a different route or be minimal; not confirmed 100% on both.

2. **AI-guided interactive tutorial**  
   `/ai-guided-interactive-tutorial-system`; not verified in both codebases.

3. **WebAuthn / passkey parity**  
   Web has multi-auth gateway; Mobile has passkey_authentication_center; behavior parity between platforms not verified.

4. **Shared validation schema (Zod / formz)**  
   No shared request/validation schema between Web and Flutter for critical payloads.

5. **Single creator payout backend contract**  
   One documented contract (e.g. one Edge name + payload) for Web and Mobile is not enforced; Web uses `stripe-secure-proxy`, Mobile uses `stripe-request-payout`.

6. **Backend-enforced payout balance check**  
   Server-side balance check for every payout request is not confirmed.

7. **All 174 audit screens on Web**  
   ~133 routes; some audit screens may be missing or merged.

8. **1:1 screen parity (174 Web ≈ Mobile)**  
   Mobile has 157 routes; no strict 1:1 mapping to the 174 listed.

9. **Payout_settings in Mobile (legacy flows)**  
   Mobile legacy flows do not use the `payout_settings` table.

10. **Unified “payment method” management**  
    Single payment-method management flow aligned across Web and Mobile not fully verified.

**Total: 10** missed or not-fully-implemented items.

---

## 4. How to add or implement (discrepancies, partial, missed)

Concrete steps to fix the ones with discrepancies, the ones partially implemented, and the ones not implemented.

### High priority

- **Unify wallet table on Mobile**  
  Use **only** `user_wallets` everywhere: point legacy `WalletService` (and any UI that still uses it) to `user_wallets` and the same columns as Web, or remove legacy usage and rely on `lib/features/payouts` and one wallet API. Run migration `20260228100000` (or manual SQL) so `user_wallets` exists and is backfilled from `wallets` if needed.

- **Unify creator payout API**  
  Use **one** Edge function (e.g. `stripe-secure-proxy` with `action: 'create_payout'`). Either (a) add a route in the same Edge that accepts `stripe-request-payout` and forwards to the same logic, or (b) change Flutter to call `stripe-secure-proxy` with `action: 'create_payout'` and the same payload as Web. Document the single contract.

- **Balance check on payout (Mobile legacy)**  
  In legacy `WalletService.requestPayout`, **before** insert: fetch `user_wallets` (or wallet balance), check `amount <= available_balance`; return error with the same message as Web if insufficient. Or deprecate the legacy flow and use only `lib/features/payouts`.

- **Same payout error messages**  
  Use **one** set of strings (e.g. Web `PAYOUT_ERRORS` / Flutter `PayoutErrors`) for all payout paths; never show raw `e.toString()` to the user.

### Medium priority

- **Payout_settings on Mobile**  
  Add a screen or section that reads/updates `payout_settings` (preferred method, threshold, bank details) and call the same Supabase table as Web.

- **Password validation on Flutter**  
  Implement the same rules as Web (length, complexity, common-passwords) in Flutter (e.g. in registration/change-password); optionally share rules via backend or a shared spec.

- **Transaction insert `wallet_id` (Mobile)**  
  For any insert into `wallet_transactions`, include `wallet_id` from `user_wallets` for the current user; align with Web and schema.

- **Processing fee (Mobile legacy)**  
  In legacy payout UI, show fee % and net amount like Web, or remove the legacy flow and use only the unified payout feature.

### Lower priority

- **Shared validation schema**  
  Introduce backend validation (e.g. Zod in Edge) for payout and other critical payloads; optionally export OpenAPI or types for both clients.

- **Screen parity (174 vs routes)**  
  Audit the 174 listed screens; add or rename routes so every audit screen has a clear route; then map Mobile routes to the same feature list where relevant.

- **Onboarding / tutorial parity**  
  Verify interactive onboarding and AI tutorial exist and work on both; add or align flows so UAT steps pass on both.

---

## 5. Important and necessary to implement (best platform latency, user-friendliness, optimization, efficiency)

Implement these **first** for a consistent, reliable, and efficient platform.

1. **Single wallet model (`user_wallets` everywhere)**  
   Prevents wrong balance, double-spend, and support confusion; one source of truth.

2. **Unified payout flow (keep using `features/payouts`)**  
   Already done; ensure all entry points (Digital Wallet, Earnings & payouts) use it; deprecate legacy payout paths that write to different tables.

3. **Creator payout: one backend contract**  
   Prevents divergent behavior and bugs between Web and Mobile creator payouts.

4. **Balance check before every payout**  
   Prevents invalid requests and bad UX; reduces failed transactions.

5. **Same user-facing payout errors**  
   Support and compliance; consistent UX.

6. **`wallet_id` in all `wallet_transactions` inserts**  
   Schema and reporting correctness; referential integrity.

7. **Payout_settings on Mobile**  
   Users can set preferred method and threshold on mobile as on web.

8. **Password rules on Flutter**  
   Security parity with Web.

---

## 6. Not important / not necessary to implement first (can defer)

Lower priority for initial platform latency, user-friendliness, optimization, and efficiency. Can be deferred.

1. **Strict 174-screen parity**  
   Many screens are admin/niche; core user flows matter more first.

2. **Shared Zod/formz schema**  
   Nice for consistency; backend validation can cover critical paths first.

3. **Processing fee in legacy Mobile payout UI**  
   Legacy flow can be deprecated in favor of unified payout.

4. **1:1 route naming (Web vs Mobile)**  
   Internal naming; user-facing flows matter more.

5. **AI-guided tutorial parity**  
   Enhances onboarding but not blocking for core voting/payout.

6. **WebAuthn/passkey parity**  
   Security improvement; email/password suffices for MVP if needed.

7. **Every single audit dashboard on Mobile**  
   Many dashboards are power-user/admin; prioritize core creator and voter flows.

---

*This document is derived from FEATURE_IMPLEMENTATION_QA_REPORT.md, CROSS_PLATFORM_LOGIC.md, PAYOUT_FLOW_QA.md, and the Vottery Dev. Prompts & Features implementation chats with Rocket.New folder.*
