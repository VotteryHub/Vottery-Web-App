# Hub parity & finance/gamification QA sign-off (Mar 2026)

Use this checklist to **sign off** Web + Mobile behavior after routing/parity work.  
**Definition of done (per `.cursorrules`):** automated smoke passes where noted, manual rows executed once per release train, no P0/P1 defects open for listed assertions.

## Prerequisites

| Step | Web | Mobile |
|------|-----|--------|
| Dev server / app | `npm start` → `http://localhost:3000` | `flutter run` with valid `--dart-define=SUPABASE_URL=...` and `SUPABASE_ANON_KEY=...` |
| Automated Web | From Web repo: `npm run test:e2e:hub-parity-signoff` (requires dev server running) | — |
| Automated Mobile | — | `flutter test test/app_urls_parity_test.dart test/revenue_intelligence_defaults_test.dart` |

---

## 1. Web — automated smoke (`hub-parity-signoff.cy.js`)

Each test **visits** the path, asserts **body visible**, **no generic crash string**, and **page-specific copy** (or redirect URL).

| # | Route | Assertions (minimum) |
|---|--------|----------------------|
| W1 | `/gamification-campaign-management-center` | Text: `Gamification Campaign Management Center` |
| W2 | `/gamification-rewards-management-center` | Text: `Gamification & Rewards Center` |
| W3 | `/security-compliance-automation-center` | Text: `Security Compliance Automation Center` |
| W4 | `/international-payment-dispute-resolution-center` | Text: `International Payment Dispute Resolution` |
| W5 | `/unified-revenue-intelligence-dashboard` | Text: `Revenue Intelligence` |
| W6 | `/admin-subscription-analytics-hub` | Text: `Subscription Analytics Hub` |
| W7 | `/public-bulletin-board-audit-trail-center` | Text: `Public Bulletin Board` |
| W8 | `/vote-verification-portal` | Text: `Vote Verification Portal` |
| W9 | `/unified-payment-orchestration-hub` | Text: `Unified Payment Orchestration Hub` |
| W10 | `/admin-quest-configuration-control-center` | URL includes `dynamic-quest-management-dashboard` |

**Pass criteria:** all specs green with `baseUrl` matching your dev server.

---

## 2. Web — manual extensions (2–3 checks per hub)

Run when changing **auth guards**, **feature toggles**, or **Supabase RLS**.

| Hub | Manual check 1 | Manual check 2 | Manual check 3 |
|-----|----------------|----------------|----------------|
| Campaign center | Admin (or allowed role) can open tabs without blank panel | Refresh loads stats | Network: `platformGamificationService` calls succeed or show safe empty state |
| Rewards center | Logged-in user sees XP header | Tab switch works | Error state if API fails is visible (not white screen) |
| Security compliance automation | GDPR tab renders | Refresh works | No infinite loading on API error |
| Intl dispute center | List or empty state renders | Primary CTA visible | No uncaught exception in console |
| Unified revenue | Time range changes reload | Forecast section appears | Toast/error on total failure |
| Admin subscription analytics | Date range changes | Export triggers download | Panels show data or empty labels |
| Public bulletin | **Non-admin** user can open (navigation) | Stats area visible | Links not 404 |
| Vote verification | Submit invalid code → user-safe message | Valid flow (staging) | Mobile browser deep link |
| Payment orchestration | Deep links to Stripe hubs work | Wallet section loads or skeleton | Sign out → redirect/guard OK |
| Quest admin redirect | Direct URL lands on quest dashboard | Bookmarks OK | Back navigation sane |

**Sign-off:** initial **_______** date **_______**

---

## 3. Mobile — automated (`test/*_test.dart`)

| # | Test file | What it proves |
|---|-----------|----------------|
| M1 | `app_urls_parity_test.dart` | Critical `AppUrls` paths match Web routes (disputes, bulletin, subscription hub, etc.) |
| M2 | `revenue_intelligence_defaults_test.dart` | `getDefaultZoneRecommendations()` returns 8 zones (UI contract) |

---

## 4. Mobile — manual (admin drawer → Web)

For each row: **Admin** → open drawer item → **Open in browser** → confirm Web URL path and page loads.

| Drawer label (approx.) | Expected Web path contains |
|-------------------------|----------------------------|
| International payment disputes | `/international-payment-dispute-resolution-center` |
| Claude dispute moderation (Web) | `/claude-ai-dispute-moderation-center` |
| Admin subscription analytics (Web) | `/admin-subscription-analytics-hub` |
| Stripe subscriptions (Web) | `/stripe-subscription-management-center` |
| Automated payout / Country payout (Web) | `/automated-payout-calculation-engine`, `/country-based-payout-processing-engine` |
| Admin quest configuration (Web) | `/admin-quest-configuration-control-center` |
| Gamification admin / engine / campaigns / rewards | `/comprehensive-gamification-admin-control-center`, `/platform-gamification-core-engine`, `/gamification-campaign-management-center`, `/gamification-rewards-management-center` |
| Security compliance automation (Web) | `/security-compliance-automation-center` |
| Compliance / audit / regulatory (Web) | `/compliance-dashboard`, `/compliance-audit-dashboard`, `/regulatory-compliance-automation-hub` |
| Public bulletin / Vote verification (Web) | `/public-bulletin-board-audit-trail-center`, `/vote-verification-portal` |

**Extra manual — Unified Revenue (native):** open **Unified Revenue Intelligence** screen → pull to refresh / refresh icon → values update or error surfaced; Forecast tab shows summary when Claude configured.

**Sign-off:** initial **_______** date **_______**

---

## 5. Release gate

- [ ] `npm run test:e2e:hub-parity-signoff` **PASS** (CI or local with server)
- [ ] `flutter test test/app_urls_parity_test.dart test/revenue_intelligence_defaults_test.dart` **PASS**
- [ ] Web manual section reviewed for current sprint scope
- [ ] Mobile manual browser parity reviewed

**Release owner sign-off:** **_______** **Date:** **_______**
