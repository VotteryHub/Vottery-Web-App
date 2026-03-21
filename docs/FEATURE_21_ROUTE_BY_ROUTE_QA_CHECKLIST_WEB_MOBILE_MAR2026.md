# Feature 21 Route-by-Route QA Checklist (Web + Mobile)

## Execution Standard

- Validate each item on **Web** and **Mobile**.
- Confirm route opens correctly, no placeholder dead-end, and back navigation returns to expected previous screen.
- Confirm contextual help toggle renders where implemented and updates text by current state/tab/step.

## Checklist

- [ ] **1. Contextual Help Overlays**
  - Web path: Settings/Security/Election/Vote hubs -> click `What is this?` -> verify overlay + element-aware updates.
  - Mobile path: Help Center, User Security Center, Comprehensive Settings Hub, Vote Dashboard, Vote Dashboard Initial, Election Creation Studio, Vote Casting -> tap help icon -> verify dynamic help text.

- [ ] **2. Language Settings**
  - Web path: route `/global-localization-control-center`.
  - Mobile path: `AppRoutes.globalLanguageSettingsHub` -> Global Language Settings screen loads and saves preference.

- [ ] **3. Accessibility Settings**
  - Web path: accessibility settings/analytics route opens with controls.
  - Mobile path: `AppRoutes.accessibilitySettingsHub` and analytics routes open and return correctly.

- [ ] **4. Multi-Authentication Gateway**
  - Web path: `/multi-authentication-gateway` loads and auth options render.
  - Mobile path: quick registration + passkey/biometric/OTP routes reachable from settings/profile/auth flow.

- [ ] **5. Two-Factor Authentication (Email/SMS/TOTP)**
  - Web path: security center 2FA panel -> send and verify challenge.
  - Mobile path: User Security Center -> Settings tab -> select method (email/sms/authenticator) -> send/setup -> verify.

- [ ] **6. User Security Center**
  - Web path: `/user-security-center` route.
  - Mobile path: `AppRoutes.userSecurityCenter`; verify tabs (risk/events/devices/settings/sessions/audit) and refresh paths.

- [ ] **7. Age Verification Center**
  - Web path: `/age-verification-digital-identity-center`.
  - Mobile path: canonical alias route `AppRoutes.ageVerificationDigitalIdentityCenter` opens age verification center screen.

- [ ] **8. GDPR Export + Deletion**
  - Web path: Settings -> Data Export / Deletion actions -> request submitted states.
  - Mobile path: Comprehensive Settings -> Advanced -> Download Your Data / Delete Account -> request submitted snackbars.

- [ ] **9. Election Creation Studio**
  - Web path: `/election-creation-studio` and save/publish actions.
  - Mobile path: `AppRoutes.electionCreationStudio`; verify all steps and next/previous flow.

- [ ] **10. MCQ Pre-Voting Gate**
  - Web path: pre-vote MCQ route/components before vote submission.
  - Mobile path: Vote Casting gate transitions include `mcq` requirement path.

- [ ] **11. Video Watch Enforcement**
  - Web path: secure voting flow enforces video watch requirement.
  - Mobile path: Vote Casting gate transitions include `video` requirement path.

- [ ] **12. Elections Dashboard Lifecycle**
  - Web path: `/elections-dashboard` and status views.
  - Mobile path: `AppRoutes.electionsDashboard` and `AppRoutes.voteDashboardInitialPage`.

- [ ] **13. Live Question Injection**
  - Web path: `/live-question-injection-management-center` (+ alias redirect check if used).
  - Mobile path: `AppRoutes.liveQuestionInjectionControlCenter` opens control center.

- [ ] **14. Presentation Builder + Audience Q&A**
  - Web path: `/presentation-builder-audience-q-a-hub`.
  - Mobile path: canonical alias route `AppRoutes.presentationBuilderAudienceQaHub` maps to Audience Questions Hub.

- [ ] **15. User Feedback Portal**
  - Web path: `/user-feedback-portal-with-feature-request-system`.
  - Mobile path: `AppRoutes.userFeedbackPortal` screen with submission/vote/list tabs.

- [ ] **16. Feature Implementation Tracking**
  - Web path: feature tracking route/page.
  - Mobile path: `AppRoutes.featureImplementationTracking` loads tracking screen.

- [ ] **17. Creator Monetization Studio**
  - Web path: `/creator-monetization-studio`.
  - Mobile path: creator monetization/analytics routes from creator dashboard path.

- [ ] **18. Subscription Management Controls**
  - Web path: subscription dashboard controls (plan, cancel, auto-renew) succeed.
  - Mobile path: native subscription center flows navigate and persist state.

- [ ] **19. Payment Method Sensitive Protection**
  - Web path: payment method actions require hCaptcha when enabled.
  - Mobile path: payment/auth actions follow native protected flow.

- [ ] **20. Route Feature-Key Synchronization**
  - Web path: `routeFeatureKeys` entries exist for audited routes.
  - Mobile path: `route_feature_keys` + `app_routes` + `route_registry` mappings remain in sync.

- [ ] **21. Navigation + Deep-Link Canonicalization**
  - Web path: alias redirects resolve to canonical routes without loops.
  - Mobile path: canonical alias routes resolve to mapped screens and back-stack works.

## Exit Criteria

- All 21 items checked on both platforms.
- No blocker defects (routing failure, broken flow, crash, or unusable action).
- Any non-blocking UI polish notes logged separately without downgrading certification.
