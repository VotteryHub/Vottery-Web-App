/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * User quality attributes smoke.
 * This is evidence for route/UI-level attributes only, not exhaustive perf/compliance certification.
 */
describe('User quality attributes parity — Web smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/auth/v1/token**', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        user: { id: 'quality-e2e-user', email: 'quality@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'quality-e2e-user', email: 'quality@vottery.com', role: 'authenticated' },
    });
  });

  it('Q1: seasonal challenge surface resolves from unified gamification dashboard', () => {
    cy.visit('/unified-gamification-dashboard', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.contains(/season|challenge|quest|streak/i, { timeout: 60000 }).should('exist');
  });

  it('Q2: multi-currency surfaces resolve', () => {
    cy.visit('/vottery-points-vp-universal-currency-center', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.contains(/currency|vp|wallet|balance/i, { timeout: 60000 }).should('exist');

    cy.visit('/multi-currency-settlement-dashboard', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.contains(/currency|settlement|exchange|rate/i, { timeout: 60000 }).should('exist');
  });

  it('Q3: adaptive layout smoke across viewports', () => {
    const viewports = [
      { label: 'mobile', size: [390, 844] },
      { label: 'tablet', size: [768, 1024] },
      { label: 'desktop', size: [1440, 900] },
    ];

    viewports.forEach(({ label, size }) => {
      cy.viewport(size[0], size[1]);
      cy.visit('/enhanced-home-feed-dashboard', { failOnStatusCode: false, timeout: 120000 });
      cy.get('body').should('be.visible');
      cy.get('body').should('not.contain', 'Something went wrong');

      cy.window().then((win) => {
        const doc = win.document.documentElement;
        // Allow a small tolerance for scrollbars/subpixel rounding.
        expect(
          doc.scrollWidth,
          `horizontal overflow (${label})`
        ).to.be.lte(doc.clientWidth + 24);
      });
    });
  });
});
