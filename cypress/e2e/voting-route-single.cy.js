const routePath = Cypress.env('ROLE_PATH') || '/';
const routeName = Cypress.env('ROLE_NAME') || routePath;

describe(`Single voting route check: ${routeName}`, () => {
  it('loads route and displays body', () => {
    cy.visit(routePath, { failOnStatusCode: false });
    cy.location('pathname').should('not.eq', '/404');
    cy.get('body').should('be.visible');
  });
});
