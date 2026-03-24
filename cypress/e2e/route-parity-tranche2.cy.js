/**
 * Route-resolution smoke (stubbed REST/auth). Ledger IDs cited in
 * `apply-regression-evidence.mjs` → `routeParityTranche2Ids` must stay aligned with these paths.
 */
describe('Tranche 2 Route Parity Checks', () => {
  const routes = [
    '/advanced-search-discovery-intelligence-hub',
    '/election-insights-predictive-analytics',
    '/voting-categories',
    '/interactive-topic-preference-collection-hub',
    '/open-ai-quest-generation-studio',
    '/election-prediction-pools-interface',
    '/3d-gamified-election-experience-center',
    '/enhanced-home-feed-dashboard',
    '/settings-account-dashboard',
    '/personal-analytics-dashboard',
    '/user-analytics-dashboard',
    '/user-security-center',
    '/friends-management-hub',
    '/direct-messaging-center',
    '/social-activity-timeline',
    '/comprehensive-social-engagement-suite',
    '/enhanced-groups-discovery-management-hub',
    '/community-engagement-dashboard',
    '/smart-push-notifications-optimization-center',
    '/vp-economy-health-monitor-dashboard',
    '/vp-redemption-marketplace-charity-hub',
    '/digital-wallet-hub',
    '/user-subscription-dashboard',
    '/voter-education-hub',
    '/user-feedback-portal-with-feature-request-system',
    '/accessibility-analytics-preferences-center',
    '/age-verification-digital-identity-center',
    '/creator-community-hub',
    '/moments-creation-studio',
    '/jolts-video-studio',
    '/real-time-notifications-hub-with-push-integration',
    '/guided-onboarding-tours-interactive-tutorial-system',
    '/ai-guided-interactive-tutorial-system',
    '/enhanced-premium-subscription-center',
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/auth/v1/token**', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        user: { id: 'test-user-id', email: 'test@vottery.com', role: 'authenticated' },
      },
    });
  });

  routes.forEach((path) => {
    it(`loads ${path} without crash`, () => {
      cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
      cy.get('body').should('be.visible');
      cy.get('body').should('not.contain', 'Something went wrong');
    });
  });
});
