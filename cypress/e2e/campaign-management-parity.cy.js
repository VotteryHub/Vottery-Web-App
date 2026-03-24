/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Campaign Management hub (primary + Web alias route). Same intercept pattern as ads-studios-analytics-parity.
 *
 * Run: npm start (port 3000) then npm run test:e2e:campaign-management
 */
describe('Campaign Management Dashboard — Web smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', (req) => {
      if (req.url.includes('/user_profiles')) {
        req.reply({
          statusCode: 200,
          body: {
            id: 'test-user-id',
            role: 'advertiser',
            email: 'advertiser@vottery.com',
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
        user: { id: 'test-user-id', email: 'advertiser@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'test-user-id', email: 'advertiser@vottery.com', role: 'authenticated' },
    });
    cy.intercept('GET', '**/realtime/v1/**', { statusCode: 200, body: {} });
  });

  const smokeCampaignOps = (path) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.location('pathname').should('eq', path);
    cy.contains('Campaign Management Dashboard', { timeout: 60000 }).should('be.visible');
    cy.contains('Time Range:', { timeout: 60000 }).should('be.visible');
  };

  const smokeCpeHub = (path) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.location('pathname').should('eq', path);
    cy.contains('Sponsored Elections & CPE Management Hub', { timeout: 60000 }).should('be.visible');
    cy.contains('CPE Pricing Matrix', { timeout: 60000 }).should('be.visible');
  };

  const smokeRoute = (path) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.location('pathname').should('eq', path);
  };

  it('C1: /campaign-management-dashboard', () => {
    smokeCampaignOps('/campaign-management-dashboard');
  });

  it('C2: /sponsored-elections-schema-cpe-management-hub (CPE workspace)', () => {
    smokeCpeHub('/sponsored-elections-schema-cpe-management-hub');
  });

  it('C3: Automated campaign optimization route resolves', () => {
    smokeRoute('/automated-campaign-optimization-dashboard');
  });

  it('C4: Ad slot manager inventory control route resolves', () => {
    smokeRoute('/ad-slot-manager-inventory-control-center');
  });

  it('C5: Dynamic ad rendering/fill-rate analytics route resolves', () => {
    smokeRoute('/dynamic-ad-rendering-fill-rate-analytics-hub');
  });
});
