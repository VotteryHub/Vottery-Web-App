describe('Enterprise SSO route flow', () => {
  it('loads enterprise SSO integration route', () => {
    cy.visit('/enterprise-sso-integration?provider=okta&issuer=https%3A%2F%2Fexample.okta.com', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.location('pathname').should('eq', '/enterprise-sso-integration');
    cy.contains('Enterprise Operations Center').should('be.visible');
    cy.contains('Test SSO Sign-In').should('be.visible');
  });

  it('renders auth callback error state', () => {
    cy.visit('/auth/callback?error=access_denied&error_description=Denied%20for%20e2e', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.location('pathname').should('eq', '/auth/callback');
    cy.contains('Authentication failed: Denied for e2e').should('be.visible');
    cy.contains('Back to Multi-Auth Gateway').should('be.visible');
  });
});
