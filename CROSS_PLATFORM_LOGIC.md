# Cross-Platform Logic Map: Vottery Web (React/Vite) vs Mobile (Flutter)

This document indexes both codebases, maps core business logic and API surface, and flags discrepancies in **payout requesting**, state management, data validation, and API usage so the Web and Flutter apps can be aligned.

---

## 1. Codebase Index

### 1.1 React/Vite Web App (`vottery_1/vottery`)

| Area | Location | Description |
|------|----------|-------------|
| **Entry** | `src/index.jsx`, `src/App.jsx` | Vite + React; providers: Auth, Theme, FontSize. |
| **Config** | `vite.config.mjs`, `tailwind.config.js`, `cypress.config.js` | Build, Tailwind, Cypress. |
| **Backend** | `supabase/migrations/`, `supabase/functions/` | DB schema, Edge Functions (Deno). |
| **Auth** | `src/contexts/AuthContext.jsx`, `src/services/authService.js` | Supabase Auth; sign up/in, password rules, profile. |
| **API client** | `src/lib/supabase.js` | Single Supabase client; `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. |
| **Custom API** | `src/services/webhookService.js` | `VITE_API_URL` (e.g. `http://localhost:3001`), **fetch** to `/api/webhooks/*`. |
| **Elections / voting** | `src/services/electionsService.js`, `votesService.js`, `lotteryAPIService.js`, `lotteryPaymentService.js` | CRUD, votes, lottery, gamified flows. |
| **Wallets** | `src/services/walletService.js` | `user_wallets`, `wallet_transactions`, `prize_redemptions`. |
| **Payments / Stripe** | `src/services/stripeService.js`, `paymentService.js`, `subscriptionService.js` | Payment intents, payouts, subscriptions. |
| **Payout routing** | `src/services/paymentRoutingService.js`, `multiCurrencyPayoutService.js` | Cash/gift/crypto routing, multi-currency. |
| **Creator earnings** | `src/services/creatorEarningsService.js` | Earnings, `create_payout` via Edge Function. |
| **Stripe backend** | `supabase/functions/stripe-secure-proxy/index.ts` | Actions: `create_payment_intent`, `create_payout`, `create_customer`, etc. |
| **Validation (backend)** | `supabase/functions/shared/inputValidation.ts` | Zod: Election, Vote, VPTransaction; sanitization. |

### 1.2 Flutter Mobile App (`vottery M`)

| Area | Location | Description |
|------|----------|-------------|
| **Entry** | `lib/main.dart` | Supabase, Stripe, Sentry, Datadog, Hive, GA4, OfflineSync. |
| **Routes** | `lib/routes/app_routes.dart` | Named routes; e.g. `creatorPayoutDashboard`, `payoutHistoryScreen`, `digitalWalletScreen`. |
| **Auth** | `lib/services/auth_service.dart` | Singleton; Supabase auth, `currentUser`, `authStateChanges`. |
| **Supabase** | `lib/services/supabase_service.dart` | `SUPABASE_URL` from env; client. |
| **Edge base URL** | Services using Dio | `'${SupabaseService.supabaseUrl}/functions/v1'`. |
| **Elections / voting** | `lib/services/voting_service.dart`, `enhanced_lottery_service.dart`, `restful_api_service.dart` | Vote cast, lottery, REST layer. |
| **Wallets** | `lib/services/wallet_service.dart` | **`wallets`** table, `wallet_transactions` (type `payout`). |
| **Payments / Stripe** | `lib/services/payment_service.dart`, `stripe_connect_service.dart` | Stripe init, payment intents, **stripe-request-payout**, process-payout. |
| **Payout management** | `lib/services/payout_management_service.dart`, `payout_notification_service.dart`, `payout_verification_service.dart` | Schedule, retry, history, analytics. |
| **Creator monetization** | `lib/services/creator_monetization_service.dart` | `requestPayout(amount, payoutMethod)`. |
| **Backend payouts** | `supabase/functions/process-automated-payouts/index.ts` (if present in repo) | Automated Stripe transfers, notifications. |

---

## 2. Core Business Logic Map

### 2.1 Authentication

| Concern | Web (React) | Flutter |
|--------|-------------|--------|
| **Where** | `AuthContext.jsx`, `authService.js` | `auth_service.dart` |
| **Storage** | Supabase session | Supabase session |
| **Password rules** | Custom `validatePassword()` (length, complexity, common-passwords) | Not re-implemented in explored files; relies on Supabase |
| **Profile** | `user_profiles` | Same |

### 2.2 Wallets & Balance

| Concern | Web (React) | Flutter |
|--------|-------------|--------|
| **Wallet table** | **`user_wallets`** | **`wallets`** ⚠️ |
| **Transactions** | `wallet_transactions` (with `wallet_id` → `user_wallets`) | `wallet_transactions` (with `user_id`; no `wallet_id` in insert) |
| **Balance field** | `available_balance`, `locked_balance`, `total_winnings` (user_wallets) | `balance_usd`, `purchasing_power_zone` (wallets) ⚠️ |
| **Service** | `walletService.getUserWallet`, `getWalletTransactions` | `WalletService.getWallet`, `getTransactions` |

### 2.3 Elections / Voting / Lottery

| Concern | Web (React) | Flutter |
|--------|-------------|--------|
| **Elections** | `electionsService`, `votesService`, `lotteryAPIService` | `voting_service`, `enhanced_lottery_service`, `restful_api_service` |
| **API style** | Supabase client + some Edge Functions | Supabase client + Dio to Edge (e.g. cast-vote) |

### 2.4 Payment Integration

| Concern | Web (React) | Flutter |
|--------|-------------|--------|
| **Stripe** | `stripeService`, `paymentService`; Edge: `stripe-secure-proxy` | `PaymentService`, `StripeConnectService`; Edge: `stripe-request-payout`, `process-payout` |
| **VP purchase** | Payment intent via Edge → wallet/transaction records | `PaymentService.purchaseVP` → create payment intent, process, award VP |
| **Creator payouts** | `create_payout` via `stripe-secure-proxy` (Stripe Connect, VP deduction) | `StripeConnectService.requestPayout` → `stripe-request-payout` |
| **User cash/crypto redemption** | `stripeService.createCashPayout` / `createCryptoWithdrawal` → **`prize_redemptions`** | `WalletService.requestPayout` → **`wallet_transactions`** (type `payout`) ⚠️ |

---

## 3. Payout Requesting: Side-by-Side

### 3.1 User cash / bank payout (winner or wallet holder)

| Aspect | Web (React) | Flutter |
|--------|-------------|--------|
| **UI** | `stripe-payment-integration-hub` → `PaymentMethodsPanel.jsx` | `wallet_dashboard.dart`, `wallet_prize_distribution_center.dart`, `digital_wallet_prize_redemption_system.dart` |
| **Service** | `stripeService.createCashPayout(payoutData)` | `WalletService.requestPayout(amount, method)` |
| **Storage** | Inserts into **`prize_redemptions`** (redemption_type `cash`, status `pending`) | Inserts into **`wallet_transactions`** (type `payout`, payout_method, status `pending`) |
| **Min amount** | **₹100** (hardcoded in UI) | **$10** bank_transfer, **$5** gift_card |
| **Max amount** | Check: amount ≤ `wallet.availableBalance` | **$10,000** daily cap (UI validation) |
| **Balance check** | Against `wallet?.availableBalance` | No balance check in `WalletService.requestPayout` (insert only) ⚠️ |
| **Backend** | No Edge call for this flow; record stays in DB for processing | No Edge call; record in `wallet_transactions` |

### 3.2 Creator payout (Stripe Connect)

| Aspect | Web (React) | Flutter |
|--------|-------------|--------|
| **Trigger** | Creator earnings / payout dashboards; `creatorEarningsService` | Creator payout dashboard; `StripeConnectService.requestPayout` |
| **API** | `supabase.functions.invoke('stripe-secure-proxy', { body: { action: 'create_payout', payload } })` | POST **`$_baseUrl/stripe-request-payout`** (Dio) with `creator_id`, `amount_usd`, `vp_amount` |
| **Edge function** | **`stripe-secure-proxy`** (action `create_payout`) | **`stripe-request-payout`** (separate endpoint name) ⚠️ |
| **Validation (backend)** | Amount ≥ 1000 (cents) = $10; balance from `user_profiles.vp_balance`; requires `stripe_account_id` | Assumed in Edge (not re-checked here) |
| **After payout** | Inserts `prize_redemptions` + RPC `deduct_vp` | N/A (handled by Edge) |

### 3.3 Prize payout (election winner)

| Aspect | Web (React) | Flutter |
|--------|-------------|--------|
| **Flow** | Via lottery/prize services and possibly Stripe proxy | `PaymentService.processPrizePayout` → POST **`process-payout`** with `election_id`, `winner_id`, `amount` |

---

## 4. API Endpoints & Usage

### 4.1 Web (React)

| Purpose | How | Endpoint / table |
|--------|-----|-------------------|
| Auth / DB | Supabase client | N/A (client) |
| Webhooks | fetch | `VITE_API_URL` → `/api/webhooks/configure`, `/api/webhooks/:id` |
| Stripe (payment intent, payout) | `supabase.functions.invoke` | `stripe-secure-proxy` (body: `action`, `payload`) |
| Subscription checkout | Edge | `create-subscription-checkout` |

### 4.2 Flutter

| Purpose | How | Endpoint / table |
|--------|-----|-------------------|
| Auth / DB | Supabase client | N/A (client) |
| Creator payout | Dio POST | `$SUPABASE_URL/functions/v1/stripe-request-payout` |
| Payment intent / VP | Dio POST | `$SUPABASE_URL/functions/v1/create-payment-intent` (or similar) |
| Prize payout | Dio POST | `$SUPABASE_URL/functions/v1/process-payout` |
| Connect onboarding | Dio POST | `stripe-create-connect-account`, `stripe-get-onboarding-link` |
| Tax / identity | Dio POST | `stripe-tax-calculate`, `stripe-create-identity-session`, etc. |

**Difference:** Web uses a **single Edge function** (`stripe-secure-proxy`) with an `action` discriminator; Flutter uses **multiple named Edge functions** (`stripe-request-payout`, `process-payout`, etc.). Backend may still be shared if those names map to the same or similar handlers.

---

## 5. State Management

| Aspect | Web (React) | Flutter |
|--------|-------------|--------|
| **Primary** | **React Context** (Auth, Theme, FontSize) | **Singleton services** + **setState** in screens |
| **Redux / Zustand** | In package.json only; **not used** in src | N/A |
| **Provider** | N/A | Used in places (e.g. `global_filter_provider`, `sms_provider_monitor`) |
| **Riverpod** | N/A | Used in at least one screen (`creator_predictive_insights_hub`) |
| **Payout state** | Local component state (useState) in panels | Local `setState` + service calls |

---

## 6. Data Validation

| Aspect | Web (React) | Flutter |
|--------|-------------|--------|
| **Backend** | Zod in `supabase/functions/shared/inputValidation.ts` (Election, Vote, VPTransaction) | Not in Flutter repo (Edge only) |
| **Frontend schema** | No Zod/Yup in `src/` | No shared validation library (e.g. formz) |
| **Auth** | Custom `validatePassword()` in `authService.js` | Form + terms check; no duplicate password rules in explored code |
| **Payout (Web)** | Inline: amount > 0, ≤ balance, min ₹100 (cash) | — |
| **Payout (Flutter)** | Inline: min $10 / $5 by method, max $10k; `Form` + `validate()` in withdrawal form (e.g. min $10, beneficiary name) | — |
| **Shared contract** | **None** between Web and Flutter for payout request shape or limits |

---

## 7. Discrepancies & Differences (Summary)

### 7.1 Critical (data model / behavior)

1. **Wallet table name**  
   - Web: **`user_wallets`** (and migrations define `user_wallets`).  
   - Flutter: **`wallets`** (and different columns: `balance_usd`, `purchasing_power_zone`).  
   - **Risk:** Different tables or schemas; balance and payouts may not be consistent across platforms.

2. **Where user payout requests are stored**  
   - Web: **`prize_redemptions`** (cash / gift_card / crypto).  
   - Flutter: **`wallet_transactions`** with `type: 'payout'`.  
   - **Risk:** Two different persistence paths; reporting and processing logic may need to handle both or be unified.

3. **Balance check on payout**  
   - Web: Checks `wallet.availableBalance` before calling `createCashPayout`.  
   - Flutter: `WalletService.requestPayout` only inserts a row; **no balance check** in the service.  
   - **Risk:** Flutter could allow requests above available balance unless enforced by DB or another layer.

### 7.2 Important (limits & UX)

4. **Minimum payout amounts**  
   - Web: **₹100** for cash (PaymentMethodsPanel).  
   - Flutter: **$10** (bank_transfer), **$5** (gift_card), and **$10,000** max per day.  
   - **Risk:** Different currencies and limits; possible confusion and inconsistent rules.

5. **Creator payout API**  
   - Web: Single Edge function **`stripe-secure-proxy`** with `action: 'create_payout'`.  
   - Flutter: Dedicated **`stripe-request-payout`** endpoint.  
   - **Risk:** If both exist on the backend, behavior and validation must be aligned; otherwise one client may be outdated.

### 7.3 Moderate (architecture)

6. **State management**  
   - Web: Context-only; no global store for payouts.  
   - Flutter: Singletons + setState; some Provider/Riverpod.  
   - **Risk:** Harder to share validation and loading/error state patterns.

7. **Validation**  
   - No shared schema or shared validation layer between Web and Flutter (limits, required fields, error messages).  
   - **Risk:** Divergent rules and poor consistency for support and compliance.

8. **Edge function naming**  
   - Web: One proxy with action types.  
   - Flutter: Many named functions.  
   - **Risk:** Duplicate or divergent logic if not implemented as a single backend with different routes.

---

## 8. Recommendations

1. **Unify wallet model:** Decide canonical table (`user_wallets` vs `wallets`) and column set; align both apps and migrations (or add a compatibility layer).
2. **Unify payout persistence:** Either both use `prize_redemptions`, or both use `wallet_transactions` with a clear type, and update all reporting/processing to one model.
3. **Add balance check in Flutter** before inserting a payout (e.g. in `WalletService.requestPayout` or in a shared Edge function).
4. **Define shared payout rules:** Single source of truth for min/max amounts and currency (e.g. config or backend), and use it from both Web and Flutter.
5. **Document or unify creator payout backend:** Clarify whether `stripe-secure-proxy` and `stripe-request-payout` are the same logic or two paths; prefer one contract (e.g. same Edge with action or same route name).
6. **Introduce shared validation:** Backend validation for all payout requests; optionally share types/schemas (e.g. OpenAPI or shared Zod) so both clients stay in sync.

---

*Generated from indexed codebases: React/Vite Web App (`vottery_1/vottery`) and Flutter Mobile App (`vottery M`).*
