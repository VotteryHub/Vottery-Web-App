/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * User foundation parity smoke.
 * Route-resolution only; shared-route IDs are documented in `apply-regression-evidence.mjs`.
 */
describe('User foundation parity — Web smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/auth/v1/token**', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        user: { id: 'user-foundation-e2e', email: 'user@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'user-foundation-e2e', email: 'user@vottery.com', role: 'authenticated' },
    });
  });

  const routes = [
    '/enhanced-home-feed-dashboard',
    '/location-based-voting',
    '/social-activity-timeline',
    '/notification-center-hub',
    '/guided-onboarding-tours-interactive-tutorial-system',
    '/global-localization-control-center',
    '/settings-account-dashboard',
    '/user-security-center',
    '/multi-authentication-gateway',
    '/election-creation-studio',
    '/moments-creation-studio',
    '/jolts-video-studio',
    '/unified-gamification-dashboard',
    '/election-prediction-pools-interface',
  ];

  routes.forEach((path) => {
    it(`loads ${path} without crash`, () => {
      cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
      cy.get('body').should('be.visible');
      cy.get('body').should('not.contain', 'Something went wrong');
    });
  });
});
