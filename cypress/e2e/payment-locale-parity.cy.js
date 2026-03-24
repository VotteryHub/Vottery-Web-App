/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

describe('Payment and localization hubs - Web parity smoke', () => {
  const allowedRedirects = new Set([
    '/',
    '/home-feed-dashboard',
    '/authentication-portal',
    '/multi-authentication-gateway',
    '/role-upgrade',
    '/onboarding',
  ]);

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', (req) => {
      if (req.url.includes('/user_profiles')) {
        req.reply({
          statusCode: 200,
          body: {
            id: 'test-user-id',
            role: 'admin',
            email: 'admin@vottery.com',
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
        user: { id: 'test-user-id', email: 'admin@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'test-user-id', email: 'admin@vottery.com', role: 'authenticated' },
    });
    cy.intercept('GET', '**/realtime/v1/**', { statusCode: 200, body: {} });
  });

  const smokeRoute = (path) => {
    // Route-contract smoke: verify SPA entrypoint resolves for the route URL.
    cy.request({ url: path, failOnStatusCode: false }).its('status').should('be.oneOf', [200, 304]);
  };

  it('P1: Automated Payment Processing Hub', () => {
    smokeRoute('/automated-payment-processing-hub');
  });

  it('P2: Stripe Payment Integration Hub', () => {
    smokeRoute('/stripe-payment-integration-hub');
  });

  it('P3: International Payment Dispute Resolution Center', () => {
    smokeRoute('/international-payment-dispute-resolution-center');
  });

  it('L1: Multi-language intelligence hub route resolves', () => {
    smokeRoute('/gamification-multi-language-intelligence-center');
  });

  it('L2: Localization tax/reporting route resolves', () => {
    smokeRoute('/localization-tax-reporting-intelligence-center');
  });
});
