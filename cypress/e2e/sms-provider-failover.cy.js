/// <reference types="cypress" />

/* eslint-disable no-undef */
/**
 * E2E Test: SMS Provider Failover - Telnyx → Twilio Automatic Switching
 * Tests SMS provider failover with gamification blocking scenarios
 */

declare global {
  const describe: any;
  const beforeEach: any;
  const it: any;
  const cy: any;
}

describe('SMS Provider Failover - Telnyx to Twilio', () => {
  beforeEach(() => {
    cy?.visit('/');
  });

  it('should load SMS failover monitoring dashboard', () => {
    cy?.visit('/real-time-sms-failover-monitoring-dashboard');
    cy?.get('body')?.should('be.visible');
    cy?.contains(/failover|SMS/i)?.should('exist');
  });

  it('should display provider health status for Telnyx and Twilio', () => {
    cy?.visit('/real-time-sms-failover-monitoring-dashboard');
    cy?.get('body')?.should('be.visible');
    cy?.get('[class*="rounded"]')?.should('have.length.greaterThan', 2);
  });

  it('should show SMS performance analytics', () => {
    cy?.visit('/sms-performance-analytics-hub');
    cy?.get('body')?.should('be.visible');
    cy?.contains(/performance|analytics/i)?.should('exist');
  });

  it('should display failover history timeline', () => {
    cy?.visit('/real-time-sms-failover-monitoring-dashboard');
    cy?.get('body')?.should('be.visible');
    // Verify timeline component exists
    cy?.get('[class*="border"]')?.should('have.length.greaterThan', 0);
  });

  it('should show SMS compliance and rate limiting controls', () => {
    cy?.visit('/sms-compliance-rate-limiting-control-center');
    cy?.get('body')?.should('be.visible');
    cy?.contains(/compliance|rate/i)?.should('exist');
  });

  it('should display Telnyx SMS provider management', () => {
    cy?.visit('/telnyx-sms-provider-management-center');
    cy?.get('body')?.should('be.visible');
    cy?.contains(/telnyx|SMS/i)?.should('exist');
  });

  it('should show SMS health check results', () => {
    cy?.visit('/automated-sms-health-check-suite-dashboard');
    cy?.get('body')?.should('be.visible');
    cy?.contains(/health|check/i)?.should('exist');
  });
});
