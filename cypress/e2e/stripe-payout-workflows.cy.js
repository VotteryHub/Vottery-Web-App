/// <reference types="cypress" />

/**
 * E2E Test: Stripe Payout Workflows and Settlement Reconciliation
 * Tests creator payout flows, Stripe Connect, and settlement processes
 */
describe('Stripe Payout Workflows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load Stripe payment integration hub', () => {
    cy.visit('/stripe-payment-integration-hub');
    cy.get('body').should('be.visible');
    cy.contains(/stripe|payment/i).should('exist');
  });

  it('should display creator earnings command center', () => {
    cy.visit('/creator-earnings-command-center-with-stripe-integration');
    cy.get('body').should('be.visible');
    cy.contains(/earnings|creator/i).should('exist');
  });

  it('should show Stripe Connect account linking', () => {
    cy.visit('/stripe-connect-account-linking-interface');
    cy.get('body').should('be.visible');
    cy.contains(/stripe|connect/i).should('exist');
  });

  it('should display enhanced creator payout dashboard', () => {
    cy.visit('/enhanced-creator-payout-dashboard-with-stripe-connect-integration');
    cy.get('body').should('be.visible');
    cy.contains(/payout|creator/i).should('exist');
  });

  it('should show settlement reconciliation panel', () => {
    cy.visit('/enhanced-creator-payout-dashboard-with-stripe-connect-integration');
    cy.get('body').should('be.visible');
    cy.get('[class*="grid"]').should('exist');
  });

  it('should display multi-currency settlement dashboard', () => {
    cy.visit('/multi-currency-settlement-dashboard');
    cy.get('body').should('be.visible');
    cy.contains(/settlement|currency/i).should('exist');
  });

  it('should show Stripe lottery payment integration', () => {
    cy.visit('/stripe-lottery-payment-integration-center');
    cy.get('body').should('be.visible');
    cy.contains(/stripe|payment/i).should('exist');
  });

  it('should display automated payout calculation engine', () => {
    cy.visit('/automated-payout-calculation-engine');
    cy.get('body').should('be.visible');
    cy.contains(/payout|calculation/i).should('exist');
  });
});
