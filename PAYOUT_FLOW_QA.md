# Payout Flow QA: Web vs Mobile Comparison

**Lead QA Engineer review.**  
*Note: There are no `src/features/payouts` or `lib/features/payouts` folders; payout logic lives in pages/services (Web) and presentation/services (Mobile). This doc compares those flows and flags discrepancies. Web is the designated Source of Truth for the unified YouTube-style redesign.*

---

## 1. API Endpoints & Data Layer

| Concern | Web (React) | Mobile (Flutter) | Same? |
|--------|-------------|------------------|-------|
| **Wallet table** | `user_wallets` | `wallets` | **No** – different table names; backend schema uses `user_wallets`. |
| **Wallet balance fields** | `available_balance`, `locked_balance`, `total_winnings`, `total_redeemed` | `balance_usd`, `purchasing_power_zone` (from `wallets`) | **No** |
| **Payout request storage** | `prize_redemptions` (redemption_type: cash/gift_card/crypto) | `wallet_transactions` (type: `payout`) | **No** – different tables and shapes. |
| **Payout settings** | `payout_settings` (get/update) | Not used in current wallet payout flow | **No** – Web has settings, Mobile does not. |
| **Transaction history** | `wallet_transactions` (with `wallet_id`) | `wallet_transactions` (no `wallet_id` in Flutter insert) | **Partial** – same table but Flutter insert omits `wallet_id` (required in schema). |
| **Creator payout** | Edge: `stripe-secure-proxy` (action `create_payout`) | Edge: `stripe-request-payout` (Dio POST) | **No** – different entrypoints. |

**Verdict:** They do **not** hit the same API endpoints / tables. Web aligns with Supabase migrations (`user_wallets`, `prize_redemptions`, `wallet_transactions` with `wallet_id`); Mobile uses `wallets` and writes payouts only to `wallet_transactions` without a shared redemption record.

---

## 2. Error Handling States

| Scenario | Web (React) | Mobile (Flutter) | Identical? |
|----------|--------------|-------------------|------------|
| Invalid amount (empty/≤0) | "Please enter a valid amount" | Not explicitly same string (validation in widget) | **No** |
| Insufficient balance | "Insufficient balance" | No balance check in service – can submit anyway | **No** – and Mobile has a logic gap. |
| Below minimum | "Minimum payout amount is ₹100" (cash) | "Minimum payout for bank transfer is $10" / "Minimum payout for gift cards is $5" | **No** – different copy and units (₹100 vs $10/$5). |
| Request fails (API/network) | "Failed to process payout. Please try again." or `result?.error?.message` | "Payout failed: ${e.toString()}" (raw exception) | **No** – Mobile exposes raw errors. |
| Success | "Payout request submitted successfully!" | "Payout request submitted successfully. Processing time: …" | **Partial** – similar intent, different wording. |
| Not authenticated | Thrown in service → "Not authenticated" or generic catch | Silent return `false` or SnackBar with exception text | **No** |

**Verdict:** Error handling is **not** identical. Messages, validation, and user-facing copy differ; Mobile does not check balance before requesting payout.

---

## 3. Hidden Logic (Client-Side) – Web vs Mobile

| Logic | Web (React) | Mobile (Dart) | Missing on Mobile? |
|-------|-------------|----------------|--------------------|
| **Processing fee % by method** | Yes – fee % per option (e.g. 2.5% bank, 5% cash), `finalAmount = amount - (amount * fee/100)` | No – no fee display or deduction in payout request | **Yes** – fee calculation and display missing. |
| **Minimum payout amount** | ₹100 (cash/redemption) in UI and validation | $10 (bank), $5 (gift card); different currency and values | **Different** – not missing but inconsistent. |
| **Balance check before submit** | Yes – `parseFloat(amount) > parseFloat(wallet?.availableBalance)` | No – `WalletService.requestPayout` only inserts; no balance check | **Yes** – critical gap on Mobile. |
| **Currency / formatting** | INR, `formatCurrency` with `wallet?.currency` | USD and multi-currency selector; different default | **Different** – Web defaults INR, Mobile USD. |
| **Redemption types** | cash, bank_transfer, gift_card, crypto with different fees and copy | bank_transfer, gift_card, crypto (no fee breakdown) | **Partial** – Mobile lacks fee and consistent copy. |

**Verdict:** There is meaningful hidden logic on Web (fee calculation, balance check, minimum amount) that is missing or different on Mobile. Aligning to Web as source of truth implies adding balance check, fee logic (or server-side equivalent), and unified thresholds/copy on Mobile.

---

## 4. Fix Strategy (Before YouTube-Style Redesign)

- **Source of truth:** Web (React).
- **API/data:** Both platforms should use the same backend contract:
  - Wallet: `user_wallets` (not `wallets`).
  - User payout request: either `prize_redemptions` only or a single Edge function that writes one canonical record (e.g. `prize_redemptions` or a dedicated `payout_requests` table) and returns the same error codes.
- **Validation:** Same minimum threshold (e.g. 100 in base currency), balance check before request, and optional processing-fee rules applied consistently (server preferred).
- **Error messages:** Single set of user-facing strings (e.g. from shared constants or backend); Mobile should not show raw `e.toString()`.
- **Redesign:** Replace both flows with a **YouTube-style payout experience** (threshold, monthly/scheduled cycle, single payment method, clear “Next payment date” and history) while applying the above alignment.

---

---

## 5. Implemented: YouTube-Style Unified Flow

- **Web:** `src/features/payouts` — `PayoutScreen`, `usePayout` hook, `payoutApi` (user_wallets + prize_redemptions), shared `constants.js` and `PAYOUT_ERRORS`. Routes: `/digital-wallet-hub`, `/earnings-payouts` both render `PayoutScreen`.
- **Mobile:** `lib/features/payouts` — `PayoutScreen`, `PayoutController`, `PayoutApi` (same tables and error messages). Routes: `digitalWalletScreen` and `earningsPayouts` both render `PayoutScreen`.
- **Contract:** Same threshold ($100), same user-facing error messages, balance check before request, next payment date (21st–26th). Mobile uses `user_wallets` and `prize_redemptions` to match Web (same Supabase project required).
