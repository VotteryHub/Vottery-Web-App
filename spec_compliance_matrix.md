# Spec Compliance Matrix - Vottery Web App

This document audits the current implementation against the major requirements from the product documentation.

## Requirements Audit

| Requirement | Status | File Paths | DB Tables | Proof / Verification |
| :--- | :--- | :--- | :--- | :--- |
| **Navigation** | Implemented | `src/components/SideNavigation.jsx`<br>`src/components/SideNavigationMobile.jsx` | N/A | Responsive sidebar with dual-state (desktop/mobile) and role-based items. |
| **4 Premium Carousels** | Implemented | `src/pages/home-feed-dashboard/index.jsx`<br>`src/pages/home-feed-dashboard/components/` | `elections`, `user_profiles` | Horizontal Snap, Vertical Stack, Smooth Gradient, Isometric Depth. |
| **Feed Injection Pattern** | Implemented | `src/pages/home-feed-dashboard/index.jsx` | N/A | Strict **1-3-1 Power Scroll** (Post -> Carousel -> 3 Posts -> Carousel). |
| **Elections Voting UIs** | Implemented | `src/pages/secure-voting-interface/index.jsx` | `election_votes` | Multi-step voting flow with identity gate and encryption progress. |
| **Live Results Rules** | Implemented | `src/pages/secure-voting-interface/components/LiveResultsPoll.jsx` | `election_votes` | Visibility controls (Always, Post-Vote, End-only) respected. |
| **Gamified Slot Machine** | Implemented | `src/components/SlotMachine3D`<br>`src/components/PlatformGamificationWidget.jsx` | `platform_gamification_campaigns` | **Floating Corner Placement** on voting screen + Integrated in Winner Engine. |
| **QR Styling** | Implemented | `src/pages/election-creation-studio/components/AdvancedSettingsForm.jsx` | N/A | **Dual-Logo QR**: Vottery center mark + Creator bottom center mark. |
| **Feature Flags** | Implemented | `src/hooks/useFeatureStore.js`<br>`src/services/platformFeatureToggles.js` | `platform_feature_toggles` | Canonical table `platform_feature_toggles` used for all UI/API gating. |
| **Module Boundaries** | Implemented | `src/modules/` | N/A | **Kernel+Modules architecture**. Modules communicate ONLY via Event Bus. |
| **Payments Routing** | Implemented | `src/services/stripeService.js` | `platform_payments` | Stripe primary routing for creator subscriptions and prize payouts. |
| **Comms Routing** | Implemented | `src/services/smsProviderService.js` | `sms_provider_state` | **Telnyx (Primary) → Twilio (Fallback)**. Excludes prizes on Twilio. |
| **KYC Routing** | Implemented | `src/services/identityOrchestrationService.js` | `identity_verification_events` | **Sumsub (Primary) → Veriff (Fallback)** via Edge Function orchestrator. |
| **Ads Placement Rules** | Implemented | `src/services/adSlotManagerService.js`<br>`src/pages/home-feed-dashboard/index.jsx` | `ad_campaigns` | **1-3-1 pattern** with injection at `i % 4 === 2`. Waterfall: Internal -> AdSense. |

## Spec-Critical Confirmation Details

### A) SMS Routing
- **Logic**: `smsProviderService.js` (L208-226).
- **Rule**: If `activeProvider === 'twilio'`, any message containing "lottery", "prize", "winner", etc., is dropped with a "skipped" status to prevent regulatory issues.

### B) Identity Verification
- **Logic**: `supabase/functions/identity-orchestrator/index.ts`.
- **Rule**: Sumsub is attempted first. Fallback to Veriff occurs if Sumsub fails or returns a confidence score < 85% for high-stakes actions.

### C) Slot Machine Placement
- **Logic**: `SecureVotingInterface.jsx` (L763) uses `PlatformGamificationWidget` with `floating={true}`.
- **Visual**: Appears as a premium floating 3D bubble in the top right corner of the voting interface.
- **Admin**: Integrated into `WinnerSelectionEngine.jsx` for live monthly draw visualization.

### D) QR Styling
- **Logic**: `AdvancedSettingsForm.jsx` (L11-61).
- **Style**:
    - **Vottery Mark**: Blue background, gold stroke, checkmark in center.
    - **Creator Mark**: White rounded box at bottom center of the QR square.

## Dev Notes on Deviations
- **Slot Machine**: Refactored from a full-width block to a floating corner widget to better align with the "front corner" spec while maintaining accessibility.
- **Feature Flags**: Consolidated `feature_flags` (legacy) into `platform_feature_toggles` (canonical) to ensure one source of truth across web and mobile.

---
**Verified by Antigravity AI Coding Assistant**
Date: 2026-04-27
Status: **LAUNCH READY (Stage 1)**
