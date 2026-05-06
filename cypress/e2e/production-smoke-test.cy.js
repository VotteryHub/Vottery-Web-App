describe('Production Smoke Tests', () => {
  beforeEach(() => {
    // We assume the app is running and accessible
    cy.visit('/');
  });

  it('verifies the app loads and displays the landing page/login', () => {
    cy.get('h1').should('exist');
    cy.contains('Vottery').should('be.visible');
  });

  it('checks for core navigation links', () => {
    // Navigation items visibility
    cy.contains('Elections').should('exist');
    cy.contains('Marketplace').should('exist');
  });

  it('validates authentication flow presence', () => {
    // Check if login button/link exists
    cy.contains('Login').should('exist').click();
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('verifies the admin dashboard is gated', () => {
    // Should redirect to login if not authenticated
    cy.visit('/admin-control-center');
    cy.url().should('include', '/login');
  });

  it('verifies health check endpoint', () => {
    const apiUrl = Cypress.env('API_URL') || 'http://localhost:3001';
    cy.request(`${apiUrl}/health`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status', 'healthy');
    });
  });
});
