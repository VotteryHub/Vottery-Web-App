# Voting Roles Route QA Checklist (Web + Mobile)

Date: 2026-03-20
Scope: 10 voting roles, navigation integrity, guard behavior, expected state transitions.

## 1) Plurality Voting
- Web click path: Home Feed -> Trending/Suggested Election card -> `Secure Voting Interface`.
- Web expected states:
  - URL resolves to `/secure-voting-interface?election=<id>`.
  - Ballot renders plurality options.
  - Submit stays disabled until one option is selected.
  - On submit success, vote receipt screen appears with back paths.
- Mobile click path: Vote dashboard/list -> `AppRoutes.enhancedVoteCasting` with `election_id`.
- Mobile expected states:
  - Permission/auth checks complete.
  - Single-select vote option behavior.
  - Submit only enabled when `_currentGate == vote` and option is selected.
  - Success snackbar and safe back navigation.

## 2) Ranked Choice Voting
- Web click path: Vote in Elections Hub -> ranked-choice election -> `Secure Voting Interface`.
- Web expected states:
  - Ranked ballot renders and accepts ordering.
  - Submit disabled until ranked choices exist.
  - Payload includes ranked choices.
- Mobile click path: `AppRoutes.enhancedVoteCastingWithPredictionIntegration` -> Ranked Choice tab.
- Mobile expected states:
  - Ranking UI active.
  - Submit disabled until ranking exists.
  - Submit calls backend vote service.

## 3) Approval Voting
- Web click path: Elections dashboard -> Vote -> `Secure Voting Interface`.
- Web expected states:
  - Multi-select approval toggles.
  - Submit disabled until at least one approval.
- Mobile click path: `AppRoutes.enhancedVoteCastingWithPredictionIntegration` -> Approval tab.
- Mobile expected states:
  - Multi-select approval works.
  - Submit reaches backend.

## 4) Plus/Minus Voting
- Web click path: direct route `/plus-minus-voting-interface` or plus-minus election through secure voting.
- Web expected states:
  - Plus/minus scoring controls render.
  - Submit only enabled when scoring data exists.
- Mobile click path: `AppRoutes.enhancedVoteCastingWithPredictionIntegration` -> Plus-Minus tab.
- Mobile expected states:
  - Score controls update local map.
  - Submit allowed only when at least one non-zero score.

## 5) MCQ Pre-Voting Quiz
- Web click path: MCQ-required election -> `Secure Voting Interface`.
- Web expected states:
  - MCQ step appears before vote step.
  - Completion advances flow.
- Mobile click path: `AppRoutes.enhancedVoteCasting` for election with `require_mcq=true`.
- Mobile expected states:
  - Gate blocks voting with explicit message.
  - Back path available (no dead-end).

## 6) MCQ Image Voting
- Web click path: `/enhanced-mcq-image-interface`.
- Web expected states:
  - Interface loads and image-option interactions are visible.
- Mobile click path: `AppRoutes.enhancedMcqImageOptionsInterface`.
- Mobile expected states:
  - Screen loads with image option controls.
  - Feature key maps to `enhanced_mcq_image_interface`.

## 7) Prediction Pool Voting
- Web click path: Secure voting receipt -> Predict button -> `/election-prediction-pools-interface?election=<id>`.
- Web expected states:
  - Prediction UI loads for election context.
  - User can submit prediction.
- Mobile click path: `AppRoutes.enhancedVoteCastingWithPredictionIntegration` -> Predict FAB/bottom sheet -> Submit vote.
- Mobile expected states:
  - Prediction can be locked.
  - Vote submit uses backend (not simulated delay).

## 8) Collaborative Voting Room
- Web click path: `/collaborative-voting-room`.
- Web expected states:
  - Room opens, chat/results panel visible.
  - Back path available.
- Mobile click path: `AppRoutes.collaborativeVotingRoom`.
- Mobile expected states:
  - Screen layout stable (no Expanded-in-scroll runtime failure).
  - Discussion and voting panels visible.
  - Back path exits room safely.

## 9) Location-Based Voting
- Web click path: `/location-based-voting` -> select election marker/card -> `View Election`.
- Web expected states:
  - Navigation resolves to `/secure-voting-interface?election=<id>`.
  - Election loads without param mismatch errors.
- Mobile click path: `AppRoutes.locationVoting`.
- Mobile expected states:
  - Location permission flow is handled.
  - Nearby elections render and route to vote flow.

## 10) External Voter Gate
- Web click path: shared link -> `/secure-voting-interface?election=<id>&ref=external`.
- Web expected states:
  - External voter gate modal appears.
  - Create account/sign-in options shown.
  - Redirect to multi-auth uses election-preserving URL.
- Mobile click path: currently permission/auth-method checks within vote casting route.
- Mobile expected states:
  - Blocked users receive explicit reason.
  - Back path available.

## Automated Checks Added In This Pass
- Web: `cypress/e2e/voting-roles-routing.cy.js`
- Web support file: `cypress/support/e2e.js`
- Web command: `npm run test:e2e:voting-roles`
- Mobile test: `test/navigation/voting_roles_navigation_test.dart`
- Mobile feature-key parity updates: `lib/config/route_feature_keys.dart`

## Execution Notes
- Web Cypress run is currently blocked by local path/command resolution for Cypress binary in a space-containing workspace path.
- Mobile Flutter test run is currently blocked by existing pre-existing compile errors in unrelated files.
