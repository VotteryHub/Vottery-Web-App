describe('Route guard sanity for critical admin routes', () => {
  const protectedRoutes = [
    '/unified-ai-decision-orchestration-command-center',
    '/unified-ai-orchestration-command-center',
    '/api-rate-limiting-dashboard',
    '/production-monitoring-dashboard',
    '/comprehensive-health-monitoring-dashboard',
    '/admin-control-center',
    '/admin-automation-control-panel',
    '/advanced-admin-role-management-system',
    '/mobile-admin-dashboard',
    '/content-moderation-control-center',
    '/ai-content-safety-screening-center',
    '/bulk-management-screen',
    '/admin-platform-logs-center',
    '/unified-admin-activity-log',
    '/white-label-election-platform',
    '/zone-specific-threat-heatmaps-dashboard',
    '/real-time-threat-correlation-intelligence-hub',
    '/security-monitoring-dashboard',
    '/automated-security-testing-framework',
    '/cryptographic-security-management-center',
    '/anthropic-security-reasoning-integration-hub',
    '/security-vulnerability-remediation-control-center',
    '/unified-business-intelligence-hub',
    '/enhanced-admin-revenue-analytics-hub',
    '/live-platform-monitoring-dashboard',
    '/advanced-analytics-and-predictive-forecasting-center',
    '/financial-tracking-zone-analytics-center',
    '/automated-payment-processing-hub',
    '/country-based-payout-processing-engine',
    '/stripe-subscription-management-center',
    '/comprehensive-gamification-admin-control-center',
    '/platform-gamification-core-engine',
    '/compliance-dashboard',
    '/compliance-audit-dashboard',
    '/regulatory-compliance-automation-hub',
    '/localization-tax-reporting-intelligence-center',
    '/enhanced-performance-monitoring-dashboard',
    '/query-performance-monitoring-dashboard',
    '/real-time-performance-testing-suite',
    '/production-load-testing-suite',
    '/ml-model-training-interface',
    '/unified-incident-response-orchestration-center',
    '/unified-incident-response-command-center',
    '/automated-incident-response-portal',
    '/stakeholder-incident-communication-hub',
    '/enhanced-incident-response-analytics',
    '/predictive-incident-prevention-24h',
    '/unified-alert-management-center',
    '/advanced-custom-alert-rules-engine',
    '/predictive-anomaly-alerting-deviation-monitoring-hub',
    '/sms-delivery-optimization-engine-control-center',
    '/advanced-webhook-orchestration-hub',
    '/executive-reporting-compliance-automation-hub',
    '/automated-executive-reporting-claude-intelligence-hub',
    '/analytics-export-reporting-hub',
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] });
    cy.intercept('POST', '**/rest/v1/**', { statusCode: 200, body: [] });
  });

  protectedRoutes.forEach((path) => {
    it(`does not dead-end when loading ${path}`, () => {
      cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
      cy.get('body').should('be.visible');
      cy.get('body').should('not.contain', '404');
      cy.get('body').should('not.contain', 'Something went wrong');
      cy.location('pathname').should('not.be.empty');
    });
  });
});
