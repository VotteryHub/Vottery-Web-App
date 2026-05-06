import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const routes = [
  { name: 'Auth', path: '/authentication-portal' },
  { name: 'HomeFeed', path: '/home-feed-dashboard' },
  { name: 'ElectionsList', path: '/elections-dashboard' },
  { name: 'ElectionDetail', path: '/vote-in-elections-hub' },
  { name: 'SecureVoting', path: '/secure-voting-interface' },
  { name: 'LiveResults', path: '/enhanced-election-results-center' },
  { name: 'GamificationCore', path: '/platform-gamification-core-engine' },
  { name: 'SearchResults', path: '/advanced-search-discovery-intelligence-hub' },
  { name: 'UserProfile', path: '/user-profile-hub' },
  { name: 'DigitalWallet', path: '/digital-wallet-hub' },
  { name: 'AdminControl', path: '/admin-control-center' },
];

const resolutions = [
  { name: 'mobile-small', width: 375, height: 812 },
  { name: 'mobile-large', width: 390, height: 844 },
  { name: 'tablet-small', width: 768, height: 1024 },
  { name: 'tablet-large', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 }
];

const BASE_URL = 'http://localhost:4028';
const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'responsive', 'screenshots');

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  
  for (const res of resolutions) {
    console.log(`\nTesting resolution: ${res.name} (${res.width}x${res.height})`);
    const context = await browser.newContext({
      viewport: { width: res.width, height: res.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    for (const route of routes) {
      console.log(`  Visiting ${route.name}...`);
      try {
        await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 15000 });
        // wait a bit for any dynamic content/animations
        await page.waitForTimeout(2000);
        
        const fileName = `${route.name}-${res.name}.png`;
        const filePath = path.join(OUTPUT_DIR, fileName);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`    Saved screenshot to ${fileName}`);
      } catch (err) {
        console.error(`    Failed to capture ${route.name}: ${err.message}`);
      }
    }
    await context.close();
  }

  await browser.close();
  console.log('Audit screenshots captured.');
}

main().catch(console.error);
