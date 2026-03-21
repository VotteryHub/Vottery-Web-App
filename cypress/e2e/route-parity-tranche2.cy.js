describe('Tranche 2 Route Parity Checks', () => {
  const routes = [
    '/creator-community-hub',
    '/moments-creation-studio',
    '/jolts-video-studio',
    '/real-time-notifications-hub-with-push-integration',
    '/guided-onboarding-tours-interactive-tutorial-system',
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
