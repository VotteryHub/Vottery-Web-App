# Implementation: Missing Features & Discrepancy Fixes

**Date:** March 8, 2025  
**Scope:** Partial features completed, missing features implemented, and Web/Mobile discrepancies corrected per audit.

---

## 1. Web App (React)

### 1.1 Elections & Voting dropdown (Left sidebar)

- **Change:** "Audit Elections" (Blockchain Audit) now appears under the Elections & Voting expandable menu.
- **File:** `src/components/ui/LeftSidebar.jsx`
- **Detail:** Filter extended to include screens where `path` contains `blockchain-audit` or `id === 'blockchain-audit'`. Slice limit increased from 8 to 10 to show all voting-related items.

### 1.2 Vote totals visibility (creator control)

- **Status:** Already supported in DB (`vote_visibility`, `vote_visibility_changed_at`) and in:
  - `AdvancedSettingsForm` (Vote Visibility Controls)
  - `LiveResultsChart` (respects visible / hidden / visible_after_vote)
  - `VoteVisibilityControls` (mid-vote change only from hidden → visible)
- **Change:** Creation flow now sends and persists the setting:
  - **File:** `src/pages/election-creation-studio/index.jsx`
  - Added `voteVisibility` and `showLiveResults` to initial `formData`.
  - Added `voteVisibility` and `showLiveResults` to the payload passed to `electionsService.create()` so new elections get the correct visibility and live-results flags.

### 1.3 1 ad per 7 organic items

- **Status:** Already implemented in `src/services/feedBlendingService.js` (`AD_INTERVAL: 7`, ad inserted every 7 organic items).
- **Change:** Comment in `src/services/adSlotManagerService.js` updated to state that participatory ads use 1 sponsored election per 7 organic items and reference `feedBlendingService.AD_INTERVAL`.

---

## 2. Mobile App (Flutter)

### 2.1 Elections & Voting menu parity

- **File:** `lib/presentation/social_media_navigation_hub/social_media_navigation_hub.dart`
- **Changes:**
  - Order and labels aligned with Web: **Create Elections**, **Vote in Elections**, **Verify Elections**, **Audit Elections**, then Vote Analytics and Vote History.
  - **Verify Elections** → `AppRoutes.blockchainVoteVerificationHub`
  - **Audit Elections** → `AppRoutes.blockchainAuditPortal`

### 2.2 Friends & Activity section

- New section **Friends & Activity** with:
  - **Friends** → `AppRoutes.friendRequestsHub`
  - **Activity Feed** → `AppRoutes.socialActivityTimeline`

### 2.3 Analytics & Monitoring routes and nav

- **File:** `lib/routes/app_routes.dart`  
  New route constants:
  - `friendsManagementHub`
  - `socialActivityTimeline`
  - `realTimeAnalyticsDashboard`
  - `livePlatformMonitoringDashboard`
  - `personalAnalyticsDashboard`

- **File:** `lib/presentation/social_media_navigation_hub/social_media_navigation_hub.dart`  
  Under **Analytics & Monetization**, new items:
  - **Real-Time Analytics** → `realTimeAnalyticsDashboard`
  - **Live Platform Monitoring** → `livePlatformMonitoringDashboard`
  - **Personal Analytics** → `personalAnalyticsDashboard`

- **File:** `lib/main.dart`  
  Route handlers added (using existing screens for parity):
  - `realTimeAnalyticsDashboard` → `Ga4EnhancedAnalyticsDashboard` (creator/admin)
  - `livePlatformMonitoringDashboard` → `UnifiedProductionMonitoringHub` (admin)
  - `personalAnalyticsDashboard` → `Ga4EnhancedAnalyticsDashboard` (creator/admin)
  - `socialActivityTimeline` → `CommunityEngagementDashboardScreen` (creator/admin)
  - `friendsManagementHub` → `CommunityEngagementDashboardScreen`

---

## 3. Summary table

| Item | Web | Mobile |
|------|-----|--------|
| Elections dropdown includes Audit | ✅ LeftSidebar filter + slice 10 | N/A (nav hub) |
| Create / Vote / Verify / Audit in nav | ✅ Via nav service + LeftSidebar | ✅ Social nav hub |
| Vote totals visibility (create + persist) | ✅ formData + create payload | Uses same backend |
| 1 ad per 7 organic | ✅ Already in feedBlendingService; comment in adSlotManager | Same backend |
| Real-Time Analytics | ✅ `/real-time-analytics-dashboard` | ✅ Route + nav → GA4 dashboard |
| Live Platform Monitoring | ✅ `/live-platform-monitoring-dashboard` | ✅ Route + nav → production monitoring |
| Personal Analytics | ✅ `/personal-analytics-dashboard` | ✅ Route + nav → GA4 dashboard |
| Social Activity Timeline | ✅ `/social-activity-timeline` | ✅ Route + nav → community engagement |
| Friends Management | ✅ `/friends-management-hub` | ✅ friendRequestsHub + Friends & Activity |

---

## 4. Not implemented (out of scope this pass)

- **Mixnets / full ZK proofs:** Spec-level; no code changes.
- **Smart contracts (Chainlink VRF, homomorphic tally):** Not added.
- **Mobile DMC voice/reactions/rich media gallery:** Would require new Flutter UI and storage; deferred.
- **Dedicated Mobile screens** for Real-Time Analytics, Live Monitoring, Personal Analytics, Social Activity Timeline: currently route to existing dashboards for parity; dedicated screens can be added later.

---

## 5. Constants / APIs

- **Vote visibility:** DB columns `vote_visibility`, `vote_visibility_changed_at`, `show_live_results` (existing migrations). Web uses camelCase in UI; `electionsService` uses `toSnakeCase`/`toCamelCase` for API.
- **Routes:** Web paths unchanged. Mobile new routes: `realTimeAnalyticsDashboard`, `livePlatformMonitoringDashboard`, `personalAnalyticsDashboard`, `socialActivityTimeline`, `friendsManagementHub`.
