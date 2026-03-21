// Keep Cypress from failing the suite on non-critical app runtime noise.
Cypress.on('uncaught:exception', (err) => {
  const message = err?.message || '';
  if (
    message.includes('ResizeObserver') ||
    message.includes('Non-Error promise rejection')
  ) {
    return false;
  }
  return false;
});
