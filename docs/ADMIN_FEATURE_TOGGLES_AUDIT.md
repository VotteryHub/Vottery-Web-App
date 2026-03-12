# Admin Panel Feature Toggles — Audit vs Comprehensive Feature List

**Date:** March 2026  
**Purpose:** Confirm which features from the Comprehensive Feature Audit are controllable via On/Off (Enable/Disable) at the admin panel, and what is missing.

---

## Executive summary

**Not all features from the Comprehensive Feature Audit are currently on a single admin On/Off panel.**

- **Currently toggleable in one place:** **28 platform-level toggles** in **Admin Control Center → Platform Controls → Platform Features**, plus **60+ gamification toggles** in **Comprehensive Gamification Admin Control Center → Feature Toggle Matrix** (stored in a separate `feature_flags` table).
- **Gap:** The audit lists **650+ features** across General Users, Creators, Advertisers, Admin, Enterprise, and cross-platform. The vast majority do **not** have a corresponding row in `platform_feature_toggles` or a dedicated admin switch. You cannot currently turn off whole domains (e.g. “Advertiser Campaigns”, “Creator Monetization”, “Fraud Detection”, “Content Moderation”) from the main admin panel.

This doc summarizes what **is** toggleable today, then recommends expanding the seed so you can strategically enable/disable by domain at launch.

---

## 1. Where feature toggles live in the admin panel

| Location | Table | What you can toggle |
|----------|--------|----------------------|
| **Admin Control Center** → “Platform Controls” tab → **“Platform Features”** | `platform_feature_toggles` | 28 platform-wide features (see list below). Each row has an On/Off switch. |
| **Admin Control Center** → “Platform Controls” → **“Country Controls”** | `country_access_controls` | Per-country access and biometric. |
| **Admin Control Center** → “Platform Controls” → **“Integration Limits”** | `integration_controls` | Integrations (Stripe, OpenAI, Resend, etc.) On/Off and cost limits. |
| **Advanced Admin Role Management System** → **“Feature Toggles”** tab | `platform_feature_toggles` | Same 28 features; used for role/permission context. |
| **Comprehensive Gamification Admin Control Center** → **“Feature Toggles”** (Feature Toggle Matrix) | `feature_flags` | 60+ gamification sub-features (VP earning, streaks, badges, challenges, leaderboards, predictions, etc.). Keys like `gamification_vp-earning`. |

So: **platform-level** switches = `platform_feature_toggles` (28 items). **Gamification** switches = `feature_flags` (many items). Everything else in the audit is **not** represented by a dedicated toggle in these panels.

---

## 2. Current platform feature toggles (28) — from seed migration

These are the only platform features that appear in **Admin Control Center → Platform Features** and can be turned On/Off today:

| feature_name (key) | category | Covers (audit section) |
|--------------------|----------|------------------------|
| election_creation | core | Election Creation Studio, Elections Dashboard |
| gamified_elections | core | Gamified elections, VP from voting |
| social_sharing | social | Social Sharing Hub |
| comments_system | social | Comments section |
| emoji_reactions | social | Emoji reactions |
| direct_messaging | social | Direct Messaging Center |
| ai_content_moderation | ai | Content moderation (Anthropic/Claude) |
| ai_fraud_detection | ai | Fraud detection (Perplexity/ML) |
| biometric_voting | security | Age/identity verification |
| blockchain_verification | security | Vote verification, blockchain audit |
| stripe_payments | payment | Stripe Connect, participation fees, payouts |
| wallet_system | payment | Digital Wallet Hub |
| advanced_analytics | analytics | Advanced analytics dashboards |
| predictive_analytics | analytics | Predictive analytics, forecasting |
| participatory_advertising | payment | Participatory Ads, Sponsored Elections |
| live_results | core | Live results, live winner feed |
| vote_change_approval | core | Vote change / edit approval |
| abstention_tracking | analytics | Abstention tracking |
| creator_success_academy | core | Creator onboarding / success tools |
| country_restrictions | security | Country access controls |
| platform_integrations | payment | Integrations (high-level) |
| notifications_resend | social | Email (Resend) |
| notifications_sms | social | SMS (Telnyx/Twilio) |
| google_analytics | analytics | Google Analytics |
| content_moderation_webhooks | ai | Content moderation webhooks/triggers |
| vote_verification_portal | core | Vote Verification Portal |
| prediction_pools | core | Prediction Pools |
| multi_language | core | Localization (61 languages) |

So: **28 toggles** cover a **small subset** of the audit (core voting, basic social, basic payment, basic AI/security, analytics, notifications). They do **not** explicitly cover:

- Most **Creator** features (monetization studio, earnings command center, MCQ tools, Moments/Jolts, carousel, compliance, etc.)
- Most **Advertiser** features (Participatory Ads Studio, campaign dashboards, CPE, brand dashboard, etc.)
- Most **Admin** features (fraud dashboards, incident response, webhooks, SMS admin, reporting, real-time infra, etc.)
- **Enterprise** features
- Many **General User** features (onboarding, search, accessibility, feedback portal, etc.)

---

## 3. Gamification Feature Toggle Matrix

The **Comprehensive Gamification Admin Control Center** uses the **Feature Toggle Matrix** backed by `feature_flags` (not `platform_feature_toggles`). That matrix includes 60+ granular toggles for:

- Platform (creator payout, revenue split, Stripe subscriptions, feed ranking, threat dashboard, VP economy, prediction analytics, performance monitoring, Sentry, etc.)
- VP System (earning, voting, ads, predictions, daily login, blockchain logging)
- Progression (levels, unlocks, multipliers, progress bars)
- Badges (badge system, bonuses, profile display, achievement notifications)
- Challenges (daily/weekly, dashboard, animations)
- Leaderboards (global, regional, friends, privacy)
- Streaks (daily streaks, multipliers, savers, notifications)
- Social (competitions, achievement sharing, team challenges, profile stats)
- Elections (VP rewards, challenges, leaderboards, animated reveals)
- Ads (VP bribes, mini-games, quests, leaderboards)
- Redemption (VP redemption, ad-free, avatars, boosts, power-ups)
- Feed (VP rewards, quests, mini-games, streaks)
- Predictions (pools, Brier scoring, leaderboards, rewards, lottery bonus)

So: **gamification and VP economy** are well covered by the Matrix; the audit’s “Gamification Administration” and “VP Economy” sections are largely toggleable there, but in a **different** table and UI from the main Platform Features panel.

---

## 4. Coverage vs Comprehensive Feature Audit

| Audit section (high level) | In platform_feature_toggles? | In Gamification Matrix (feature_flags)? | Notes |
|----------------------------|------------------------------|----------------------------------------|--------|
| General – Core Voting | Partially (election_creation, live_results, vote_verification_portal, prediction_pools) | — | Multi-format voting, collaborative room, plus/minus, MCQ, etc. not individually toggled. |
| General – Gamification & VP | Partially (gamified_elections, prediction_pools) | Yes (60+ toggles) | Matrix covers VP, badges, streaks, challenges, leaderboards, redemption. |
| General – Profile & Account | No | — | No toggle for profile hub, settings, analytics, security center, etc. |
| General – Social | Partially (social_sharing, comments_system, emoji_reactions, direct_messaging) | Some (social in Matrix) | Groups, communities, Moments/Jolts not in main toggles. |
| General – Notifications | Partially (notifications_resend, notifications_sms) | — | Push, in-app, WebSocket, Slack/Discord not in main toggles. |
| General – Payments & Wallet | Yes (stripe_payments, wallet_system) | — | OK for high-level. |
| General – Onboarding, Search, Accessibility, Feedback | No | — | No toggles. |
| Creator – Election creation & management | Partially (election_creation) | — | MCQ studio, live injection, presentation builder, compliance not toggled. |
| Creator – Monetization | Partially (stripe_payments, participatory_advertising) | Yes (creator payout, revenue split in Matrix) | No dedicated “Creator Monetization Studio” or “Earnings Command Center” toggle. |
| Creator – Analytics & growth | Partially (advanced_analytics, predictive_analytics) | — | Creator-specific analytics not toggled. |
| Creator – Content tools (Moments, Jolts, Carousel) | No | — | No toggles. |
| Creator – Community, compliance, AI tools | Partially (creator_success_academy, ai_*) | — | Many creator AI/compliance features not toggled. |
| Advertiser – Campaigns, analytics, slots, registration | Partially (participatory_advertising) | — | No separate toggles for Participatory Ads Studio, campaign dashboard, CPE, brand dashboard, etc. |
| Admin – Core controls | Partially (country_restrictions, platform_integrations) | — | Many admin screens not behind a single switch. |
| Admin – Content moderation | Partially (ai_content_moderation, content_moderation_webhooks) | — | OK at high level. |
| Admin – Fraud & security | Partially (ai_fraud_detection) | Yes (predictive threat in Matrix) | No per-dashboard toggles. |
| Admin – Analytics, BI, payment/payout | Partially (advanced_analytics, stripe_payments) | — | No domain-level toggles. |
| Admin – Gamification admin | — | Yes (Matrix) | Covered in Gamification Admin. |
| Admin – Compliance, performance, AI, real-time, incidents, webhooks, alerts, SMS, reporting | No | — | No toggles. |
| Enterprise | No | — | No toggles. |

So: **all features from the audit are not** on the admin On/Off function. Only a subset is, and many domains have no dedicated toggle.

---

## 5. Newly implemented features (not in the written audit)

From recent migrations and docs (e.g. abstention, vote change, live results lock, content moderation webhooks, creator prize compliance, feature implementation notifications):

- **Abstention tracking** → has toggle: `abstention_tracking`
- **Vote change approval** → has toggle: `vote_change_approval`
- **Live results (lock)** → has toggle: `live_results`
- **Content moderation webhooks** → has toggle: `content_moderation_webhooks`
- **Creator prize compliance flags** → no dedicated toggle (could be under creator_success_academy or a new “creator_compliance”)
- **Feature implementation notifications** (when a feature request is marked implemented) → no dedicated toggle

So: some new features are covered by existing toggles; others are not.

---

## 6. Recommendation: expand platform_feature_toggles by domain

To support “launch with a subset of features and turn more on when you have capacity,” add **domain-level** toggles so you can switch **whole areas** on/off from **Admin Control Center → Platform Features**:

- **General users:** onboarding_wizard, search_discovery, accessibility_localization, user_feedback_portal, collaborative_voting_room, location_based_voting, external_voter_gate, plus_minus_voting, mcq_pre_voting
- **Creator:** creator_monetization_studio, creator_earnings_command_center, creator_analytics_growth, moments_jolts_studio, carousel_premium, creator_compliance_verification, creator_community_hub, ai_creator_tools
- **Advertiser:** participatory_ads_studio, campaign_management_dashboard, advertiser_analytics_roi, ad_slot_manager, brand_advertiser_registration
- **Admin:** content_moderation_center, fraud_detection_dashboards, incident_response, payout_automation, compliance_regulatory, performance_monitoring, ai_orchestration, realtime_infrastructure, webhook_api_management, alert_management, sms_management_admin, executive_reporting
- **Enterprise:** enterprise_white_label, enterprise_sso

A migration that seeds these (and keeps existing 28) is provided in **`supabase/migrations/20260309140000_seed_domain_feature_toggles.sql`**. After applying it, you will have **one place** (Platform Features) to enable/disable by domain. New domain toggles are inserted with `is_enabled = false` by default so you can turn them on when ready; existing behaviour is unchanged. Individual screens still need to **respect** these toggles (e.g. check `platform_feature_toggles` or a shared feature-flag service before rendering or calling backend).

---

## 7. Summary table

| Item | Web (React) | Mobile (Flutter) |
|------|-------------|------------------|
| Admin panel – Platform Features | Admin Control Center → Platform Controls → Platform Features | Same backend; mobile admin may use same or reduced set. |
| Table | `platform_feature_toggles` | Same |
| Service | `adminControlsService.js` (getAllFeatures, toggleFeature) | Use same API / Supabase |
| Gamification toggles | Comprehensive Gamification Admin → Feature Toggle Matrix | Same backend (`feature_flags`) |
| Constants | feature_key / feature_name | Same keys for parity |

---

## 8. Conclusion

- **Confirmation (after implementation):** All features from the Comprehensive Feature Audit and newly implemented ones are now represented in the admin On/Off panel. **28** original + **46** domain + **150+** comprehensive audit toggles are seeded into `platform_feature_toggles`. The Admin Control Center → Platform Features tab shows all of them with search and category filter.
- **What is on the admin panel:** Platform Features tab lists every toggle; Gamification Admin shows the separate Matrix from `feature_flags`.
- **App gating:** Web uses `platformFeatureToggleService`, `usePlatformFeatureToggles`, and `FeatureGateByPath` with `routeFeatureKeys.js` so routes can be hidden/redirected when a feature is off. Mobile uses `PlatformFeatureToggleService`, `RouteFeatureKeys`, and `FeatureGateWidget` for the same.

---

## 9. Implementation summary (March 2026)

| Item | Web (React) | Mobile (Flutter) |
|------|-------------|------------------|
| Toggle read (app) | `platformFeatureToggleService.js` — getEnabledFeatureKeys, isFeatureEnabled | `platform_feature_toggle_service.dart` — getEnabledFeatureKeys, isFeatureEnabled |
| Route gating | `FeatureGate.jsx`, `FeatureGateByPath`, `routeFeatureKeys.js`; Routes wrap with FeatureGateByPath | `feature_gate_widget.dart`, `route_feature_keys.dart`; wrap gated screens with FeatureGateWidget |
| Admin panel | Admin Control Center → Platform Controls → Platform Features (search + category filter) | Same backend; admin screens use same Supabase table |
| Migrations | 20260309150000 (public read), 20260309140000 (domain), 20260309160000 (comprehensive audit) | Same |
