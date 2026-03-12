# Remaining Features & Systematic Implementation Plan

**Sources:** Vottery's 1st Rough Dev. Docs (.txt), `prompts_extracted/`, and `VOTTERYS_1ST_ROUGH_DEV_DOCS_CROSSCHECK_REPORT.md`.

This document lists **remaining partially implemented** and **missed** features for both the React Web App and Flutter Mobile App, and describes how to implement them systematically.

---

## 1. "More score needed" – six items (status after this pass)

| Item | Status | Notes |
|------|--------|--------|
| **WebSocket &lt;100ms (replace 30s polling)** | Implemented | Monitoring dashboards use `useRealtimeMonitoring` (Supabase Realtime). Winner Notification Center 30s polling replaced with Realtime subscription on `prize_distributions` and `notifications`. |
| **Production Deployment Hub UI** | Complete | Release management, blue-green toggles, feature flags, rollback, staged rollout 10%/25%/50%/75%/100%; tables `deployment_config`, `deployment_releases`. |
| **Security & Compliance Audit screen** | Complete | Checklist (encryption, authentication/biometric, GDPR/CCPA, penetration testing, data residency, pre-launch); CSV/PDF export; Pre-Launch Sign-Off action. |
| **Full carousel replacement with Premium 2D** | Complete | Home feed uses Premium 2D only (Horizontal snap, Vertical card stack, Smooth gradient); 9 content types (Jolts, Live Moments, Creator Spotlights, Recommended Groups/Elections, Creator Services, Trending Topics, Top Earners, Prediction Accuracy Champions). 3D naming removed from wrapper and mock copy. |
| **Per-screen performance playbooks** | Complete | Load Testing center has Per-Screen Metrics with bottlenecks and optimization playbooks; dedicated "Performance Playbooks" tab added. |
| **Full Expanded VP Redemption categories** | Implemented | Categories: Platform Perks, Election, Social, Real-world, VIP; Stripe/PayPal for cash-equivalent; blockchain log for auditability. |

---

## 2. React Web App – remaining partially implemented

| # | Feature | What's missing |
|---|--------|----------------|
| 1 | Platform-wide Gamification on Home/Profile | Percentization (By Country, Continent, Gender, MAUs, DAUs, Premium buyers, etc.); Admin Disable/Enable for this feature. |
| 2 | Age verification (AI facial, Gov ID, reusable) | Confirm all three methods wired end-to-end and reusable across elections. |
| 3 | Ad Slot Manager & home feed | Verify waterfall (internal first, AdSense only for unfilled); fill-rate tracking in dashboard. |
| 4 | Comprehensive Feature Analytics | Single dashboard: adoption, engagement, revenue per screen; cohort analysis; A/B testing framework. |
| 5 | Lottery REST API & webhooks | RESTful ticket/result/draw; Webhooks Draw Completed + Vote Cast; /api/audit/logs; log format JSON (action, timestamp, userId, hash). |
| 6 | API Documentation Portal | All public lottery endpoints + webhook events (draw_completed, vote_cast) listed and Try-it working. |
| 7 | Community Moderation | Backend tables and service wired (content_flags, moderation_actions, content_appeals) – done; AI review for election integrity. |
| 8 | Cross-Domain Data Sync Hub | Last sync, pending count, conflict count per entity; resolve actions (Keep local / Keep remote / Merge) persist. |
| 9 | Unified Payment Orchestration Hub | Smart routing (Stripe vs PayPal by zone); single view for subscription + participation + payout. |
| 10 | Interactive onboarding wizard | Step-by-step, role-based (voter, creator, advertiser, admin) flow; verify UX. |
| 11 | Shared validation (Zod) for API/Edge | Zod in Edge for payout, vote cast, draw initiate; 400 with same error keys as Web/Mobile. |
| 12 | Campaign Management (sponsored elections) | Live status, pause/edit, real-time engagement metrics per campaign across zones; Advertiser Analytics & ROI Dashboard. |
| 13 | Admin Panel – Disable/Enable & API limits | Features, Countries, Integrations with disable/enable and per-week/per-month limits; real-time analytics. |
| 14 | Participatory Advertising – Admin toggle | Participatory Advertising on Features list with disable/enable. |

---

## 3. React Web App – missed / not implemented

| # | Feature | Notes |
|---|--------|--------|
| 1 | Public REST API for lottery (exposed + documented) | One place: expose REST + docs. |
| 2 | Webhooks: Draw Completed, Ticket Purchased (Vote Cast) | Configurable and server dispatch documented and tested. |
| 3 | Full Technical Platform Documentation / Methodology Guide | PDF-friendly docs – documentation only. |
| 4 | Comprehensive Feature Analytics (all screens, cohort, A/B) | Single dashboard end-to-end. |

---

## 4. Flutter Mobile App – remaining partially implemented

| # | Feature | What's missing |
|---|--------|----------------|
| 1 | Campaign Management Dashboard | Zone breakdown (8 zones) from API – done; same contract as Web. |
| 2 | Participatory Ads Studio | Market Research / Hype / CSR templates; same Supabase and Edge as Web. |
| 3 | Ad Slot Manager | Waterfall (internal first, AdSense fallback); fill-rate; same slot IDs as Web. |
| 4 | Verify / Audit Elections | Full parity: hash/bulletin-board, audit portal with chained logs, blockchain verification. |
| 5 | Platform-wide Gamification | Percentization; Home and Profile display; Admin Disable/Enable; same backend as Web. |
| 6 | VP Redemption / Rewards Shop | Expanded categories (Platform, Election, Social, Real-world, VIP); Stripe/PayPal; blockchain log. |
| 7 | Creator revenue share | Admin UI for per-country % if required; else read-only. |
| 8 | Comments on/off (creator control) | Edit-election flow updates `comments_enabled`. |
| 9 | User Feedback Portal – Community Engagement | Same data as Web; social proof badges. |
| 10 | Subscription architecture | Billing analytics; plan upgrade/downgrade via Stripe billing portal; same product/price IDs as Web. |
| 11 | Unified Payment Orchestration Hub | Smart routing display; preferred method per flow. |
| 12 | AI-guided interactive tutorial | Deeper integration with key screens (tooltips/steps). |
| 13 | Performance / E2E / Sentry | Screen &lt;2s, memory &lt;500MB, API p95 &lt;3s; E2E for vote cast, payment, achievement; Sentry + Slack. |
| 14 | Age verification (triple method) | AI facial, Gov ID, reusable; same `age_verification_records` as Web. |

---

## 5. Flutter Mobile App – missed / not implemented

| # | Feature | Notes |
|---|--------|--------|
| 1 | API Documentation Portal | Web-only or deep link to Web portal. |
| 2 | Community Moderation Tools (full) | Content flagging, moderator queue, appeal workflows, AI review – full parity. |
| 3 | Advanced Performance Profiling | CPU/memory/network per screen, bottlenecks, playbooks. |
| 4 | Cross-Domain Data Sync Hub | Web-only or deep link. |
| 5 | Comprehensive Feature Analytics | Analytics per screen, cohort, A/B – not confirmed. |
| 6 | Lottery REST API & webhooks | Mobile calls backend; no Mobile-specific UI. |
| 7 | Unified AI Decision Orchestration / Multi-AI panels | Parity not verified. |
| 8 | Production Deployment Hub | Web-only or deep link. |
| 9 | Security & Compliance Audit Screen | Web-only or deep link. |
| 10 | Prediction Analytics Dashboard | Full dashboard not confirmed. |
| 11 | VP Economy Health Monitor (full spec) | Real-time VP inflation/deflation, velocity, alerts. |
| 12 | Prediction Pool Notifications Hub | Webhooks and user preferences. |
| 13 | Full Technical Platform Documentation | Documentation only. |

---

## 6. Systematic implementation order

### Phase 1 – Backend & shared (enables testing)

1. **Lottery REST API + webhooks (Web)**  
   - Expose REST for ticket/result/draw; document in API Documentation Portal.  
   - Webhooks: Draw Completed, Vote Cast; server dispatch with retry; document in Webhook Management.

2. **Community Moderation backend**  
   - Already done: migrations and service; ensure RLS and moderator role.

3. **Admin Panel – Features/Countries/APIs**  
   - Already wired to `platform_feature_toggles` and `integration_controls`; verify limits (per week/month).

4. **Shared validation (Zod)**  
   - Edge: Zod schemas for payout, vote cast, draw initiate; 400 responses with same error keys as Web/Mobile.

### Phase 2 – Web UX and dashboards

5. **WebSocket &lt;100ms**  
   - Done: Realtime for monitoring and Winner Notification Center.

6. **Production Deployment Hub**  
   - Done: UI and tables.

7. **Security & Compliance Audit**  
   - Done: Checklist, export, Pre-Launch Sign-Off.

8. **Carousel replacement**  
   - Done: Premium 2D + 9 content types; 3D naming removed.

9. **Per-screen performance playbooks**  
   - Done: Load Testing center + Playbooks tab.

10. **Expanded VP Redemption**  
    - Done: Categories, Stripe/PayPal, blockchain log.

11. **API Documentation Portal**  
    - Lottery endpoints and webhook events (draw_completed, vote_cast) – ensure Try-it and Webhook Management work.

12. **Campaign Management (Web)**  
    - Live status, pause/edit, zone metrics, Advertiser Analytics & ROI; same contract as Mobile.

13. **Unified Payment Orchestration (Web)**  
    - Smart routing (Stripe vs PayPal by zone); single view for subscription + participation + payout.

14. **Comprehensive Feature Analytics (Web)**  
    - Adoption, engagement, revenue per screen; cohort; A/B testing.

### Phase 3 – Flutter parity and polish

15. **Campaign Management (Flutter)**  
    - Zone breakdown (8 zones) – done; confirm same API and UI as Web.

16. **Participatory Ads Studio (Flutter)**  
    - Market Research / Hype / CSR; same Supabase/Edge as Web.

17. **VP Redemption (Flutter)**  
    - Expanded categories and payment/blockchain alignment with Web.

18. **Verify / Audit (Flutter)**  
    - Full parity with Web (hash, audit logs, blockchain).

19. **Platform Gamification (both)**  
    - Percentization; Admin Disable/Enable; same backend.

20. **Age verification (both)**  
    - Triple method end-to-end; reusable record across elections.

21. **Ad Slot Manager (both)**  
    - Waterfall verification; fill-rate; same slot IDs.

22. **Optional: Telnyx, Documentation, Deep links**  
    - Telnyx per Rough Dev. Docs; PDF technical docs; Flutter deep links to Web (API Docs, Production Hub, Security Audit).

---

## 7. File references

| Item | Location |
|------|----------|
| Rough Dev. Docs | `Vottery's 1st Rough Dev. Docs/` (.txt) |
| Prompts extracted | `prompts_extracted/` |
| Cross-check report | `VOTTERYS_1ST_ROUGH_DEV_DOCS_CROSSCHECK_REPORT.md` |
| Web routes | `src/Routes.jsx` |
| Flutter routes | `vottery M/lib/routes/app_routes.dart` |
| Dual-platform rule | `.cursor/rules/vottery-dual-platform.mdc` |

---

*This plan aligns with the Rough Dev. Docs and prompts_extracted. Implement in the order above where dependencies apply; otherwise parallelize by platform.*

---

## 8. Implemented in latest pass (migrations + roadmap)

- **Migration `20260303100000_security_audit_seed_and_realtime.sql`**: Seeds `security_audit_checklist` when empty; enables Realtime for `prize_distributions` and `notifications`. Run via Supabase Dashboard (SQL Editor) or `npx supabase db push`. See `supabase/RUN_MIGRATIONS_AND_REALTIME.md`.
- **Lottery API & webhooks**: API Documentation Panel Try-it uses Supabase Edge (`tickets-verify`, `draws-initiate`, `audit-logs`) when `VITE_SUPABASE_URL` is set. Shared Zod validation in Edge (`shared/lotteryValidation.ts`) for tickets-verify, draws-initiate, audit-logs with 400 and error keys.
- **Campaign Management (Web)**: Campaign list shows ROI and zone_breakdown (8 zones) per campaign; `analyticsService.getSponsoredCampaigns` returns `zone_breakdown` and `roi`.
- **Unified Payment Orchestration**: Smart routing tab already shows Stripe vs PayPal by zone and flow.
- **Comprehensive Feature Analytics**: Already has Feature Overview, Cohort, A/B Testing, Revenue Impact tabs.
- **Flutter VP Redemption**: Rewards Shop has Payment & audit banner (Stripe/PayPal, blockchain log). Categories already align (platform_perks, election_enhancements, social_rewards, real_world_rewards, vip_tiers).
- **Flutter Participatory Ads**: Market Research / Hype Prediction / CSR Vote already in `ad_format_selection_step.dart` and participatory_ads_studio.
