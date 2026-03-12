# Web App (React) – Feature Gap Analysis & Rocket.New Implementation Prompts

**Document purpose:** Cross-check of all features from the **prompt features implementation folder** (`prompts_extracted/` + `PROMPTS_FOLDER_FULL_ANALYSIS.md`) against the **React Web App** (Vottery). This document lists **partially implemented** and **completely missed** features on the Web App, and provides **copy-paste prompts with exact implementation instructions** for use on Rocket.New.

**Sources:**  
- All 17 section files in `prompts_extracted/`  
- `PROMPTS_FOLDER_FULL_ANALYSIS.md`  
- `FEATURE_IMPLEMENTATION_QA_REPORT.md`  
- Web codebase: `vottery_1/vottery/src/` (Routes.jsx, pages, services)

**Layout:** Structured for easy copy to PDF (sections, tables, code blocks).

---

## PART A – PARTIALLY IMPLEMENTED FEATURES (Web App)

Features that exist in the prompts and are **partially** present in the React Web App (missing screens, logic, or full spec).

| # | Feature | What exists on Web | What is missing (to reach 100%) |
|---|--------|---------------------|----------------------------------|
| 1 | **Platform-wide (Whole Vottery) Gamification** | `platform-gamification-core-engine` page, `platformGamificationService.js`, `platform_gamification_campaigns` / `platform_gamification_winners`, percentization in UI. | **Home and Profile display:** Prominent display on Home and User Profile showing current month prize pool, number of winners, countdown, and optional **spinning slot machine**; visibility controlled by admin enable/disable. Ensure 1:1 with prompt (percentization by country/continent/gender/MAU/DAU/premium/subscribers/advertisers/creators/others, prize rename/branding). |
| 2 | **Age verification** | `ageVerificationService.js`, `age_verification_records`, nav to `/age-verification-digital-identity-center`. | Full spec: **AI facial**, **Gov ID**, **reusable digital identity** as in prompt 12. Verify route exists and UI supports all three methods. |
| 3 | **Interactive onboarding wizard** | LeftSidebar link to `/interactive-onboarding-wizard`; `navigationService` has path. | **Route in Routes.jsx:** Ensure `/interactive-onboarding-wizard` is registered and component exists (step-by-step, role-based). If missing, add route and page. |
| 4 | **AI-guided interactive tutorial** | Page folder `ai-guided-interactive-tutorial-system` exists. | **Route in Routes.jsx:** Ensure `/ai-guided-interactive-tutorial-system` is registered. Role-based tutorial and integration across key screens. |
| 5 | **Community Engagement Dashboard** | Page `community-engagement-dashboard/index.jsx` and LeftSidebar path `/community-engagement-dashboard`. | **Route in Routes.jsx:** Ensure `/community-engagement-dashboard` is in the main routes array so the link works. Leaderboards for feedback contributions, voting participation, feature requests, adoption metrics. |
| 6 | **Ad Slot Manager & home feed integration** | `ad-slot-manager-inventory-control-center`, `AdSlotRenderer.jsx`, home feed has `adSlots` state. | Confirm **home feed** (and other surfaces) use `AdSlotRenderer` with **waterfall logic** (internal ads first, AdSense only for unfilled slots). Verify no double-fill and fill-rate tracking. |
| 7 | **Cross-Domain Data Sync Hub** | Cross-domain intelligence and Supabase real-time exist in various hubs. | Dedicated **Cross-Domain Data Sync Hub** screen: unified dashboard for real-time Supabase sync across elections, posts, ads, users with **conflict resolution** and **offline queue monitoring** (prompt 12). |
| 8 | **Advanced Performance Profiling** | `load-testing-performance-analytics-center` has Performance Profiling panel. | **Per-screen:** CPU/memory/network per screen, **automated bottleneck identification**, and **optimization playbooks** (prompt 12). |
| 9 | **Comprehensive Feature Analytics** | Multiple analytics dashboards exist. | Single dashboard: **adoption rates, engagement patterns, revenue impact for all 143 (or current) screens**, with **cohort analysis** and **A/B testing framework** (prompt 12). |
| 10 | **Lottery / Gamification REST API & webhooks** | Services and Edge functions exist; vote flow and draws work. | **Public REST layer:** Expose `/api/tickets/verify`, `/api/draws/initiate`, `/api/audit/logs` (or equivalent) and **configurable webhooks** for draw completed, vote cast (prompt 12, Online Gamification doc). |
| 11 | **API Documentation Portal** | `res-tful-api-management-center` has API Documentation panel; other API docs in places. | **Developer-focused:** Full **REST API explorer**, **webhook management** for brand partners, 3rd party integration docs (prompt 2). |
| 12 | **Community Moderation Tools** | Content Moderation Control Center exists. | **Full spec:** Content **flagging dashboard**, **moderator queue**, **appeal workflows**, **AI review** for election integrity (prompt 2). |
| 13 | **Production Deployment Hub** | Deployment-related and monitoring pages exist. | **Dedicated hub:** **Release management**, **blue-green deployment** toggles, **feature flag controls**, **rollback procedures**, **staged rollout** (10%/25%/100%) (prompt 15). |
| 14 | **Security & Compliance Audit Screen** | Compliance dashboards exist. | **Pre-launch checklist:** **Encryption**, **biometric auth**, **data residency**, **GDPR/CCPA workflows**, **penetration testing results**, **security sign-off** (prompt 15). |
| 15 | **WebSocket &lt;100ms (replace 30s polling)** | Real-time and WebSocket hubs exist. | Ensure **all** monitoring dashboards use **WebSocket** (or Supabase Realtime) with **&lt;100ms** latency; remove 30-second polling where still present (prompt 15). |

---

## PART B – COMPLETELY MISSED OR NOT IMPLEMENTED (Web App)

Features specified in the prompts that are **not** implemented (or not findable) in the React Web App.

| # | Feature | Prompt source | Notes |
|---|--------|----------------|-------|
| 1 | **Interactive onboarding wizard (route + flow)** | 1, 3, 8, 13 | Sidebar links to `/interactive-onboarding-wizard`; route not in main Routes.jsx. Add route and full step-by-step, role-based onboarding. |
| 2 | **AI-guided interactive tutorial (route)** | 13 | Page exists; ensure route `/ai-guided-interactive-tutorial-system` is in Routes.jsx and accessible. |
| 3 | **Community Engagement Dashboard (route)** | 20 | Page exists; ensure `/community-engagement-dashboard` is in Routes.jsx. |
| 4 | **Cross-Domain Data Sync Hub** | 12 | Unified dashboard for Supabase sync (elections, posts, ads, users), conflict resolution, offline queue. No dedicated page found. |
| 5 | **Comprehensive Feature Analytics (143 screens)** | 12 | Analytics per screen with cohort and A/B testing. Not a single dedicated dashboard. |
| 6 | **Public REST API for lottery** | 12, Online Gamification doc | Endpoints: ticket verify, draw initiate, audit logs. Backend may exist; public REST layer not exposed. |
| 7 | **Configurable webhooks (draw completed, vote cast)** | 12, Online Gamification doc | Webhook URLs configurable by admin; events: draw completed, vote cast. |
| 8 | **Age verification: AI facial, Gov ID, reusable identity** | 12 | Full triple-method spec. Current implementation may be basic; add AI facial and Gov ID flows if missing. |
| 9 | **Production Deployment Hub** | 15 | Release management, blue-green, feature flags, rollback, staged rollout 10%/25%/100%. |
| 10 | **Security & Compliance Audit Screen** | 15 | Checklist dashboard for encryption, biometric, data residency, GDPR/CCPA, pentest, sign-off. |
| 11 | **API Documentation Portal (full)** | 2 | Developer docs + REST API explorer + webhook management for partners. |
| 12 | **Platform Gamification display on Home/Profile** | 13 | Prominent block on Home and Profile: prize pool, winners count, slot machine, admin toggle. |
| 13 | **3D Carousel systems (Kinetic Spindle, Isometric Deck, Liquid Horizon)** | 18 | Optional; if only one carousel exists, add or document the three variants. |
| 14 | **Unified Payment Orchestration Hub** | 13 | Centralized payment method management (subscriptions, participation fees, payouts), smart routing Stripe/PayPal by zone. |
| 15 | **Shared validation schema (Zod) for API/Edge** | CROSS_PLATFORM_LOGIC | Backend validation (e.g. Zod in Edge) for payout and critical payloads; optional OpenAPI for Web + Mobile. |

---

## PART C – HOW TO IMPLEMENT (Summary)

- **Partial:** For each row in Part A, add the missing UI, route, or logic so behavior matches the prompt. Reuse existing services and Supabase tables; add only missing pieces.
- **Missed:** For each row in Part B, either implement the feature (new page, route, service) or explicitly document as deferred. When adding, use same table names and API contracts as Mobile where applicable.
- **Constants/API sync:** Keep Web and Mobile aligned: same route path names where relevant, same env vars, same table/column names, same error message constants (e.g. `PAYOUT_ERRORS`).

---

## PART D – COVERAGE: DO D.1–D.11 COVER ALL 15 PARTIAL + 15 MISSED?

**Short answer:** D.1–D.11 alone did **not** cover all 30 items (they covered 11 of 15 partial and 11 of 15 missed). **D.12–D.17** were added so that **all 15 partial + 15 missed** are now covered. The table below lists which feature is covered by which prompt.

| Part | # | Feature | Covered by prompt |
|------|---|--------|--------------------|
| **A (Partial)** | 1 | Platform-wide Gamification | **D.1** |
| A | 2 | Age verification (AI facial, Gov ID, reusable identity) | **D.12** |
| A | 3 | Interactive onboarding wizard | **D.2** |
| A | 4 | AI-guided interactive tutorial | **D.2** |
| A | 5 | Community Engagement Dashboard | **D.2** |
| A | 6 | Ad Slot Manager & home feed | **D.10** |
| A | 7 | Cross-Domain Data Sync Hub | **D.3** |
| A | 8 | Advanced Performance Profiling | **D.4** |
| A | 9 | Comprehensive Feature Analytics | **D.5** |
| A | 10 | Lottery REST API & webhooks | **D.6** |
| A | 11 | API Documentation Portal (full) | **D.13** |
| A | 12 | Community Moderation Tools (full) | **D.14** |
| A | 13 | Production Deployment Hub | **D.7** |
| A | 14 | Security & Compliance Audit Screen | **D.8** |
| A | 15 | WebSocket &lt;100ms (replace 30s polling) | **D.15** |
| **B (Missed)** | 1 | Interactive onboarding wizard (route) | **D.2** |
| B | 2 | AI-guided tutorial (route) | **D.2** |
| B | 3 | Community Engagement Dashboard (route) | **D.2** |
| B | 4 | Cross-Domain Data Sync Hub | **D.3** |
| B | 5 | Comprehensive Feature Analytics | **D.5** |
| B | 6 | Public REST API for lottery | **D.6** |
| B | 7 | Configurable webhooks | **D.6** |
| B | 8 | Age verification: AI facial, Gov ID, reusable identity | **D.12** |
| B | 9 | Production Deployment Hub | **D.7** |
| B | 10 | Security & Compliance Audit Screen | **D.8** |
| B | 11 | API Documentation Portal (full) | **D.13** |
| B | 12 | Platform Gamification display on Home/Profile | **D.1** |
| B | 13 | 3D Carousel systems (Kinetic Spindle, etc.) | **D.16** |
| B | 14 | Unified Payment Orchestration Hub | **D.9** |
| B | 15 | Shared validation schema (Zod) for API/Edge | **D.17** |

**D.11** is a process rule (check both codebases, apply twice, verify constants), not a feature-specific prompt.

**D.12–D.17** were added so that **all 15 partial and 15 missed** features have a corresponding implementation prompt. Coverage is now complete: every Part A and Part B item is covered by exactly one of D.1–D.17 (D.11 is meta).

---

## PART D – COPY-PASTE PROMPTS FOR ROCKET.NEW (Web App – React)

Use the following prompts on Rocket.New. Copy each block as-is to implement the corresponding feature in the **React Web App** only (unless the prompt says otherwise). After implementing on Web, apply the equivalent change to the Flutter Mobile App and verify constants.

---

### D.1 – Platform Gamification display on Home and Profile (React)

```
In the Vottery React Web App (src/), add the Platform Gamification display block to the Home feed and User Profile pages as specified in the prompts.

Requirements:
- Data: Use existing platformGamificationService.getCampaigns() and get active campaign with is_enabled true. Use tables platform_gamification_campaigns and platform_gamification_winners.
- Home: In home-feed-dashboard (e.g. top or sidebar), add a section "Platform Gamification" showing: current month campaign name, total prize pool amount, number of winners, countdown to next draw (or "Draw complete"), and a compact spinning slot machine animation (or link to /platform-gamification-core-engine). If admin has disabled platform gamification (is_enabled false), do not render this section.
- Profile: In user-profile-hub, add the same block (or a smaller badge) so every user sees it. Same visibility rule (hide if disabled).
- Reuse: Use existing PlatformGamificationCoreEngine and platformGamificationService; add only the display components and ensure route /platform-gamification-core-engine is already in Routes.jsx.
- Constants: Use same table names (platform_gamification_campaigns, platform_gamification_winners) and service methods as already in the codebase.
```

---

### D.2 – Register missing routes: onboarding, tutorial, community engagement (React)

```
In the Vottery React Web App (src/Routes.jsx), register the following routes if they are not already in the routes array:

1. /interactive-onboarding-wizard  →  InteractiveOnboardingWizard component (create under src/pages/interactive-onboarding-wizard/ if it does not exist). Step-by-step, role-based onboarding (voter, creator, advertiser, admin).
2. /ai-guided-interactive-tutorial-system  →  AIGuidedInteractiveTutorialSystem component (already exists under src/pages/ai-guided-interactive-tutorial-system/). Lazy load: lazy(() => import('./pages/ai-guided-interactive-tutorial-system/index')).
3. /community-engagement-dashboard  →  CommunityEngagementDashboard component (already exists under src/pages/community-engagement-dashboard/). Lazy load: lazy(() => import('./pages/community-engagement-dashboard/index')).

Add the corresponding import (lazy) at the top and add the three path/element entries to the routes array so that LeftSidebar links to these paths work. Do not remove any existing routes.
```

---

### D.3 – Cross-Domain Data Sync Hub (React)

```
In the Vottery React Web App, add a new page "Cross-Domain Data Sync Hub" as specified in prompt 12.

Requirements:
- Route: /cross-domain-data-sync-hub (add to Routes.jsx and LeftSidebar/navigationService).
- UI: Unified dashboard showing real-time Supabase sync status for: elections, posts, ads (sponsored_elections), and users (user_profiles or auth). Show for each: last sync time, pending changes count, conflict count, and status (healthy / warning / error).
- Conflict resolution: Section or modal to list and resolve sync conflicts (e.g. same row updated on two clients). Allow "keep local", "keep remote", or "merge" where applicable.
- Offline queue: If the app uses an offline queue (e.g. for mutations when offline), show queue length and retry status. If no offline queue exists, show "N/A" or add a simple queue status from Supabase Realtime.
- Data: Use Supabase Realtime and existing Supabase client. No new backend tables required unless you add a sync_metadata table for last_sync_per_entity.
- Reuse: Reuse existing Supabase service and real-time patterns from other hubs.
```

---

### D.4 – Advanced Performance Profiling (per-screen, bottlenecks, playbooks) (React)

```
In the Vottery React Web App, extend the existing Performance Profiling (load-testing-performance-analytics-center or equivalent) to match prompt 12.

Requirements:
- Per-screen: For each route/screen, show CPU, memory, and network usage (sample or estimate from Performance API / Resource Timing where available in the browser). Display in a table or list with screen name (route path) and metrics.
- Bottleneck identification: Add a section "Bottlenecks" that lists screens or API calls that exceed thresholds (e.g. load time >2s, memory >500MB). Use heuristics from existing load testing or add simple client-side timing.
- Optimization playbooks: For each bottleneck type, show a short "playbook" (e.g. "Use lazy loading", "Reduce bundle size", "Cache API response"). Can be static text or link to internal docs.
- Integrate with existing Performance Profiling panel; do not duplicate the whole dashboard. Add these three subsections or tabs.
```

---

### D.5 – Comprehensive Feature Analytics dashboard (React)

```
In the Vottery React Web App, add a "Comprehensive Feature Analytics" dashboard as in prompt 12.

Requirements:
- Route: /comprehensive-feature-analytics-dashboard (add to Routes.jsx and nav).
- Data: For each major screen/feature (use a list of route paths from Routes.jsx, or up to 143 if you have a defined list), show: adoption rate (% of users who visited), engagement pattern (e.g. avg time, actions per session), and revenue impact (if applicable, e.g. for payout or subscription screens). Store aggregates in Supabase (e.g. feature_analytics table with screen_id, date, adoption_rate, engagement_metrics, revenue_impact). If table does not exist, create migration and backfill from existing analytics or GA.
- Cohort analysis: Filter or segment by cohort (e.g. signup week, role, country). Add dropdown or tabs for cohort selection.
- A/B testing framework: Section to define A/B tests (e.g. variant A vs B for a screen), track which variant a user saw, and show conversion or engagement comparison. Minimal implementation: table ab_tests, ab_assignments, and a simple UI to create test and view results.
- Reuse: Use existing analytics services and Google Analytics if already integrated; supplement with Supabase for server-side metrics.
```

---

### D.6 – Lottery REST API and webhooks (Backend / Edge)

```
In the Vottery project (Supabase Edge or Node backend), expose a public REST API layer and webhooks for the Online Gamification / lottery system as in prompt 12 and the Online Gamification doc.

Requirements:
- REST endpoints (implement via Supabase Edge Functions or existing API):
  - GET or POST /api/tickets/verify  —  Verify a ticket (vote ID) and return whether it is recorded and counted (hash check). Use existing vote verification logic.
  - POST /api/draws/initiate  —  Initiate a draw for a given election (admin or creator). Use existing draw/lottery logic.
  - GET /api/audit/logs  —  Return audit logs (e.g. cryptographic_audit_logs or equivalent) for a given election or time range, with hash chain. Paginate.
- Webhooks: Admin-configurable webhook URLs (store in table webhook_config with url, events[]). Events: "draw_completed", "vote_cast". On draw completion or vote cast, POST to each registered URL with payload { event, election_id, timestamp, ... }. Use Supabase Edge or database triggers to invoke webhook dispatcher.
- Security: Authenticate API with API key or JWT; restrict /api/draws/initiate to admin/creator. Webhooks: validate outbound URLs and use retry with backoff.
- Constants: Document endpoint paths and payload shapes so React and Flutter can call the same API.
```

---

### D.7 – Production Deployment Hub (React)

```
In the Vottery React Web App, add a "Production Deployment Hub" page as in prompt 15.

Requirements:
- Route: /production-deployment-hub (add to Routes.jsx and nav under Admin or DevOps).
- UI: Release management section (list recent releases, version, date, status); blue-green deployment toggles (e.g. switch traffic between blue and green); feature flag controls (list flags and on/off); rollback procedure (button or link to rollback last release); staged rollout (dropdown or slider: 10%, 25%, 100% of users). 
- Backend: If you do not have a real release server, use Supabase table deployment_config (e.g. current_release, feature_flags jsonb, rollout_percentage) and Edge function or RPC to update. Frontend reads/writes via Supabase client with RLS so only admin can change.
- Integrate with existing monitoring or CI/CD if any; otherwise standalone.
```

---

### D.8 – Security & Compliance Audit Screen (React)

```
In the Vottery React Web App, add a "Security & Compliance Audit" screen as in prompt 15.

Requirements:
- Route: /security-compliance-audit-screen (add to Routes.jsx and nav).
- UI: Checklist dashboard with items: Encryption (e.g. "Data at rest encrypted", "TLS in transit"); Biometric auth (optional per election); Data residency (e.g. "EU data in EU region"); GDPR/CCPA workflows (e.g. "Data export", "Right to delete"); Penetration testing results (e.g. "Last pentest date", "Critical issues: 0"); Pre-launch security sign-off (e.g. "Sign-off by", "Date"). Each item: status (Pass / Fail / N/A) and optional notes. Store checklist state in Supabase table security_audit_checklist (id, item_key, status, notes, updated_at) so only admin can update.
- Read-only for non-admin; admin can update status and notes. Export checklist as PDF or CSV.
```

---

### D.9 – Unified Payment Orchestration Hub (React)

```
In the Vottery React Web App, add a "Unified Payment Orchestration Hub" as in prompt 13.

Requirements:
- Route: /unified-payment-orchestration-hub (add to Routes.jsx and nav).
- UI: Centralized view for payment methods: (1) Subscription payment method (Stripe default card or PayPal), (2) Participation fee payment method (per election), (3) Payout method (bank account / Stripe Connect). Show which method is used for which flow and by zone if applicable. Allow user to set or update each (link to existing Stripe Connect, payout_settings, or subscription billing portal). Smart routing: display "Stripe" vs "PayPal" by zone or user preference from payout_settings or user_profiles.
- Data: Use existing payout_settings, Stripe Connect, and subscription tables. No new tables unless you add payment_method_preferences (user_id, flow_type, provider, zone).
- Reuse: Reuse existing Stripe Connect linking and payout settings components; this page orchestrates and links to them.
```

---

### D.10 – Ad Slot Manager: ensure home feed uses waterfall (React)

```
In the Vottery React Web App, verify and fix the home feed so that Ad Slot Manager waterfall is correctly applied.

Requirements:
- Home feed (home-feed-dashboard): Must use AdSlotRenderer or equivalent for every ad slot. Logic: (1) Request next internal (participatory) ad for the slot from ad slot service or Supabase. (2) If an internal ad is returned, render it. (3) If no internal ad (unfilled), render Google AdSense in that slot only. Do not render both in the same slot. Do not render AdSense in a slot that already has an internal ad.
- Verify: adSlots state or props passed to AdSlotRenderer must come from a service that implements this waterfall (e.g. getAdForSlot(slotId)). If the current code renders internal ads and AdSense independently, refactor so one component per slot gets a single "ad" object (internal or fallback AdSense).
- Fill rate: Optionally track and display fill rate (internal vs AdSense) in Ad Slot Manager dashboard. Use same ad_slot_* or sponsored_elections tables as existing.
```

---

### D.12 – Age verification: AI facial, Gov ID, reusable digital identity (React)

```
In the Vottery React Web App, extend the existing Age Verification (ageVerificationService, age_verification_records, route /age-verification-digital-identity-center) to support the full spec from prompt 12.

Requirements:
- Three methods: (1) AI facial verification (e.g. camera capture + age-estimation or liveness check), (2) Government ID upload and verification (e.g. passport, driver's license; store hash or reference, verify age from ID), (3) Reusable digital identity (e.g. once verified, user gets a "verified age" token or flag reusable across elections that require age check).
- UI: On age-verification-digital-identity-center (or equivalent), offer tabs or steps: "Verify with face", "Verify with ID", "Use existing verification". If user already has reusable verification, show status and "Already verified until [date]" or similar.
- Data: Use existing age_verification_records; add columns if needed (e.g. method: 'facial'|'gov_id'|'reusable', id_reference, expires_at). Reusable = same record referenced for multiple elections without re-verification.
- Integration: Election creation or voting flow checks age_verification_records for the user when election has min_age_requirement; allow reuse if record is valid and not expired.
- Constants: Same table and field names as Mobile (age_verification_records, age_verification_audit_logs) so both platforms stay in sync.
```

---

### D.13 – API Documentation Portal (full): REST API explorer, webhook management (React)

```
In the Vottery React Web App, add or extend the API Documentation Portal to match prompt 2 (developer documentation, REST API explorer, webhook management for brand partners and enterprises).

Requirements:
- Route: /api-documentation-portal or extend existing res-tful-api-management-center. Add to Routes.jsx and nav.
- REST API explorer: List all public API endpoints (e.g. /api/tickets/verify, /api/draws/initiate, /api/audit/logs, auth endpoints). For each: method, path, request body schema, response schema, example request/response. Allow "Try it" with API key input and execute request from the browser (or link to Postman/OpenAPI).
- Webhook management: UI for admin or brand partners to register webhook URLs and select events (e.g. draw_completed, vote_cast). CRUD on webhook_config (url, events[], secret for signing, enabled). Show delivery log (last 50 attempts, status, payload snippet).
- 3rd party integration docs: Short doc section on how to get API keys, rate limits, and embed elections (e.g. iframe or deep links). Link to existing docs if any.
- Reuse: Use same webhook_config table and event names as in D.6 (Lottery REST API and webhooks). Expose only documented, safe endpoints in the explorer.
```

---

### D.14 – Community Moderation Tools (full): flagging, moderator queue, appeal workflows (React)

```
In the Vottery React Web App, extend the Content Moderation Control Center to match prompt 2 (content flagging dashboard, moderator queue, appeal workflows, AI review for election integrity).

Requirements:
- Content flagging dashboard: List user-flagged content (posts, comments, elections) with: content snippet, reporter, reason, date, status (pending/reviewed/resolved). Filter by type (post, comment, election) and status. Allow moderator to "Dismiss", "Remove content", or "Escalate".
- Moderator queue: Dedicated queue of items awaiting review (status = pending). Sort by priority or date. One-click actions: Approve, Remove, Request AI review. If AI content moderation exists (e.g. OpenAI/Claude), show AI confidence score and recommendation.
- Appeal workflows: When content is removed, allow author to submit an appeal. Appeals list: appellant, original content ref, reason, date. Moderator can "Uphold removal" or "Restore content". Notify user of outcome (e.g. via Resend or in-app).
- Data: Use or add tables: content_flags (id, content_type, content_id, reporter_id, reason, status, created_at), moderation_actions (id, flag_id, moderator_id, action, created_at), content_appeals (id, flag_id, appellant_id, reason, status, created_at). RLS: only moderators/admins see queue and appeals.
- Integrate with existing Content Moderation Control Center; add tabs or sections for "Flags", "Queue", "Appeals". Same constants and table names as Mobile if you add equivalent moderation on Flutter.
```

---

### D.15 – WebSocket &lt;100ms: replace 30s polling in monitoring dashboards (React)

```
In the Vottery React Web App, ensure all monitoring dashboards use WebSocket or Supabase Realtime with sub-100ms latency instead of 30-second polling.

Requirements:
- Identify all dashboards that currently use setInterval or polling (e.g. 30-second refresh) for: fraud alerts, incident tracking, performance metrics, system health. Search for setInterval, setTimeout with 30000, or "30" in context of refresh.
- Replace with: Supabase Realtime subscriptions (channel on relevant tables, e.g. system_alerts, fraud_alerts) or a dedicated WebSocket connection to a backend that pushes updates. On each event, update local state so the UI re-renders within 100ms of the server event.
- Fallback: If Realtime is disconnected, show "Reconnecting..." and retry with exponential backoff; optionally fall back to a single poll every 5s until reconnected.
- Targets: Advanced Monitoring Hub, Fraud Detection & Alert Management Center, Live Platform Monitoring Dashboard, Production Monitoring, and any other admin/creator dashboard that shows live metrics. Document which pages were updated.
- Do not change business logic; only change the data-fetch mechanism from polling to push (Realtime/WebSocket).
```

---

### D.16 – 3D Carousel systems (Kinetic Spindle, Isometric Deck, Liquid Horizon) (React, optional)

```
In the Vottery React Web App, implement or document the three 3D Carousel variants specified in prompt 18: Kinetic Spindle, Isometric Deck, Liquid Horizon.

Requirements:
- If only one carousel exists today: Add two more variants (or clearly document that one variant is used everywhere and the other two are deferred).
- Kinetic Spindle: Carousel with a central spindle axis; items rotate around the axis (e.g. vertical or horizontal).
- Isometric Deck: Items arranged in an isometric grid/deck; navigation shifts the deck with isometric perspective.
- Liquid Horizon: Flowing, horizon-style carousel with smooth liquid-like transitions.
- Usage: Use existing carousel entry points (e.g. home feed, Jolts, elections) and allow admin or A/B test to choose variant per section. Store variant choice in config (e.g. feature_flags or carousel_config table).
- Performance: Lazy load carousel assets; target 60fps on high-end and 30fps on low-end (per prompt 19). Reuse existing 3d-carousel-performance-optimization-center patterns.
- Constants: Same variant names (kinetic_spindle, isometric_deck, liquid_horizon) in Web and Mobile if Flutter has equivalent carousels.
```

---

### D.17 – Shared validation schema (Zod) for API/Edge (Backend, optional)

```
In the Vottery project, introduce shared request/response validation for critical API payloads (e.g. payout request, vote cast, draw initiate) so Web and Mobile use the same rules.

Requirements:
- Backend: In Supabase Edge Functions (or Node API) that handle payout, vote, and draw requests, add Zod (or similar) schemas to validate request body. Reject with 400 and a clear error message if validation fails. Use the same error codes and message keys as the frontends (e.g. INSUFFICIENT_BALANCE, MINIMUM_AMOUNT).
- Export: Export the Zod schemas (or their JSON Schema equivalent) so that (a) React can import and use for client-side validation, and (b) Flutter can replicate rules (or consume OpenAPI generated from the schema). Optionally publish an OpenAPI spec that includes request/response schemas for /api/tickets/verify, /api/draws/initiate, payout Edge, etc.
- Scope: Start with payout request (amount, currency, user_id) and vote cast payload; then add draw initiate and audit log query params. Do not change existing table names or column names; only add validation layer.
- Constants: Validation error keys (e.g. PAYOUT_ERRORS.INSUFFICIENT_BALANCE) must match the strings used in Web and Mobile UI so both show the same user-facing message.
```

---

### D.11 – Dual-platform rule (when implementing any feature)

```
When implementing any of the above features (or any new feature) in the Vottery project:

1. Check both codebases: Web (React in vottery_1/vottery/src) and Mobile (Flutter in vottery M/lib). Ensure the same feature exists or is planned for both where the spec says "Web and Mobile".

2. Apply twice: Propose the change for React (Web) first with exact file paths and code snippets; then propose the equivalent change for Flutter (Mobile) with exact file paths and Dart code.

3. Verify constants: Any new or changed variable names, API paths, Supabase table/column names, and error message strings must be updated in BOTH projects so that Web and Mobile stay 100% synchronized. List the shared constants (e.g. table names, Edge function names, PAYOUT_THRESHOLD) in a short table at the end of your response.
```

---

## PART E – CURSOR RULE (Dual Web + Mobile)

The following rule is already saved in `.cursor/rules/vottery-dual-platform.mdc`. It ensures that whenever you modify or implement a feature:

- **Check both** Web and Mobile directories.
- **Apply twice:** React first, then Flutter.
- **Verify constants** in both projects for 100% synchronization.

No additional rule file is required; the existing rule applies.

---

## PART F – FILE LOCATIONS (Reference)

| Item | Location |
|------|----------|
| Prompt features (extracted) | `vottery_1/vottery/prompts_extracted/` |
| Full analysis | `vottery_1/vottery/PROMPTS_FOLDER_FULL_ANALYSIS.md` |
| QA report | `vottery_1/vottery/FEATURE_IMPLEMENTATION_QA_REPORT.md` |
| Web routes | `vottery_1/vottery/src/Routes.jsx` |
| Web platform gamification | `vottery_1/vottery/src/pages/platform-gamification-core-engine/`, `src/services/platformGamificationService.js` |
| Web Ad Slot Manager | `vottery_1/vottery/src/pages/ad-slot-manager-inventory-control-center/`, `src/components/AdSlotRenderer.jsx` |
| Web home feed | `vottery_1/vottery/src/pages/home-feed-dashboard/index.jsx` |
| Web payouts (unified) | `vottery_1/vottery/src/features/payouts/` |
| Cursor dual-platform rule | `vottery_1/vottery/.cursor/rules/vottery-dual-platform.mdc` |

---

*End of document. Copy any section into Rocket.New or convert the full file to PDF as needed.*
