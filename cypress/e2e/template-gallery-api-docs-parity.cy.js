/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Campaign Template Gallery + API Documentation Portal smoke (Web/Mobile parity targets).
 *
 * Run: npm start (port 3000) then npm run test:e2e:template-gallery-api-docs
 */
describe('Template gallery & API docs portal — Web smoke', () => {
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
  });

  it('T1: Campaign Template Gallery', () => {
    cy.visit('/campaign-template-gallery', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.location('pathname').should('eq', '/campaign-template-gallery');
    cy.contains('Campaign Template Gallery', { timeout: 60000 }).should('be.visible');
    cy.contains('All Industries', { timeout: 60000 }).should('be.visible');
  });

  it('T2: API Documentation Portal', () => {
    cy.visit('/api-documentation-portal', { failOnStatusCode: false, timeout: 120000 });
    cy.get('body').should('be.visible');
    cy.location('pathname').should('eq', '/api-documentation-portal');
    cy.contains('Developer API Documentation', { timeout: 60000 }).should('be.visible');
    cy.contains('Quick Start', { timeout: 60000 }).should('be.visible');
  });
});
