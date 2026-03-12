/// <reference types="cypress" />

import type {} from 'cypress';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      navigateAndVerify(path: string, expectedText?: string): Chainable<void>;
      waitForLoad(): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email = 'test@vottery.com', password = 'testpassword') => {
  cy.visit('/authentication-portal');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', 'authentication-portal');
});

// Navigate to page and verify it loads
Cypress.Commands.add('navigateAndVerify', (path, expectedText) => {
  cy.visit(path);
  cy.get('body').should('be.visible');
  if (expectedText) {
    cy.contains(expectedText, { matchCase: false }).should('exist');
  }
});

// Wait for loading to complete
Cypress.Commands.add('waitForLoad', () => {
  cy.get('[class*="animate-spin"]', { timeout: 10000 }).should('not.exist');
});

export {};