// Cypress support file
// Import commands.js using ES2015 syntax:
import './commands';

// Add this block to declare Cypress global type
declare global {
  const Cypress: any;
}

// Prevent uncaught exceptions from failing tests
Cypress?.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  if (err?.message?.includes('ResizeObserver') || err?.message?.includes('Non-Error promise rejection')) {
    return false;
  }
  return true;
});
