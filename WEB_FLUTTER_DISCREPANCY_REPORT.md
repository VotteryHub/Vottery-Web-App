# Web vs Flutter Discrepancy Report

**Role:** Full Stack Tech Engineer & Lead QA Engineer  
**Scope:** React Web App vs Flutter Mobile App – feature parity, state management, validation, API usage.

---

## 1. Payout Requesting

### 1.1 Data model & API usage

| Aspect | Web (React) | Flutter (Mobile) | Discrepancy |
|--------|-------------|------------------|-------------|
| **Primary table** | `prize_redemptions` (via `src/features/payouts/api.js`) | **Two paths:** (1) `PayoutApi` → `prize_redemptions` ✓ (2) `WalletService.requestPayout` → **`wallet_transactions`** ✗ | Flutter has a second path that writes to a different table. |
| **Wallet source** | `user_wallets` (balance check + `wallet_id`) | Same in `PayoutApi`; `WalletService` does **not** check `user_wallets` or balance | Balance validation and wallet linkage differ when `WalletService` is used. |
| **Response shape** | `{ data, error }` with `error.message` | `PayoutApi`: `(success: bool, error: String?)`; `WalletService`: `bool` only | Different return contracts; Flutter does not expose structured error messages when using `WalletService`. |

### 1.2 Which Flutter code uses which path

- **Uses `WalletService.requestPayout`** (wrong table, no balance check, no user-facing error messages):
  - `lib/presentation/digital_wallet_prize_redemption_system/digital_wallet_prize_redemption_system.dart` → `_requestPayout` calls `_walletService.requestPayout`.
  - Any other screen that calls `WalletService.instance.requestPayout` (e.g. wallet dashboard widgets).
- **Uses `PayoutApi.requestPayout`** (aligned with Web):
  - `lib/features/payouts/` (e.g. payout screens that use `PayoutApi.instance.requestPayout`).

### 1.3 Validation & constants

| Item | Web | Flutter | Fix |
|------|-----|---------|-----|
| **Minimum payout threshold** | `src/features/payouts/constants.js`: **100**; `SHARED_CONSTANTS.js` **PAYMENT_CONSTANTS.PAYOUT_THRESHOLD: 50** (duplicate, inconsistent) | `PayoutConstants.payoutThreshold`: **100** | Pick one source of truth (e.g. **100** in feature constants) and remove or align the other (e.g. SHARED_CONSTANTS). |
| **Below-threshold message** | `Minimum payout amount is $100.` (from payouts/constants) | `Minimum payout amount is $100.` (from `PayoutErrors.belowThreshold`) | Already aligned if threshold is 100. |
| **Hardcoded minimums in UI** | None in payout feature | `digital_wallet_prize_redemption_system`: **$10** bank, **$5** gift card | Remove hardcoded 10/5; use single `PayoutConstants.payoutThreshold` (and same message as Web). |

### 1.4 Recommended fixes (payout)

1. **Single payout path on Flutter**  
   - Route **all** payout requests through **`PayoutApi.requestPayout`** (same as Web: `user_wallets` + `prize_redemptions`).  
   - **Deprecate or refactor** `WalletService.requestPayout`: either remove it or make it a thin wrapper that calls `PayoutApi.instance.requestPayout` and maps `(success, error)` to a bool if needed for legacy callers.

2. **Screens currently using `WalletService.requestPayout`**  
   - In `digital_wallet_prize_redemption_system.dart` (and any wallet dashboard withdrawal UI):  
     - Replace `_walletService.requestPayout(method, amount)` with `PayoutApi.instance.requestPayout(amount: amount, method: method)`.  
     - Use the returned `error` string for SnackBar and remove hardcoded $10 / $5 checks; use `PayoutConstants.payoutThreshold` and `PayoutErrors` for validation and messages.

3. **Constants**  
   - In Web: use **one** source for payout threshold (e.g. `src/features/payouts/constants.js` with **100**).  
   - In `SHARED_CONSTANTS.js`: either remove `PAYOUT_THRESHOLD` / `PAYOUT_BELOW_THRESHOLD` or make them re-export the feature constant so both platforms and shared docs stay in sync.  
   - In Flutter: keep `PayoutConstants.payoutThreshold = 100` and use it everywhere (including any “minimum payout” copy).

---

## 2. Vote casting

### 2.1 Data model & behavior

| Aspect | Web | Flutter | Discrepancy |
|--------|-----|---------|-------------|
| **Table** | `votes` + **`zero_knowledge_proofs`** | `votes` only | Flutter does **not** insert into `zero_knowledge_proofs`. |
| **Vote row content** | RSA/ElGamal encrypted payload, `encrypted_vote_data`, `rsa_public_key`, `elgamal_public_key`, `blockchain_hash`, `vote_hash`, **`lottery_ticket_id`** (if lotterized) | `vote_hash`, `blockchain_hash` (SHA-256), no encryption, no `lottery_ticket_id` | Different schema usage and security model. |
| **Return type** | `{ data, receipt, error }` with receipt (e.g. `lotteryTicketId`, `zkProof`, `cryptographicProofs`) | `bool` (success/failure) | Callers on Flutter cannot get receipt or structured error. |
| **Error handling** | Returns `error: { message }`; caller can show message | No error message returned; only `false` and logging | UX and debugging differ. |

### 2.2 Recommended fixes (vote casting)

1. **Contract alignment (short term)**  
   - Flutter `VotingService.castVote` return type: change to something like `Future<({bool success, String? errorMessage, Map<String, dynamic>? receipt})>` and surface the same error messages as Web where possible (e.g. "Not authenticated", "Failed to cast vote").  
   - Optionally insert a minimal row into `zero_knowledge_proofs` from Flutter (e.g. placeholder or same structure as Web) so backend/analytics stay consistent.

2. **Feature parity (medium term)**  
   - Document that Web has Tier 1 crypto (RSA, ElGamal, ZK proof) and Flutter currently uses hash-only verification.  
   - Either: (a) implement equivalent crypto + `zero_knowledge_proofs` + `lottery_ticket_id` on Flutter, or (b) define a “lite” vote schema and backend behavior for mobile and document the difference.

---

## 3. State management

| Area | Web | Flutter | Note |
|------|-----|--------|------|
| **Payout** | Feature-level hook `usePayout` + `payoutApi`; state in React state | `PayoutApi` singleton + various screens holding local state; some screens use `WalletService` | Unify on one API (PayoutApi) and, if desired, a single controller/hook-style layer for loading/error/success. |
| **Auth** | `supabase.auth.getUser()` in API/hooks | `AuthService.instance` / `_auth.currentUser` | Same backend; consistent. |
| **Voting** | `votesService.castVote`; state in page/hook | `VotingService.instance.castVote`; state in widgets | Same Supabase `votes` table; return shape and ZK/lottery differ as above. |

---

## 4. Data validation

| Validation | Web | Flutter | Fix |
|------------|-----|---------|-----|
| **Payout amount** | `> 0`, finite, `>= PAYOUT_THRESHOLD`, `<= available_balance` in `api.js` | Same in `PayoutApi`; **not** in `WalletService`; different thresholds in `digital_wallet_prize_redemption_system` ($10/$5) | Use only PayoutApi and single threshold (e.g. 100); remove $10/$5. |
| **Payout auth** | Check in `requestPayout` (getUser) | Check in `PayoutApi` and WalletService | Keep; ensure all paths use same check when using PayoutApi. |

---

## 5. API endpoint / backend usage

| Feature | Web | Flutter | Align |
|---------|-----|--------|--------|
| **Payout** | Supabase only: `user_wallets`, `payout_settings`, `prize_redemptions` | PayoutApi: same. WalletService: **`wallet_transactions`** | Use only Supabase tables as Web (prize_redemptions); remove or delegate WalletService payout path. |
| **Vote** | Supabase: `votes`, `zero_knowledge_proofs` | Supabase: `votes` only | Add `zero_knowledge_proofs` and/or document and optionally implement same contract. |

(If Flutter ever calls a backend URL like `stripe-request-payout` for payout, that should be reconciled with Web: either Web also uses that endpoint for processing or Flutter should use only Supabase + same Edge/batch job as Web.)

---

## 6. Summary of fixes

1. **Payout**  
   - Use **one** payout path on Flutter: **PayoutApi** (Supabase `user_wallets` + `prize_redemptions`).  
   - Replace or delegate `WalletService.requestPayout` so it does not write to `wallet_transactions` for payout.  
   - Use single threshold (100) and same error messages (PayoutErrors) everywhere; remove hardcoded $10/$5 in `digital_wallet_prize_redemption_system`.  
   - Web: single source of truth for payout threshold (e.g. payouts/constants.js); align or remove SHARED_CONSTANTS duplicate.

2. **Vote casting**  
   - Align return type and error messaging (success, errorMessage, optional receipt).  
   - Optionally align data model (zero_knowledge_proofs, lottery_ticket_id, encrypted fields) or document “lite” mobile flow.

3. **Constants**  
   - Keep Flutter `PayoutConstants` and `PayoutErrors` in sync with Web `src/features/payouts/constants.js` (threshold, messages, status values).  
   - In Web, avoid duplicate definitions (e.g. SHARED_CONSTANTS vs payouts/constants); prefer one source and re-export if needed.

Once these are done, both apps will handle payout requesting the same way (same table, same validation, same messages), and vote casting will be closer in contract and data model.

---

## 7. Fixes applied (implementation summary)

- **Flutter `WalletService.requestPayout`**  
  Now delegates to `PayoutApi.instance.requestPayout` so all payout requests use `user_wallets` + `prize_redemptions` (same as Web). Return type changed to `(success, errorMessage)` so callers can show user-facing errors.

- **Flutter screens**  
  - `wallet_dashboard`, `wallet_prize_distribution_center`: Use the new `requestPayout` result and show `errorMessage` on failure; success message set to the same as Web: *"Payout request submitted. You'll be paid by the next payment date."*  
  - `digital_wallet_prize_redemption_system`: Switched to `PayoutApi.requestPayout` and `PayoutConstants.payoutThreshold` / `PayoutSuccess.requestSubmitted`; removed hardcoded $10 / $5 minimums.

- **Web `SHARED_CONSTANTS.js`**  
  `PAYMENT_CONSTANTS.PAYOUT_THRESHOLD` and `ERROR_MESSAGES.PAYOUT_BELOW_THRESHOLD` set to **100** and aligned message so they match `src/features/payouts/constants.js`.

- **Vote casting**  
  No code changes; report documents the gap (Web: votes + zero_knowledge_proofs + receipt; Flutter: votes only, bool return). Recommended follow-up: align return type and optionally add ZK/lottery fields on Flutter.
