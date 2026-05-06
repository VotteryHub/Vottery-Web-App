import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

const APP_URL = 'http://localhost:4028';
const VIEWPORTS = [
  { name: 'iPhone 13', width: 390, height: 844 },
  { name: 'iPhone X', width: 375, height: 812 }
];

const ELECTIONS = [
  { id: 'fc7b757d-2e46-474d-a64a-b6eb878c430c', type: 'Approval', name: 'Mobile Verification: Approval' },
  { id: '43df9e18-9fa3-40aa-9593-47431e7fffbd', type: 'Ranked-Choice', name: 'Mobile Verification: Ranked Choice' }
];

const TEST_ACCOUNT = { email: 'test.preview@vottery.test', password: 'VotteryTest2026!' };

async function run() {
  console.log('🚀 Starting Mobile Voting Preview & Verification...');
  const browser = await chromium.launch();
  const results = [];

  // Create evidence directories
  const screenshotDir = 'docs/responsive/screenshots/mobile-voting';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  try {
    for (const viewport of VIEWPORTS) {
      console.log(`\n📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        userAgent: devices['iPhone 13'].userAgent
      });

      const page = await context.newPage();

      // 1. Login
      console.log('   Logging in...');
      await page.goto(`${APP_URL}/authentication-portal`, { timeout: 60000 });
      await page.fill('input[name="email"]', TEST_ACCOUNT.email);
      await page.fill('input[name="password"]', TEST_ACCOUNT.password);
      await page.click('button[type="submit"]');
      
      // Wait for home feed or direct redirect
      try {
        await page.waitForURL(`${APP_URL}/home-feed-dashboard`, { timeout: 15000 });
        console.log('   Login successful, current URL:', page.url());
      } catch (e) {
        console.warn('   Login redirect timeout, current URL:', page.url());
        const loginErrorPath = path.resolve(screenshotDir, `login-failure-${viewport.width}.png`);
        await page.screenshot({ path: loginErrorPath });
        console.log(`   📸 Login failure screenshot captured: ${loginErrorPath}`);
        console.log('   Attempting direct navigation to elections anyway...');
      }

      for (const election of ELECTIONS) {
        const url = `${APP_URL}/secure-voting-interface?election=${election.id}`;
        console.log(`   Previewing ${election.type} voting: ${election.name}`);
        
        const result = {
          election: election.name,
          type: election.type,
          viewport: viewport.name,
          pass: false,
          issues: [],
          screenshot: `docs/responsive/screenshots/mobile-voting/${election.type.replace(/\s+/g, '-')}-${viewport.width}.png`
        };

        try {
          await page.goto(url, { timeout: 60000, waitUntil: 'networkidle' });
          
          // Wait for main content or specialized ballot components
          await page.waitForSelector('main, .card', { timeout: 30000 });
          
          // Small delay for animations/rendering
          await page.waitForTimeout(3000);

          // PASS/FAIL checks
          
          // 1. Ballot options render (Check for at least one option)
          const hasOptions = await page.evaluate(() => {
            const items = document.querySelectorAll('.divide-y > div, [role="radio"], [role="checkbox"]');
            return items.length > 0;
          });
          if (!hasOptions) result.issues.push('No ballot options rendered');

          // 2. CTA button visible
          const submitBtn = page.locator('button:has-text("Submit Vote"), button:has-text("Vote"), button:has-text("Handshake")');
          const isVisible = await submitBtn.first().isVisible();
          if (!isVisible) result.issues.push('Submit/Action button not visible');

          // 3. No horizontal page overflow
          const overflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth + 5; 
          });
          if (overflow) result.issues.push('Horizontal overflow detected');

          if (result.issues.length === 0) result.pass = true;

          // Capture screenshot
          const screenshotPath = path.resolve(result.screenshot);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`     ✅ Screenshot captured: ${result.screenshot}`);

        } catch (err) {
          console.error(`     ❌ Error testing ${election.name}:`, err.message);
          result.issues.push(`Runtime error: ${err.message}`);
          
          // Capture failure screenshot
          const failPath = path.resolve(screenshotDir, `fail-${election.type}-${viewport.width}.png`);
          await page.screenshot({ path: failPath });
        }

        results.push(result);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  // Generate report
  generateReport(results);
}

function generateReport(results) {
  let md = `# Mobile Voting Preview Results\n\n`;
  md += `**Date:** ${new Date().toLocaleString()}\n\n`;
  md += `| Election | Type | Viewport | Status | Issues |\n`;
  md += `| --- | --- | --- | --- | --- |\n`;
  
  results.forEach(r => {
    md += `| ${r.election} | ${r.type} | ${r.viewport} | ${r.pass ? '✅ PASS' : '❌ FAIL'} | ${r.issues.join(', ') || 'None'} |\n`;
  });

  md += `\n## Visual Evidence\n`;
  results.forEach(r => {
    md += `### ${r.election} (${r.viewport})\n`;
    md += `Status: ${r.pass ? 'PASS' : 'FAIL'}\n\n`;
    md += `![Screenshot](/${r.screenshot})\n\n`;
    if (r.issues.length > 0) {
      md += `**Issues Found:**\n`;
      r.issues.forEach(issue => md += `- ${issue}\n`);
      md += `\n`;
    }
    md += `---\n\n`;
  });

  const reportPath = 'docs/responsive/mobile-voting-preview.md';
  fs.writeFileSync(reportPath, md);
  console.log(`\n✨ Verification Complete! Report saved to: ${reportPath}`);
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
