# VP/XP/Gamification Route-by-Route QA Checklist (Web + Mobile)

## Scope

Features 1-14:
- VP universal center, earning, spending/redemption, marketplace
- Charity + crypto conversion
- XP/levels + badges + streak notifications
- Dynamic quests + AI quests + seasonal challenges
- Prediction pools
- 3D gamified election experience

## Canonical Route Matrix

- **Web**
  - `/vottery-points-vp-universal-currency-center`
  - `/vp-redemption-marketplace-charity-hub`
  - `/dynamic-quest-management-dashboard`
  - `/election-prediction-pools-interface`
  - `/premium-3d-slot-machine-integration-hub`
  - `/3d-gamified-election-experience-center`
- **Mobile**
  - `AppRoutes.vpEconomyDashboard`
  - `AppRoutes.rewardsShopHub`
  - `AppRoutes.digitalWalletPrizeRedemptionSystem`
  - `AppRoutes.vpCharityHub`
  - `AppRoutes.vpCryptoConversion`
  - `AppRoutes.questManagementDashboard`
  - `AppRoutes.enhancedVoteCastingWithPredictionIntegration`
  - `AppRoutes.completeGamifiedLotteryDrawingSystem`

## Route-by-Route Test Steps

### 1) VP Universal Currency Center
- **Web path:** Home/Navigation -> `Vottery Points` -> `/vottery-points-vp-universal-currency-center`
  - Expect: loading state then VP balance, level, earning/spending panels.
  - Expect: no console crash from missing service methods.
- **Mobile path:** App menu -> `VP Economy Dashboard` -> `AppRoutes.vpEconomyDashboard`
  - Expect: current VP, transactions, opportunities rendered.

### 2) VP Earning Actions
- **Web path:** perform vote/login/prediction/quest actions -> return to VP center.
  - Expect: VP increases with configured rules.
- **Mobile path:** vote + daily login + complete quest.
  - Expect: `vp_transactions` entries and balance updates.

### 3) VP Spending and Redemption
- **Web path:** `/vp-redemption-marketplace-charity-hub` -> redeem option.
  - Expect: successful redemption or insufficient VP error.
- **Mobile path:** `Digital Wallet Prize Redemption System` -> request payout / gift card.
  - Expect: success/error snackbar and transaction history update.

### 4) VP Redemption Marketplace
- **Web path:** `/vp-redemption-marketplace-charity-hub`
  - Expect: category tabs, redemption actions, history panel visible.
- **Mobile path:** `AppRoutes.rewardsShopHub`
  - Expect: rewards list loads from `rewards_shop_items` and `process_vp_redemption` executes.

### 5) VP Charity Hub
- **Web path:** in redemption hub, open charity panel and donate.
  - Expect: redemption transaction recorded with `charity_donation`.
- **Mobile path:** `AppRoutes.vpCharityHub` (from wallet redeem tab button).
  - Expect: charity selector + VP donation action with success/failure state.

### 6) VP Crypto Conversion
- **Web path:** in redemption hub, open crypto panel and convert.
  - Expect: conversion action routes through redemption service.
- **Mobile path:** `AppRoutes.vpCryptoConversion` (from wallet redeem tab button).
  - Expect: token selector + amount + conversion submission state.

### 7) XP and 100-Level System
- **Web path:** perform repeated XP actions until level-up thresholds.
  - Expect: level progression capped at 100.
- **Mobile path:** after XP gain, verify level title and multiplier updates.
  - Expect: levels progress beyond old 10-tier behavior.

### 8) Achievement Badge System
- **Web path:** profile/achievement panels.
  - Expect: badge inventory and progress display.
- **Mobile path:** achievement hub/user achievements.
  - Expect: unlock progress and award behavior.

### 9) Streak Tracking + 24h/1h Notifications
- **Web path:** perform daily activity and inspect streak state.
  - Expect: streak status and countdown behavior.
- **Mobile path:** trigger streak update.
  - Expect: entries in `user_streak_reminders` for 24h and 1h reminders.

### 10) Dynamic Quest Management Dashboard
- **Web path:** `/dynamic-quest-management-dashboard`
  - Expect: active quests with progress and reward data.
- **Mobile path:** `AppRoutes.questManagementDashboard`
  - Expect: no static placeholder-only data; quests loaded from `user_quests` or AI fallback.

### 11) AI-Generated Quests
- **Web path:** quest generation flows.
  - Expect: personalized quests with persisted records.
- **Mobile path:** AI quest generation screen/widget.
  - Expect: generated quests saved and visible in dashboard.

### 12) Seasonal Challenges
- **Web path:** gamification multi-language/seasonal views.
  - Expect: season/challenge entries visible and localized.
- **Mobile path:** challenge surfaces and language support.
  - Expect: no dead route; challenge states render without crash.

### 13) Prediction Pools
- **Web path:** `/election-prediction-pools-interface`
  - Expect: pool participation, leaderboard, resolution states.
- **Mobile path:** `AppRoutes.enhancedVoteCastingWithPredictionIntegration`
  - Expect: deterministic tracker behavior (no random drift), reward settlement path.

### 14) 3D Gamified Election Experience
- **Web path:** `/premium-3d-slot-machine-integration-hub` and `/3d-gamified-election-experience-center`
  - Expect: 3D flow is reachable and renders stable.
- **Mobile path:** `AppRoutes.completeGamifiedLotteryDrawingSystem`
  - Expect: full flow enters, animations render, no placeholder crash.

## Negative Tests

- Insufficient VP during redemption must block and show clear error.
- Unauthorized/protected route access must deny without redirect loops.
- Null/empty amount in charity/crypto flow must not submit.
- Network failures must show user-safe fallback and preserve app navigation.

## Pass Criteria

- All listed routes are reachable by in-app navigation.
- No placeholder-only dead-end for core VP/XP flows.
- VP/XP changes are persisted and reflected consistently in UI.
- All critical actions return deterministic success/error states.
