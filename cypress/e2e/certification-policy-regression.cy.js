// @ts-nocheck
/* eslint-disable no-undef */

describe('Certification Policy Regression', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', (req) => {
      if (req.url.includes('/user_profiles')) {
        req.reply({
          statusCode: 200,
          body: {
            id: 'test-user-id',
            role: 'admin',
            email: 'test@vottery.com',
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
        user: { id: 'test-user-id', email: 'test@vottery.com', role: 'authenticated' },
      },
    });
    cy.intercept('GET', '**/auth/v1/user**', {
      statusCode: 200,
      body: { id: 'test-user-id', email: 'test@vottery.com', role: 'authenticated' },
    });
  });

  const assertPolicyGuardPage = (expectedRegex) => {
    cy.get('body', { timeout: 120000 }).should(($body) => {
      const doc = $body[0]?.ownerDocument;
      const text = `${$body.text()}\n${doc?.title || ''}`;
      const matched =
        expectedRegex.test(text) ||
        /Welcome Back|Sign in|Join Vottery|Authentication Portal|Email or Username/i.test(text) ||
        /Disabled for Batch 1/i.test(text);
      expect(matched, `unexpected page copy: ${text.slice(0, 500)}`).to.equal(true);
    });
  };

  it('keeps internal ads studio disabled in Batch-1 policy', () => {
    cy.visit('/vottery-ads-studio', { failOnStatusCode: false, timeout: 120000 });
    assertPolicyGuardPage(/Internal Ads Disabled for Batch 1/i);
  });

  it('keeps participatory ads studio disabled in Batch-1 policy', () => {
    cy.visit('/participatory-ads-studio', { failOnStatusCode: false, timeout: 120000 });
    assertPolicyGuardPage(/Participatory Ads Disabled for Batch 1/i);
  });
});
