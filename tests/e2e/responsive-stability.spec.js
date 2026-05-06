import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 390, height: 844 },
  { name: 'Tablet-Portrait', width: 768, height: 1024 },
  { name: 'Tablet-Landscape', width: 1024, height: 768 },
  { name: 'Desktop', width: 1440, height: 900 }
];

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

const routes = [
  { name: 'Auth', path: `${BASE_URL}/authentication-portal` },
  { name: 'Home', path: `${BASE_URL}/home-feed-dashboard` },
  { name: 'Elections', path: `${BASE_URL}/elections-dashboard` },
  { name: 'Vote', path: `${BASE_URL}/secure-voting-interface?election=fc7b757d-2e46-474d-a64a-b6eb878c430c` },
  { name: 'Search', path: `${BASE_URL}/advanced-search-discovery-intelligence-hub` },
  { name: 'Profile', path: `${BASE_URL}/user-profile-hub` },
  { name: 'Notifications', path: `${BASE_URL}/notification-center-hub` },
  { name: 'Messages', path: `${BASE_URL}/direct-messaging-center` },
  { name: 'Admin', path: `${BASE_URL}/admin-control-center` },
  { name: 'AdminHealth', path: `${BASE_URL}/admin/health-check` }
];

test.describe('Responsive Stability & Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Print browser logs
    page.on('console', msg => console.log(`BROWSER LOG [${msg.type()}]: ${msg.text()}`));
    page.on('requestfailed', request => console.log(`REQUEST FAILED: ${request.url()} [${request.failure().errorText}]`));

    // 1. Mock Supabase Auth Session
    await page.addInitScript(() => {
      const session = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: { id: 'mock-user-id', email: 'test@vottery.test', app_metadata: { provider: 'email' } }
      };
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({ currentSession: session }));
    });

    // 2. Intercept API Calls
    await page.route('**/supabase.co/rest/v1/elections*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { 
            id: 'fc7b757d-2e46-474d-a64a-b6eb878c430c', 
            title: 'Mock Election 2026', 
            voting_type: 'plurality',
            status: 'active',
            start_date: '2026-01-01',
            end_date: '2026-12-31'
          }
        ])
      });
    });

    await page.route('**/supabase.co/rest/v1/posts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { 
            id: 'p1', 
            content: 'Vottery is live!', 
            user_id: 'u1', 
            post_type: 'organic', 
            created_at: new Date().toISOString(),
            user_profiles: { name: 'Test Pilot', username: 'testpilot', avatar: 'https://placehold.co/100', verified: true },
            elections: { title: 'Mock Election', category: 'General' }
          }
        ])
      });
    });

    await page.route('**/supabase.co/rest/v1/user_profiles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'mock-user-id', display_name: 'Test Pilot', avatar_url: 'https://placehold.co/100' }])
      });
    });

    await page.route('**/supabase.co/rest/v1/sponsored_elections*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.route('**/supabase.co/rest/v1/feed_items*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Catch-all for other Supabase rest calls
    await page.route('**/supabase.co/rest/v1/**', async (route) => {
      if (!route.request().url().includes('posts') && !route.request().url().includes('elections') && !route.request().url().includes('profiles')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else {
        await route.continue();
      }
    });
  });
  for (const viewport of viewports) {
    test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const route of routes) {
        test(`Verify ${route.name} route stability`, async ({ page }) => {
          console.log(`Testing ${route.name} at ${viewport.name}...`);
          
          // Use longer timeout for slow local environments
          await page.goto(route.path, { waitUntil: 'networkidle', timeout: 60000 });
          
          // Specific checks for dynamic content
          if (route.name === 'Home') {
            await page.waitForSelector('[data-section-type="stories-carousel"]', { timeout: 15000 }).catch(() => {});
          } else if (route.name === 'Vote') {
            await page.waitForSelector('.card, main', { timeout: 15000 }).catch(() => {});
          }

          // Capture screenshot
          const filename = `${viewport.name}-${route.name}.png`.toLowerCase();
          await page.screenshot({ 
            path: `docs/responsive/screenshots/critical/${filename}`,
            fullPage: route.name === 'Home' || route.name === 'Profile' 
          });

          // Smoke checks
          const bodyVisible = await page.isVisible('body');
          expect(bodyVisible).toBe(true);
          
          // Check for horizontal overflow (tolerance of 5px)
          const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth + 5;
          });
          expect(overflow).toBe(false);
        });
      }

      // Specialized test for Drawer Open State
      test('Verify Drawer Open State responsiveness', async ({ page }) => {
        if (viewport.width < 1024) {
          await page.goto('/home-feed-dashboard', { waitUntil: 'networkidle' });
          const menuBtn = page.locator('button[aria-label="Menu"]');
          if (await menuBtn.isVisible()) {
            await menuBtn.click();
            await page.waitForTimeout(500); // Wait for animation
            await page.screenshot({ path: `docs/responsive/screenshots/critical/${viewport.name.toLowerCase()}-drawer-open.png` });
            await expect(page.locator('text=Navigation')).toBeVisible();
          }
        }
      });
    });
  }
});
