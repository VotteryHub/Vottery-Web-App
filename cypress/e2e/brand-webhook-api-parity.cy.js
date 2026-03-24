/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Brand registration, REST API management, and Webhook hub smoke (Web/Mobile parity targets).
 *
 * Run: npm start (port 3000) then npm run test:e2e:brand-webhook-api
 */
describe('Brand registration, REST API & Webhook hub — Web smoke', () => {
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
    cy.location('pathname').should('eq', '/brand-advertiser-registration-portal');
    cy.contains('Brand Advertiser Registration', { timeout: 60000 }).should('be.visible');
    cy.contains('Company Info', { timeout: 60000 }).should('be.visible');
  });

  it('B2: RESTful API Management Center', () => {
    cy.visit('/res-tful-api-management-center', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.location('pathname').should('eq', '/res-tful-api-management-center');
    cy.contains('RESTful API Management Center', { timeout: 60000 }).should('be.visible');
    cy.contains('Comprehensive Express.js endpoint administration', { timeout: 60000 }).should(
      'be.visible',
    );
  });

  it('B3: Webhook Integration Hub', () => {
    cy.visit('/webhook-integration-hub', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.location('pathname').should('eq', '/webhook-integration-hub');
    cy.contains('Webhook Integration Hub', { timeout: 60000 }).should('be.visible');
    cy.contains('Configurable event notifications', { timeout: 60000 }).should('be.visible');
  });
});
