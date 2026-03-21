describe('Stabilization route parity smoke', () => {
  const routes = [
    '/comprehensive-health-monitoring-dashboard',
    '/load-testing-performance-analytics-center',
    '/performance-optimization-engine-dashboard',
    '/real-time-web-socket-monitoring-command-center',
    '/automated-data-cache-management-hub',
    '/advanced-supabase-real-time-coordination-hub',
    '/enhanced-real-time-web-socket-coordination-hub',
    '/automatic-ai-failover-engine-control-center',
    '/ai-performance-orchestration-dashboard',
    '/claude-model-comparison-center',
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/functions/v1/**', { statusCode: 200, body: { data: {} } });
    cy.intercept('POST', '**/auth/v1/token**', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        user: { id: 'test-user-id', email: 'test@vottery.com', role: 'authenticated' },
      },
    });
  });

  routes.forEach((path) => {
    it(`loads ${path} without crash or route fallback`, () => {
      cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
      cy.location('pathname').should('eq', path);
      cy.get('body').should('be.visible');
      cy.get('body').should('not.contain', 'Something went wrong');
      cy.get('body').should('not.contain', '404');
    });
  });
});
