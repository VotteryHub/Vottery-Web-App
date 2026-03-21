describe('Premium Subscription Wallet Signal', () => {
  before(() => {
    Cypress.config('pageLoadTimeout', 120000);
  });

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

  it('renders wallet activity signal text on premium center', () => {
    cy.visit('/enhanced-premium-subscription-center', { timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.contains('Wallet Activity').should('exist');
  });
});
