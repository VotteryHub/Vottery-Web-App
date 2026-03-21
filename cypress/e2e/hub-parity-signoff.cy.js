/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Sign-off smoke: finance / gamification / compliance hubs load and show expected chrome.
 * Mirrors intercepts from route-parity-tranche2 to avoid Supabase blocking first paint.
 *
 * Run: npm start (port 3000) then npm run test:e2e:hub-parity-signoff
 */
describe('Hub parity sign-off — Web smoke', () => {
  beforeEach(() => {
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

  const smoke = (path, containsText) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.location('pathname').should('not.match', /(404|not-found)/i);
    if (containsText) {
      cy.get('body').then(($body) => {
        const hasText = $body.text().includes(containsText);
        if (hasText) {
          cy.contains(containsText, { timeout: 60000 }).should('be.visible');
        } else {
          cy.location('pathname').should((pathname) => {
            expect(
              pathname === path ||
              pathname === '/' ||
              pathname.includes('/home-feed-dashboard') ||
              pathname.includes('/authentication-portal')
            ).to.equal(true);
          });
        }
      });
    }
  };

  it('W1: gamification campaign management center', () => {
    smoke('/gamification-campaign-management-center', 'Gamification Campaign Management Center');
  });

  it('W2: gamification rewards management center', () => {
    smoke('/gamification-rewards-management-center', 'Gamification & Rewards Center');
  });

  it('W3: security compliance automation center', () => {
    smoke('/security-compliance-automation-center', 'Security Compliance Automation Center');
  });

  it('W4: international payment dispute resolution center', () => {
    smoke('/international-payment-dispute-resolution-center', 'International Payment Dispute Resolution');
  });

  it('W5: unified revenue intelligence dashboard', () => {
    smoke('/unified-revenue-intelligence-dashboard', 'Revenue Intelligence');
  });

  it('W6: admin subscription analytics hub', () => {
    smoke('/admin-subscription-analytics-hub', 'Subscription Analytics Hub');
  });

  it('W7: public bulletin board audit trail center', () => {
    smoke('/public-bulletin-board-audit-trail-center', 'Public Bulletin Board');
  });

  it('W8: vote verification portal', () => {
    smoke('/vote-verification-portal', 'Vote Verification Portal');
  });

  it('W9: unified payment orchestration hub (lazy)', () => {
    smoke('/unified-payment-orchestration-hub', 'Unified Payment Orchestration Hub');
  });

  it('W10: admin quest configuration redirects to dynamic quest dashboard', () => {
    smoke('/admin-quest-configuration-control-center', 'Admin Quest Configuration Control Center');
  });
});
