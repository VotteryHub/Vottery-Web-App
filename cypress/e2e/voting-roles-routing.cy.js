const roleRoutes = [
  { role: 'Plurality Voting', path: '/secure-voting-interface?election=e2e-plurality' },
  { role: 'Ranked Choice Voting', path: '/secure-voting-interface?election=e2e-ranked' },
  { role: 'Approval Voting', path: '/secure-voting-interface?election=e2e-approval' },
  { role: 'Plus Minus Voting', path: '/plus-minus-voting-interface' },
  { role: 'MCQ Pre Voting Quiz', path: '/enhanced-mcq-pre-voting-interface' },
  { role: 'MCQ Image Voting', path: '/enhanced-mcq-image-interface' },
  { role: 'Prediction Pool Voting', path: '/election-prediction-pools-interface?election=e2e-prediction' },
  { role: 'Collaborative Voting Room', path: '/collaborative-voting-room' },
  { role: 'Location Based Voting', path: '/location-based-voting' },
  { role: 'External Voter Gate', path: '/secure-voting-interface?election=e2e-external&ref=external' },
  { role: 'Content Quality Scoring Claude', path: '/content-quality-scoring-claude' },
  { role: 'Predictive Creator Insights', path: '/predictive-creator-insights-dashboard' },
  { role: 'Creator Revenue Forecasting', path: '/creator-revenue-forecasting-dashboard' },
  { role: 'Creator Churn Prediction', path: '/creator-churn-prediction-intelligence-center' },
  { role: 'Claude Creator Success Agent', path: '/claude-creator-success-agent' },
];

describe('Voting role route smoke checks', () => {
  roleRoutes.forEach(({ role, path }) => {
    it(`loads route for ${role}`, () => {
      cy.visit(path, { failOnStatusCode: false, timeout: 120000 });
      cy.location('pathname').should('not.eq', '/404');
      cy.get('body').should('be.visible');
    });
  });

  it('enforces external voter gate flow', () => {
    cy.visit('/secure-voting-interface?election=e2e-external&ref=external', {
      failOnStatusCode: false,
      timeout: 120000,
    });

    cy.contains('Secure Voting').should('be.visible');
    cy.contains('Join to Vote').should('be.visible');
    cy.contains('Create New Account').should('be.visible');
    cy.contains('Sign In to Existing Account').should('be.visible');
  });

  it('supports enterprise SSO integration route', () => {
    cy.visit('/enterprise-sso-integration?provider=okta&issuer=https%3A%2F%2Fexample.okta.com', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.location('pathname').should('eq', '/enterprise-sso-integration');
    cy.contains('Enterprise Operations Center').should('be.visible');
    cy.contains('Test SSO Sign-In').should('be.visible');
  });

  it('renders auth callback error state deterministically', () => {
    cy.visit('/auth/callback?error=access_denied&error_description=Denied%20for%20e2e', {
      failOnStatusCode: false,
      timeout: 120000,
    });
    cy.location('pathname').should('eq', '/auth/callback');
    cy.contains('Authentication failed: Denied for e2e').should('be.visible');
    cy.contains('Back to Multi-Auth Gateway').should('be.visible');
  });
});
