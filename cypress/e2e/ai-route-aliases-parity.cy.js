/// <reference types="cypress" />
/* eslint-disable no-undef */
/* global describe, beforeEach, it, cy */

/**
 * Smoke: Perplexity redirects, ML aliases, and former placeholder routes resolve to real UIs.
 * Intercepts mirror route-parity-tranche2 to avoid Supabase blocking render.
 */
describe('AI / fraud route aliases and redirects', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/auth/v1/token**', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        user: { id: 'test-user-id', email: 'test@vottery.com', role: 'authenticated' },
      },
    });
  });

  it('redirects perplexity market research to advanced perplexity fraud intelligence', () => {
    cy.visit('/perplexity-market-research-intelligence-center', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.url().should('include', 'advanced-perplexity-fraud-intelligence-center');
    cy.get('body').should('be.visible');
  });

  it('redirects perplexity strategic planning to fraud forecasting', () => {
    cy.visit('/perplexity-strategic-planning-center', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.url().should('include', 'advanced-perplexity-fraud-forecasting-center');
    cy.get('body').should('be.visible');
  });

  it('loads advanced ML threat alias (enhanced predictive threat)', () => {
    cy.visit('/advanced-ml-threat-detection-center', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
  });

  it('loads continuous ML feedback alias (auto-improving fraud)', () => {
    cy.visit('/continuous-ml-feedback-outcome-learning-center', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
  });

  it('loads open-ai carousel content intelligence (content distribution)', () => {
    cy.visit('/open-ai-carousel-content-intelligence-center', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'Something went wrong');
  });
});
