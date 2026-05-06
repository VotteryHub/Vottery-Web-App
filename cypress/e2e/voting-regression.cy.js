describe('Voting Flow Regression Tests', () => {
  const TEST_USER = 'test.preview@vottery.test';
  const TEST_PASS = 'VotteryTest2026!';

  beforeEach(() => {
    // Login before each test
    cy.visit('/authentication-portal');
    cy.get('input[type="email"]').type(TEST_USER);
    cy.get('input[type="password"]').type(TEST_PASS);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home-feed-dashboard');
  });

  it('A) verifies the Step 1 Hang fix (auto-advance to ballot)', () => {
    // We search for the regression election created in the seed script
    cy.contains('Regression: Step 1 Hang Fix').click();
    
    // It should automatically move from step 1 (MCQ/Media) to step 2 (Ballot)
    // We check for elements that only appear in Step 2 (the Ballot)
    cy.contains('Cast Your Vote', { timeout: 10000 }).should('be.visible');
    
    // Check if the ballot component (Approval) rendered its options
    cy.get('[data-testid="approval-ballot"]').should('exist');
    cy.contains('Option 1').should('be.visible');
    cy.contains('Option 2').should('be.visible');
    
    // Verify we are not stuck on the "View Media" or "Take Quiz" step
    cy.get('.step-indicator').contains('Cast Vote').should('have.class', 'active');
  });

  it('B) verifies voting type normalization logic', () => {
    // 1. Test Ranked Choice variant (standardized in seed for E2E, but normalization utility handles variants)
    cy.visit('/home-feed-dashboard');
    cy.contains('Regression: Normalization Test').click();
    
    cy.contains('Cast Your Vote', { timeout: 10000 }).should('be.visible');
    // Ranked choice ballot should show ranking controls
    cy.get('[data-testid="ranked-choice-ballot"]').should('exist');
    cy.contains('Option 1').should('be.visible');

    // 2. Test Plus-Minus variant
    cy.visit('/home-feed-dashboard');
    cy.contains('Regression: Plus-Minus Test').click();
    
    cy.contains('Cast Your Vote', { timeout: 10000 }).should('be.visible');
    // Plus-minus ballot should show score buttons
    cy.get('[data-testid="plus-minus-ballot"]').should('exist');
    cy.get('button').contains('+1').should('exist');
  });
});
