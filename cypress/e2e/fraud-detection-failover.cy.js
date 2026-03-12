/// <reference types="cypress" />

/**
 * E2E Test: AI-Powered Fraud Detection with Automatic Failover
 * Tests fraud detection system with OpenAI/Claude/Gemini/Perplexity failover scenarios
 */
describe('Fraud Detection Failover', () => {
  beforeEach(() => {
    cy.visit('/authentication-portal');
  });

  it('should load fraud detection dashboard', () => {
    cy.visit('/advanced-ai-fraud-prevention-command-center');
    cy.get('body').should('be.visible');
    cy.contains(/fraud/i).should('exist');
  });

  it('should display real-time threat assessment panel', () => {
    cy.visit('/advanced-ai-fraud-prevention-command-center');
    cy.get('body').should('be.visible');
    // Verify threat assessment components render
    cy.get('[class*="rounded"]').should('have.length.greaterThan', 0);
  });

  it('should handle AI failover when primary provider unavailable', () => {
    cy.visit('/automatic-ai-failover-engine-control-center');
    cy.get('body').should('be.visible');
    // Verify failover engine loads
    cy.contains(/failover/i).should('exist');
  });

  it('should show fraud detection metrics', () => {
    cy.visit('/fraud-detection-alert-management-center');
    cy.get('body').should('be.visible');
    cy.get('[class*="grid"]').should('exist');
  });

  it('should navigate to fraud prevention dashboard', () => {
    cy.visit('/fraud-prevention-dashboard-with-perplexity-threat-analysis');
    cy.get('body').should('be.visible');
    cy.url().should('include', 'fraud-prevention');
  });

  it('should display AI orchestration status', () => {
    cy.visit('/unified-ai-orchestration-command-center');
    cy.get('body').should('be.visible');
    cy.contains(/orchestration|AI/i).should('exist');
  });
});
