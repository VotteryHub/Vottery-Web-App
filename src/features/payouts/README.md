# Payout feature (YouTube-style)

This feature is the **single payout flow** for Web and Mobile. Both use the same API contract and error messages.

## Backend requirements

- **Supabase project:** Web and Mobile must use the **same** Supabase project (same `SUPABASE_URL` / `VITE_SUPABASE_URL`).
- **Tables:**
  - `user_wallets` – balance and wallet id per user.
  - `prize_redemptions` – payout requests (cash/gift_card/crypto).
  - `payout_settings` – preferred method, threshold, bank details (optional).
- **Migration:** Run Supabase migrations so that `user_wallets` exists. If you have a legacy `wallets` table, the migration `20260228100000_ensure_user_wallets_and_backfill_from_wallets.sql` will backfill `user_wallets` from it.

## Routes

- **Web:** `/digital-wallet-hub`, `/earnings-payouts` → `PayoutScreen`.
- **Mobile:** `AppRoutes.digitalWalletScreen`, `AppRoutes.earningsPayouts` → `PayoutScreen`.

## Navigation

- **Web:** Header quick links and Left sidebar include “Earnings & payouts” (→ `/earnings-payouts`).
- **Mobile:** Profile menu in the bottom bar includes “Earnings & payouts” (→ `earningsPayouts`).
