/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Dual-platform smoke: Participatory Ads Studio, Vottery Ads Studio (unified), Advertiser Analytics ROI.
 * Intercepts mirror hub-parity-signoff to avoid Supabase blocking first paint.
 *
 * Run: npm start (port 3000) then npm run test:e2e:ads-studios-analytics
 */
describe('Ads studios & advertiser analytics — Web smoke', () => {
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
  });

  const smoke = (path, textSubstring) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.location('pathname').should('eq', path);
    cy.get('body').should('contain', textSubstring);
  };

  const smokeRoute = (path) => {
    cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
    cy.location('pathname').should('eq', path);
  };

  it('A1: Participatory Ads Studio route renders wizard chrome', () => {
    smoke('/participatory-ads-studio', 'Participatory Ads Studio');
  });

  it('A2: Vottery Ads Studio (unified) route renders', () => {
    smoke('/vottery-ads-studio', 'Vottery Ads Studio');
  });

  it('A3: Advertiser Analytics & ROI Dashboard renders with time range controls', () => {
    smoke('/advertiser-analytics-roi-dashboard', 'Advertiser Analytics & ROI Dashboard');
    cy.contains('Time Range:', { timeout: 60000 }).should('be.visible');
    cy.contains('30 Days').should('be.visible');
  });

  it('A4: Enhanced real-time advertiser ROI dashboard route resolves', () => {
    smokeRoute('/enhanced-real-time-advertiser-roi-dashboard');
  });

  it('A5: Brand dashboard and KPIs route resolves', () => {
    smokeRoute('/brand-dashboard-specialized-kpis-center');
  });

  it('A6: Real-time brand alert and budget monitoring route resolves', () => {
    smokeRoute('/real-time-brand-alert-budget-monitoring-center');
  });
});
