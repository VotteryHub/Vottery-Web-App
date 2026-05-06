# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\responsive-stability.spec.js >> Responsive Stability & Visual Regression >> Viewport: Mobile (390x844) >> Verify Drawer Open State responsiveness
- Location: tests\e2e\responsive-stability.spec.js:154:11

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/home-feed-dashboard", waiting until "networkidle"

```

# Test source

```ts
  56  |           }
  57  |         ])
  58  |       });
  59  |     });
  60  | 
  61  |     await page.route('**/supabase.co/rest/v1/posts*', async (route) => {
  62  |       await route.fulfill({
  63  |         status: 200,
  64  |         contentType: 'application/json',
  65  |         body: JSON.stringify([
  66  |           { 
  67  |             id: 'p1', 
  68  |             content: 'Vottery is live!', 
  69  |             user_id: 'u1', 
  70  |             post_type: 'organic', 
  71  |             created_at: new Date().toISOString(),
  72  |             user_profiles: { name: 'Test Pilot', username: 'testpilot', avatar: 'https://placehold.co/100', verified: true },
  73  |             elections: { title: 'Mock Election', category: 'General' }
  74  |           }
  75  |         ])
  76  |       });
  77  |     });
  78  | 
  79  |     await page.route('**/supabase.co/rest/v1/user_profiles*', async (route) => {
  80  |       await route.fulfill({
  81  |         status: 200,
  82  |         contentType: 'application/json',
  83  |         body: JSON.stringify([{ id: 'mock-user-id', display_name: 'Test Pilot', avatar_url: 'https://placehold.co/100' }])
  84  |       });
  85  |     });
  86  | 
  87  |     await page.route('**/supabase.co/rest/v1/sponsored_elections*', async (route) => {
  88  |       await route.fulfill({
  89  |         status: 200,
  90  |         contentType: 'application/json',
  91  |         body: JSON.stringify([])
  92  |       });
  93  |     });
  94  | 
  95  |     await page.route('**/supabase.co/rest/v1/feed_items*', async (route) => {
  96  |       await route.fulfill({
  97  |         status: 200,
  98  |         contentType: 'application/json',
  99  |         body: JSON.stringify([])
  100 |       });
  101 |     });
  102 | 
  103 |     // Catch-all for other Supabase rest calls
  104 |     await page.route('**/supabase.co/rest/v1/**', async (route) => {
  105 |       if (!route.request().url().includes('posts') && !route.request().url().includes('elections') && !route.request().url().includes('profiles')) {
  106 |         await route.fulfill({
  107 |           status: 200,
  108 |           contentType: 'application/json',
  109 |           body: JSON.stringify([])
  110 |         });
  111 |       } else {
  112 |         await route.continue();
  113 |       }
  114 |     });
  115 |   });
  116 |   for (const viewport of viewports) {
  117 |     test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
  118 |       test.use({ viewport: { width: viewport.width, height: viewport.height } });
  119 | 
  120 |       for (const route of routes) {
  121 |         test(`Verify ${route.name} route stability`, async ({ page }) => {
  122 |           console.log(`Testing ${route.name} at ${viewport.name}...`);
  123 |           
  124 |           // Use longer timeout for slow local environments
  125 |           await page.goto(route.path, { waitUntil: 'networkidle', timeout: 60000 });
  126 |           
  127 |           // Specific checks for dynamic content
  128 |           if (route.name === 'Home') {
  129 |             await page.waitForSelector('[data-section-type="stories-carousel"]', { timeout: 15000 }).catch(() => {});
  130 |           } else if (route.name === 'Vote') {
  131 |             await page.waitForSelector('.card, main', { timeout: 15000 }).catch(() => {});
  132 |           }
  133 | 
  134 |           // Capture screenshot
  135 |           const filename = `${viewport.name}-${route.name}.png`.toLowerCase();
  136 |           await page.screenshot({ 
  137 |             path: `docs/responsive/screenshots/critical/${filename}`,
  138 |             fullPage: route.name === 'Home' || route.name === 'Profile' 
  139 |           });
  140 | 
  141 |           // Smoke checks
  142 |           const bodyVisible = await page.isVisible('body');
  143 |           expect(bodyVisible).toBe(true);
  144 |           
  145 |           // Check for horizontal overflow (tolerance of 5px)
  146 |           const overflow = await page.evaluate(() => {
  147 |             return document.documentElement.scrollWidth > window.innerWidth + 5;
  148 |           });
  149 |           expect(overflow).toBe(false);
  150 |         });
  151 |       }
  152 | 
  153 |       // Specialized test for Drawer Open State
  154 |       test('Verify Drawer Open State responsiveness', async ({ page }) => {
  155 |         if (viewport.width < 1024) {
> 156 |           await page.goto('/home-feed-dashboard', { waitUntil: 'networkidle' });
      |                      ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  157 |           const menuBtn = page.locator('button[aria-label="Menu"]');
  158 |           if (await menuBtn.isVisible()) {
  159 |             await menuBtn.click();
  160 |             await page.waitForTimeout(500); // Wait for animation
  161 |             await page.screenshot({ path: `docs/responsive/screenshots/critical/${viewport.name.toLowerCase()}-drawer-open.png` });
  162 |             await expect(page.locator('text=Navigation')).toBeVisible();
  163 |           }
  164 |         }
  165 |       });
  166 |     });
  167 |   }
  168 | });
  169 | 
```