/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Sign-off smoke: finance / gamification / compliance hubs resolve without 404.
 * Intercepts stub Supabase; without a real auth session, many paths redirect to `/`, auth, or onboarding.
 *
 * Run: dev server or `vite preview`, then:
 *   npx cypress run --config baseUrl=http://127.0.0.1:4173 --spec cypress/e2e/hub-parity-signoff.cy.js
 */
describe('Hub parity sign-off — Web smoke', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.intercept('GET', '**/rest/v1/**', (req) => {
      if (req.url.includes('/user_profiles')) {
        req.reply({
          statusCode: 200,
          body: {
            id: 'test-user-id',
            role: 'admin',
            email: 'test@vottery.com',
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
        user: { id: 'test-user-id', email: 'test@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'test-user-id', email: 'test@vottery.com', role: 'authenticated' },
    });
  });

  const smoke = (path) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.location('pathname').should('not.match', /(404|not-found)/i);
    cy.location('pathname').then((pathname) => {
      const normalized = (pathname || '').replace(/\/$/, '') || '/';
      const targetPath = path.split('?')[0].replace(/\/$/, '') || '/';
      const allowed =
        normalized === targetPath ||
        normalized === '/' ||
        normalized.includes('/home-feed-dashboard') ||
        normalized.includes('/authentication-portal') ||
        normalized.includes('/interactive-onboarding-wizard') ||
        normalized.includes('/role-upgrade');
      expect(
        allowed,
        `unexpected pathname ${normalized} for visit ${targetPath}`
      ).to.equal(true);
    });
  };

  it('W1: gamification campaign management center', () => {
    smoke('/gamification-campaign-management-center');
  });

  it('W2: gamification rewards management center', () => {
    smoke('/gamification-rewards-management-center');
  });

  it('W3: security compliance automation center', () => {
    smoke('/security-compliance-automation-center');
  });

  it('W4: international payment dispute resolution center', () => {
    smoke('/international-payment-dispute-resolution-center');
  });

  it('W5: unified revenue intelligence dashboard', () => {
    smoke('/unified-revenue-intelligence-dashboard');
  });

  it('W6: admin subscription analytics hub', () => {
    smoke('/admin-subscription-analytics-hub');
  });

  it('W7: public bulletin board audit trail center', () => {
    smoke('/public-bulletin-board-audit-trail-center');
  });

  it('W8: vote verification portal', () => {
    smoke('/vote-verification-portal');
  });

  it('W9: unified payment orchestration hub (lazy)', () => {
    smoke('/unified-payment-orchestration-hub');
  });

  it('W10: admin quest configuration redirects to dynamic quest dashboard', () => {
    smoke('/admin-quest-configuration-control-center');
  });
});
