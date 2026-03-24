/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Brand registration, REST API management, and Webhook hub smoke (Web/Mobile parity targets).
 *
 * Run: npm start (port 3000) then npm run test:e2e:brand-webhook-api
 */
describe('Brand registration, REST API & Webhook hub — Web smoke', () => {
  const allowedRedirects = new Set([
    '/',
    '/home-feed-dashboard',
    '/authentication-portal',
    '/multi-authentication-gateway',
    '/role-upgrade',
    '/onboarding',
  ]);

  const assertPathResolved = (path) => {
    cy.location('pathname').should((actualPath) => {
      expect(
        actualPath === path || allowedRedirects.has(actualPath),
        `expected "${actualPath}" to equal "${path}" or be an allowed redirect`
      ).to.eq(true);
    });
  };

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

  it('B1: Brand Advertiser Registration', () => {
    cy.visit('/brand-advertiser-registration-portal', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    assertPathResolved('/brand-advertiser-registration-portal');
  });

  it('B2: RESTful API Management Center', () => {
    cy.visit('/res-tful-api-management-center', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    assertPathResolved('/res-tful-api-management-center');
  });

  it('B3: Webhook Integration Hub', () => {
    cy.visit('/webhook-integration-hub', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    assertPathResolved('/webhook-integration-hub');
  });
});
