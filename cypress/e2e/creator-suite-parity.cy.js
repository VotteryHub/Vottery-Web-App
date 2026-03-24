/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Creator suite route smoke (route-resolution only).
 * Keep this aligned with `creatorSuiteParityIds` in `scripts/apply-regression-evidence.mjs`.
 */
describe('Creator suite parity — Web smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', (req) => {
      if (req.url.includes('/user_profiles')) {
        req.reply({
          statusCode: 200,
          body: {
            id: 'creator-test-user-id',
            role: 'creator',
            email: 'creator@vottery.com',
          },
        });
        return;
      }
      req.reply({ statusCode: 200, body: [] });
    });
    cy.intercept('POST', '**/auth/v1/token**', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        user: { id: 'creator-test-user-id', email: 'creator@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'creator-test-user-id', email: 'creator@vottery.com', role: 'authenticated' },
    });
  });

  const creatorRoutes = [
    '/election-creation-studio',
    '/creator-country-verification-interface',
    '/enhanced-mcq-creation-studio',
    '/live-question-injection-management-center',
    '/presentation-builder-audience-q-a-hub',
    '/creator-monetization-studio',
    '/creator-brand-partnership-portal',
    '/creator-marketplace-screen',
    '/real-time-analytics-dashboard',
    '/creator-revenue-forecasting-dashboard',
    '/creator-success-academy',
    '/campaign-template-gallery',
    '/dynamic-cpe-pricing-engine-dashboard',
    '/moments-creation-studio',
    '/creator-growth-analytics-dashboard',
    '/mcq-analytics-intelligence-dashboard',
    '/mcq-a-b-testing-analytics-dashboard',
  ];

  creatorRoutes.forEach((path) => {
    it(`loads ${path} without crash`, () => {
      cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
      cy.get('body').should('be.visible');
      cy.get('body').should('not.contain', 'Something went wrong');
      cy.location('pathname').should('eq', path);
    });
  });
});
