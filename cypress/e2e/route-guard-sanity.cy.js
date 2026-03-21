describe('Route guard sanity for critical admin routes', () => {
  const protectedRoutes = [
    '/unified-ai-decision-orchestration-command-center',
    '/unified-ai-orchestration-command-center',
    '/api-rate-limiting-dashboard',
    '/production-monitoring-dashboard',
    '/comprehensive-health-monitoring-dashboard',
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/rest/v1/**', { statusCode: 200, body: [] });
  });

  protectedRoutes.forEach((path) => {
    it(`does not dead-end when loading ${path}`, () => {
      cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
      cy.get('body').should('be.visible');
      cy.get('body').should('not.contain', '404');
      cy.get('body').should('not.contain', 'Something went wrong');
      cy.location('pathname').should('not.be.empty');
    });
  });
});
