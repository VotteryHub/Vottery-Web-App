# Flutter Mobile App – Feature Gap Analysis & Rocket.New Implementation Prompts

**Document purpose:** Cross-check of all features from the *prompt features implementation folder* (prompts_extracted + PROMPTS_FOLDER_FULL_ANALYSIS) against the Flutter Mobile App. This document lists **partially implemented** and **completely missed** features on Mobile, and provides **copy-paste prompts with exact implementation instructions** for use on Rocket.New.

**Sources:**  
- All 17 section files in `prompts_extracted/`  
- `PROMPTS_FOLDER_FULL_ANALYSIS.md`  
- `FEATURE_IMPLEMENTATION_QA_REPORT.md`  
- Flutter codebase: `vottery M/lib/` (routes, services, presentation)

**Layout:** Structured for easy copy to PDF (sections, tables, code blocks).

---

## PART A – PARTIALLY IMPLEMENTED FEATURES (Flutter Mobile)

Features that exist in the prompts and are **partially** present on the Flutter app (missing screens, logic, or parity with Web).

| # | Feature | What exists on Flutter | What is missing (to reach 100%) |
|---|--------|------------------------|----------------------------------|
| 1 | **Campaign Management Dashboard** | Advertiser analytics and real-time ROI screens exist; **no** dedicated Campaign Management screen with live status, pause/edit controls, real-time engagement metrics per campaign across zones. | Full **Campaign Management** screen: live status, pause/edit controls, zone metrics; same API/contract as Web `campaign-management-dashboard`. |
| 2 | **Participatory Ads Studio** | Campaign Template Gallery exists; **no** Participatory Ads Studio screen for brands to create sponsored elections (multi-step wizard, audience targeting, budget by zone, Market Research / Hype / CSR templates). | **Participatory Ads Studio** screen: create sponsored elections, targeting, budget by zone, ad format types; parity with Web `participatory-ads-studio`. |
| 3 | **Ad Slot Manager / Centralized ad orchestration** | No Ad Slot Manager on Mobile. Web has Ad Slot Manager (internal ads first, Google AdSense only for unfilled slots). | **Ad Slot Manager** (or equivalent) on Mobile: same waterfall logic (internal participatory ads first, AdSense fallback), fill-rate awareness where ads are shown. |
| 4 | **Verify Elections / Audit Elections** | `verify_audit_elections_hub` and `verification_audit_service` exist. | Ensure full parity: vote ID verification, hash/bulletin-board check, audit portal with chained logs and blockchain verification as in prompts. |
| 5 | **Platform-wide (Whole Vottery) Gamification** | Lottery/slot machine and gamification exist per election; **no** monthly platform-wide gamification with percentization by country/continent/gender/MAU/DAU/premium/subscribers/advertisers/creators, prize rename/branding, RNG slot machine on home/profile, admin disable/enable. | **Platform Gamification** flow: monthly pool, allocation rules (percentization), display on home/profile, admin toggle; same backend as Web if implemented. |
| 6 | **VP Redemption / Rewards Shop** | `rewards_shop_hub` exists with categories (platform_perks, election_enhancements, social_rewards, real_world_rewards, vip_tiers). | Align with prompt “Expanded VP Redemption”: ad-free hours, themes/avatars, priority boosts, storage; bonus votes/tickets; exclusive groups, shoutouts, referral, emotes; gift cards, merchandise, charity, experiences; early access, multi-currency, milestone rewards; ensure Stripe/PayPal for cash-equivalent and blockchain log for redemptions. |
| 7 | **Creator revenue share (configurable %)** | Revenue split and creator payouts exist. | Admin-configurable revenue share per country (e.g. 70/30, 90/10 “Morale Booster”) as in prompts; ensure Mobile reads same `payout_settings` / admin config as Web. |
| 8 | **Comments on/off (creator control)** | Not verified in Flutter. | Creator/content creator option to enable/disable comments per election/content; same DB field and UI as Web. |
| 9 | **User Feedback Portal – Community Engagement** | `user_feedback_portal` exists (feature requests, categories). | **Community Engagement Dashboard**: leaderboards for feedback contributions, voting participation, feature requests submitted, adoption metrics, social proof badges; link to same data as Web. |
| 10 | **Incident Response – Feature deployment correlation** | Incident/monitoring screens exist. | **Enhanced Incident Response Analytics**: automated correlation between Monitoring Hub alerts and Feature Implementation Tracking (which feature deployments may have caused incidents); same as Web. |
| 11 | **Real-time gamification notifications** | Notifications exist; gamification-specific real-time (VP earn, achievement unlock, streak, leaderboard rank) may be partial. | Real-time gamification notifications: VP earn alerts, achievement unlock popups, streak maintenance, leaderboard rank changes via Supabase subscriptions. |
| 12 | **Subscription architecture (Stripe tiers)** | Stripe Connect and payouts exist. | Full subscription dashboard: Premium/Pro/Enterprise tiers, VP multipliers (e.g. Basic 2x, Pro 3x, Elite 5x), billing analytics, plan upgrades/downgrades, renewal processing; parity with Web. |
| 13 | **Unified Payment Orchestration Hub** | Payments and payouts exist. | Centralized payment method management for subscriptions, participation fees, and payouts; smart routing (Stripe/PayPal) by zone and user preferences; single UI for payment methods. |
| 14 | **AI-guided interactive tutorial** | Not clearly present. | Role-based interactive tutorial (onboarding) as in prompts; same concept as Web `/ai-guided-interactive-tutorial-system`. |
| 15 | **Performance / E2E testing & Sentry** | Performance and Sentry exist in part. | Performance monitoring (screen load &lt;2s, memory &lt;500MB, API p95 &lt;3s); E2E tests for vote casting, payment, NFT/achievement unlock, Claude recommendation; Sentry with Slack webhooks for critical errors. |

---

## PART B – COMPLETELY MISSED OR NOT IMPLEMENTED (Flutter Mobile)

Features specified in the prompts that are **not** implemented (or not findable) in the Flutter app.

| # | Feature | Prompt source | Notes |
|---|--------|----------------|-------|
| 1 | **Campaign Management Dashboard** (full) | 1.docx, 2.docx, Check the features | Web: `/campaign-management-dashboard`. Mobile: no equivalent screen with live status, pause/edit, zone metrics. |
| 2 | **Participatory Ads Studio** (full) | 2.docx, 5.docx, 6.docx | Web: `/participatory-ads-studio`. Mobile: no multi-step “create sponsored election” studio. |
| 3 | **Ad Slot Manager & inventory control** | 19.docx | Web: `/ad-slot-manager-inventory-control-center`. Mobile: no screen or logic for internal-first, AdSense-fallback. |
| 4 | **API Documentation Portal** | 2.docx | Developer docs, REST API explorer, webhook management for brand partners. Not present on Mobile (can be web-only; if Mobile should link or embed, add deep link). |
| 5 | **Community Moderation Tools** (full) | 2.docx | Content flagging dashboard, moderator queue, appeal workflows, AI review. Mobile may have partial moderation; full parity not verified. |
| 6 | **Platform-wide monthly Gamification** | 13.docx | Monthly pool, percentization by country/continent/gender/MAU/DAU/premium/subscribers/advertisers/creators, prize rename, slot machine on home/profile, admin disable/enable. Not implemented on Mobile. |
| 7 | **Age verification (AI facial, Gov ID, reusable identity)** | 12.docx | Age verification control center exists; full AI facial, Gov ID, reusable digital identity flow not confirmed. |
| 8 | **Advanced Performance Profiling** | 12.docx | CPU/memory/network per screen, bottleneck identification, optimization playbooks. Not present on Mobile. |
| 9 | **Cross-Domain Data Sync Hub** | 12.docx | Unified dashboard for Supabase sync (elections, posts, ads, users), conflict resolution, offline queue. Not present on Mobile. |
| 10 | **Comprehensive Feature Analytics (143 screens)** | 12.docx | Analytics per screen, cohort analysis, A/B testing. Mobile has many screens; 1:1 feature analytics not confirmed. |
| 11 | **Lottery REST API layer & webhooks** | 12.docx, Online Gamification doc | Public REST endpoints for tickets/verify, draws/initiate, audit/logs; webhooks for draw completed, vote cast. Backend/Edge; Mobile would call these if exposed. |
| 12 | **Unified AI Decision Orchestration / Multi-AI panels** | 15.docx, 20.docx | Consolidated dashboard with Claude, Perplexity, OpenAI (confidence scoring, 1-click execution). Web has multiple AI hubs; Mobile parity not verified. |
| 13 | **Production Deployment Hub** | 15.docx | Release management, blue-green, feature flags, rollback, staged rollout 10%/25%/100%. Not present on Mobile. |
| 14 | **Security & Compliance Audit Screen** | 15.docx | Checklist for encryption, biometric, data residency, GDPR/CCPA, penetration testing, pre-launch sign-off. Not verified on Mobile. |
| 15 | **Prediction Analytics Dashboard** | 16.docx | Prediction pool performance, accuracy distributions, VP payout totals, fraud alerts for prediction patterns. Prediction screens exist; full analytics dashboard as in prompt not confirmed. |
| 16 | **VP Economy Health Monitor** | 16.docx | Real-time VP inflation/deflation, circulation velocity, earning vs spending, redemption by zone, alerts when &gt;15% from targets. `vp_economy_health_monitor` exists; confirm full spec. |
| 17 | **Prediction Pool Notifications Hub** | 16.docx | Supabase Edge webhooks: pool creation, prediction lock-in countdowns, resolution events, leaderboard rank changes; user preference customization. Not verified. |
| 18 | **Full Technical Platform Documentation / Methodology Guide** | 18.docx | PDF-friendly technical docs and development methodology. Documentation only; no code change for Mobile. |

---

## PART C – HOW TO IMPLEMENT (Summary)

- **Partial:** For each row in Part A, add the missing screens or logic in Flutter so behavior and data contract match the Web (and prompts). Prefer the same Supabase tables, Edge functions, and API contracts as Web.
- **Missed:** For each row in Part B, either (1) implement the feature in Flutter to match the prompt and Web, or (2) explicitly document as web-only or deferred.
- **Constants/API sync:** When adding or changing a feature, update both Web and Mobile: same route/path names where applicable, same environment variables (e.g. Supabase URL, Stripe keys), same table and column names, same error message constants (e.g. `PAYOUT_ERRORS` / `PayoutErrors`).

---

## PART D – COPY-PASTE PROMPTS FOR ROCKET.NEW (Exact Implementation)

Use the following prompts on Rocket.New. Copy each block as-is (or one at a time) to implement the corresponding feature in the **Flutter Mobile App** only, unless the prompt says otherwise.

---

### D.1 – Campaign Management Dashboard (Flutter)

```
In the Vottery Flutter mobile app (vottery M), add a full Campaign Management Dashboard screen that matches the Web app's campaign-management-dashboard.

Requirements:
- Screen path/route: /campaign-management-dashboard (e.g. AppRoutes.campaignManagementDashboard).
- Data: Use the same Supabase tables and APIs as the Web app (e.g. sponsored_elections or equivalent for campaign list).
- UI: List of active sponsored elections with for each campaign: live status (active/paused/ended), pause/edit controls, real-time engagement metrics (votes, reach, CPE), and zone breakdown (8 purchasing power zones).
- Auto-refresh: Refresh campaign list and metrics every 30 seconds (or use Supabase real-time subscription if already available on Web).
- Navigation: Add a menu item "Campaign Management" under Advertising/Admin section that navigates to this screen.
- Reuse: If advertiser_analytics_dashboard or real_time_advertiser_roi_dashboard already fetch campaign data, reuse the same service layer and only add this new screen and route.
```

---

### D.2 – Participatory Ads Studio (Flutter)

```
In the Vottery Flutter mobile app (vottery M), add a Participatory Ads Studio screen that matches the Web app's participatory-ads-studio.

Requirements:
- Screen path/route: /participatory-ads-studio (e.g. AppRoutes.participatoryAdsStudio).
- Flow: Multi-step wizard for brands to create a sponsored election: (1) Basic info (title, description, image), (2) Ad format type: Market Research, Hype Prediction, or CSR Vote, (3) Audience targeting (zones, tags), (4) Budget configuration by zone (8 purchasing power zones), (5) Review and submit.
- Data: Use the same Supabase tables as the Web app for sponsored elections (e.g. sponsored_elections, ad_frequency_caps, cpe_pricing_zones). Call the same Edge functions or Supabase RPC if Web uses them for creation.
- Templates: Option to start from a template (link or reuse campaign_template_gallery data).
- Navigation: Add "Ads Studio" or "Participatory Ads Studio" in the menu under Advertising, linking to this screen.
- Ensure any new constant (e.g. API path, table name) is the same as in the Web app (participatory-ads-studio flow).
```

---

### D.3 – Ad Slot Manager / Centralized ad orchestration (Flutter)

```
In the Vottery Flutter mobile app (vottery M), implement Ad Slot Manager behavior so that internal participatory (Facebook-like) ads are primary and Google AdSense is used only for unfilled slots.

Requirements:
- Do not duplicate the full Web Ad Slot Manager dashboard unless required; focus on the rendering logic wherever ads are shown (e.g. home feed, profile).
- Create a small service or widget: getAdForSlot(slotId). Logic: (1) Try to get an internal sponsored election ad for this slot (from Supabase or same API as Web). (2) If none available (unfilled), then show Google AdSense in that slot.
- Use the same slot IDs or slot naming as the Web app if documented (e.g. home_feed_1, home_feed_2).
- If the Web app has an Ad Slot Manager API or Supabase view that returns "next ad for slot", call that from Flutter so one source of truth exists.
- Add no new backend tables without aligning with Web; prefer reusing Web's ad slot / inventory logic via API or Supabase.
```

---

### D.4 – Platform-wide monthly Gamification (Flutter)

```
In the Vottery Flutter mobile app (vottery M), add support for Platform-wide (Whole Vottery) monthly Gamification as specified in the prompts.

Requirements:
- Backend: If not already present, the backend (Supabase + Edge) must support: platform_gamification_campaigns (or equivalent), allocation rules (percentization by country, continent, gender, MAU, DAU, premium, subscribers, advertisers, creators, others), prize naming/branding, and RNG winner selection. Implement or reuse Web implementation.
- Mobile UI: (1) A prominent display on Home and Profile showing the current month's platform gamification: prize pool amount, number of winners, countdown or next draw time, and optional spinning slot machine animation. (2) If admin has disabled platform gamification, do not show this block.
- Data: Fetch from same Supabase table(s) or API as Web (e.g. platform_gamification_campaigns, allocation rules, winner list when available).
- Navigation: No separate "Platform Gamification" screen required unless product asks; focus on Home and Profile display and same enable/disable as Web.
- Constants: Use same table names and API paths as Web (e.g. platform_gamification_campaigns).
```

---

### D.5 – Community Engagement Dashboard (Flutter)

```
In the Vottery Flutter mobile app (vottery M), extend the existing User Feedback Portal with a Community Engagement Dashboard that includes leaderboards.

Requirements:
- New screen or new section: "Community Engagement" or "Community Leaderboards".
- Leaderboards: (1) By feedback contributions (e.g. feature requests submitted, votes on ideas), (2) By voting participation, (3) By adoption metrics (e.g. features used). Use the same feature_requests and related tables as the Web app.
- Social proof: Badges or labels for top contributors (e.g. "Top Contributor", "Most Votes").
- Data: Same Supabase tables as Web (e.g. feature_requests, votes, implementation tracking). If Web has an API or view for leaderboard data, call it from Flutter.
- Route: e.g. /community-engagement-dashboard or /user-feedback-portal with tab "Leaderboards".
- Keep existing User Feedback Portal (submit request, voting, trending) unchanged; add this as an additional tab or linked screen.
```

---

### D.6 – Enhanced Incident Response Analytics (Flutter)

```
In the Vottery Flutter mobile app (vottery M), add Enhanced Incident Response Analytics that links Monitoring Hub alerts to Feature Implementation Tracking.

Requirements:
- Screen or section: "Incident Response Analytics" or "Incident–Feature Correlation".
- Logic: For each incident (or alert) from the monitoring system, show which feature implementations or deployments were active around that time; optionally show a simple "possible cause" or correlation score. Use the same data sources as the Web app (e.g. system_alerts, feature deployment or implementation tracking tables).
- UI: List or timeline of incidents with expandable section showing related feature deployments and a short root-cause summary if available.
- Data: Same Supabase tables and Edge functions as Web; do not invent new tables unless Web already has them. If Web has an Edge that computes correlation, call it from Flutter.
```

---

### D.7 – Real-time gamification notifications (Flutter)

```
In the Vottery Flutter mobile app (vottery M), implement real-time gamification notifications using Supabase real-time subscriptions.

Requirements:
- Subscribe to relevant Supabase tables or channels: e.g. user_vp_transactions, user_quests (completions), badge awards, leaderboard changes.
- When VP is earned: show in-app toast or snackbar "VP earned: +X" (and optional confetti).
- When an achievement/badge is unlocked: show "Achievement unlocked: [name]".
- When streak is maintained or broken: show "Streak: N days" or "Streak broken".
- When leaderboard rank changes: optional notification "You moved to rank #K on [leaderboard name]".
- Use the same table and column names as the Web app so that both platforms receive the same events. Prefer a single Realtime channel or table that the backend updates for gamification events.
```

---

### D.8 – Subscription tiers with VP multipliers (Flutter)

```
In the Vottery Flutter mobile app (vottery M), add a Subscription Architecture screen or section that matches the Web app's subscription dashboard.

Requirements:
- Display current plan: Basic, Pro, Elite (or equivalent) with VP multipliers (e.g. Basic 2x, Pro 3x, Elite 5x).
- Show billing analytics: next billing date, amount, payment method.
- Allow plan upgrade/downgrade (navigate to Stripe billing portal or same flow as Web).
- Use the same Stripe subscription product/price IDs and same Supabase table for user subscription state as the Web app. Ensure REACT_APP_ and Flutter env vars use the same Stripe keys and product IDs where applicable.
```

---

### D.9 – Unified Payment Orchestration Hub (Flutter)

```
In the Vottery Flutter mobile app (vottery M), add a Unified Payment Orchestration Hub screen (or extend Settings/Payouts) for centralized payment method management.

Requirements:
- Single place to manage: (1) Payment methods for subscriptions, (2) Payment methods for participation fees, (3) Payout methods (e.g. bank account for creator payouts).
- Smart routing: Show which method is used for which flow (Stripe vs PayPal) and by zone if applicable. Use the same payout_settings and payment method tables as the Web app.
- Allow user to set preferred method per flow (subscription, participation, payout) if the backend supports it; otherwise show current method and link to Stripe/Connect or PayPal where already implemented.
- Reuse existing Stripe Connect and payout_settings_service; do not duplicate logic. Add only the orchestration UI and same constants as Web.
```

---

### D.10 – Comments on/off (creator control) (Flutter)

```
In the Vottery Flutter mobile app (vottery M), add creator control to enable or disable comments per election (or per content).

Requirements:
- In election creation or edit flow: add a toggle "Allow comments" (default on). Store in the same column as the Web app (e.g. elections.allow_comments or equivalent boolean).
- In vote/election detail screen: if allow_comments is false, hide comment input and comment list; show a short message "Comments disabled by creator" if needed.
- Use the same Supabase table and column name as the Web app so that Web and Mobile stay in sync. Verify in Web codebase the exact field name (e.g. allow_comments) and use it in Flutter.
```

---

### D.11 – Same constants and API paths (Web + Flutter)

```
When implementing any of the above features (or any new feature) in the Vottery project:

1. Check both codebases: Web (React in vottery or vottery_1/vottery) and Mobile (Flutter in vottery M). Ensure the same feature exists or is planned for both where the spec says "Web and Mobile".

2. Apply twice: Propose the change for React (Web) first with exact file paths and code snippets; then propose the equivalent change for Flutter (Mobile) with exact file paths and Dart code.

3. Verify constants: Any new or changed variable names, API paths, Supabase table/column names, and error message strings must be updated in BOTH projects so that Web and Mobile stay 100% synchronized. List the shared constants (e.g. PAYOUT_THRESHOLD = 100, table user_wallets, Edge name stripe-secure-proxy) in a short table at the end of your response.
```

---

## PART E – CURSOR RULE (Dual Web + Mobile)

The following rule should be added to your Cursor rules so that future changes always consider both Web and Mobile.

**Rule text (save as `.cursor/rules/vottery-dual-platform.mdc` or paste into Cursor Rules):**

```markdown
# Vottery dual-platform rule

When the user asks to modify or implement a feature or anything in the Vottery project:

1. **Check both:** Automatically check both the Web app (React: `vottery_1/vottery` or `web/`) and the Mobile app (Flutter: `vottery M/` or `mobile/`) if they exist in the workspace.

2. **Apply twice:** Propose the change for React first (exact files, code snippets), then clearly and separately provide the equivalent change for Flutter (exact files, Dart code). If the feature is Web-only or Mobile-only, say so explicitly.

3. **Verify constants:** Ensure that any changed variable names, API paths, Supabase table/column names, and error messages are updated in BOTH projects to maintain 100% synchronization. When introducing a new constant (e.g. route path, Edge function name, error code), define it in one place and use the same value in both codebases.
```

---

## PART F – FILE LOCATIONS (Reference)

| Item | Location |
|------|----------|
| Prompt features (extracted) | `vottery_1/vottery/prompts_extracted/` (section_1_1.docx.txt … section_17_*.txt, section_16_Check_*.txt) |
| Full analysis | `vottery_1/vottery/PROMPTS_FOLDER_FULL_ANALYSIS.md` |
| QA report | `vottery_1/vottery/FEATURE_IMPLEMENTATION_QA_REPORT.md` |
| Discrepancy fixes | `vottery_1/vottery/DISCREPANCY_FIXES_IMPLEMENTED.md` |
| Flutter routes | `vottery M/lib/routes/app_routes.dart` |
| Flutter payouts (unified) | `vottery M/lib/features/payouts/` |
| Web routes | `vottery_1/vottery/src/Routes.jsx` |
| Web Campaign Management | `vottery_1/vottery/src/pages/campaign-management-dashboard/` |
| Web Participatory Ads Studio | `vottery_1/vottery/src/pages/participatory-ads-studio/` |
| Web Ad Slot Manager | `vottery_1/vottery/src/pages/ad-slot-manager-inventory-control-center/` |

---

*End of document. Copy any section into Rocket.New or convert the full file to PDF as needed.*
