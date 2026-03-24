/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Crypto/compliance route smoke.
 * IMPORTANT: This verifies route resolution and visible compliance UX copy only.
 * It is not a cryptographic correctness proof.
 */
describe('Crypto and compliance parity — Web smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/auth/v1/token**', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        user: { id: 'crypto-e2e-user', email: 'security@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'crypto-e2e-user', email: 'security@vottery.com', role: 'authenticated' },
    });
  });

  const smokeRoute = (path) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
  };

  it('loads cryptographic security management center', () => {
    smokeRoute('/cryptographic-security-management-center');
    cy.contains(/cryptographic|encryption|security/i, { timeout: 60000 }).should('exist');
  });

  it('loads vote anonymity mixnet control hub', () => {
    smokeRoute('/vote-anonymity-mixnet-control-hub');
    cy.contains(/mixnet|anonymity|privacy/i, { timeout: 60000 }).should('exist');
  });

  it('loads public bulletin board / VVSG compliance panel', () => {
    smokeRoute('/public-bulletin-board-audit-trail-center');
    cy.contains(/VVSG|compliance|audit/i, { timeout: 60000 }).should('exist');
  });
});
