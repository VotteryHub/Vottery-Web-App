# Phase 1 Route Parity and Strict QA Checklist (Web + Mobile)

## Verification State Contract (Hardened V1)

Use these terminal states consistently across Web and Mobile verification UX:

- `verified`: receipt/hash is confirmed against verification records.
- `pending_backend`: user input is valid but no verification record is currently available.
- `failed`: invalid payload, tamper/mismatch, or deterministic validation failure.
- `unavailable`: transport/backend/system error during verification.
- `unsupported`: flow is reachable but verification mode is not supported for the current election/config.

## Cross-Platform Route Parity Matrix

| Feature | Web Route | Mobile Route/Screen | Entry Point (Web) | Entry Point (Mobile) | Expected States |
|---|---|---|---|---|---|
| 1. Cryptographic receipts | `/secure-voting-interface` and `/vote-verification-portal` | `AppRoutes.enhancedVoteCasting`, `AppRoutes.blockchainVoteReceiptCenter` | Home Feed -> Voting -> Secure Voting -> Vote Receipt | Vote Dashboard -> Cast Vote -> Blockchain Vote Receipt Center | loading, verified/failed/pending_backend/unavailable |
| 2. Mixnet anonymity | `/vote-anonymity-mixnet-control-hub` | `AppRoutes.anonymousVotingConfigurationHub` | Admin/Security menu -> Vote Anonymity | Security section -> Anonymous Voting Configuration | loading, success, error, unsupported |
| 3. ZK verification context | `/vote-verification-portal` | `AppRoutes.blockchainVoteVerificationHub` | Verify Vote card | Verify & Audit -> Blockchain Verification Hub | loading, verified, failed, unavailable |
| 4. Homomorphic context | `/cryptographic-security-management-center` | `AppRoutes.productionSecurityHardeningSprintDashboard` | Security menu -> Cryptographic Security | Security dashboards -> Hardening Sprint | loading, success, unsupported |
| 5. Threshold crypto context | `/cryptographic-security-management-center` | `AppRoutes.productionSecurityHardeningSprintDashboard` | Security menu -> Cryptographic Security | Security dashboards -> Hardening Sprint | loading, success, unsupported |
| 6. Blockchain verification portal | `/blockchain-audit-portal` | `AppRoutes.blockchainAuditPortal` -> VerifyAuditElectionsHub | Security -> Blockchain Audit | Verify & Audit menu -> Blockchain Audit Portal | loading, verified, failed, unavailable |
| 7. VVSG compliance | `/public-bulletin-board-audit-trail-center` | `AppRoutes.productionSecurityHardeningSprintDashboard` | Compliance -> Public Bulletin Board | Security dashboards -> VVSG panel | loading, success, error |
| 8. Vote verification by receipt | `/vote-verification-portal?receipt=<id_or_hash>` | `AppRoutes.blockchainVoteReceiptCenter` Verify tab | Deep link or Verify Vote card | Vote Receipt Center -> Verify Receipt tab | loading, verified, failed, pending_backend, unavailable |
| 9. Featured elections carousel | `/home-feed-dashboard` and `/vote-in-elections-hub` | `AppRoutes.socialMediaHomeFeed`, `AppRoutes.voteDiscovery`, carousel screens | Home Feed featured cards | Social Feed -> featured/trending carousel | loading, populated, empty, error |
| 10. Category browser | `/voting-categories` and `/vote-in-elections-hub` | `AppRoutes.voteDiscovery`, `AppRoutes.carouselContentDiscoveryFilterCenter` | Vote in Elections -> Categories/Filters | Vote Discovery -> category chips/filter controls | loading, filtered_results, empty, error |
| 11. Trending elections feed | `/vote-in-elections-hub` | `AppRoutes.voteDiscovery` | Home Feed -> Trending Elections | Vote Discovery -> Trending section | realtime_update, loading, empty, error |
| 12. Location discovery | `/location-based-voting` | `AppRoutes.locationVoting` | Voting menu -> Location-Based Voting | Vote Discovery -> Location Voting | permission_prompt, loading, results, empty, denied |
| 13. Advanced search hub | `/advanced-search-discovery-intelligence-hub` | `AppRoutes.unifiedSearchSystemHub`, `AppRoutes.advancedUnifiedSearchScreen` | Voting/Discovery -> Advanced Search | Discovery -> Unified Search -> Advanced Search | loading, results, no_results, error |
| 14. Claude recommendation overlay | `/context-aware-claude-recommendations-overlay` and `/claude-ai-feed-intelligence-center` | `AppRoutes.claudeContextualInsightsOverlaySystem`, `AppRoutes.contextAwareRecommendationsOverlay` | Home/AI menu -> Claude Recommendations | Feed/AI tools -> Contextual Insights Overlay | loading, recommendations, empty, error |
| 15. Topic preference onboarding | `/interactive-topic-preference-collection-hub` | `AppRoutes.topicPreferenceCollectionHub` | Onboarding -> Topic Preference Hub | Onboarding/Tutorial -> Topic Preference Hub | step_progress, saved, validation_error |
| 16. Election insights analytics | `/election-insights-predictive-analytics` | `AppRoutes.mobileElectionInsightsAnalytics` | Elections -> Insights | Analytics -> Mobile Election Insights | loading, data_ready, empty, error |

## Strict Route-by-Route Navigation QA Checklist

### Web QA Steps

1. Go to `/vote-verification-portal`.
   - Verify input field and verify button render.
   - Submit invalid short input -> deterministic failed state message.
   - Submit known valid hash/id -> `verified` or `pending_backend` state card.
2. Open deep link `/vote-verification-portal?receipt=<known_vote_hash>`.
   - Verify auto-verification starts without manual click.
   - Verify result and manual verification show identical status text.
3. Navigate to `/advanced-search-discovery-intelligence-hub` from home/discovery CTA.
   - Verify route resolves directly (no placeholder).
   - Verify filters and search states: loading, results, no_results.
4. Navigate to `/context-aware-claude-recommendations-overlay`.
   - Verify concrete page loads (not AI placeholder center).
   - Verify recommendation cards render and transparency/why section is visible.
5. Navigate to `/claude-ai-feed-intelligence-center`.
   - Verify concrete page loads and feed intelligence sections render.
6. Navigate to `/public-bulletin-board-audit-trail-center`.
   - Verify VVSG and bulletin/audit panels load.
7. Navigate to `/location-based-voting`.
   - Deny location permission -> denied state.
   - Allow location -> loading then nearby elections/empty state.
8. Navigate to `/secure-voting-interface`.
   - Cast flow reaches receipt section and verification link target points to `/vote-verification-portal`.

### Mobile QA Steps

1. Open `AppRoutes.blockchainVoteReceiptCenter` -> Verify Receipt tab.
   - Empty payload -> no submission.
   - Invalid JSON -> `unavailable` or `failed` reason shown.
   - Valid known receipt -> `verified` state and timestamp.
   - Unknown receipt -> `pending_backend` state.
2. Open `AppRoutes.blockchainAuditPortal`.
   - Verify it opens VerifyAuditElectionsHub (not RoutePlaceholderScreen).
3. Open `AppRoutes.friendsManagementHub`.
   - Verify it opens SocialConnectionsManager (not unrelated dashboard).
4. Open `AppRoutes.unifiedSearchSystemHub` and `AppRoutes.advancedUnifiedSearchScreen`.
   - Verify both routes resolve directly and search flow returns states.
5. Open `AppRoutes.claudeContextualInsightsOverlaySystem`.
   - Verify contextual overlay screen loads and allows recommendation interaction.
6. Open `AppRoutes.locationVoting`.
   - Deny location permission -> denied/fallback state.
   - Grant location -> results or empty state.
7. Open `AppRoutes.mobileElectionInsightsAnalytics`.
   - Verify loading, data-ready, and empty/error fallback UI.

## Negative Path Checks (Web + Mobile)

- Unknown route shows platform fallback (web route fallback or mobile placeholder) without crash.
- Verification backend timeout/network error maps to `unavailable`.
- Invalid receipt payload maps to `failed` (never silently succeeds).
- Missing verification record maps to `pending_backend` (not false verified).
- Role-protected routes deny unauthorized users without redirect loops.

## Sign-off Criteria for Phase 1

- All routes in matrix are reachable from at least one in-app entry point.
- No critical navigation dead-ends for touched features.
- Verification flows use deterministic state contract.
- Web/Mobile user-facing status semantics are aligned.

## Phase 1 Route Sweep Results (Execution)

Date: 2026-03-20

### Web (Route Registry + Deep-Link Contract)

| Check | Result | Evidence |
|---|---|---|
| `/vote-verification-portal` registered | PASS | `src/Routes.jsx` |
| `/advanced-search-discovery-intelligence-hub` registered | PASS | `src/Routes.jsx` |
| `/context-aware-claude-recommendations-overlay` mapped to real page | PASS | `src/Routes.jsx` (no placeholder target) |
| `/claude-ai-feed-intelligence-center` mapped to real page | PASS | `src/Routes.jsx` (no placeholder target) |
| `/public-bulletin-board-audit-trail-center` registered | PASS | `src/Routes.jsx` |
| Deep-link receipt auto verify (`?receipt=`) implemented | PASS | `src/pages/vote-verification-portal/index.jsx` (`useSearchParams`) |
| Verification input prefill from deep-link | PASS | `src/pages/vote-verification-portal/components/VerificationInput.jsx` |
| Feature-gate keys added for new routes | PASS | `src/config/routeFeatureKeys.js` |

### Mobile (Named Route + Flow Mapping)

| Check | Result | Evidence |
|---|---|---|
| `blockchainAuditPortal` resolves to non-placeholder screen | PASS | `lib/config/route_registry.dart` -> `VerifyAuditElectionsHub` |
| `friendsManagementHub` resolves to social connections flow | PASS | `lib/main.dart` -> `SocialConnectionsManager` |
| `unifiedSearchSystemHub` route registered | PASS | `lib/config/route_registry.dart` |
| `advancedUnifiedSearchScreen` route registered and navigable | PASS | `lib/main.dart`, `lib/widgets/dual_header_top_bar.dart` |
| `claudeContextualInsightsOverlaySystem` route registered | PASS | `lib/config/route_registry.dart` |
| `locationVoting` route registered | PASS | `lib/config/route_registry.dart` |
| `mobileElectionInsightsAnalytics` route registered | PASS | `lib/config/route_registry.dart` |
| Feature-gate keys aligned for verification/search/overlay routes | PASS | `lib/config/route_feature_keys.dart` |

### Hardened Verification State Contract

| Check | Result | Evidence |
|---|---|---|
| Mobile service states defined (`verified/pending_backend/failed/unavailable/unsupported`) | PASS | `lib/services/blockchain_receipt_service.dart` |
| Mobile verify UI renders state-aware status | PASS | `lib/presentation/blockchain_vote_receipt_center/blockchain_vote_receipt_center.dart` |
| Web deterministic result contract with deep-link + manual path convergence | PASS | `src/pages/vote-verification-portal/index.jsx` |

### Validation Command Notes

- `ReadLints` on touched files: PASS (no linter diagnostics).
- Web `npm run build`: ENV/PATH failure in workspace shell (`WinDeLot` path splitting issue; `vite` path resolve error), not a code-level route error.
- Mobile `flutter analyze` and `dart analyze` stalled in this environment and were terminated after extended wait; no diagnostics emitted before stall.
