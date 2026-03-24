/**
 * Ad-hoc route smoke: path is **not** fixed, so this spec is **not** wired into
 * `feature-baseline-ledger-1-233.json` via `apply-regression-evidence.mjs`.
 *
 * Run (example):
 *   npm run test:e2e:cert-single-route -- --config baseUrl=http://127.0.0.1:4173 --env ROLE_PATH=/secure-voting-interface,ROLE_NAME=SecureVoting
 *
 * Env: `ROLE_PATH` (default `/`), optional `ROLE_NAME` for the describe title.
 */
const routePath = Cypress.env('ROLE_PATH') || '/';
const routeName = Cypress.env('ROLE_NAME') || routePath;

describe(`Single voting route check: ${routeName}`, () => {
  it('loads route and displays body', () => {
    cy.visit(routePath, { failOnStatusCode: false });
    cy.location('pathname').should('not.eq', '/404');
    cy.get('body').should('be.visible');
  });
});
