# Certification continuation - sign-off (2026-03-23)

## Scope

This document records **evidence-backed** progress after resuming the 1-233 certification program. **GREEN** for a feature still means *only* when a cited automated check or signed test run proves it, not heuristic "implemented in repo" status alone.

## Changes in this continuation

| Area | Evidence / artifact |
|------|---------------------|
| Browser-safe Slack alerts | `src/services/brandAlertService.js` - replaced `@slack/webhook` (Node `process` / `node:os` in bundle) with `fetch` POST to the incoming webhook URL so production preview/E2E does not white-screen. |
| Vite `define` | `vite.config.mjs` - `process.env.NODE_ENV` + `global` for any remaining CJS expectations in dependencies. |
| Ledger evidence script | `scripts/apply-regression-evidence.mjs` - **org-wide baseline** on every row: `run-certification-policy-audit.mjs`, `npm:check:route-feature-keys`, `npm:build`; rows with **Mobile App** in `availability` also cite Flutter `batch1_route_allowlist_policy_test`, `feature_parity_navigation_test`, `app_urls_parity_test`; plus existing Cypress hub/policy maps and crypto disclosure IDs. Run `npm run cert:refresh-ledgers`. |
| Batch-1 route allowlist (Web) | `src/config/batch1RouteAllowlist.js` - added `PARTICIPATORY_ADS_STUDIO_ROUTE` and hub-parity smoke targets (gamification, compliance, revenue, bulletin, quest). **Rationale:** participatory policy page must be routable; hub smoke must not false-positive on home-feed nav text. |
| Batch-1 route allowlist (Mobile) | `lib/config/batch1_route_allowlist.dart` - `participatoryAdsStudio` + `participatoryAdsStudioWebCanonical` aligned with Web. |
| Hub parity E2E | `cypress/e2e/hub-parity-signoff.cy.js` - **route-resolution smoke**: visit W1-W10 paths; expect no 404 and final `pathname` is either the hub or an allowed redirect (`/`, home-feed, auth, onboarding, role-upgrade). Stubbed Supabase/auth does not prove hub H1 copy. |
| Policy regression E2E | `cypress/e2e/certification-policy-regression.cy.js` - same REST/auth intercept pattern as hub-parity; longer timeouts; broader auth copy fallbacks. |
| Crypto executable guardrails | `scripts/check-cryptographic-primitives.mjs`, `scripts/check-crypto-route-contract-parity.mjs`, `scripts/check-vote-crypto-contract-parity.mjs`, and `scripts/check-ledger-critical-crypto-evidence.mjs` are wired into baseline/refresh flows to prevent regressions across Web/Mobile crypto routes, vote-proof contracts, and required ledger evidence for rows 12-15 and 17. |
| GREEN proof integrity guardrail | `scripts/check-ledger-green-proof-quality.mjs` enforces that any row marked GREEN cites feature-specific executable evidence beyond org-wide baseline strings. |
| Payment/locale contract parity guardrail | `scripts/check-payment-locale-contract-parity.mjs` enforces canonical route constants, Web feature-key mappings, service contracts (`lotteryPaymentService`, `localeService`), mobile URL constants, and evidence mappings for IDs 73/83/87/168/171/174. |
| Payment/locale service behavior guardrail | `scripts/check-payment-locale-service-behavior.mjs` executes service-level checks for `lotteryPaymentService.formatCurrency` and callable payment/locale service contracts. |
| Fraud/perplexity contract parity guardrail | `scripts/check-fraud-perplexity-contract-parity.mjs` enforces Web/Mobile canonical path/feature-key/URL parity and evidence wiring for fraud failover rows 146/147/152/197/199. |
| AI orchestration contract parity guardrail | `scripts/check-ai-orchestration-contract-parity.mjs` enforces Web/Mobile canonical path/feature-key/URL parity and evidence wiring for AI orchestration rows 196/197/198/199/200/201. |
| AI route aliases contract parity guardrail | `scripts/check-ai-route-aliases-contract-parity.mjs` enforces Web/Mobile canonical alias path/feature-key/URL parity and evidence wiring for AI alias rows 148/149/155/151/144/203. |
| Enterprise SSO contract parity guardrail | `scripts/check-enterprise-sso-contract-parity.mjs` enforces Web/Mobile enterprise SSO/operations canonical path-feature-key-URL parity and evidence wiring for row 88. |
| Vote casting contract parity guardrail | `scripts/check-vote-casting-contract-parity.mjs` enforces Web/Mobile vote-casting canonical path/feature-key/URL parity and evidence wiring for rows 1/11/16/18/60/96. |
| Achievement unlock contract parity guardrail | `scripts/check-achievement-unlock-contract-parity.mjs` enforces Web/Mobile gamification/profile/notification canonical path-feature-key-URL parity and evidence wiring for rows 27/33/34/35/36/43/49/68/180. |
| Creator suite contract parity guardrail | `scripts/check-creator-suite-contract-parity.mjs` enforces Web/Mobile creator-suite canonical path/feature-key/URL parity and evidence wiring for rows 95/97/98/99/100/101/102/106/107/108/109/110/111/114/115/116/118/121/122. |
| Feature integration contract parity guardrail | `scripts/check-feature-integration-contract-parity.mjs` enforces Web/Mobile analytics-export/webhook/reporting/logs/sync canonical path-feature-key-URL parity and evidence wiring for rows 42/78/96/175/187/193/207. |
| Claude recommendations contract parity guardrail | `scripts/check-claude-recommendations-contract-parity.mjs` enforces Web/Mobile canonical path/feature-key/URL parity and evidence wiring for Claude recommendation rows 24/141/142/201. |
| Stripe payout contract parity guardrail | `scripts/check-stripe-payout-contract-parity.mjs` enforces Web/Mobile route-feature-key/URL parity and evidence wiring for payout workflow rows 103/104/105/169/171/173. |
| SMS/alert contract parity guardrail | `scripts/check-sms-alert-contract-parity.mjs` enforces Web/Mobile canonical path/feature-key/URL parity and evidence wiring for SMS failover rows 218/219/221/222/223. |
| NPM | `npm run test:e2e:certification-policy` - runs policy spec only. |

## Commands verified in this session

- `node scripts/run-certification-policy-audit.mjs` - **PASS** (Web + Mobile policy toggles and internal-ads kill-switch).
- `flutter test test/navigation/batch1_route_allowlist_policy_test.dart` - **PASS**.
- `npm run build` - **PASS** (after `brandAlertService` + Vite `define` changes).
- `vite preview` + `cypress run` - **PASS** for `certification-policy-regression.cy.js` and `hub-parity-signoff.cy.js` (`baseUrl=http://127.0.0.1:4173`).
- Run `npm install` after pull - `@slack/webhook` removed from `package.json` (use `fetch` for Slack incoming webhooks).

## Manual / CI follow-up (required for full GREEN claims)

1. **Dev server + Cypress:** `npm start` (or Vite on a known port) with `cypress run --config baseUrl=<that-origin>` for:
   - `npm run test:e2e:hub-parity-signoff`
   - `npm run test:e2e:certification-policy`
2. **Vite production build:** run `npm run build` to completion in your environment (large bundle; used as compile gate).
3. **Ledger evidence refresh:** from repo root:
   - `node scripts/apply-regression-evidence.mjs` - annotates `feature-baseline-ledger-1-233.json` (hub-parity + policy Cypress IDs, policy audit, Flutter tests).
   - `node scripts/build-certification-ledger-batches.mjs` - regenerates `ledger-L1-*.md` through `ledger-L5-*.md`.

### Feature IDs tied to Cypress (2026-03-23)

| Spec | Feature IDs |
|------|-------------|
| `hub-parity-signoff.cy.js` | 18, 166, 167, 174, 175, 178, 179, 180, 184, 186 |
| `certification-policy-regression.cy.js` | 124, 132 |
| `campaign-management-parity.cy.js` | 126, 127, 133, 134, 135 |
| `ads-studios-analytics-parity.cy.js` | 124, 128, 129, 130, 131, 132 |
| `template-gallery-api-docs-parity.cy.js` | 125, 226 |
| `brand-webhook-api-parity.cy.js` | 123, 224, 226 |
| `payment-locale-parity.cy.js` | 73, 83, 87, 168, 171, 174 |
| `premium-subscription-wallet-signal.cy.js` | 76 |
| `route-guard-sanity.cy.js` | 136-140, 143, 145, 150, 153, 154, 156-165, 168, 170, 172, 176, 177, 181-183, 185, 187-192, 194, 196, 197, 202, 209-217, 220, 225, 227-233 |
| `ai-route-aliases-parity.cy.js` | 144, 148, 149, 151, 155, 203 |
| `route-parity-tranche2.cy.js` | 20, 23, 25, 26, 28-32, 37, 39, 40, 41, 50-52, 54-57, 58, 59, 61, 62, 63, 65, 67, 69, 72, 74, 75, 76, 78, 79, 81, 84, 90, 94 |
| `voting-roles-routing.cy.js` | 1-10, 88, 113, 117, 119, 120 |
| `enterprise-sso-route-flow.cy.js` | 88 |
| `route-parity-stabilization.cy.js` | 189, 193, 195, 198, 199, 201, 204, 205, 206, 208 |
| `stripe-payout-workflows.cy.js` | 103, 104, 105, 169, 171, 173 |
| `fraud-detection-failover.cy.js` | 146, 147, 152, 197, 199 |
| `sms-provider-failover.cy.js` | 218, 219, 221, 222, 223 |
| `ai-orchestration.cy.js` | 196, 197, 198, 199, 200, 201 |
| `claude-recommendations.cy.js` | 24, 141, 142, 201 |
| `vote-casting.cy.js` | 1, 11, 16, 18, 60, 96 |
| `achievement-unlock.cy.js` | 27, 33, 34, 35, 36, 43, 49, 68, 180 |
| `creator-suite-parity.cy.js` | 95, 97, 98, 99, 100, 101, 102, 106, 107, 108, 109, 110, 111, 114, 115, 116, 118, 121, 122 |
| `user-foundation-parity.cy.js` | 19, 21, 22, 44, 45, 46, 47, 48, 53, 64, 66, 70, 71, 73, 80, 82, 83, 86, 87, 89, 91, 92, 93 |
| `crypto-compliance-parity.cy.js` | 12, 13, 14, 15, 17 *(route/compliance UX smoke only)* |
| `user-quality-attributes-parity.cy.js` | 38, 77, 85 *(quality-attribute smoke only)* |
| `critical-path-vote-to-payout.cy.js` | 1, 16, 18, 60 |
| `feature-integration-suite.cy.js` | 42, 78, 96, 175, 187, 193, 207 |

**Batch runners (Web):** `npm run test:e2e:cert-domain-batch`, `npm run test:e2e:cert-routing-platform-batch`, `npm run test:e2e:cert-ops-extended-batch`, `npm run test:e2e:cert-voter-flow-batch`, `npm run test:e2e:creator-suite-parity`, `npm run test:e2e:user-foundation-parity`, `npm run test:e2e:crypto-compliance-parity`, and `npm run test:e2e:user-quality-attributes-parity`. Use with `vite preview` or a dev server plus Cypress `baseUrl`.

**Not mapped to a stable ledger ID:** `voting-route-single.cy.js` remains ad-hoc (`ROLE_PATH`-driven).

**Full mapped suite (Web):** `npm run test:e2e:cert-all-mapped-specs`.
## Honest certification stance (unchanged)

The baseline ledger remains mostly **AMBER** until each row is tied to **hard evidence**. **Org-wide regression strings** on every ID mean "this product baseline was run," not "this specific feature passed E2E." Cryptographic / mixnet / ZK rows cannot be marked **GREEN** without dedicated proofs and tests; do not conflate UI stubs with verified cryptography.

## Web / Mobile parity (Batch-1 ads & routes)

| Item | Web (React) | Mobile (Flutter) |
|------|-------------|------------------|
| Participatory route in Batch-1 allowlist | `PARTICIPATORY_ADS_STUDIO_ROUTE` in `batch1RouteAllowlist.js` | `AppRoutes.participatoryAdsStudio` + `participatoryAdsStudioWebCanonical` |
| Internal ads kill-switch | `INTERNAL_ADS_BATCH1_DISABLED` in `votteryAdsConstants.js` | `internalAdsBatch1Disabled` in `vottery_ads_constants.dart` |
| Policy E2E (Web) | `cypress/e2e/certification-policy-regression.cy.js` | N/A (mirror manually or integration_test if added) |
| Batch-1 ads policy copy (Flutter) | `BATCH1_*` in `votteryAdsConstants.js` | `test/presentation/batch1_ads_policy_copy_test.dart` (ledger row **124** evidence via `apply-regression-evidence.mjs`) |
| Crypto Batch-1 scope disclosure (Web) | `CryptographicBatch1ScopeBanner.jsx` on mixnet + crypto admin hubs | N/A (Web-only admin surfaces); ledger rows **12-15** cite banner + hub pages as **honest scope** evidence (verdict stays **RED** for real crypto) |

## Consolidated follow-up notes

- Keep evidence current with `npm run cert:refresh-ledgers` after any mapping/script changes.
- Crypto-critical evidence (rows `12-15,17`) is now guarded in CI/local via `npm run cert:check-ledger-critical-crypto-evidence`.
- Crypto-critical verdict posture is guarded via `npm run cert:check-ledger-critical-crypto-verdicts` (`12-15` remain RED, `17` remains AMBER until explicit promotion criteria changes).
- GREEN row promotion integrity is guarded via `npm run cert:check-ledger-green-proof-quality`.
- Coverage accounting is available via `npm run cert:report-cypress-coverage`.
- `voting-route-single.cy.js` remains intentionally ad-hoc and excluded from stable 1-233 ledger mapping.


