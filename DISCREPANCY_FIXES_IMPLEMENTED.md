# Discrepancy Fixes & Missing Features – Implemented

This document lists the changes made to correct discrepancies, complete partially implemented features, and implement missing items (per FEATURE_DISCREPANCIES_AND_PRIORITIES.md).

---

## 1. Mobile: Unified wallet and payout (user_wallets, balance check, same errors)

### `lib/services/wallet_service.dart`
- **getUserWallet()** added: reads from `user_wallets` (canonical table).
- **getWallet()** updated: uses `user_wallets` first; falls back to `wallets` for backward compatibility. Returns a map that includes `available_balance` (from `user_wallets`) or `balance_usd` (from `wallets`).
- **initializeWallet()** updated: creates a row in `user_wallets` first; falls back to `wallets` if needed.
- **getPayoutHistory()** updated: reads from `prize_redemptions` first, then `wallet_transactions` (same contract as Web).
- **requestPayout()** rewritten:
  - Validates amount (invalid, below minimum $100) and uses **PayoutErrors** (same strings as Web).
  - Fetches **user_wallets** and checks **amount ≤ available_balance** before submitting.
  - Inserts into **prize_redemptions** (with `wallet_id`, `user_id`, `redemption_type: cash`, etc.) instead of only `wallet_transactions`.
  - Returns `Map` with `success` and optional `payout_error` key for user-facing message (no raw `e.toString()`).
- **minPayoutAmount** set to 100 (aligned with Web PAYOUT_THRESHOLD).

### Callers updated to handle new return type and show PayoutErrors
- **wallet_prize_distribution_center.dart**: Uses `result['success']` and `result[WalletService.keyPayoutError]` for SnackBar.
- **wallet_dashboard.dart**: Same; throws `Exception(errorMsg)` so catch block shows user-facing message.
- **digital_wallet_prize_redemption_system.dart**: Same; SnackBar shows `errorMsg` instead of generic failure.

---

## 2. Creator payout API unified (single backend contract)

### `lib/services/stripe_connect_service.dart`
- **requestPayout()** now calls **`stripe-secure-proxy`** with body:
  - `action: 'create_payout'`
  - `payload: { amount: amountUsd * 100, currency: 'usd' }`
- Same contract as Web; Edge uses `user_profiles.vp_balance` and `stripe_account_id` and already enforces server-side balance check.

---

## 3. Mobile: Payout settings (same table as Web)

### New files
- **lib/services/payout_settings_service.dart**: `getPayoutSettings()`, `updatePayoutSettings(settings)` for `payout_settings` table (same as Web).
- **lib/presentation/payout_settings_screen/payout_settings_screen.dart**: Screen with auto payout toggle, minimum threshold, preferred method, payout schedule; loads/saves via `PayoutSettingsService`.

### Integration
- **lib/routes/app_routes.dart**: New route `payoutSettingsScreen` → `PayoutSettingsScreen`.
- **lib/presentation/comprehensive_settings_hub/comprehensive_settings_hub.dart**: New “Payments & Payouts” section with “Payout Settings” opening `PayoutSettingsScreen`.

---

## 4. Mobile: Password validation (match Web)

### New file
- **lib/utils/password_validator.dart**: `PasswordValidator.validate(password)` returns list of errors; `validateJoined()` returns single string or null. Rules: min 12 chars, uppercase, lowercase, number, special character, and common-password check (same as Web authService).

### Auth usage
- **lib/services/auth_service.dart**:
  - **signUpWithEmail()**: Calls `PasswordValidator.validateJoined(password)`; throws `AuthException` with that message if invalid.
  - **updatePassword()**: Same validation before calling `updateUser`.

---

## 5. Backend (already present)

- **stripe-secure-proxy** `createPayout`: Already validates amount ≥ $10 (cents), checks `user_profiles.vp_balance` and `stripe_account_id`, and returns clear errors. No code change; Mobile now uses this single Edge.

---

## 6. What was not implemented (lower priority / deferrable)

- **Strict 174-screen parity** and **1:1 route naming**: Not done (per “not important” list).
- **Shared Zod/formz schema**: Not added (backend validation already in Edge).
- **Interactive onboarding wizard / AI-guided tutorial**: Not added (deferrable).
- **WebAuthn/passkey parity**: Not verified (deferrable).
- **Legacy wallet_transactions insert with wallet_id**: Legacy `requestPayout` now writes to `prize_redemptions`; any remaining `wallet_transactions` inserts elsewhere were not changed. New payout flow uses `prize_redemptions` with `wallet_id`.

---

## 7. How to verify

1. **Mobile wallet**: Sign in, open a screen that uses `WalletService.getWallet()` or `getUserWallet()`; confirm balance comes from `user_wallets` when the table exists. Request a payout above balance and confirm “Insufficient balance.” message; below $100 and confirm “Minimum payout amount is $100.”.
2. **Creator payout**: From creator payout UI, request payout; in network tab confirm request goes to `stripe-secure-proxy` with `action: 'create_payout'`.
3. **Payout settings**: Settings → Payments & Payouts → Payout Settings; change and save; confirm `payout_settings` row in Supabase.
4. **Password**: Register a new account with a weak password (e.g. “short” or “Password1”); confirm validation errors. Change password with same rules.

---

*Implemented per FEATURE_DISCREPANCIES_AND_PRIORITIES.md and FEATURE_IMPLEMENTATION_QA_REPORT.md.*
